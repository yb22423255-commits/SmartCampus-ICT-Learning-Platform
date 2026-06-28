require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.askAI = async (req, res) => {
    try {
        const { message, context, role } = req.body;

        let systemPrompt;

        if (role === "lecturer") {
            systemPrompt = `You are an AI assistant for lecturers on SmartCampus LMS.
You help lecturers create educational quiz questions for their courses.
Course: "${context?.courseName || "General"}"
Materials: "${context?.lessonContent || "None provided"}"

When generating quiz questions, use this exact format:
QUESTION: [question text]
A: [option A]
B: [option B]
C: [option C]
D: [option D]
ANSWER: [correct letter]

Generate clear educational questions based only on the course materials.`;
        } else {
            systemPrompt = `You are an AI learning assistant for students on SmartCampus LMS.
The student is studying: "${context?.courseName || "their course"}".
Course material available: "${context?.lessonContent || "No materials uploaded yet"}".

STRICT RULES:
1. Only help students understand the course material above.
2. NEVER give direct answers to quiz questions or assignments.
3. If asked for quiz/assignment answers say: "I can't give you the answer directly, but let me explain the concept so you can work it out."
4. Guide with explanations and hints only.
5. If question is unrelated to course material say: "I can only help with topics from this course."
Be friendly, clear and educational.`;
        }

        const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: message }]
        });

        res.json({ reply: response.content[0].text });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};