const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Global binding for stable Railway deployment

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the interactive report canvas
app.get('/report', (req, res) => {
    const payload = req.query.p;
    if (!payload) {
        return res.status(400).send('Missing report token payload.');
    }

    // Spawn python engine defensively
    const pythonProcess = spawn('python3', [path.join(__dirname, 'engine.py'), payload]);

    let outputData = "";
    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(outputData);
            if (result.error) {
                return res.status(500).send(`Engine Error: ${result.error}`);
            }
            
            // Pass results straight to your template file or send as JSON to the canvas view
            res.sendFile(path.join(__dirname, 'report-template.html'));
            // Alternatively, inject variables dynamically here if not fetching client-side
        } catch (e) {
            res.status(500).send("Failed to parse calculated telemetry matrix.");
        }
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Stateless server listening on http://${HOST}:${PORT}`);
});
