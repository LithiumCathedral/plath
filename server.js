const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Crucial for parsing incoming Vercel form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main calculation route
app.post('/generate-report', (req, res) => {
    try {
        const { fullName, currentName, birthDate } = req.body;

        if (!fullName || !currentName || !birthDate) {
            return res.status(400).send('Missing critical data anchors.');
        }

        // 1. Dynamic Matrix Calculation Engine
        const cleanName = fullName.replace(/[^a-zA-Z]/g, '').toUpperCase();
        const matrixSeed = cleanName.length * (new Date(birthDate).getDate() || 1);
        const matrixId = `#${matrixSeed}-PRX`;

        // 2. Generate Data-Specific Personal Narrative
        const parsedDate = new Date(birthDate);
        const year = parsedDate.getFullYear();
        const monthName = parsedDate.toLocaleString('default', { month: 'long' });

        const uniqueStory = `
            The system initializes under the structural anchor of the primary matrix for <strong>${fullName}</strong>. 
            Tracing architectural lineage back through the specified temporal milestone of <strong>${monthName} ${year}</strong>, 
            the telemetry vectors reveal a deeply synchronized convergence point.
            <br><br>
            As the core handle transitions from its historical blueprint into the current active node alias <strong>${currentName}</strong>, 
            a secondary footprint emerges within the shared workspace. The engine has successfully synthesized these flat database coordinates, 
            stripping out traditional folder hierarchies to map exactly where this identity node builds momentum next.
            <br><br>
            Telemetry resolution finalized. The data ownership loop remains entirely secure, uncompromised, and perfectly flat.
        `;

        // 3. Load HTML Template and Inject Variables
        const templatePath = path.join(__dirname, 'report-template.html');
        let htmlResponse = fs.readFileSync(templatePath, 'utf8');

        htmlResponse = htmlResponse
            .replace(/{{fullName}}/g, fullName.toUpperCase())
            .replace(/{{currentName}}/g, currentName.toUpperCase())
            .replace(/{{birthDate}}/g, birthDate)
            .replace(/{{matrixId}}/g, matrixId)
            .replace(/{{generatedStory}}/g, uniqueStory);

        res.send(htmlResponse);

    } catch (error) {
        console.error("Engine Fault: ", error);
        res.status(500).send("Internal System Error: Telemetry engine collapsed.");
    }
});

// Railway requires listening on process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`// PLATH Engine running smoothly on port ${PORT}`);
});
