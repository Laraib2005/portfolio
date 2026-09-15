export function normalizeQuestion(question = '') {
  return String(question).toLowerCase().replace(/[?!.,]/g, '').trim()
}

export function getChatResponse(question, lastTopic = '') {
  const text = normalizeQuestion(question)

  if (/^(hi|hey|hello|hy|salam|assalamualaikum|aoa)$/.test(text)) {
    return 'Hi! I\'m Laraib AI Assistant. How can I help you?'
  }

  if (text.includes('how are you') || text.includes('how are u') || text === 'how r u') {
    return 'I\'m doing great, thanks for asking! What would you like to talk about?'
  }

  if (text.includes('who') || text.includes('name') || text.includes('about laraib')) {
    return 'Laraib Rizwan is an AI engineer and automation builder who creates practical systems for research, workflows, and creative work.'
  }

  if (text.includes('experience') || text.includes('background')) {
    return 'Laraib\'s experience is focused on AI engineering, workflow automation, agentic AI, web development, and productivity-focused tools.'
  }

  if (text.includes('skill') || text.includes('tool') || text.includes('technology') || text.includes('tech')) {
    return 'Laraib works with AI, automation, Python, C++, web development, OpenClaw, Claude, Agent SDK, Agentic AI, OpenAI, n8n, Make, Notion, Pinecone, and Airtable.'
  }

  if (text.includes('project') || text.includes('work') || text.includes('build')) {
    return 'Laraib has built AI automation systems, knowledge systems for faster research, creative tooling, web experiences, and productivity workflows.'
  }

  if (text.includes('automation')) {
    return 'Laraib designs human-in-the-loop automations that turn repetitive tasks into clear, reliable workflows.'
  }

  if (text.includes('openclaw')) {
    return 'OpenClaw is one of Laraib\'s AI tools for building useful automation and agentic workflows.'
  }

  if (text.includes('claude')) {
    return 'Claude is part of Laraib\'s AI toolkit for research, reasoning, and content workflows.'
  }

  if (text.includes('agent') || text.includes('agentic')) {
    return 'Laraib is exploring Agent SDK and Agentic AI to build systems that can reason, connect tools, and complete useful tasks with human oversight.'
  }

  if (text.includes('contact') || text.includes('email') || text.includes('hire') || text.includes('reach')) {
    return 'You can contact Laraib directly at laraibrizwan221@gmail.com.'
  }

  if (text.includes('python')) {
    return 'Python is a high-level programming language commonly used for web development, automation, data analysis, and AI.'
  }

  if (text.includes('c++') || text.includes('cpp')) {
    return 'C++ is a fast, general-purpose programming language often used for systems and performance-focused software.'
  }

  if (text.includes('what is artificial intelligence') || text.includes('what is ai') || text === 'ai') {
    return 'Artificial intelligence is technology that enables computers to learn from information, understand patterns, and help with tasks that normally require human intelligence.'
  }

  if (text.includes('what is fde') || text === 'fde') {
    return 'FDE commonly means Full Disk Encryption in cybersecurity, but it can also mean Forward Deployed Engineer in technology.'
  }

  if (text.includes('machine learning')) {
    return 'Machine learning is a part of AI where systems learn patterns from data and use them to make predictions or decisions.'
  }

  if (text.includes('course') && (text.includes('ai') || text.includes('artificial intelligence'))) {
    return 'A strong AI learning path is: Python and math fundamentals, machine learning, deep learning, natural language processing, and then AI agents or automation. Build projects alongside each course so you learn by doing.'
  }

  if (text.includes('learn ai') || text.includes('study ai') || text.includes('career in ai')) {
    return 'Start with Python, statistics, and linear algebra, then learn machine learning, deep learning, NLP, and practical AI automation. A project-based course path is usually better than collecting certificates alone.'
  }

  if (text.includes('thank')) {
    return 'You are welcome!'
  }

  if (/^(tell me more|more details)$/.test(text) && lastTopic === 'skills') {
    return 'Laraib combines AI tools with Python, C++, web development, and automation platforms to build practical systems.'
  }

  if (/^(tell me more|more details)$/.test(text) && lastTopic === 'projects') {
    return 'Her projects focus on saving time, organizing knowledge, and helping people move from raw ideas to useful results.'
  }

  const currencyMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:usd|us dollar|dollar|dollars|pakistani rupee|pkr|rupees)/i)
  if (currencyMatch) {
    const amount = Number(currencyMatch[1])
    const hasPakistaniContext = /pakistan|pkr|rupee|rupees/.test(text)
    const hasDollarContext = /dollar|usd|us dollar/.test(text)
    if (hasDollarContext && hasPakistaniContext) {
      const rate = 278.5
      return `About ${amount} USD is around PKR ${Number((amount * rate).toFixed(2)).toLocaleString()} in Pakistan, depending on the live exchange rate.`
    }
  }

  if (text.includes('dollar') && text.includes('pakistan')) {
    return 'About 1 USD is roughly PKR 278 to 280 in Pakistan, depending on the current exchange rate.'
  }

  if (text.includes('convert') && (text.includes('dollar') || text.includes('usd')) && text.includes('pkr')) {
    return 'Using a rough rate of 1 USD = PKR 278.5, a 1 USD amount is about PKR 278.5.'
  }

  return 'I do not know that yet. Could you add a little context or rephrase the question?'
}
