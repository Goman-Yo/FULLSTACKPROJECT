// backend/upload.js
const cloudinary = require('./cloudinary'); // Uses your existing cloudinary config
const path = require('path');

// --- IMPORTANT: EDIT THIS LIST ---
// Add the paths to the local images you want to upload.
// The path should be relative to the `backend` folder.
const imagePaths = [
    'public/images/ai-image-detection.jpg',
    'public/images/film-finder-ui.png',
    'public/images/text-analysis-abstract.jpg',
    // Add paths to your gallery images if needed
    // '../frontend/public/images/gallery/personal1.jpg', 
];
// --------------------------------

const uploadImage = async (filePath) => {
    const fileName = path.basename(filePath);
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'portfolio_assets' // Optional: puts all images in a folder in Cloudinary
        });
        console.log(`✅ Successfully uploaded ${fileName}`);
        console.log(`   URL: ${result.secure_url}\n`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Failed to upload ${fileName}. Error: ${error.message}\n`);
    }
};

const runUploads = async () => {
    console.log("Starting image uploads to Cloudinary...\n");
    for (const imagePath of imagePaths) {
        await uploadImage(imagePath);
    }
    console.log("--- All uploads complete ---");
};

runUploads();