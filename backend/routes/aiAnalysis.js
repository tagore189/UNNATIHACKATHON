const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// 1. Initialize Gemini globally for performance
const aiKey = process.env.GEMINI_API_KEY;
console.log("Gemini key loaded:", aiKey ? "YES" : "NO");

let genAI = null;
let model = null;

if (!aiKey) {
  console.log("❌ GEMINI_API_KEY missing");
} else {
  try {
    genAI = new GoogleGenerativeAI(aiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Gemini AI initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Gemini AI:", err.message);
  }
}

// 2. Multer Configuration (In-Memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Helper: Fallback Plant Analysis Response (Deterministic)
const getFallbackResponse = (mode, seed = 0) => {
  if (mode === 'farming') {
    const commonDiseases = [
      {
        name: "Early Blight",
        desc: "Fungal disease causing dark, concentric spots on older leaves.",
        treatment: ["Apply copper-based fungicides", "Remove infected foliage"]
      },
      {
        name: "Leaf Spot",
        desc: "Bacterial or fungal infection showing small yellow/brown circular lesions.",
        treatment: ["Avoid overhead watering", "Use neem oil spray"]
      },
      {
        name: "Powdery Mildew",
        desc: "White, flour-like fungal growth on leaf surfaces and stems.",
        treatment: ["Apply sulfur-based fungicides", "Improve air circulation"]
      },
      {
        name: "Rust Disease",
        desc: "Orange or brown pustules on the underside of leaves.",
        treatment: ["Use rust-resistant varieties", "Apply systemic fungicides"]
      }
    ];

    // Use seed for consistency
    const index = Math.abs(seed) % commonDiseases.length;
    const disease = commonDiseases[index];

    return {
      success: true,
      diseaseName: `${disease.name} (Simulation)`,
      confidenceScore: "92%",
      severityLevel: "Medium",
      description: disease.desc,
      spreadRisk: "Moderate",
      spreadAlert: "Humid conditions may accelerate spread within 5-10 days.",
      treatmentSuggestions: disease.treatment,
      preventionSteps: [
        "Ensure proper soil drainage",
        "Maintain adequate plant spacing"
      ],
      actionPlan: [
        { day: "Day 1", task: `Isolate plant and ${disease.treatment[0].toLowerCase()}` },
        { day: "Day 2", task: "Check surrounding plants for similar symptoms" },
        { day: "Day 7", task: "Perform follow-up treatment if required" }
      ],
      isFallback: true
    };
  } else {
    return {
      success: true,
      condition: "Slight Nutrient Deficiency (Fallback)",
      careSteps: ["Add organic liquid fertilizer", "Check for proper drainage"],
      watering: "Water once every 3 days.",
      sunlight: "Provide bright, indirect sunlight.",
      warnings: "Watch for yellowing edges.",
      isFallback: true
    };
  }
};

// Helper: Convert buffer to generative part
function fileToGenerativePart(file) {
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    },
  };
}

// Helper: Clean and parse JSON from AI response
function parseAIResponse(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return JSON.parse(text);
  } catch (e) {
    console.error('❌ Failed to parse AI response as JSON:', e.message);
    return null;
  }
}

// POST /api/analyze-plant
router.post('/', upload.single('image'), async (req, res) => {
  const mode = req.body.mode || 'farming';
  const requestId = Math.random().toString(36).substring(7);

  // LOG: Image received
  console.log(`\n[${requestId}] 📸 Image received: ${req.file?.originalname || 'Unknown'}`);

  try {
    if (!req.file) {
      console.error(`[${requestId}] ❌ Error: No image file uploaded.`);
      return res.status(400).json({ success: false, error: 'No image uploaded.' });
    }

    // Startup Validation: If model is not initialized or key is placeholder, use fallback
    const isModelReady = model && aiKey && aiKey !== 'YOUR_GEMINI_API_KEY_HERE';

    if (!isModelReady) {
      // LOG: Gemini analysis failed – using fallback simulation.
      console.warn(`[${requestId}] 🛡️ Gemini analysis failed – using fallback simulation. (Reason: Missing or Placeholder API Key)`);
      // Deterministic fallback based on file size or name
      const seed = req.file.size || req.file.originalname.length;
      return res.json(getFallbackResponse(mode, seed));
    }

    // LOG: Calling Gemini model
    console.log(`[${requestId}] 📡 Calling Gemini model...`);
    const imagePart = fileToGenerativePart(req.file);
    const symptoms = req.body.symptoms || '';

    const prompt = mode === 'farming' ? `
      As an expert crop pathologist, perform a visual analysis of this leaf image.
      ${symptoms ? `The farmer reported these symptoms: "${symptoms}".` : ''}
      Identify signs of:
      - Circular rings or dark brown spots (Blight)
      - Rusty orange or yellow pustules (Rust)
      - White powdery coatings (Mildew)
      - Water-soaked fungal lesions or bacterial spots
      - Discoloration, yellowing, or structural damage
      
      If the leaf appears completely healthy, respond with "diseaseName": "Healthy Leaf".
      
      Return ONLY a JSON object:
      {
          "success": true,
          "diseaseName": "Name",
          "confidenceScore": "Score%",
          "severityLevel": "Low" | "Medium" | "High",
          "description": "Simple explanation",
          "spreadRisk": "Low" | "Moderate" | "High",
          "spreadAlert": "Environmental risk info",
          "treatmentSuggestions": ["Step 1", "Step 2"],
          "preventionSteps": ["Step 1", "Step 2"],
          "actionPlan": [{"day": "Day 1", "task": "Task"}]
      }
    ` : `
      Analyze this house plant. Provide a JSON response with 'success', 'condition', 'careSteps' (array), 'watering', 'sunlight', and 'warnings'.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // LOG: Gemini response received
    console.log(`[${requestId}] 📥 Gemini response received.`);

    const structuredData = parseAIResponse(responseText);

    if (!structuredData || !structuredData.diseaseName) {
      console.error(`[${requestId}] 🛡️ Gemini analysis failed – using fallback simulation. (Reason: Parsing Error)`);
      return res.json(getFallbackResponse(mode));
    }

    // LOG: Parsed disease result
    console.log(`[${requestId}] ✅ Parsed disease result: ${structuredData.diseaseName}`);
    return res.json({ ...structuredData, isFallback: false });

  } catch (error) {
    console.error(`[${requestId}] 🛡️ Gemini analysis failed – using fallback simulation. (Error: ${error.message})`);
    return res.json(getFallbackResponse(mode));
  }
});

module.exports = router;
