const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5004;

// Define the external base directory
const externalBaseDirectory = '/some/external/path';

// Allow CORS
app.use(cors());

// Serve static files (images) from the external directory
app.use('/images', express.static(path.join(externalBaseDirectory)));

// Endpoint to get folder structure
app.get('/api/folders', (req, res) => {
    const baseFolder = path.join(externalBaseDirectory, 'Industry');
    try {
        const folders = fs.readdirSync(baseFolder, { withFileTypes: true })
            .filter(item => item.isDirectory())
            .map(folder => {
                const folderPath = path.join(baseFolder, folder.name);
                const images = fs.readdirSync(folderPath).filter(file => /\.(png|jpg|jpeg)$/.test(file));
                return {
                    name: folder.name,
                    images: images.map(img => `/images/Industry/${folder.name}/${img}`)
                };
            });
        res.json({ folders });
    } catch (error) {
        console.error("Error reading folders:", error);
        res.status(500).json({ error: "Failed to read folder structure" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
