const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cloudinary = require('./cloudinary');
require('dotenv').config(); // Load environment variables first

const db = require('./db');
const { authenticateToken } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS Configuration ---
const corsOptions = {
  origin: ['http://localhost:3000', 'https://yosef-portfolio.onrender.com'], // Allow both local and deployed frontend
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json());
app.use('/images', express.static('public/images'));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// נתיב בסיסי לבדיקה
app.get('/', (req, res) => {
  res.send('Hello from the Backend Server!');
});

// נתיב לבדיקת החיבור לבסיס הנתונים (אפשר להשאיר אותו לבדיקות עתידיות)
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      message: 'Database connection successful!',
      dbTime: result.rows[0].now,
    });
  } catch (err) {
    console.error('Database connection error', err.stack);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// --- API ENDPOINT: Get all categories ---

// --- API ENDPOINT: Get all skills ---
app.get('/api/skills', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows } = await db.query('SELECT * FROM skills WHERE user_id = $1 ORDER BY category, name', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching skills', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

app.get('/api/experience', authenticateToken, async (req, res) => {
  try {
    // req.user.userId is now available from the middleware
    const { rows } = await db.query('SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC', [req.user.userId]);
    res.json(rows);
  } catch (err) { /* ... error handling ... */ }
});

app.get('/api/education', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM education WHERE user_id = $1', [req.user.userId]);
    res.json(rows);
  } catch (err) { /* ... error handling ... */ }
});

// --- API ENDPOINT: Get all projects (with their technologies) ---
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT
        p.id, p.user_id, p.title, p.description, p.image_url, p.live_link, p.code_link, p.display_order,
        COALESCE(
          (SELECT json_agg(s.name)
           FROM project_technologies pt
           JOIN skills s ON s.id = pt.technology_id
           WHERE pt.project_id = p.id),
          '[]'::json
        ) AS technologies
      FROM
        projects p
      WHERE 
        p.user_id = $1
      ORDER BY
        p.display_order ASC;
    `;
    const { rows } = await db.query(query, [req.user.userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching projects', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});
// --- API ENDPOINT: Get all gallery images with their comments ---
app.get('/api/gallery', async (req, res) => {
  try {
    // שאילתה מתקדמת ששולפת כל תמונה ומקבצת את כל התגובות שלה למערך JSON
    const query = `
      SELECT
        g.id,
        g.image_url,
        g.caption,
        g.category,
        g.likes,
        COALESCE(
          (SELECT json_agg(json_build_object('id', c.id, 'name', c.commenter_name, 'text', c.comment_text))
           FROM image_comments c
           WHERE c.image_id = g.id
          ), '[]'::json
        ) AS comments
      FROM
        gallery_images g
      ORDER BY
        g.id;
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching gallery images', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

// --- API ENDPOINT: Add/Remove a like from an image ---
app.post('/api/gallery/:id/like', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // נקבל 'like' או 'unlike'

  // בניית השאילתה באופן דינמי
  const queryText = action === 'unlike'
    ? 'UPDATE gallery_images SET likes = likes - 1 WHERE id = $1 AND likes > 0 RETURNING likes'
    : 'UPDATE gallery_images SET likes = likes + 1 WHERE id = $1 RETURNING likes';

  try {
    const { rows } = await db.query(queryText, [id]);
    if (rows.length > 0) {
      res.json({ newLikesCount: rows[0].likes });
    } else {
      res.status(404).json({ error: 'Image not found or cannot unlike further' });
    }
  } catch (err) {
    console.error('Error updating like', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

// --- API ENDPOINT: Image Upload ---
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    // Upload the image buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) reject(error);
        resolve(result);
      }).end(req.file.buffer);
    });

    // Send the secure URL back to the client
    res.json({ imageUrl: result.secure_url });

  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Something went wrong during image upload.' });
  }
});

