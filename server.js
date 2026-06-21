const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { spawn } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize SQLite database connection to a local file
const dbPath = path.join(__dirname, 'telemetry.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection crash:', err);
    } else {
        console.log('// PLATH Local SQLite Engine initialized.');
        // Establish permanent data schema table
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
            sessionId TEXT PRIMARY KEY,
            email TEXT,
            fullName TEXT,
            currentName TEXT,
            birthDate TEXT,
            timestamp INTEGER
        )`);
    }
});

// Content Repository Matrix for Archetype Profiles
const archetypeRepository = {
    "Harmonic Convergence": {
        subtitle: "The Synthesized Network Node",
        description: "Your systems sit in an extraordinary state of native equilibrium. The transition between who you were structurally born to be and the alias you actively wield operates without drag.",
        humanImpact: "This means you move through life with a natural radar for alignment. Opportunities and environments click into place because your core internal compass doesn't have to fight your active expression."
    },
    "Dynamic Adaptation": {
        subtitle: "The Fluid Iteration Vector",
        description: "Your system runs on fluid iteration. You are built like open source software—constantly updating, modular, and incredibly resilient to field mutations.",
        humanImpact: "This tells us you are a natural chameleon. You can jump into structural work, pivot directly into creative content strategy, and completely realign yourself without losing your core truth."
    },
    "Friction Catalyst": {
        subtitle: "The Disruptive Structural Anchor",
        description: "Your blueprint intentionally introduces dialectic pressure into stagnant spaces to break loops and force evolutionary updates.",
        humanImpact: "This reveals why you often feel a deep internal restlessness or notice systematic flaws in rooms that others ignore. You are engineered to be the truth-tester—introducing friction to spark meaningful iteration."
    }
};

const lpRepository = {
    1: { title: "Strategic Pioneer", insight: "You are wired to construct entirely new pathways. If a field feels crowded, your energy naturally seeks the frontier to innovate solo." },
    2: { title: "Systemic Bridge", insight: "Your talent lies in parsing the space *between* objects. You calibrate partnerships, sense unspoken friction, and design smooth handshakes." },
    3: { title: "Expression Vector", insight: "You are a conduit for conceptual design. Your primary track is translating dense, complex undercurrents into highly digestible language." },
    4: { title: "Structural Grid", insight: "You give form to chaos. You instinctively establish perimeters, build repeatable workflows, and turn abstract vision into stable infrastructure." },
    5: { title: "Dynamic Pivot", insight: "You thrive inside kinetic exploration. Routine is your system fault; your engine recharges by navigating changing field parameters." },
    6: { title: "Harmonic Anchor", insight: "You are the operational custodian of your space. You naturally stabilize teams, balance environments, and build structural equity." },
    7: { title: "Diagnostic Core", insight: "You are the ultimate internal debugger. You require mental isolation to look under the hood of concepts, finding truth where others see noise." },
    8: { title: "Execution Engine", insight: "You are optimized for scaled manifest output. You know how to direct resources, govern assets, and execute complex long-term strategies." },
    9: { title: "Universal Node", insight: "You function at the point of network resolution. Your energy is idealistic, open-source, and dedicated to bringing global loops to full closure." },
    11: { title: "Master Antenna", insight: "You operate on a heightened, intuitive frequency. You capture hidden telemetry signals in a room before anyone else opens their mouth." },
    22: { title: "Master Builder", insight: "Your architecture is designed for massive physical scale. You possess the processing power to execute systemic blueprints that shift entire industries." },
    33: { title: "Master Conduit", insight: "You serve as an absolute harmonic stabilizer, radiating transformative systemic alignment across widespread networks." }
};

// 1. PRIMARY MONETIZATION ROUTE (Receives front-end inputs and routes to database step)
app.post('/generate-report', (req, res) => {
    const { email, fullName, currentName, birthDate } = req.body;

    if (!email || !fullName || !currentName || !birthDate) {
        return res.status(400).send('Missing critical identity anchors.');
    }

    // Generate a secure, 32-character crypto-hex string to act as the report's permalink ID
    const sessionId = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();

    // Commit payload details to the database
    const sql = `INSERT INTO profiles (sessionId, email, fullName, currentName, birthDate, timestamp) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [sessionId, email, fullName, currentName, birthDate, timestamp], (err) => {
        if (err) {
            console.error('Database write state failure:', err);
            return res.status(500).send('Database storage write fault.');
        }

        // REDIRECT FLOW: Direct the user cleanly to their unique, sharable URL path
        // (Once Stripe hook is added, this is where you'd point to the Stripe payment checkout url instead)
        res.redirect(`/report/${sessionId}`);
    });
});

// 2. STABLE RETRIEVAL PATHWAY FOR REUSE AND CROSS-DEVICE SHARING
app.get('/report/:sessionId', (req, res) => {
    const { sessionId } = req.params;

    const sql = `SELECT * FROM profiles WHERE sessionId = ?`;
    db.get(sql, [sessionId], (err, row) => {
        if (err || !row) {
            return res.status(404).send('Telemetry profile not found or expired registry parameters.');
        }

        // Extract saved data out from database storage record safely
        const { fullName, currentName, birthDate } = row;
        const [year, month, day] = birthDate.split('-');
        const formattedDate = `${month}-${day}-${year}`;

        const inputData = JSON.stringify({
            full_birth_name: fullName,
            current_name: currentName,
            dob: formattedDate
        });

        // Run calculation matrices dynamically on page execution
        const pythonProcess = spawn('python3', [path.join(__dirname, 'engine.py')]);
        let pythonData = '';

        pythonProcess.stdin.write(inputData);
        pythonProcess.stdin.end();
        pythonProcess.stdout.on('data', (data) => { pythonData += data.toString(); });

        pythonProcess.on('close', (code) => {
            if (code !== 0) return res.status(500).send("Engine compilation failed.");

            try {
                const metrics = JSON.parse(pythonData);
                const arch = archetypeRepository[metrics.archetype] || archetypeRepository["Dynamic Adaptation"];
                const lp = lpRepository[metrics.life_path] || { title: "Systemic Core", insight: "Baseline active." };

                const payload = {
                    fullName: fullName.toUpperCase(),
                    currentName: currentName.toUpperCase(),
                    birthDate: formattedDate,
                    matrixId: `_CORE_${metrics.hcv}_${metrics.life_path}`,
                    uspcScore: metrics.uspc_score,
                    archetype: metrics.archetype,
                    archSubtitle: arch.subtitle,
                    archDesc: arch.description,
                    archHuman: arch.humanImpact,
                    lifePath: metrics.life_path,
                    lifePathTitle: lp.title,
                    lifePathInsight: lp.insight,
                    expression: metrics.expression,
                    subconscious: metrics.subconscious_num,
                    hcv: metrics.hcv,
                    alignment: metrics.alignment_coefficient,
                    tensionGap: metrics.tension_gap,
                    missingVectors: metrics.missing_vectors,
                    missingMeanings: metrics.missing_meanings
                };

                const templatePath = path.join(__dirname, 'report-template.html');
                let htmlResponse = fs.readFileSync(templatePath, 'utf8');

                Object.keys(payload).forEach(key => {
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    htmlResponse = htmlResponse.replace(regex, payload[key]);
                });

                res.send(htmlResponse);
            } catch (err) {
                res.status(500).send("Data layout compilation error.");
            }
        });
    });
});

app.get('/', (req, res) => {
    res.send("// PLATH Secure Engine Warehouse with persistent DB records is live.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`// System running smoothly on port ${PORT}`);
});
