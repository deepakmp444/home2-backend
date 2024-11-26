const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5004;

app.use(cors())
// Serve static files (images) from "public" folder
app.use('/images', express.static(path.join(__dirname, 'public')));

// Endpoint to get folder structure
app.get('/api/folders', (req, res) => {
    const baseFolder = path.join(__dirname, 'public/Industry');
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
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