// --- API ENDPOINT: Add a comment to an image ---
app.post('/api/gallery/:id/comment', async (req, res) => {
  const { id: image_id } = req.params;
  const { name, text } = req.body; // קבלת שם המגיב והתגובה מגוף הבקשה

  if (!name || !text) {
    return res.status(400).json({ error: 'Name and text are required' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO image_comments (image_id, commenter_name, comment_text) VALUES ($1, $2, $3) RETURNING *',
      [image_id, name, text]
    );
    res.status(201).json(rows[0]); // החזרת התגובה החדשה שנוצרה
  } catch (err) {
    console.error('Error adding comment', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});
// --- API ENDPOINT: Handle contact form submission ---
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  try {
    const queryText = `
      INSERT INTO contact_submissions(sender_name, sender_email, subject, message) 
      VALUES($1, $2, $3, $4) 
      RETURNING id
    `;
    const { rows } = await db.query(queryText, [name, email, subject, message]);
    res.status(201).json({ success: true, message: 'Message received!', submissionId: rows[0].id });
  } catch (err) {
    console.error('Error saving contact form submission', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

app.get('/api/expertise', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM expertise WHERE user_id = $1 ORDER BY id', [req.user.userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching expertise', err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- API ENDPOINT: Add a new expertise item for a user ---
app.post('/api/expertise', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const query = 'INSERT INTO expertise(user_id, title, description) VALUES($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [userId, title, description]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding expertise', err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- API ENDPOINT: User Login ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. מצא את המשתמש לפי האימייל
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' }); // שגיאה גנרית לאבטחה
    }
    const user = rows[0];

    // 2. השווה את הסיסמה שהתקבלה עם הסיסמה המוצפנת שבבסיס הנתונים
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. אם הסיסמה נכונה, צור טוקן (JWT)
    const token = jwt.sign(
      { userId: user.id, name: user.full_name }, // המידע שנרצה לאחסן בטוקן
      'YOUR_SUPER_SECRET_KEY', // "מפתח סודי" - נשנה את זה בהמשך לקובץ .env
      { expiresIn: '1h' } // תוקף הטוקן (למשל, שעה)
    );

    // 4. שלח את הטוקן בחזרה למשתמש
    res.json({ 
      message: 'Login successful!',
      token: token,
      user: { id: user.id, name: user.full_name, email: user.email }
    });

  } catch (err) {
    console.error('Login error', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

// --- API ENDPOINT: User Registration ---
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserQuery = `
      INSERT INTO users(full_name, email, password_hash) 
      VALUES($1, $2, $3) 
      RETURNING id, full_name, email
    `;
    const { rows } = await db.query(newUserQuery, [name, email, passwordHash]);
    
    res.status(201).json({
      message: 'User registered successfully!',
      user: rows[0]
    });

  } catch (err) {
    // Check for unique email violation
    if (err.code === '23505') { 
      return res.status(409).json({ error: 'Email already exists.' });
    }
    console.error('Registration error', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});
// --- API ENDPOINT: Add a new project (with technologies) ---
app.post('/api/projects', authenticateToken, async (req, res) => {
  // Note: we now expect a 'technologies' array in the body
  const { title, description, imageUrl, liveLink, codeLink, displayOrder, technologies } = req.body;
  const userId = req.user.userId;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const client = await db.getClient(); // Use a transaction for multiple database operations

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Insert the new project
    const projectQuery = `
      INSERT INTO projects(user_id, title, description, image_url, live_link, code_link, display_order) 
      VALUES($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, title, description
    `;
    const projectResult = await client.query(projectQuery, [userId, title, description, imageUrl, liveLink, codeLink, displayOrder]);
    const newProject = projectResult.rows[0];

    // 2. Handle the technologies
    if (technologies && technologies.length > 0) {
      const techInserts = technologies.map(async (techName) => {
        // Find the skill ID, or create it if it doesn't exist (optional, but robust)
        let skillResult = await client.query('SELECT id FROM skills WHERE name = $1', [techName.trim()]);
        let skillId;
        if (skillResult.rows.length === 0) {
          // For this project, let's assume skills must exist.
          // A more advanced version could create them:
          // const newSkillResult = await client.query('INSERT INTO skills(name, category) VALUES($1, $2) RETURNING id', [techName.trim(), 'Uncategorized']);
          // skillId = newSkillResult.rows[0].id;
          console.warn(`Skill "${techName.trim()}" not found in skills table. Skipping.`);
          return; // Skip if skill not found
        } else {
          skillId = skillResult.rows[0].id;
        }

        // Link the project and the skill
        await client.query(
          'INSERT INTO project_technologies(project_id, technology_id) VALUES($1, $2)',
          [newProject.id, skillId]
        );
      });
      await Promise.all(techInserts); // Wait for all tech links to be created
    }

    await client.query('COMMIT'); // Commit transaction
    res.status(201).json(newProject);

  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error adding new project', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  } finally {
    client.release(); // Release client back to the pool
  }
});
app.post('/api/education', authenticateToken, async (req, res) => {
  const { institutionName, degree, expectedGraduation, highlights } = req.body;
  const userId = req.user.userId;

  if (!institutionName || !degree) {
    return res.status(400).json({ error: 'Institution and degree are required.' });
  }

  try {
    const query = `
      INSERT INTO education(user_id, institution_name, degree, expected_graduation_date, highlights) 
      VALUES($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const { rows } = await db.query(query, [userId, institutionName, degree, expectedGraduation, highlights]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding education record', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

// --- API ENDPOINT: Add a new Experience record ---
app.post('/api/experience', authenticateToken, async (req, res) => {
  const { jobTitle, companyName, startDate, endDate, description } = req.body;
  const userId = req.user.userId;

  if (!jobTitle || !companyName) {
    return res.status(400).json({ error: 'Job title and company name are required.' });
  }

  try {
    const query = `
      INSERT INTO experience(user_id, job_title, company_name, start_date, end_date, description) 
      VALUES($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    // Use null for dates if they are empty strings
    const { rows } = await db.query(query, [userId, jobTitle, companyName, startDate || null, endDate || null, description]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding experience record', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

// --- API ENDPOINT: Add a new skill ---
app.post('/api/skills', authenticateToken, async (req, res) => {
  const { name, category } = req.body;
  const userId = req.user.userId; // Get the user's ID from the token

  if (!name || !category) {
    return res.status(400).json({ error: 'Skill name and category are required' });
  }

  try {
    const queryText = `
      INSERT INTO skills(name, category, user_id) 
      VALUES($1, $2, $3) 
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [name, category, userId]);
    res.status(201).json(rows[0]);
  } catch (err){         
      if (err.code === '23505') 
        return res.status(409).json({ error: `You already have a skill named "${name}".` });
    }
    console.error('Error adding new skill', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
  });
// --- API ENDPOINT: Get the logged-in user's profile ---
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, full_name, email, headline, sub_headline, profile_image_url FROM users WHERE id = $1', [req.user.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching profile', err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- API ENDPOINT: Update the logged-in user's profile ---
app.put('/api/profile', authenticateToken, async (req, res) => {
  // We now correctly accept profileImageUrl from the request body
  const { fullName, headline, subHeadline, profileImageUrl } = req.body;
  const userId = req.user.userId;

  if (!fullName || !headline || !subHeadline) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // This query now correctly updates the image URL column.
    // COALESCE is a smart function that uses the new URL if provided,
    // or keeps the old one if a new image wasn't uploaded.
    const query = `
      UPDATE users 
      SET 
        full_name = $1, 
        headline = $2, 
        sub_headline = $3, 
        profile_image_url = COALESCE($4, profile_image_url) 
      WHERE id = $5 
      RETURNING id, full_name, email, headline, sub_headline, profile_image_url
    `;
    const { rows } = await db.query(query, [fullName, headline, subHeadline, profileImageUrl, userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating profile', err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// --- API ENDPOINT: Get all contact form submissions (Admin only) ---
app.get('/api/contact-submissions', authenticateToken, async (req, res) => {
  // --- ADD THIS AUTHORIZATION CHECK ---
  const loggedInUserId = req.user.userId;
  const adminId = process.env.ADMIN_USER_ID;

  if (String(loggedInUserId) !== String(adminId)) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to view this page.' });
  }
  // --- END OF CHECK ---

  try {
    const { rows } = await db.query('SELECT * FROM contact_submissions ORDER BY received_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching contact submissions', err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// --- API ENDPOINT: Delete a contact submission ---
app.delete('/api/contact-submissions/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  // Ensure only admin can delete
  if (String(req.user.userId) !== String(process.env.ADMIN_USER_ID)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const deleteOp = await db.query('DELETE FROM contact_submissions WHERE id = $1', [id]);
    if (deleteOp.rowCount > 0) {
      res.status(204).send(); // Success, no content to send back
    } else {
      res.status(404).json({ error: 'Submission not found' });
    }
  } catch (err) {
    console.error('Error deleting submission', err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- API ENDPOINT: Mark a submission as replied ---
app.put('/api/contact-submissions/:id/reply', authenticateToken, async (req, res) => {
  const { id } = req.params;
  // Ensure only admin can mark as replied
  if (String(req.user.userId) !== String(process.env.ADMIN_USER_ID)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const { rows } = await db.query(
      'UPDATE contact_submissions SET replied = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Submission not found' });
    }
  } catch (err) {
    console.error('Error updating submission', err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});