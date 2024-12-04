import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 5004;

// Enable CORS
app.use(cors());

// Define the folder location (your specified path)
const folderLocation = "C:\\Users\\sheet\\Downloads\\Desktop\\Documents";

// Serve static files (images) from the specified folder
app.use('/images', express.static(folderLocation));

// Endpoint to get folder structure
app.get('/api/folders', (req, res) => {
    const folders = fs.readdirSync(folderLocation, { withFileTypes: true })
        .filter(item => item.isDirectory()) // Filter to keep only directories
        .map(folder => {
            const folderPath = path.join(folderLocation, folder.name);
            const images = fs.readdirSync(folderPath)
                .filter(file => /\.(png|jpg|jpeg)$/i.test(file)); // Filter images by extensions
            return {
                name: folder.name,
                images: images.map(img => `/images/${folder.name}/${img}`) // Generate URL for each image
            };
        });
    res.json({ folders }); // Send folder structure as JSON
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
