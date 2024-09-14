// server.js
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/api/gemini-pro', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://gemini-api-url.com/analyze-vulnerability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `AIzaSyCq6NCb8HPbaA_d9LSB1nr3UaDY1VmYu4c`,  // Use your actual Gemini API key
            },
            body: JSON.stringify({
                query: userMessage
            })
        });

        const data = await response.json();
        res.json({ response: data.mitigations[0].description }); // Adjust this based on actual API response structure
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ response: 'Sorry, something went wrong.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
