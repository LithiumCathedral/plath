const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main dynamic report route
app.post('/generate-report', (req, res) => {
    try {
        const { fullName, currentName, birthDate } = req.body;

        if (!fullName || !currentName || !birthDate) {
            return res.status(400).send('Missing critical data anchors.');
        }

        // Reformat YYYY-MM-DD from HTML input to MM-DD-YYYY for engine.py
        const [year, month, day] = birthDate.split('-');
        const formattedDate = `${month}-${day}-${year}`;

        // Prepare payload for Python
        const inputData = JSON.stringify({
            full_birth_name: fullName,
            current_name: currentName,
            dob: formattedDate
        });

        // Spawn engine.py execution process
        const pythonProcess = spawn('python3', [path.join(__dirname, 'engine.py')]);

        let pythonData = '';
        
        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            pythonData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python exited with code ${code}`);
                return res.status(500).send("Engine calculation failure.");
            }

            const metrics = JSON.parse(pythonData);

            // Generate customized narrative based directly on real calculation values
            const uniqueStory = `
                The system initializes under the structural anchor of the primary matrix for <strong>${fullName.toUpperCase()}</strong>. 
                Tracing architectural lineage back through the specified temporal milestone, the telemetry vectors reveal a 
                deeply synchronized alignment coefficient of <strong>${metrics.alignment_coefficient}</strong> and a 
                Life Path vector of <strong>${metrics.life_path}</strong>.
                <br><br>
                As the core handle transitions from its historical blueprint into the active node alias <strong>${currentName.toUpperCase()}</strong>, 
                a secondary footprint emerges within the shared workspace with an Expression capability of <strong>${metrics.expression}</strong>. 
                Your calculations reveal a <strong>${metrics.uspc_score}</strong> Unified Soul Print Core match, placing your matrix profile 
                firmly under the <strong>${metrics.archetype}</strong> archetype template.
                <br><br>
                Telemetry resolution finalized. The data ownership loop remains entirely secure, uncompromised, and perfectly flat.
            `;

            // Load HTML Template and inject variables
            const templatePath = path.join(__dirname, 'report-template.html');
            let htmlResponse = fs.readFileSync(templatePath, 'utf8');

            htmlResponse = htmlResponse
                .replace(/{{fullName}}/g, fullName.toUpperCase())
                .replace(/{{currentName}}/g, currentName.toUpperCase())
                .replace(/{{birthDate}}/g, formattedDate)
                .replace(/{{matrixId}}/g, `_CORE_${metrics.hcv}`)
                .replace(/{{generatedStory}}/g, uniqueStory);

            res.send(htmlResponse);
        });

    } catch (error) {
        console.error("Engine Fault: ", error);
        res.status(500).send("Internal System Error: Telemetry engine collapsed.");
    }
});

// Fallback safety route so the root address gives an active message instead of an error
app.get('/', (req, res) => {
    res.send("// PLATH Engine backend factory is live and listening on port 8080.");
});

// Fallback safety route to check GET requests to /generate-report
app.get('/generate-report', (req, res) => {
    res.send("Missing critical data anchors. Please submit via the frontend portal.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`// PLATH Engine running smoothly on port ${PORT}`);
});
