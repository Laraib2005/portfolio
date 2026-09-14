import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

const emailAddress = 'laraibrizwan221@gmail.com'
const formSubmitToken = 'd32618207196fbed616d84b7fe8970d'

function ThreeBackground({ theme }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    const isDark = theme === 'dark'
    const accent = isDark ? 0xc9e66d : 0xdd7653
    const softAccent = isDark ? 0x6b8b47 : 0xf0a486
    const group = new THREE.Group()
    const pointer = { x: 0, y: 0 }

    camera.position.z = 8
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0x000000, 0)
    scene.add(group)

    const wireMaterial = new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.18 })
    const orbMaterial = new THREE.MeshBasicMaterial({ color: softAccent, transparent: true, opacity: 0.11 })
    const solidMaterial = new THREE.MeshBasicMaterial({ color: softAccent, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    const orbGeometry = new THREE.SphereGeometry(1.8, 32, 24)
    const orb = new THREE.Mesh(orbGeometry, orbMaterial)
    const orbWire = new THREE.Mesh(orbGeometry, wireMaterial)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.08, 0.018, 12, 96), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.48 }))
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(14, 8, 20, 12), solidMaterial)

    const orbGroup = new THREE.Group()
    orbGroup.position.set(3.2, 0.6, -1)
    ring.rotation.set(1.05, 0.2, -0.2)
    orbGroup.add(orb, orbWire, ring)
    plane.rotation.x = -Math.PI / 2.8
    plane.position.set(0, -3.3, -2)
    group.add(orbGroup, plane)

    const starPositions = new Float32Array(360)
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (Math.random() - 0.5) * 15
      starPositions[index + 1] = (Math.random() - 0.5) * 9
      starPositions[index + 2] = (Math.random() - 0.5) * 7 - 2
    }
    const stars = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: accent, size: 3.2, sizeAttenuation: false, transparent: true, opacity: 0.85 }))
    stars.geometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    scene.add(stars)

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight, false)
    }

    function move(event) {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    let frameId
    function animate(time) {
      const elapsed = time * 0.00025
      orbGroup.rotation.y = elapsed * 0.7
      orbGroup.rotation.x = Math.sin(elapsed * 2) * 0.08
      ring.rotation.z = elapsed * 0.8
      stars.rotation.y = elapsed * 0.15
      stars.material.opacity = 0.66 + Math.sin(time * 0.0015) * 0.16
      group.rotation.y += (pointer.x * 0.04 - group.rotation.y) * 0.02
      group.rotation.x += (-pointer.y * 0.025 - group.rotation.x) * 0.02
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      orbGeometry.dispose()
      ring.geometry.dispose()
      plane.geometry.dispose()
      wireMaterial.dispose()
      orbMaterial.dispose()
      solidMaterial.dispose()
      ring.material.dispose()
      stars.geometry.dispose()
      stars.material.dispose()
      renderer.dispose()
    }
  }, [theme])

  return <canvas className="three-background" ref={canvasRef} aria-hidden="true" />
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! I\'m Laraib AI Assistant. How can I help you?' }])
  const [lastTopic, setLastTopic] = useState('')

  function getResponse(question) {
    const text = question.toLowerCase().replace(/[?!.,]/g, '').trim()
    if (/^(hi|hey|hello|hy|salam|assalamualaikum|aoa)$/.test(text)) return 'Hi! I\'m Laraib AI Assistant. How can I help you?'
    if (text.includes('how are you') || text.includes('how are u') || text === 'how r u') return 'I\'m doing great, thanks for asking! What would you like to talk about?'
    if (text.includes('who') || text.includes('name') || text.includes('about laraib')) { setLastTopic('laraib'); return 'Laraib Rizwan is an AI engineer and automation builder who creates practical systems for research, workflows, and creative work.' }
    if (text.includes('experience') || text.includes('background')) { setLastTopic('experience'); return 'Laraib\'s experience is focused on AI engineering, workflow automation, agentic AI, web development, and productivity-focused tools.' }
    if (text.includes('skill') || text.includes('tool') || text.includes('technology') || text.includes('tech')) { setLastTopic('skills'); return 'Laraib works with AI, automation, Python, C++, web development, OpenClaw, Claude, Agent SDK, Agentic AI, OpenAI, n8n, Make, Notion, Pinecone, and Airtable.' }
    if (text.includes('project') || text.includes('work') || text.includes('build')) { setLastTopic('projects'); return 'Laraib has built AI automation systems, knowledge systems for faster research, creative tooling, web experiences, and productivity workflows.' }
    if (text.includes('automation')) { setLastTopic('automation'); return 'Laraib designs human-in-the-loop automations that turn repetitive tasks into clear, reliable workflows.' }
    if (text.includes('openclaw')) return 'OpenClaw is one of Laraib\'s AI tools for building useful automation and agentic workflows.'
    if (text.includes('claude')) return 'Claude is part of Laraib\'s AI toolkit for research, reasoning, and content workflows.'
    if (text.includes('agent') || text.includes('agentic')) return 'Laraib is exploring Agent SDK and Agentic AI to build systems that can reason, connect tools, and complete useful tasks with human oversight.'
    if (text.includes('contact') || text.includes('email') || text.includes('hire') || text.includes('reach')) return 'You can contact Laraib directly at laraibrizwan221@gmail.com.'
    if (text.includes('python')) return 'Python is a high-level programming language commonly used for web development, automation, data analysis, and AI.'
    if (text.includes('c++') || text.includes('cpp')) return 'C++ is a fast, general-purpose programming language often used for systems and performance-focused software.'
    if (text.includes('what is artificial intelligence') || text.includes('what is ai') || text === 'ai') return 'Artificial intelligence is technology that enables computers to learn from information, understand patterns, and help with tasks that normally require human intelligence.'
    if (text.includes('what is fde') || text === 'fde') return 'FDE commonly means Full Disk Encryption in cybersecurity, but it can also mean Forward Deployed Engineer in technology.'
    if (text.includes('machine learning')) return 'Machine learning is a part of AI where systems learn patterns from data and use them to make predictions or decisions.'
    if (text.includes('course') && (text.includes('ai') || text.includes('artificial intelligence'))) return 'A strong AI learning path is: Python and math fundamentals, machine learning, deep learning, natural language processing, and then AI agents or automation. Build projects alongside each course so you learn by doing.'
    if (text.includes('learn ai') || text.includes('study ai') || text.includes('career in ai')) return 'Start with Python, statistics, and linear algebra, then learn machine learning, deep learning, NLP, and practical AI automation. A project-based course path is usually better than collecting certificates alone.'
    if (text.includes('thank')) return 'You are welcome!'
    if (/^(tell me more|more details)$/.test(text) && lastTopic === 'skills') return 'Laraib combines AI tools with Python, C++, web development, and automation platforms to build practical systems.'
    if (/^(tell me more|more details)$/.test(text) && lastTopic === 'projects') return 'Her projects focus on saving time, organizing knowledge, and helping people move from raw ideas to useful results.'
    return 'I do not know that yet. Could you add a little context or rephrase the question?'
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const question = input.trim()
    if (!question || isTyping) return
    const nextMessages = [...messages, { role: 'user', text: question }]
    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: nextMessages.slice(-10) }) })
      if (!response.ok) throw new Error('Gemini API request failed')
      const data = await response.json()
      setMessages((current) => [...current, { role: 'assistant', text: data.reply }])
    } catch {
      await new Promise((resolve) => window.setTimeout(resolve, 450))
      setMessages((current) => [...current, { role: 'assistant', text: getResponse(question) }])
    } finally { setIsTyping(false) }
  }

  return <div className="chat-widget"><div className={isOpen ? 'chat-panel open' : 'chat-panel'} aria-hidden={!isOpen}><div className="chat-header"><div><strong>Ask me anything</strong><small><span className="status-dot" /> Online assistant</small></div><button className="chat-close" type="button" onClick={() => setIsOpen(false)} aria-label="Minimize chat">−</button></div><div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}{isTyping && <div className="chat-message assistant typing"><span /><span /><span /></div>}</div><form className="chat-form" onSubmit={handleSubmit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Ask a question" /><button type="submit" aria-label="Send question">↑</button></form></div><button className="ask-button" type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-label={isOpen ? 'Close Ask chat' : 'Open Ask chat'}><span className="ask-spark" aria-hidden="true">✦</span> Ask</button></div>
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}><span aria-hidden="true">{isDark ? '☼' : '☾'}</span><small>{isDark ? 'Light' : 'Dark'}</small></button>
}

