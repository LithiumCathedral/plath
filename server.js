const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto'); // Built-in Node tool to generate unique session hashes
const { spawn } = require('child_process');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// mock database object for architectural visualization 
// (In production, replace with a quick SQLite or Supabase instance)
const globalTelemetryDatabase = {}; 

// 1. STRIPE CHECKOUT INITIALIZATION ROUTE
app.post('/create-checkout-session', async (req, res) => {
    const { email, fullName, currentName, birthDate } = req.body;
    
    // Here you will initialize the Stripe SDK wrapper:
    // const session = await stripe.checkout.sessions.create({ ... })
    
    // For now, we simulate a successful redirect pipeline to the success token handler
    res.redirect(`https://plath-backend-production.up.railway.app/verify-transaction?email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}&currentName=${encodeURIComponent(currentName)}&birthDate=${encodeURIComponent(birthDate)}`);
});

// 2. TRANSACTION VERIFICATION & PERMANENT SESSION GENERATION
app.get('/verify-transaction', (req, res) => {
    const { email, fullName, currentName, birthDate } = req.query;
    
    // Generate an unbreakable, unique session string hash
    const uniqueSessionId = crypto.randomBytes(16).toString('hex');
    
    // Lock the metrics data bundle into permanent memory mapped to that hash
    globalTelemetryDatabase[uniqueSessionId] = {
        email,
        fullName,
        currentName,
        birthDate,
        timestamp: Date.now()
    };
    
    // OPTIONAL: Trigger an automated email node here to send the link directly to their inbox
    // mailer.sendMagicLink(email, `https://plath-backend-production.up.railway.app/report/${uniqueSessionId}`);

    // Instantly redirect the active user straight to their unique, permanent report portal
    res.redirect(`/report/${uniqueSessionId}`);
});

// 3. PERSISTENT MULTI-DEVICE ROUTE BY UNIQUE SESSION ID
app.get('/report/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const activeSession = globalTelemetryDatabase[sessionId];
    
    if (!activeSession) {
        return res.status(404).send("Telemetry profile expired or unrecognized. Verify security parameters.");
    }
    
    // Extract the saved parameters effortlessly
    const { fullName, currentName, birthDate } = activeSession;
    const [year, month, day] = birthDate.split('-');
    const formattedDate = `${month}-${day}-${year}`;

    const inputData = JSON.stringify({
        full_birth_name: fullName,
        current_name: currentName,
        dob: formattedDate
    });

    // Spawn the Python math matrix engine to calculate the data dynamically on load
    const pythonProcess = spawn('python3', [path.join(__dirname, 'engine.py')]);
    let pythonData = '';
    
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();
    pythonProcess.stdout.on('data', (data) => { pythonData += data.toString(); });

    pythonProcess.on('close', (code) => {
        if (code !== 0) return res.status(500).send("Engine calculation fault.");
        
        const metrics = json.parse(pythonData);
        
        // ... (Your existing code to fetch archetype repository strings and render report-template.html)
        // Pass 'window.location.href' cleanly down to Card 9's share button actions!
    });
});
