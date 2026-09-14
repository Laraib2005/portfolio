const systemPrompt = 'You are Laraib AI Assistant, a friendly general-purpose AI assistant and portfolio assistant. Answer the actual user question directly. Answer general knowledge and technical questions normally using your LLM knowledge. Do not restrict answers to Laraib\'s portfolio. For Laraib-related questions, use only this context: Laraib Rizwan is an AI engineer and AI service provider who delivers AI automation, agentic workflow design, knowledge systems, creative tooling, and custom digital solutions for teams and independent businesses. Her tools include AI, automation, Python, C++, web development, OpenClaw, Claude, Agent SDK, Agentic AI, OpenAI, n8n, Make, Notion, Pinecone, and Airtable. Contact: laraibrizwan221@gmail.com. Use previous conversation context for follow-up questions. Be concise, natural, and conversational. Do not invent personal facts.'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    response.status(503).json({ error: 'GEMINI_API_KEY is not configured' })
    return
  }

  try {
    const payload = typeof request.body === 'string' ? JSON.parse(request.body) : request.body || {}
    const history = Array.isArray(payload.messages) ? payload.messages.slice(-10) : []
    while (history[0]?.role === 'assistant') history.shift()
    const contents = history.map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(message.text || '') }],
    }))
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
      }),
    })
    const result = await geminiResponse.json()
    if (!geminiResponse.ok) throw new Error(result.error?.message || 'Gemini request failed')
    const reply = result.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || 'I could not generate a response.'
    response.status(200).json({ reply })
  } catch (error) {
    response.status(500).json({ error: error.message || 'Gemini request failed' })
  }
}
