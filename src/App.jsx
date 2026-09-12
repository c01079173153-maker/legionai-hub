import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserProvider, Contract, parseUnits, formatUnits } from 'ethers';
import './index.css';

// ── Web3 설정 ──────────────────────────────────────────────────
const LGAI_ADDRESS = "0xC8C2D7B7736C3B5eC4eD0F547791E4389A054512";
const COMMANDER_WALLET = "0x68B56EAc0209B3230891B4e74a78b276f3b74610";
const LGAI_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const PAYMENT_AMOUNT = "10"; // 10 LGAI per query

// ── 에이전트 정의 ─────────────────────────────────────────────
const AGENTS = [
  { id: 1, name: '염 사령관', role: 'Supreme Commander', avatar: '👑', color: '#f59e0b', tasks: ['전략 수립', '작전 명령'], defaultModel: 'qwen2.5:1.5b' },
  { id: 2, name: 'Alpha — 전략 참모', role: 'Chief Strategy', avatar: '🧠', color: '#00d2ff', tasks: ['시장 분석', '투자 전략'], defaultModel: 'gemma3:4b' },
  { id: 3, name: 'Beta — 코드 장인', role: 'Lead Engineer', avatar: '⚙️', color: '#a855f7', tasks: ['API 개발', '버그 수정'], defaultModel: 'phi4-mini:3.8b' },
  { id: 4, name: 'Gamma — 시장 스파이', role: 'Intel Analyst', avatar: '🔭', color: '#10b981', tasks: ['시세 모니터링', '경쟁사 분석'], defaultModel: 'llama3.2:3b' },
  { id: 5, name: 'Delta — 봇 병사', role: 'Auto-Trader', avatar: '🤖', color: '#ef4444', tasks: ['자동 매수/매도'], defaultModel: 'qwen2.5:1.5b' },
  { id: 6, name: 'Epsilon — 디자이너', role: 'Creative Director', avatar: '🎨', color: '#ec4899', tasks: ['UI 목업', 'UX 설계'], defaultModel: 'gemma3:4b' },
];

