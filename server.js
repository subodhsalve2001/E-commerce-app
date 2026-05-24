const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Cloud Database Uniform Resource Identifier
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://subodhsalve2002_db_user:hiVpmrZXZ8iXIWO2@cluster0.qo4aar3.mongodb.net/?appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected successfully to MongoDB Cloud!'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Define the Poem Schema
const poemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true }, // Stored as strict ISO-8601 strings
    published: { type: Boolean, default: false }
});

// Converts MongoDB's "_id" to "id" for your React frontend
poemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Poem = mongoose.model('Poem', poemSchema);

// --- API ROUTES ---

// GET: Fetch all poems chronologically
app.get('/api/poems', async (req, res) => {
    try {
        const poems = await Poem.find({}).sort({ date: -1 });
        res.json(poems);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong fetching poems." });
    }
});

// POST: Add a new poem
app.post('/api/poems', async (req, res) => {
    try {
        const newPoem = new Poem({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            content: req.body.content,
            date: req.body.date,
            published: req.body.published
        });
        
        const savedPoem = await newPoem.save();
        res.json(savedPoem);
    } catch (error) {
        res.status(400).json({ error: "Failed to save poem." });
    }
});

// PUT: Update an existing poem
app.put('/api/poems/:id', async (req, res) => {
    try {
        const updatedPoem = await Poem.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        
        if (updatedPoem) {
            res.json(updatedPoem);
        } else {
            res.status(404).json({ error: "Poem not found" });
        }
    } catch (error) {
        res.status(400).json({ error: "Failed to update poem." });
    }
});

// DELETE: Remove a poem
app.delete('/api/poems/:id', async (req, res) => {
    try {
        await Poem.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete poem." });
    }
});

// Dynamic Port Allocation enabling frictionless deployment to Render/Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on port ${PORT}`);
});