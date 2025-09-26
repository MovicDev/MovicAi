const express = require('express');
express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const getMovieData = async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.status(200).json({ 
            response: text
        });
    } catch (err) {
        console.error('Error generating content:', err);
        res.status(500).json({ 
            error: 'Failed to generate content', 
            details: err.message 
        });
    }
};

module.exports = { getMovieData };