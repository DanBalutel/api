const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000;  // You can choose any other available port

const targetUrl = 'http://3.67.38.226:3000/';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Respond to preflights
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/', async (req, res) => {
    try {
        const forwardUrl = targetUrl + req.path;
        const response = await axios({
            method: req.method,
            url: forwardUrl,
            data: req.body,
            headers: req.headers
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error in the proxy:', error.response.statusText);
        res.status(error.response.status).send(error.response.statusText);
    }
});

app.get('/get', (req, res) => {
	res.send("PONG");
});


app.listen(process.env.PORT || PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