function ContactPage({ theme, onToggle }) {
  const [formState, setFormState] = useState('idle')
  const [formError, setFormError] = useState('')
  async function handleSubmit(event) {
    event.preventDefault()
    setFormState('sending')
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name')?.toString().trim()
    const email = formData.get('email')?.toString().trim()
    const message = formData.get('message')?.toString().trim()
    if (!name || !email || !message) { setFormState('error'); setFormError('Please complete your name, email, and message.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormState('error'); setFormError('Please enter a valid email address.'); return }
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${formSubmitToken}`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message, _subject: `Portfolio message from ${name}`, _replyto: email, _captcha: 'false' }) })
      if (!response.ok) throw new Error('Message could not be sent')
      form.reset(); setFormState('success')
    } catch { setFormState('error'); setFormError('Something went wrong. Please use the email link above instead.') }
  }
  return <main className="contact-page"><ThreeBackground theme={theme} /><ChatWidget /><nav className="nav shell"><a className="wordmark" href="#top" aria-label="Laraib Rizwan home">L<span>/</span>R</a><div className="nav-actions"><div className="nav-links contact-nav"><a href="#top">Home</a><a href="#about">About</a><a className="nav-contact" href="#contact">Contact ↗</a></div><ThemeToggle theme={theme} onToggle={onToggle} /></div></nav><section className="contact-layout shell"><div className="contact-kicker"><span className="status-dot" /> Open to meaningful work</div><div className="contact-copy"><p className="eyebrow">Let's make something useful</p><h1>Have a good<br /><em>problem?</em></h1><p>Tell me what is taking too much time, feeling too manual, or waiting for a smarter system. I would love to hear about it.</p><a className="contact-email" href={`mailto:${emailAddress}?subject=Let's%20work%20together`}>{emailAddress}<span aria-hidden="true">↗</span></a><form className="contact-form" onSubmit={handleSubmit} noValidate><label htmlFor="contact-name">Name<input id="contact-name" name="name" required /></label><label htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" required /></label><label htmlFor="contact-message">Message<textarea id="contact-message" name="message" rows="5" required /></label><button className="button button-dark" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? 'Sending...' : 'Send message'} ↗</button>{formState === 'success' && <p className="form-feedback success" role="status">Thanks, your message has been sent.</p>}{formState === 'error' && <p className="form-feedback error" role="alert">{formError}</p>}</form></div></section><footer className="footer shell"><span>© 2026 / Laraib Rizwan</span><span>AI engineer & automation builder</span><a href="#top">Back home ↑</a></footer></main>
}

function App() {
  const [activeFilter, setActiveFilter] = useState('All work')
  const [isContact, setIsContact] = useState(window.location.hash === '#contact')
  const [theme, setTheme] = useState(() => localStorage.getItem('laraib-theme') || 'light')

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('laraib-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleHashChange = () => setIsContact(window.location.hash === '#contact')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (isContact) return <ContactPage theme={theme} onToggle={toggleTheme} />

  const projects = [
    { number: '01', type: 'AI AUTOMATION', title: 'The inbox that thinks ahead.', description: 'A triage system that turns noisy support threads into calm, prioritized action lists.', tools: ['Make', 'OpenAI', 'Notion'], result: '4.5 hrs saved / week', color: 'peach' },
    { number: '02', type: 'KNOWLEDGE SYSTEM', title: 'A second brain for a small team.', description: 'A searchable research layer that connects scattered docs, calls, and decisions.', tools: ['n8n', 'Pinecone', 'Claude'], result: '2x faster research', color: 'mint' },
    { number: '03', type: 'CREATIVE TOOLING', title: 'From blank page to first draft.', description: 'A human-in-the-loop content pipeline for turning raw ideas into sharp first drafts.', tools: ['Python', 'GPT-4o', 'Airtable'], result: '12 workflows shipped', color: 'lilac' },
  ]
  const filteredProjects = activeFilter === 'All work' ? projects : projects.filter((project) => project.type === activeFilter)

  return (
    <main><ThreeBackground theme={theme} /><ChatWidget />
      <nav className="nav shell"><a className="wordmark" href="#top" aria-label="Laraib Rizwan home">L<span>/</span>R</a><div className="nav-actions"><div className="nav-links main-nav"><a href="#top">Home</a><a href="#about">About</a><a className="nav-contact" href="#contact">Contact <span aria-hidden="true">↗</span></a></div><ThemeToggle theme={theme} onToggle={toggleTheme} /></div></nav>
      <section className="hero shell" id="top"><div className="hero-copy"><p className="hero-name" aria-label="Laraib Rizwan">{'Laraib Rizwan'.split('').map((letter, index) => <span key={`${letter}-${index}`} aria-hidden="true">{letter === ' ' ? '\u00a0' : letter}</span>)}</p><p className="eyebrow"><span className="status-dot" /> AI systems & automation studio</p><h1>I make busywork<br /><em>disappear.</em></h1><p className="hero-intro">I help teams turn repetitive work into reliable AI systems, smart automations, and useful digital tools.</p><a className="button button-dark" href="#contact">Work with me <span aria-hidden="true">↗</span></a></div><div className="hero-art" aria-label="Abstract illustration of connected AI systems" role="img"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="core"><span>AI</span><small>in / out</small></div><div className="node node-a"><b>01</b><span>listen</span></div><div className="node node-b"><b>02</b><span>connect</span></div><div className="node node-c"><b>03</b><span>ship</span></div><div className="signal signal-one" /><div className="signal signal-two" /></div></section>
      <section className="marquee" aria-hidden="true"><div>CURIOUS BY DEFAULT <span>✳</span> USEFUL BY DESIGN <span>✳</span> HUMAN IN THE LOOP <span>✳</span> CURIOUS BY DEFAULT <span>✳</span></div></section>
      <section className="work shell" id="work"><div className="section-heading"><div><p className="eyebrow">A few things I have made</p><h2>Selected <em>work</em></h2></div><p className="section-note">Not demos. Small systems with a job to do.</p></div><div className="filters" role="group" aria-label="Filter projects">{['All work', 'AI AUTOMATION', 'KNOWLEDGE SYSTEM', 'CREATIVE TOOLING'].map((filter) => <button key={filter} className={activeFilter === filter ? 'filter active' : 'filter'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="project-list">{filteredProjects.map((project) => <article className={`project ${project.color}`} key={project.number}><div className="project-index">{project.number}</div><div className="project-main"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="tool-row">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div><div className="project-result"><span>Outcome</span><strong>{project.result}</strong><span className="arrow" aria-hidden="true">↗</span></div></article>)}</div></section>
      <section className="about shell" id="about"><div className="about-stamp">AI<br />×<br />HUMAN</div><div className="about-copy"><p className="eyebrow">A little context</p><h2>Building with<br /><em>intention.</em></h2><p>I am an AI engineer exploring the space between a clever model and a genuinely better day. My work lives across automation, research, and creative tools. I like systems that are transparent, adaptable, and just a little bit delightful to use.</p><div className="skill-list"><span>OpenClaw</span><span>Claude</span><span>Agent SDK</span><span>Agentic AI</span></div><a className="text-link" href="#contact">Start a conversation <span aria-hidden="true">↗</span></a></div><div className="availability"><span className="status-dot" /> Available for thoughtful projects<br /><small>Based anywhere with good Wi-Fi</small></div></section>
      <footer className="footer shell"><span>© 2026 / Laraib Rizwan</span><span>Built with curiosity + code</span><a href="#top">Back to top ↑</a></footer>
    </main>
  )
}

export default App
