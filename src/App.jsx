import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

// ── 에이전트 정의 ─────────────────────────────────────────────
const AGENTS = [
  { id: 1, name: '염 사령관', role: 'Supreme Commander', avatar: '👑', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)', tasks: ['전략 수립', '작전 명령 하달', '리소스 배분'], defaultModel: 'qwen2.5:1.5b' },
  { id: 2, name: 'Alpha — 전략 참모', role: 'Chief Strategy Officer', avatar: '🧠', color: '#00d2ff', bgColor: 'rgba(0,210,255,0.12)', tasks: ['시장 분석', '투자 전략 도출', '리스크 계산', '포트폴리오 최적화'], defaultModel: 'gemma3:4b' },
  { id: 3, name: 'Beta — 코드 장인', role: 'Lead Engineer', avatar: '⚙️', color: '#a855f7', bgColor: 'rgba(168,85,247,0.12)', tasks: ['API 개발', '자동화 스크립트 작성', '버그 수정', '시스템 아키텍처'], defaultModel: 'phi4-mini:3.8b' },
  { id: 4, name: 'Gamma — 시장 스파이', role: 'Intelligence Analyst', avatar: '🔭', color: '#10b981', bgColor: 'rgba(16,185,129,0.12)', tasks: ['실시간 시세 모니터링', '뉴스 감지', '경쟁사 분석', '거래량 추적'], defaultModel: 'llama3.2:3b' },
  { id: 5, name: 'Delta — 봇 병사', role: 'Bithumb Auto-Trader', avatar: '🤖', color: '#ef4444', bgColor: 'rgba(239,68,68,0.12)', tasks: ['자동 매수/매도', '손절 관리', '수익 실현', '주문 최적화'], defaultModel: 'qwen2.5:1.5b' },
  { id: 6, name: 'Epsilon — 디자이너', role: 'Creative Director', avatar: '🎨', color: '#ec4899', bgColor: 'rgba(236,72,153,0.12)', tasks: ['UI 목업 제작', '브랜드 아이덴티티', '마케팅 자료', '사용자 경험 설계'], defaultModel: 'gemma3:4b' },
];

const MODEL_ICONS = {
  'qwen2.5': '🌟', 'gemma3': '💎', 'phi4-mini': '⚡', 'llama3.2': '🦙',
  'mistral': '🌊', 'deepseek': '🔍', 'default': '🧩'
};

function getModelIcon(name) {
  for (const [key, icon] of Object.entries(MODEL_ICONS)) {
    if (name?.includes(key)) return icon;
  }
  return MODEL_ICONS.default;
}

function formatModelSize(bytes) {
  if (!bytes) return '';
  const gb = bytes / (1024 ** 3);
  return gb >= 1 ? `${gb.toFixed(1)}GB` : `${(bytes / (1024 ** 2)).toFixed(0)}MB`;
}

function getTime() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getLogTime() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

// ── 시스템 포트 정의 ──────────────────────────────────────────
const SYSTEM_PORTS = [
  { port: 'http://localhost:5000', label: '원격 제어 앱', icon: '📱', color: 'var(--cyan)' },
  { port: 'http://localhost:5173', label: 'LegionAI Hub (여기!)', icon: '⚔️', color: 'var(--purple-bright)' },
  { port: 'http://localhost:8080', label: '황제 지식 대시보드', icon: '📊', color: 'var(--amber)' },
  { port: 'http://localhost:11434', label: 'Ollama AI 엔진', icon: '🤖', color: 'var(--green)' },
];