function getTime() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function App() {
  // Web3 States
  const [walletAddress, setWalletAddress] = useState(null);
  const [lgaiBalance, setLgaiBalance] = useState("0");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // AI States
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('qwen2.5:1.5b');
  const [activeAgent, setActiveAgent] = useState(null);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [agentStates, setAgentStates] = useState(() => {
    const states = {};
    AGENTS.forEach(a => { states[a.id] = { status: 'idle', taskIdx: 0 }; });
    return states;
  });

  const [messages, setMessages] = useState([
    { role: 'agent', agent: AGENTS[0], text: '사령관님, 새로운 Web3 통합 사령부가 완공되었습니다. 우측 상단의 지갑을 연결하고 10 LGAI를 결제하여 명령을 내리십시오.', time: getTime() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const OLLAMA = '/ollama';

  // ── Web3 기능 ───────────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('메타마스크가 설치되어 있지 않습니다!');
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      
      // Switch to Sepolia
      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]); // Sepolia
      } catch (err) {
        console.error("Sepolia 네트워크 변경 실패", err);
      }

      await updateBalance(accounts[0], provider);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBalance = async (address, provider) => {
    try {
      const contract = new Contract(LGAI_ADDRESS, LGAI_ABI, provider);
      const bal = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      setLgaiBalance(formatUnits(bal, decimals));
    } catch (e) {
      console.error("잔액 조회 실패", e);
    }
  };

  // ── AI 엔진 연결 확인 ──────────────────────────────────────
  useEffect(() => {
    const load = () => fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(5000) })
      .then(r => r.json())
      .then(data => {
        setModels(data.models || []);
        if (!ollamaOnline) setOllamaOnline(true);
      })
      .catch(() => setOllamaOnline(false));

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [ollamaOnline]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const setAgentStatus = useCallback((agentId, status) => {
    setAgentStates(prev => ({ ...prev, [agentId]: { ...prev[agentId], status } }));
  }, []);

  // ── 결제 및 채팅 로직 ──────────────────────────────────────
  const handleChatRequest = async () => {
    if (!input.trim() || isLoading || isProcessingPayment) return;
    if (!walletAddress) {
      alert("먼저 우측 상단에서 메타마스크 지갑을 연결해주십시오.");
      return;
    }

    const currentInput = input.trim();
    const agent = activeAgent || AGENTS[1];
    
    // 1. 유저 메시지 추가
    const userMsg = { role: 'user', text: currentInput, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessingPayment(true);

    try {
      // 2. LGAI 결제 진행
      setMessages(prev => [...prev, { 
        role: 'agent', agent, 
        text: `명령을 접수했습니다. 10 LGAI 결제를 메타마스크에서 승인해주십시오... 🦊`, 
        time: getTime(), isPaymentPrompt: true 
      }]);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(LGAI_ADDRESS, LGAI_ABI, signer);
      
      const decimals = await contract.decimals();
      const amount = parseUnits(PAYMENT_AMOUNT, decimals);

      // 송금 트랜잭션 발생
      const tx = await contract.transfer(COMMANDER_WALLET, amount);
      setMessages(prev => [...prev, { 
        role: 'agent', agent, 
        text: `트랜잭션이 네트워크에 전송되었습니다. 블록 확인 대기 중... ⏳ (TX: ${tx.hash.slice(0,10)}...)`, 
        time: getTime(), isPaymentPrompt: true 
      }]);

      await tx.wait(); // 블록에 기록될 때까지 대기
      
      // 결제 성공! 잔액 갱신
      await updateBalance(walletAddress, provider);
      setIsProcessingPayment(false);
      setIsLoading(true);
      setAgentStatus(agent.id, 'working');

      // 3. AI 추론 시작
      const systemPrompt = `당신은 "${agent.name}"입니다. 역할: ${agent.role}. 
      당신은 염상민 사령관의 AI 군단 소속 에이전트입니다. 짧고 명확하게 한국어로 답변하세요. 전문적이고 자신감 있는 어조를 유지하세요.`;

      const response = await fetch(`${OLLAMA}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter(m => !m.isPaymentPrompt).slice(-4).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: currentInput }
          ],
          stream: false
        })
      });

      const data = await response.json();
      const reply = data.message?.content || '응답 오류';
      
      setMessages(prev => [...prev, { role: 'agent', agent, text: `[결제 완료 ✓]\n${reply}`, time: getTime() }]);
      setAgentStatus(agent.id, 'completed');
      setTimeout(() => setAgentStatus(agent.id, 'idle'), 3000);

    } catch (error) {
      console.error(error);
      setIsProcessingPayment(false);
      setMessages(prev => [...prev, { 
        role: 'agent', agent, 
        text: `❌ 결제가 거절되었거나 실패했습니다. (가스비 부족 또는 잔액 부족)`, 
        time: getTime(), isPaymentPrompt: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatRequest(); }
  };

  const formatAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <>
      <div className="bg-scene">
        <div className="bg-grid" />
        <div className="bg-glow bg-glow-1" />
        <div className="bg-glow bg-glow-2" />
      </div>

      <div className="app-layout">
        {/* ── TOPBAR ── */}
        <header className="topbar glass-panel">
          <div className="topbar-logo">
            <div className="logo-icon">🔮</div>
            <div className="logo-text"><span>Legion</span>AI Hub</div>
          </div>

          <div className="topbar-right">
            <div className={`status-pill ${ollamaOnline ? 'online' : ''}`}>
              <div className="status-dot" style={{ background: ollamaOnline ? 'var(--green)' : 'var(--red)' }} />
              {ollamaOnline ? 'AI ENGINE: ONLINE' : 'AI ENGINE: OFFLINE'}
            </div>
            
            {walletAddress ? (
              <div className="wallet-btn connected">
                <span style={{ fontSize: '16px' }}>🦊</span>
                {formatAddr(walletAddress)}
                <div className="wallet-balance">{parseFloat(lgaiBalance).toLocaleString()} LGAI</div>
              </div>
            ) : (
              <button className="wallet-btn" onClick={connectWallet}>
                <span style={{ fontSize: '18px' }}>🦊</span>
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* ── MAIN DASHBOARD ── */}
        <div className="dashboard">
          
          {/* LEFT SIDEBAR */}
          <aside className="sidebar glass-panel">
            <div>
              <div className="sidebar-section-title">AI CORE MODELS</div>
              <div className="model-selector">
                {models.length > 0 ? models.map(m => (
                  <div key={m.name} className={`model-item ${selectedModel === m.name ? 'active' : ''}`} onClick={() => setSelectedModel(m.name)}>
                    <div className="model-badge">{m.name.includes('qwen') ? '🌟' : m.name.includes('gemma') ? '💎' : '⚡'}</div>
                    <div className="model-info">
                      <div className="model-name">{m.name}</div>
                      <div className="model-meta">{m.details?.parameter_size}</div>
                    </div>
                  </div>
                )) : <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>로컬 AI 모델을 감지할 수 없습니다.</div>}
              </div>
            </div>

            <div>
              <div className="sidebar-section-title">AGENTS ROSTER</div>
              <div className="agent-roster">
                {AGENTS.map(agent => (
                  <div key={agent.id} className={`roster-item ${activeAgent?.id === agent.id ? 'active-roster' : ''}`} onClick={() => setActiveAgent(agent)}>
                    <div className="roster-avatar" style={{ background: `${agent.color}20`, borderColor: agent.color }}>
                      {agent.avatar}
                    </div>
                    <div className="roster-info">
                      <div className="roster-name" style={{ color: activeAgent?.id === agent.id ? agent.color : 'var(--text-primary)' }}>{agent.name}</div>
                      <div className="roster-role" style={{ color: agent.color }}>{agent.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER OFFICE VIEW */}
          <main className="main-area">
            <div className="stats-bar glass-panel">
              <div className="stat-item">
                <div className="stat-icon" style={{ color: 'var(--cyan)' }}>⚡</div>
                <div className="stat-data">
                  <div className="stat-value glow-cyan">99.9%</div>
                  <div className="stat-label">System Uptime</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon" style={{ color: 'var(--purple-bright)' }}>🧩</div>
                <div className="stat-data">
                  <div className="stat-value glow-purple">{models.length}</div>
                  <div className="stat-label">Loaded Models</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon" style={{ color: 'var(--amber)' }}>💰</div>
                <div className="stat-data">
                  <div className="stat-value">10 LGAI</div>
                  <div className="stat-label">Cost per Query</div>
                </div>
              </div>
            </div>

            <div className="office-area">
              <div className="agent-work-grid">
                {AGENTS.map(agent => {
                  const s = agentStates[agent.id]?.status || 'idle';
                  return (
                    <div key={agent.id} className={`agent-work-card ${activeAgent?.id === agent.id ? 'active-card' : ''}`} onClick={() => setActiveAgent(agent)}>
                      <div className="card-header">
                        <div className="card-avatar" style={{ color: agent.color }}>
                          {agent.avatar}
                          {s === 'working' && <div className="working-ring" style={{ borderColor: agent.color }} />}
                        </div>
                        <div className="card-meta">
                          <div className="card-agent-name">{agent.name}</div>
                          <div className="card-agent-role" style={{ color: agent.color }}>{agent.role}</div>
                        </div>
                      </div>
                      
                      <div className="card-task">
                        <div className="task-label">Current Task</div>
                        <div className="task-text">
                          {s === 'working' ? (
                            <span style={{ color: 'var(--cyan)' }}>AI 프로세스 연산 중...</span>
                          ) : s === 'completed' ? (
                            <span style={{ color: 'var(--green)' }}>임무 완수 ✓</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>스탠바이 상태</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="card-footer">
                        <span>{agent.defaultModel}</span>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: `${agent.color}20`, color: agent.color, fontSize: '10px' }}>
                          READY
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>

          {/* RIGHT CHAT AREA */}
          <aside className="chat-area glass-panel">
            <div className="chat-header">
              <div className="chat-title">
                {activeAgent ? activeAgent.avatar : '💬'} 
                {activeAgent ? activeAgent.name : 'Terminal'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                {walletAddress ? 'SECURE CONNECTION' : 'WAITING FOR WALLET'}
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <div className={`msg-avatar ${msg.role === 'user' ? 'user-av' : 'agent'}`}>
                    {msg.role === 'user' ? '👑' : (msg.agent?.avatar || '🤖')}
                  </div>
                  <div>
                    <div className={`msg-bubble ${msg.isPaymentPrompt ? 'payment-bubble' : ''}`}>
                      <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{msg.text}</pre>
                    </div>
                    <div className="msg-time">{msg.time}</div>
                  </div>
                </div>
              ))}
              {(isLoading || isProcessingPayment) && (
                <div className="message agent">
                  <div className="msg-avatar agent">{activeAgent?.avatar || '🤖'}</div>
                  <div className="msg-bubble" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {isProcessingPayment ? '결제 트랜잭션 처리 중...' : 'AI 모델 추론 중...'}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <div className="input-wrapper">
                <textarea
                  className="chat-input"
                  placeholder={walletAddress ? (activeAgent ? `${activeAgent.name}에게 명령 하달 (비용: 10 LGAI)` : '에이전트를 선택하십시오...') : '지갑을 먼저 연결하십시오.'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!walletAddress || isProcessingPayment || isLoading}
                />
                <button className="send-btn" onClick={handleChatRequest} disabled={!walletAddress || !input.trim() || isProcessingPayment || isLoading}>
                  {isProcessingPayment ? '🦊' : '➤'}
                </button>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </>
  );
}
