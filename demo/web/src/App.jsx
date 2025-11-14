import { useState, useRef, useEffect } from 'react'
import './App.css'

const MODES = {
  NORMAL: { label: 'Normal', icon: '○', color: '#4a9eff' },
  REFLECTIVE: { label: 'Reflective', icon: '◈', color: '#8b5cf6' },
  ADVERSARIAL: { label: 'Adversarial', icon: '⬡', color: '#ef4444' }
}

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Welcome to ActiveMirrorOS Demo. This is a simulated reflective session showing how the system engages with uncertainty and thoughtful questioning.',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [currentMode, setCurrentMode] = useState('REFLECTIVE')
  const [lingosLiteEnabled, setLingosLiteEnabled] = useState(true)
  const [sessionInteractions, setSessionInteractions] = useState(0)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage, mode, lingosEnabled) => {
    const responses = {
      NORMAL: {
        standard: [
          `I understand you're thinking about "${userMessage}". Let me help you explore that.`,
          `That's an interesting point. Here's what I think about ${userMessage.substring(0, 30)}...`,
          `Based on what you've shared, I'd say this relates to your ongoing exploration.`
        ],
        lingos: [
          `I'm noticing patterns in "${userMessage}" ⟨medium⟩. What aspect feels most important to you?`,
          `You've raised something worth exploring. ⟨low⟩ Could you say more about what drew you to this?`,
          `⟨medium⟩ I'm uncertain about the full context here. What would help me understand better?`
        ]
      },
      REFLECTIVE: {
        standard: [
          `Reflecting on your message, I see several layers worth exploring...`,
          `This connects to deeper patterns. Let me mirror back what I'm hearing...`,
          `Your words reveal interesting implications. Consider how this relates to...`
        ],
        lingos: [
          `⟨medium⟩ I'm sitting with "${userMessage.substring(0, 40)}..." What emerges when you pause with this?`,
          `This feels significant. ⟨high⟩ I'm uncertain what you mean by the underlying intention—could you reflect on that?`,
          `I notice hesitation in how to respond. ⟨medium⟩ What would make this more clear for both of us?`,
          `Your thought seems to contain multiple threads. ⟨low⟩ Which one pulls your attention most strongly?`
        ]
      },
      ADVERSARIAL: {
        standard: [
          `I need to challenge that assumption. Have you considered the opposite viewpoint?`,
          `Let me push back on this: what evidence supports your position?`,
          `That's one perspective, but what about the counterargument that...?`
        ],
        lingos: [
          `⟨high⟩ I'm uncertain that holds up under scrutiny. What happens if we test that assumption?`,
          `I notice resistance to this view. ⟨medium⟩ Can you explain why this feels true to you?`,
          `⟨medium⟩ I'm questioning whether we're seeing the full picture. What are we missing?`,
          `Your certainty here makes me curious. ⟨low⟩ Where might doubt be valuable?`
        ]
      }
    }

    const pool = lingosEnabled
      ? responses[mode].lingos
      : responses[mode].standard

    return pool[Math.floor(Math.random() * pool.length)]
  }

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString()
    }

    const assistantMessage = {
      role: 'assistant',
      content: generateResponse(inputText, currentMode, lingosLiteEnabled),
      timestamp: new Date().toISOString(),
      mode: currentMode
    }

    setMessages([...messages, userMessage, assistantMessage])
    setSessionInteractions(prev => prev + 1)
    setInputText('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const cycleMode = () => {
    const modes = Object.keys(MODES)
    const currentIndex = modes.indexOf(currentMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setCurrentMode(modes[nextIndex])
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">
            <span className="icon">◈</span>
            ActiveMirrorOS Demo
          </h1>
          <p className="subtitle">Reflection over Prediction</p>
        </div>

        <div className="controls">
          <div className="mode-selector">
            <button
              className="mode-button"
              onClick={cycleMode}
              style={{ borderColor: MODES[currentMode].color }}
            >
              <span style={{ color: MODES[currentMode].color }}>
                {MODES[currentMode].icon}
              </span>
              <span className="mode-label">{MODES[currentMode].label}</span>
            </button>
          </div>

          <div className="lingos-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={lingosLiteEnabled}
                onChange={(e) => setLingosLiteEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">LingOS Lite Mode</span>
            </label>
            {lingosLiteEnabled && (
              <div className="lingos-info">
                • More questions<br/>
                • Explicit uncertainty ⟨⟩<br/>
                • Reflective paraphrases
              </div>
            )}
          </div>
        </div>

        <div className="session-info">
          Session interactions: <strong>{sessionInteractions}</strong>
        </div>
      </header>

      <main className="chat-container">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message message-${msg.role}`}>
              <div className="message-header">
                <span className="message-role">
                  {msg.role === 'user' ? '👤 You' :
                   msg.role === 'system' ? '⚙️ System' :
                   `🤖 ActiveMirror${msg.mode ? ` (${MODES[msg.mode].icon} ${MODES[msg.mode].label})` : ''}`}
                </span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            className="input"
            placeholder="Share your thoughts..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="3"
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            Send ✦
          </button>
        </div>
      </main>

      <footer className="footer">
        <p>
          <strong>Demo Note:</strong> This is a simulated interface using rule-based responses.
          No real AI calls are made. Responses demonstrate LingOS Lite patterns with uncertainty markers.
        </p>
      </footer>
    </div>
  )
}

export default App
