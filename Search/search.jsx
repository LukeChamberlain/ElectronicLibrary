const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 

app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Missing "url" query parameter');
    }

    console.log(`Fetching URL: ${url}`);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'YourAppName/1.0 (https://yourwebsite.com)'
            }
        });
        if (!response.ok) {
            console.error(`Error from Open Library API: ${response.status} ${response.statusText}`);
            return res.status(response.status).send(`Error from Open Library API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data');
    }
});

app.listen(3000, () => console.log('Proxy server running on http://localhost:3000'));