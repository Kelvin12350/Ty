const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get the API key from Vercel's environment variables
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  // This will stop the function if the API key is not set
  throw new Error("Google API Key is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// This is the main serverless function
export default async function handler(req, res) {
  // Vercel handles CORS and body parsing for us
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    // Send the AI's response back to the frontend
    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Error communicating with AI:", error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
}
