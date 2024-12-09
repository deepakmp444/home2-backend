const express = require('express');
const shell = require('shelljs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5004;

// Define the external base directory
const externalBaseDirectory = '/Users/deepakkumar/Documents/Industry';

// Ensure externalBaseDirectory exists
if (!shell.test('-d', externalBaseDirectory)) {
    console.error(`Directory does not exist: ${externalBaseDirectory}`);
    process.exit(1);
}

// Allow CORS
app.use(cors());

// Serve static files (images) from the external directory
app.use('/images', express.static(path.join(externalBaseDirectory)));

// Endpoint to get folder structure
app.get('/api/folders', (req, res) => {
    const baseFolder = externalBaseDirectory;

    try {
        // Get all subfolders inside the base folder
        const folders = shell.ls('-d', path.join(baseFolder, '*/')).map(folderPath => {
            const folderName = path.basename(folderPath);

            // Get all image files in the folder
            const imageFiles = shell.ls(path.join(folderPath, '*.{png,jpg,jpeg}'));

            return {
                name: folderName,
                images: imageFiles.map(img => `/images/${folderName}/${path.basename(img)}`)
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
