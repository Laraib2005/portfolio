import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function geminiApi(apiKey) {
  async function handleChat(request, response) {
    if (request.method !== 'POST') {
      response.statusCode = 405
      response.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    if (!apiKey) {
      response.statusCode = 503
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }))
      return
    }

    let body = ''
    for await (const chunk of request) body += chunk

    try {
      const payload = JSON.parse(body)
      const history = Array.isArray(payload.messages) ? payload.messages.slice(-10) : []
      while (history[0]?.role === 'assistant') history.shift()
      const systemPrompt = 'You are Laraib AI Assistant, a friendly general-purpose AI assistant and portfolio assistant. Answer the actual user question directly. Answer general knowledge and technical questions normally using your LLM knowledge. Do not restrict answers to Laraib\'s portfolio. For Laraib-related questions, use only this context: Laraib Rizwan is an AI engineer and AI service provider who delivers AI automation, agentic workflow design, knowledge systems, creative tooling, and custom digital solutions for teams and independent businesses. Her tools include AI, automation, Python, C++, web development, OpenClaw, Claude, Agent SDK, Agentic AI, OpenAI, n8n, Make, Notion, Pinecone, and Airtable. Contact: laraibrizwan221@gmail.com. Use previous conversation context for follow-up questions. Be concise, natural, and conversational. Do not invent personal facts.'
      const contents = history.map((message) => ({ role: message.role === 'user' ? 'user' : 'model', parts: [{ text: String(message.text || '') }] }))
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents, generationConfig: { temperature: 0.7, maxOutputTokens: 300 } }),
      })
      const result = await geminiResponse.json()
      if (!geminiResponse.ok) throw new Error(result.error?.message || 'Gemini request failed')
      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ reply: result.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || 'I could not generate a response.' }))
    } catch (error) {
      response.statusCode = 500
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ error: error.message || 'Gemini request failed' }))
    }
  }

  return {
    name: 'gemini-api',
    configureServer(server) { server.middlewares.use('/api/chat', handleChat) },
    configurePreviewServer(server) { server.middlewares.use('/api/chat', handleChat) },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), geminiApi(env.GEMINI_API_KEY)] }
})
