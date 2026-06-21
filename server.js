const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Comprehensive Content Matrix for Archetypes & Core Systems
const archetypeRepository = {
    "Harmonic Convergence": {
        subtitle: "The Synthesized Network Node",
        description: "Your system initializes under a state of rare architectural alignment. The tension vectors between your historical blueprint and active identity operate in a symbiotic feedback loop, creating massive capacity for structural synchronization.",
        shadow: "Propensity to over-optimize systems at the expense of organic, chaotic execution. Beware of systemic paralysis via analysis.",
        strategy: "Prioritize data ownership and flat workspaces. Deploy deep focus intervals to anchor your high alignment score into physical, tangible outputs."
    },
    "Dynamic Adaptation": {
        subtitle: "The Fluid Iteration Vector",
        description: "Your matrix operates in a state of continuous deployment. You possess a high coefficient for shifting cross-functional roles effortlessly, translating abstract strategic parameters into practical, ground-level execution.",
        shadow: "Risk of vector diffusion. Splicing your focus across too many simultaneous builds can dilute your core energetic output.",
        strategy: "Anchor your focus using dynamic query dashboards (like Obsidian Dataview metrics). Treat your energy like a modular codebase—lock down one feature before launching the next."
    },
    "Friction Catalyst": {
        subtitle: "The Disruptive Structural Anchor",
        description: "Your telemetry reveals a high dialectic tension gap. This is not a system fault—it is an energetic engine design. You are built to introduce pressure into static environments, forcing rapid iteration and exposing hidden systematic bugs.",
        shadow: "Burnout from constant resistance or alienating surrounding slower-moving nodes.",
        strategy: "Use manual labor or intense physical cycles as a mechanical ground to discharge excess intellectual tension. Channel friction explicitly into structural restructuring."
    }
};

const numberProfiles = {
    lifePath: {
        1: "Strategic Pioneer // Independent Architecture",
        2: "Systemic Bridge // Cooperative Integration",
        3: "Expression Vector // Creative Synthesis",
        4: "Structural Grid // Process & Foundational Mechanics",
        5: "Dynamic Pivot // Kinetic Freedom & Iteration",
        6: "Harmonic Anchor // Systemic Custodianship",
        7: "Diagnostic Core // Analytical Seclusion & Truth",
        8: "Execution Engine // Scaled Output & Material Control",
        9: "Universal Node // Systemic Resolution & Closure",
        11: "Master Antenna // High-Frequency Intuitive Telemetry",
        22: "Master Builder // Scaled Structural Manifestation",
        33: "Master Conduit // Universal Harmonic Engineering"
    }
};

// Main dynamic report processing route
app.post('/generate-report', (req, res) => {
    try {
        const { fullName, currentName, birthDate } = req.body;

        if (!fullName || !currentName || !birthDate) {
            return res.status(400).send('Missing critical data anchors.');
        }

        // Reformat standard HTML YYYY-MM-DD input cleanly for engine.py parsing
        const [year, month, day] = birthDate.split('-');
        const formattedDate = `${month}-${day}-${year}`;

        // Explicitly map frontend keys to match snake_case variables in engine.py dictionary keys
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
                console.error(`Python script exited with crash code: ${code}`);
                return res.status(500).send("Engine calculation failure.");
            }

            try {
                const metrics = JSON.parse(pythonData);
                
                // Extract profile copy from repository matrix
                const archData = archetypeRepository[metrics.archetype] || archetypeRepository["Dynamic Adaptation"];
                const lpProfile = numberProfiles.lifePath[metrics.life_path] || "Unassigned Matrix Coordinate";

                // Aggregate data payload for template parsing
                const dataPayload = {
                    fullName: fullName.toUpperCase(),
                    currentName: currentName.toUpperCase(),
                    birthDate: formattedDate,
                    matrixId: `_CORE_${metrics.hcv}_${metrics.life_path}`,
                    
                    // Calculated Metrics
                    uspcScore: metrics.uspc_score,
                    archetype: metrics.archetype,
                    archSubtitle: archData.subtitle,
                    archDesc: archData.description,
                    archShadow: archData.shadow,
                    archStrategy: archData.strategy,
                    
                    // Technical Grid Values
                    lifePath: metrics.life_path,
                    lifePathTitle: lpProfile,
                    expression: metrics.expression,
                    subconscious: metrics.subconscious_num,
                    hcv: metrics.hcv,
                    alignment: metrics.alignment_coefficient
                };

                // Load HTML Template and inject mapped payload tokens
                const templatePath = path.join(__dirname, 'report-template.html');
                let htmlResponse = fs.readFileSync(templatePath, 'utf8');

                // Strictly replaces global double curly braces: {{key}}
                Object.keys(dataPayload).forEach(key => {
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    htmlResponse = htmlResponse.replace(regex, dataPayload[key]);
                });

                res.send(htmlResponse);

            } catch (jsonErr) {
                console.error("Malformed output from engine:", jsonErr);
                res.status(500).send("Data processing corruption error.");
            }
        });

    } catch (error) {
        console.error("Engine Fault detected during execution: ", error);
        res.status(500).send("Internal System Error: Telemetry engine collapsed.");
    }
});

// Root fallback route to verify active container health status
app.get('/', (req, res) => { 
    res.send("// PLATH Engine backend factory is live and listening on port 8080."); 
});

// Safety route to block plain GET parameters to processing terminal
app.get('/generate-report', (req, res) => { 
    res.send("Missing critical data anchors. Please submit via the frontend portal."); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`// PLATH Engine running smoothly on port ${PORT}`); 
});
