const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000;  // You can choose any other available port

const targetUrl = 'http://3.67.38.226:3000';

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

app.get('/get', (req, res) => {
	res.send("PONG");
});

app.use('/', async (req, res) => {
    try {
        const forwardUrl = targetUrl + req.path;

        // Logging incoming request details
        console.log('Incoming Request:');
        console.log('Method:', req.method);
        console.log('Path:', req.path);
        console.log('Body:', req.body);
        console.log('Headers:', req.headers);
        console.log('Incoming request path:', req.path);

        // Create a new headers object from the original request headers.
        let forwardedHeaders = { ...req.headers };

        // Delete headers that shouldn't be forwarded.
        delete forwardedHeaders.host;
        delete forwardedHeaders['accept-encoding'];  // This can sometimes cause issues with Axios

        // Logging forwarding details
        console.log('Forwarding To:', forwardUrl);
        console.log('Forwarded Headers:', forwardedHeaders);

        const response = await axios({
            method: req.method,
            url: forwardUrl,
            data: JSON.stringify(req.body),
            headers: forwardedHeaders,
            timeout: 5000  // Set a timeout of 5 seconds
        });

        // Logging response details
        console.log('Received Response:');
        console.log('Status:', response.status);
        console.log('Data:', response.data);

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error in the proxy:', error.response ? error.response.statusText : error.message);
        res.status(error.response ? error.response.status : 500).send(error.response ? error.response.statusText : "Internal Proxy Error");
    }
});



app.listen(process.env.PORT || PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