// ── 파티클 배경 ──────────────────────────────────────────────
function Particles() {
  return (
    <div className="particles">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${8 + Math.random() * 12}s`,
          animationDelay: `${Math.random() * 10}s`,
          opacity: 0.3 + Math.random() * 0.4,
          width: Math.random() > 0.7 ? '3px' : '2px',
          height: Math.random() > 0.7 ? '3px' : '2px',
          background: Math.random() > 0.5 ? 'var(--cyan)' : 'var(--purple-bright)',
        }} />
      ))}
    </div>
  );
}

// ── 양자 실시간 데이터 대시보드 (Quantum Dashboard) ────────
function QuantumDashboard() {
  const [stats, setStats] = useState({ burned: 45210, nodes: 1247, hashRate: 84.2, apy: 38.4 });

  useEffect(() => {
    const ti = setInterval(() => {
      setStats(prev => ({
        burned: prev.burned + Math.floor(Math.random() * 5),
        nodes: prev.nodes + (Math.random() > 0.8 ? 1 : 0),
        hashRate: (84.0 + Math.random() * 2).toFixed(1),
        apy: (38.0 + Math.random() * 0.8).toFixed(1)
      }));
    }, 2000);
    return () => clearInterval(ti);
  }, []);

  return (
    <div className="quantum-dashboard glass-panel">
      <div className="q-header">
        <span className="q-icon pulse">🔴</span> LGAI QUANTUM CORE <span className="q-badge">LIVE</span>
      </div>
      <div className="q-grid">
        <div className="q-stat">
          <div className="q-val text-neon-red">{stats.burned.toLocaleString()}</div>
          <div className="q-label">Total Burned (24h)</div>
        </div>
        <div className="q-stat">
          <div className="q-val text-neon-cyan">{stats.nodes.toLocaleString()}</div>
          <div className="q-label">Active DePIN Nodes</div>
        </div>
        <div className="q-stat">
          <div className="q-val text-neon-purple">{stats.hashRate} TH/s</div>
          <div className="q-label">Global Hashrate</div>
        </div>
        <div className="q-stat">
          <div className="q-val text-neon-green">{stats.apy}%</div>
          <div className="q-label">Staking APY</div>
        </div>
      </div>
    </div>
  );
}

// ── AI 커뮤니티 통제실 (Community Ops) ────────
function CommunityOpsPanel() {
  const [logs, setLogs] = useState([
    { time: '16:00:12', platform: 'Telegram', user: '@crypto_whale', msg: 'Is this just another meme?', ai: 'Negative. LGAI is a quantized DePIN utility matrix. See docs.', sentiment: 'Neutral' }
  ]);

  useEffect(() => {
    const fuds = ['Devs doing something?', 'Price dumping?', 'Wen Binance?', 'Rug pull?'];
    const shills = ['LGAI is the future of money.', 'Just bought another 1M LGAI 🚀', 'Omniverse is mind blowing.'];
    const aiResponsesFud = ['FUD detected. System metrics remain bullish.', 'LGAI burn rate is up 12%. Hold the line.', 'Omni-chain arbitrage just secured 12.4 ETH.', 'Liquidity is locked. Check smart contract.'];
    const aiResponsesShill = ['Affirmative. Welcome to the Empire.', 'Your contribution to the network is noted.', 'Prepare for Phase 4.'];

    const ti = setInterval(() => {
      setLogs(prev => {
        const isFud = Math.random() > 0.5;
        const msg = isFud ? fuds[Math.floor(Math.random() * fuds.length)] : shills[Math.floor(Math.random() * shills.length)];
        const ai = isFud ? aiResponsesFud[Math.floor(Math.random() * aiResponsesFud.length)] : aiResponsesShill[Math.floor(Math.random() * aiResponsesShill.length)];
        
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        
        const newLog = {
          time,
          platform: Math.random() > 0.5 ? 'Telegram' : 'Discord',
          user: `@user_${Math.floor(Math.random()*9999)}`,
          msg,
          ai,
          sentiment: isFud ? 'Negative' : 'Positive'
        };
        
        const nextLogs = [newLog, ...prev];
        if (nextLogs.length > 4) nextLogs.pop();
        return nextLogs;
      });
    }, 3000);
    return () => clearInterval(ti);
  }, []);

  return (
    <div className="community-ops glass-panel" style={{ marginTop: '1rem', border: '1px solid rgba(236,72,153,0.3)' }}>
      <div className="q-header" style={{ color: 'var(--social)', marginBottom: '1rem' }}>
        <span className="q-icon pulse" style={{ color: 'var(--social)' }}>🤖</span> AUTONOMOUS COMMUNITY OPS <span className="q-badge" style={{ background: 'rgba(236,72,153,0.2)', color: 'var(--social)', borderColor: 'var(--social)' }}>ENGAGED</span>
      </div>
      <div className="ops-terminal" style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '0.75rem', animation: 'fade-up 0.3s ease' }}>
            <div style={{ color: 'var(--text-secondary)' }}>[{log.time}] [{log.platform}] {log.user}: <span style={{ color: log.sentiment === 'Negative' ? '#ef4444' : '#10b981' }}>"{log.msg}"</span></div>
            <div style={{ color: 'var(--cyan)', marginTop: '2px', paddingLeft: '1rem', borderLeft: '2px solid var(--cyan)' }}>↳ [AI_AGENT]: {log.ai}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 에이전트 작업 카드 ────────────────────────────────────────
function AgentWorkCard({ agent, selectedModel, onClick, isActive, agentStatus, currentTaskIdx }) {
  const status = agentStatus || 'idle';
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (status !== 'working') return;
    const di = setInterval(() => setDots(d => (d + 1) % 4), 500);
    return () => clearInterval(di);
  }, [status]);

  const statusLabel = { working: '작업 중', idle: '대기', completed: '완료' }[status];
  const badgeClass = { working: 'badge-working', idle: 'badge-idle', completed: 'badge-completed' }[status];

  return (
    <div className={`agent-work-card ${status} ${isActive ? 'active-card' : ''}`} onClick={() => onClick(agent)}>
      <div className="card-header">
        <div className="card-avatar" style={{ background: agent.bgColor, border: `1px solid ${agent.color}30` }}>
          <span style={{ fontSize: '24px' }}>{agent.avatar}</span>
          {status === 'working' && <div className="working-ring" style={{ borderTopColor: agent.color, borderRightColor: agent.color + '60' }} />}
        </div>
        <div className="card-meta">
          <div className="card-agent-name" style={{ color: isActive ? agent.color : 'var(--text-primary)' }}>{agent.name}</div>
          <div className="card-agent-role" style={{ color: agent.color }}>{agent.role}</div>
        </div>
        <span className={`card-status-badge ${badgeClass}`}>{statusLabel}</span>
      </div>

      <div className="card-task">
        <div className="task-label">현재 작업</div>
        <div className="task-text">
          {status === 'working' ? (
            <>
              {agent.tasks[currentTaskIdx % agent.tasks.length]}
              {'.'.repeat(dots)}
              <span className="typing-indicator">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </span>
            </>
          ) : status === 'completed' ? (
            <span style={{ color: 'var(--green)' }}>✓ 태스크 완료</span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>명령 대기 중...</span>
          )}
        </div>
      </div>

      {status === 'working' && (
        <div className="progress-track">
          <div className="progress-fill progress-fill-animated" style={{ background: `linear-gradient(90deg, ${agent.color}80, ${agent.color})` }} />
        </div>
      )}

      <div className="card-footer">
        <span style={{ color: agent.color, fontSize: '11px' }}>
          {getModelIcon(selectedModel || agent.defaultModel)} {selectedModel || agent.defaultModel}
        </span>
        {status === 'working' && <span className="badge-working" style={{ padding: '2px 6px', fontSize: '9px' }}>AI 추론 중</span>}
      </div>
    </div>
  );
}

// ── 포트 상태 아이템 ──────────────────────────────────────────
function PortStatusItem({ port, label, icon, color, isOnline }) {
  return (
    <div
      className={`port-item ${isOnline ? 'online' : 'offline'}`}
      onClick={() => {
        if (isOnline) {
          window.open(port, '_blank');
        }
      }}
      style={{ cursor: isOnline ? 'pointer' : 'default' }}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isOnline ? color : 'var(--text-muted)' }}>
          {port.replace('http://localhost:', ':')}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{label}</div>
      </div>
      <div className="port-status-wrapper">
        {isOnline ? (
          <div className="port-dot online" />
        ) : (
          <div className="port-dot offline" />
        )}
        <span className="port-status-label" style={{ color: isOnline ? 'var(--green)' : 'var(--red)' }}>
          {isOnline ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
}

// ── 메인 앱 ──────────────────────────────────────────────────
export default function App() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('qwen2.5:1.5b');
  const [activeAgent, setActiveAgent] = useState(null);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [portStatus, setPortStatus] = useState({});
  const [mobileTab, setMobileTab] = useState('office'); // 'sidebar' | 'office' | 'chat'

  // Agent states: track per-agent status
  const [agentStates, setAgentStates] = useState(() => {
    const states = {};
    AGENTS.forEach(a => { states[a.id] = { status: 'idle', taskIdx: 0 }; });
    return states;
  });

  const [messages, setMessages] = useState([
    { role: 'agent', agent: AGENTS[0], text: '사령관님, AI 사무실이 가동되었습니다. 에이전트를 선택하고 명령을 내려주십시오! 🫡', time: getTime() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(getTime());
  const [completedTasks, setCompletedTasks] = useState(0);
  const [logs, setLogs] = useState([
    { time: getLogTime(), msg: <>시스템 초기화 완료 — <span className="highlight">LegionAI Hub</span> 가동</> },
  ]);
  const messagesEndRef = useRef(null);

  // 시계
  useEffect(() => {
    const ti = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(ti);
  }, []);

  // Ollama 모델 불러오기 (Vite 프록시 경유 — CORS 우회)
  const OLLAMA = '/ollama'; // vite.config.js proxy → http://localhost:11434

  const addLog = useCallback((msg) => {
    setLogs(prev => [...prev.slice(-30), { time: getLogTime(), msg }]);
  }, []);

  // Ollama 모델 로드 + 연결 상태
  useEffect(() => {
    const load = () => fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(5000) })
      .then(r => r.json())
      .then(data => {
        const list = data.models || [];
        setModels(list);
        if (!ollamaOnline) {
          setOllamaOnline(true);
          addLog(<><span className="highlight">Ollama</span> 서버 연결 성공! ({list.length}개 모델 감지)</>);
        }
        if (list.length > 0) {
          setSelectedModel(prev => list.find(m => m.name === prev) ? prev : list[0].name);
        }
      })
      .catch(() => {
        if (ollamaOnline || models.length === 0) {
          setOllamaOnline(false);
          addLog(<span style={{ color: 'var(--amber)' }}>⚠️ Ollama 서버 미연결 — 오프라인 모드</span>);
        }
      });

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 시스템 포트 상태 확인
  useEffect(() => {
    const checkPorts = async () => {
      const results = {};
      for (const { port } of SYSTEM_PORTS) {
        try {
          // 5173은 자기 자신이므로 항상 online
          if (port.includes('5173')) {
            results[port] = true;
            continue;
          }
          // Ollama는 프록시 경유
          if (port.includes('11434')) {
            results[port] = ollamaOnline;
            continue;
          }
          const resp = await fetch(port, { mode: 'no-cors', signal: AbortSignal.timeout(2000) });
          results[port] = true;
        } catch {
          results[port] = false;
        }
      }
      setPortStatus(results);
    };

    checkPorts();
    const interval = setInterval(checkPorts, 20000);
    return () => clearInterval(interval);
  }, [ollamaOnline]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAgentClick = (agent) => {
    setActiveAgent(agent);
    setMobileTab('chat'); // 모바일에서 에이전트 클릭 시 채팅으로 전환
    addLog(<><span className="highlight">{agent.name}</span> 선택됨 — 채팅 준비</>);
  };

  const setAgentStatus = useCallback((agentId, status) => {
    setAgentStates(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId], status }
    }));
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', text: input.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    const agent = activeAgent || AGENTS[1];
    setAgentStatus(agent.id, 'working');
    addLog(<><span className="highlight">{agent.name}</span> → <span className="highlight">{selectedModel}</span> 추론 시작</>);

    if (!ollamaOnline) {
      // Ollama 오프라인 — 안내 메시지
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'agent', agent,
          text: `⚠️ 현재 Ollama 서버가 오프라인 상태입니다.\n\n연결 방법:\n1. 터미널에서 \`ollama serve\` 실행\n2. 모델 다운로드: \`ollama pull ${selectedModel}\`\n3. 이 페이지가 자동으로 감지합니다!\n\n💡 Ollama 설치: https://ollama.com`,
          time: getTime()
        }]);
        setAgentStatus(agent.id, 'idle');
        setIsLoading(false);
        addLog(<span style={{ color: 'var(--amber)' }}>⚠️ Ollama 오프라인 — 연결 안내 표시</span>);
      }, 800);
      return;
    }

    try {
      const systemPrompt = `당신은 "${agent.name}"입니다. 역할: ${agent.role}. 
      당신은 염상민 사령관의 AI 군단 소속 에이전트입니다. 짧고 명확하게 한국어로 답변하세요. 
      전문적이고 자신감 있는 어조를 유지하세요. 이모지를 적절히 사용하세요.`;

      const response = await fetch(`${OLLAMA}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: currentInput }
          ],
          stream: false
        })
      });

      const data = await response.json();
      const reply = data.message?.content || '응답을 받을 수 없습니다.';
      setMessages(prev => [...prev, { role: 'agent', agent, text: reply, time: getTime() }]);
      setAgentStatus(agent.id, 'completed');
      setCompletedTasks(prev => prev + 1);
      addLog(<><span className="highlight">{agent.name}</span> 응답 완료 ✓</>);

      // 3초 후 idle로 복귀
      setTimeout(() => setAgentStatus(agent.id, 'idle'), 3000);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'agent', agent,
        text: `⚠️ ${selectedModel} 모델 응답 오류입니다.\n\n가능한 원인:\n• Ollama 서버가 중단됨\n• 모델이 아직 다운로드 중\n• 메모리 부족\n\n터미널에서 \`ollama serve\`를 다시 실행해주세요.`,
        time: getTime()
      }]);
      setAgentStatus(agent.id, 'idle');
      addLog(<span style={{ color: 'var(--red)' }}>❌ {agent.name} 응답 실패</span>);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const workingCount = Object.values(agentStates).filter(s => s.status === 'working').length;
  const onlinePortCount = Object.values(portStatus).filter(Boolean).length;

  return (
    <>
      {/* 배경 */}
      <div className="bg-scene">
        <div className="bg-grid" />
        <div className="bg-glow bg-glow-1" />
        <div className="bg-glow bg-glow-2" />
        <div className="bg-glow bg-glow-3" />
        <Particles />
      </div>

      <div className="app-layout">
        {/* ── 탑바 ── */}
        <header className="topbar">
          <div className="topbar-logo">
            <div className="logo-icon">⚔️</div>
            <div className="logo-text"><span>Legion</span>AI 사령부</div>
          </div>

          <div className="topbar-status">
            <div className={`status-pill ${ollamaOnline ? 'online' : 'offline-pill'}`}>
              <div className={`status-dot ${ollamaOnline ? '' : 'dot-offline'}`} />
              {ollamaOnline ? `LIVE — ${workingCount}명 작업 중` : 'OFFLINE — Ollama 미연결'}
            </div>
            <div className="status-pill" style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.3)', color: 'var(--purple-bright)', fontSize: '12px', fontWeight: 600 }}>
              🤖 {models.length > 0 ? `${models.length}개 AI 모델 탑재` : '모델 로딩 중...'}
            </div>
            <div className="topbar-time">{time}</div>
          </div>
        </header>

        {/* ── 모바일 탭 네비게이션 ── */}
        <nav className="mobile-tab-nav">
          <button className={`mobile-tab ${mobileTab === 'sidebar' ? 'active' : ''}`} onClick={() => setMobileTab('sidebar')}>
            🪖 에이전트
          </button>
          <button className={`mobile-tab ${mobileTab === 'office' ? 'active' : ''}`} onClick={() => setMobileTab('office')}>
            🏢 사무실
          </button>
          <button className={`mobile-tab ${mobileTab === 'chat' ? 'active' : ''}`} onClick={() => setMobileTab('chat')}>
            💬 채팅
          </button>
        </nav>

        {/* ── 메인 대시보드 ── */}
        <div className="dashboard">

          {/* ── 좌측 사이드바 ── */}
          <aside className={`sidebar ${mobileTab === 'sidebar' ? 'mobile-show' : 'mobile-hide'}`}>
            {/* AI 모델 섹션 */}
            <div>
              <div className="sidebar-section-title">🧩 탑재된 AI 모델</div>
              <div className="model-selector">
                {!ollamaOnline && models.length === 0 ? (
                  <div className="offline-notice">
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔌</div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Ollama 미연결</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      터미널에서 <code style={{ color: 'var(--cyan)', background: 'rgba(0,210,255,0.1)', padding: '1px 4px', borderRadius: '3px' }}>ollama serve</code> 실행
                    </div>
                  </div>
                ) : models.map(m => (
                  <div
                    key={m.name}
                    className={`model-item ${selectedModel === m.name ? 'active' : ''}`}
                    onClick={() => { setSelectedModel(m.name); addLog(<><span className="highlight">{m.name}</span> 선택됨</>); }}
                  >
                    <div className="model-badge" style={{ background: selectedModel === m.name ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.05)', fontSize: '18px' }}>
                      {getModelIcon(m.name)}
                    </div>
                    <div className="model-info">
                      <div className="model-name" style={{ color: selectedModel === m.name ? 'var(--cyan)' : 'var(--text-primary)' }}>
                        {m.name}
                      </div>
                      <div className="model-meta">
                        {m.details?.parameter_size} · {formatModelSize(m.size)} · {m.details?.quantization_level}
                      </div>
                    </div>
                    <div className="model-status" style={{ background: selectedModel === m.name ? 'var(--cyan)' : 'var(--green)' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* 에이전트 명부 */}
            <div>
              <div className="sidebar-section-title">🪖 에이전트 명부</div>
              <div className="agent-roster">
                {AGENTS.map(agent => {
                  const s = agentStates[agent.id]?.status || 'idle';
                  return (
                    <div
                      key={agent.id}
                      className={`roster-item ${s} ${activeAgent?.id === agent.id ? 'roster-active' : ''}`}
                      style={{ borderLeftColor: agent.color }}
                      onClick={() => handleAgentClick(agent)}
                    >
                      <div className="roster-avatar" style={{ background: agent.bgColor }}>
                        <span>{agent.avatar}</span>
                        <div className={`roster-status-dot ${s}`} />
                      </div>
                      <div className="roster-info">
                        <div className="roster-name" style={{ color: activeAgent?.id === agent.id ? agent.color : 'var(--text-primary)' }}>
                          {agent.name}
                        </div>
                        <div className="roster-task">
                          {s === 'working' ? agent.tasks[agentStates[agent.id]?.taskIdx || 0] : s === 'completed' ? '✓ 완료' : '대기 중'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── 중앙 오피스 뷰 ── */}
          <main className={`main-area ${mobileTab === 'office' ? 'mobile-show' : 'mobile-hide'}`}>
            {/* 스탯바 */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <div className="stat-data">
                  <div className="stat-value glow-cyan">{workingCount}</div>
                  <div className="stat-label">열일 중</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">✅</span>
                <div className="stat-data">
                  <div className="stat-value">{completedTasks}</div>
                  <div className="stat-label">완료 태스크</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🧩</span>
                <div className="stat-data">
                  <div className="stat-value glow-purple">{models.length}</div>
                  <div className="stat-label">AI 모델</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🌐</span>
                <div className="stat-data">
                  <div className="stat-value" style={{ fontSize: '13px', color: ollamaOnline ? 'var(--green)' : 'var(--red)' }}>
                    {ollamaOnline ? 'ONLINE' : 'OFFLINE'}
                  </div>
                  <div className="stat-label">Ollama :11434</div>
                </div>
              </div>
            </div>

            {/* 사무실 카드 영역 */}
            <div className="office-area">
              <QuantumDashboard />
              <CommunityOpsPanel />
              
              <div className="section-header" style={{ marginTop: '1.5rem' }}>
                <div className="section-title">
                  🏢 AI 사무실 — 실시간 작업 현황
                  <span className={`section-badge ${ollamaOnline ? '' : 'badge-offline'}`}>
                    {ollamaOnline ? 'LIVE' : 'OFFLINE'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  선택 모델: <span style={{ color: 'var(--cyan)' }}>{selectedModel}</span>
                </div>
              </div>

              <div className="agent-work-grid">
                {AGENTS.map(agent => (
                  <AgentWorkCard
                    key={agent.id}
                    agent={agent}
                    selectedModel={selectedModel}
                    onClick={handleAgentClick}
                    isActive={activeAgent?.id === agent.id}
                    agentStatus={agentStates[agent.id]?.status}
                    currentTaskIdx={agentStates[agent.id]?.taskIdx || 0}
                  />
                ))}
              </div>

              {/* 시스템 포트 현황 */}
              <div style={{ marginTop: '8px' }}>
                <div className="section-header">
                  <div className="section-title">
                    🖥️ 시스템 포트 현황
                    <span className="section-badge">{onlinePortCount}/{SYSTEM_PORTS.length}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {SYSTEM_PORTS.map(({ port, label, icon, color }) => (
                    <PortStatusItem
                      key={port}
                      port={port}
                      label={label}
                      icon={icon}
                      color={color}
                      isOnline={portStatus[port] ?? false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* ── 우측 채팅 패널 ── */}
          <aside className={`chat-area ${mobileTab === 'chat' ? 'mobile-show' : 'mobile-hide'}`}>
            <div className="chat-header">
              <div className="chat-title">
                <span>{activeAgent ? activeAgent.avatar : '💬'}</span>
                <span>{activeAgent ? activeAgent.name : '채팅 — 에이전트 선택'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!ollamaOnline && <span className="chat-offline-badge">OFFLINE</span>}
                <span className="chat-model-tag">{selectedModel}</span>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <div className={`msg-avatar ${msg.role === 'user' ? 'user-av' : 'agent'}`}>
                    {msg.role === 'user' ? '👑' : (msg.agent?.avatar || '🤖')}
                  </div>
                  <div>
                    <div className={`msg-bubble ${isLoading && i === messages.length - 1 && msg.role === 'agent' ? 'thinking' : ''}`}>
                      {msg.text}
                    </div>
                    <div className="msg-time">{msg.time}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message agent">
                  <div className="msg-avatar agent">{activeAgent?.avatar || '🤖'}</div>
                  <div>
                    <div className="msg-bubble thinking">
                      <span style={{ color: 'var(--text-muted)' }}>추론 중</span>
                      <span className="typing-indicator">
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <div className="model-select-bar">
                <label>AI 모델:</label>
                <select
                  className="model-select"
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                >
                  {models.map(m => (
                    <option key={m.name} value={m.name}>
                      {getModelIcon(m.name)} {m.name} ({m.details?.parameter_size})
                    </option>
                  ))}
                  {models.length === 0 && <option value="qwen2.5:1.5b">🌟 qwen2.5:1.5b (오프라인)</option>}
                </select>
              </div>

              {!activeAgent && (
                <div className="agent-select-hint">
                  ⬅ 왼쪽에서 에이전트를 클릭하거나 카드를 눌러 선택하세요
                </div>
              )}

              <div className="input-row">
                <textarea
                  className="chat-input"
                  placeholder={activeAgent ? `${activeAgent.name}에게 명령하세요...` : '에이전트를 먼저 선택하세요...'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                />
                <button className="send-btn" onClick={sendMessage} disabled={isLoading || !input.trim()}>
                  {isLoading ? '⏳' : '➤'}
                </button>
              </div>
            </div>

            {/* 활동 로그 */}
            <div className="activity-log">
              <div className="log-title">📋 시스템 로그</div>
              {logs.slice().reverse().map((log, i) => (
                <div key={i} className="log-entry">
                  <span className="log-time">{log.time}</span>
                  <span className="log-msg">{log.msg}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
