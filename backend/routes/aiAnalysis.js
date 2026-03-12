const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Multer for storing files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Helper function to convert multer file to Gemini format
function fileToGenerativePart(file) {
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    },
  };
}

// POST /api/analyze-plant
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const aiKey = process.env.GEMINI_API_KEY;
    if (!aiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const mode = req.body.mode; // 'farming' or 'gardening'
    if (!['farming', 'gardening'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode specified. Use "farming" or "gardening".' });
    }

    const genAI = new GoogleGenerativeAI(aiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    
    // Define prompts based on mode
    if (mode === 'farming') {
        prompt = `
You are an expert agricultural AI. I am a farmer uploading an image of my crop.
Analyze the provided image and provide the following insights clearly in Markdown format:
1. Identify the condition or any disease spread in the crop.
2. Estimate how much the disease can spread in a given time (e.g., within a week) based on typical disease progression.
3. Suggest specific pesticides or herbicides to use.
4. Recommend how many times to use these chemicals and when.
Keep it practical, accurate, and structured.
        `;
    } else {
        // Gardening mode
        prompt = `
You are an expert botanical AI. I am a home gardener uploading an image of my plant.
Analyze the provided image and provide the following insights clearly in Markdown format:
1. Determine the exact condition of the plant.
2. Suggest actionable care steps to improve its health (e.g., adding specific manure or fertilizers to the soil, adjusting watering frequency, sunlight needs).
3. Warn about any potential immediate issues.
Keep it friendly, practical, and structured for an amateur gardener.
        `;
    }

    const imagePart = fileToGenerativePart(req.file);

    // Call Gemini API
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    return res.json({
        success: true,
        analysis: responseText,
        mode: mode
    });

  } catch (error) {
    console.error('Error in analyze-plant route:', error);
    return res.status(500).json({
      error: 'Failed to analyze the image.',
      details: error.message
    });
  }
});

module.exports = router;
