import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits, parseEther } from 'ethers';
import './index.css';

// ── Web3 Constants ─────────────────────────────────────────────
const LGAI_ADDRESS = "0xC8C2D7B7736C3B5eC4eD0F547791E4389A054512";
const PRESALE_ADDRESS = "0x11967364213108F0440764b27671a967a20E31b4";
const COMMANDER_WALLET = "0x68B56EAc0209B3230891B4e74a78b276f3b74610";

const LGAI_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const PRESALE_ABI = [
  "function buyTokens(address referrer) payable",
  "function rate() view returns (uint256)"
];

const RATE_ETH_TO_LGAI = 10000; // 1 ETH = 10,000 LGAI

// ── FOMO Mock Data ──────────────────────────────────────────────
const FOMO_ALERTS = [
  { address: "0x7F2...9a1", amount: "50,000", location: "Tokyo, JP" },
  { address: "0x3B1...4c2", amount: "120,000", location: "New York, US" },
  { address: "0x9E4...8f5", amount: "15,000", location: "Seoul, KR" },
  { address: "0x1A6...3b9", amount: "300,000", location: "Dubai, AE" },
  { address: "0x5C8...2d4", amount: "8,500", location: "London, UK" }
];

const AI_MESSAGES = [
  "Agent-Alpha: Accumulating LGAI... Bullish signal detected.",
  "Agent-Beta: Smart money is entering the Sepolia pool.",
  "Agent-Gamma: 10,000 ETH target for Phase 1 Presale.",
  "Agent-Delta: Neural network predicts 1000x potential."
];

// ── i18n Dictionary ─────────────────────────────────────────────
const translations = {
  en: {
    nav_about: "About", nav_tokenomics: "Tokenomics", nav_roadmap: "Roadmap",
    btn_connect: "Connect Wallet", badge_presale: "LGAI PRESALE IS LIVE",
    hero_title: "The First AI-Governed Crypto Empire",
    hero_sub: "LGAI is the native utility token powering the LegionAI ecosystem. An autonomous network of AI agents optimizing the Web3 future.",
    btn_buy: "Buy LGAI Token", btn_wp: "Read Whitepaper",
    widget_title: "Presale Swap", widget_status: "Stage 1 Active",
    lbl_pay: "You Pay", lbl_receive: "You Receive", btn_swap: "SWAP NOW",
    ref_title: "🚀 Invite Friends & Earn 5% Bonus!",
    ref_desc: "Share your unique referral link. You receive 5% of LGAI purchased through your link.",
    ref_copy: "Copy Link", ref_copied: "Copied!",
    sec_tokenomics: "LGAI Tokenomics", sec_tokenomics_sub: "Total Supply: 1,000,000,000 LGAI. Strategically allocated for long-term ecosystem growth.",
    lbl_public: "Public Sale (40%)", lbl_liq: "Liquidity Pool (30%)", lbl_eco: "Ecosystem (20%)", lbl_team: "Team (10%)",
    sec_roadmap: "Strategic Roadmap", sec_roadmap_sub: "Our path to global Web3 and AI domination.",
    ph1: "Phase 1", ph1_title: "Genesis & Smart Contract Deployment", ph1_desc: "Deployment of LGAI on Sepolia. Community building and official presale launch.",
    ph2: "Phase 2", ph2_title: "DEX Listing & Global Marketing", ph2_desc: "Liquidity generation and listing on Uniswap. Global influencer partnerships.",
    ph3: "Phase 3", ph3_title: "AI Council Activation", ph3_desc: "Launch of the LGAI powered autonomous AI SaaS platform. AI agents begin managing treasury.",
    footer: "© 2026 LegionAI Hub. All rights reserved."
  },
  kr: {
    nav_about: "소개", nav_tokenomics: "토크노믹스", nav_roadmap: "로드맵",
    btn_connect: "지갑 연결", badge_presale: "LGAI 사전 판매(Presale) 진행 중",
    hero_title: "최초의 AI 통치 암호화폐 제국",
    hero_sub: "LGAI는 LegionAI 생태계를 구동하는 핵심 유틸리티 토큰입니다. 자율 AI 에이전트들이 Web3의 미래를 지배합니다.",
    btn_buy: "LGAI 토큰 구매", btn_wp: "백서 읽기",
    widget_title: "프리세일 스왑", widget_status: "Stage 1 진행 중",
    lbl_pay: "지불할 수량 (ETH)", lbl_receive: "받을 수량 (LGAI)", btn_swap: "지금 스왑하기",
    ref_title: "🚀 친구 초대하고 5% 보너스 받기!",
    ref_desc: "나만의 초대 링크를 공유하세요. 친구가 구매한 LGAI 수량의 5%를 에어드랍 해드립니다.",
    ref_copy: "링크 복사", ref_copied: "복사됨!",
    sec_tokenomics: "LGAI 토크노믹스", sec_tokenomics_sub: "총 발행량: 1,000,000,000 LGAI. 장기적인 생태계 성장을 위한 전략적 분배.",
    lbl_public: "퍼블릭 세일 (40%)", lbl_liq: "유동성 풀 (30%)", lbl_eco: "생태계 기금 (20%)", lbl_team: "팀 및 파운더 (10%)",
    sec_roadmap: "전략적 로드맵", sec_roadmap_sub: "글로벌 Web3 및 AI 제국을 향한 여정",
    ph1: "1단계", ph1_title: "제네시스 & 스마트 컨트랙트 배포", ph1_desc: "LGAI 테스트넷 배포 완료. 글로벌 커뮤니티 구축 및 공식 프리세일 런칭.",
    ph2: "2단계", ph2_title: "탈중앙화 거래소(DEX) 상장 및 마케팅", ph2_desc: "유니스왑 유동성 공급 및 상장. 글로벌 인플루언서 파트너십 체결.",
    ph3: "3단계", ph3_title: "AI 통치 위원회 가동", ph3_desc: "LGAI 전용 AI SaaS 플랫폼 공식 오픈. AI 에이전트들의 자금 관리 시작.",
    footer: "© 2026 LegionAI 사령부. All rights reserved."
  }
};

export default function App() {
  const [lang, setLang] = useState('kr');
  const [walletAddress, setWalletAddress] = useState(null);
  const [lgaiBalance, setLgaiBalance] = useState("0");
  const [referrerAddress, setReferrerAddress] = useState("0x0000000000000000000000000000000000000000"); // default empty referrer
  
  // Swap Widget States
  const [ethAmount, setEthAmount] = useState('');
  const [lgaiAmount, setLgaiAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  
  // Marketing States
  const [fomoAlert, setFomoAlert] = useState(null);
  const [aiMessageIndex, setAiMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const t = translations[lang] || translations['en'];

  // ── INIT & URL Parsing ───────────────────────────────────────
  useEffect(() => {
    // Parse ?ref=0x... from URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref && /^0x[a-fA-F0-9]{40}$/.test(ref)) {
      setReferrerAddress(ref);
      console.log("Referrer set to:", ref);
    }
  }, []);

  // ── Web3 Connection ────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      
      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]); // Sepolia
      } catch (err) {
        console.error("Failed to switch to Sepolia", err);
      }

      await fetchBalance(accounts[0], provider);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBalance = async (address, provider) => {
    try {
      const contract = new Contract(LGAI_ADDRESS, LGAI_ABI, provider);
      const bal = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      setLgaiBalance(formatUnits(bal, decimals));
    } catch (e) {
      console.error(e);
    }
  };

  const formatAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  // ── FOMO & AI Ticker Logic ────────────────────────────────────
  useEffect(() => {
    const triggerFomo = () => {
      const randomAlert = FOMO_ALERTS[Math.floor(Math.random() * FOMO_ALERTS.length)];
      setFomoAlert(randomAlert);
      setTimeout(() => setFomoAlert(null), 4000);
      const nextTime = Math.floor(Math.random() * 7000) + 8000;
      setTimeout(triggerFomo, nextTime);
    };
    const fomoTimer = setTimeout(triggerFomo, 5000);

    const tickerTimer = setInterval(() => {
      setAiMessageIndex((prev) => (prev + 1) % AI_MESSAGES.length);
    }, 4000);

    return () => {
      clearTimeout(fomoTimer);
      clearInterval(tickerTimer);
    };
  }, []);

  // ── Swap Logic (Smart Contract Interaction) ────────────────
  const handleEthChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setEthAmount(val);
      setLgaiAmount(val ? (parseFloat(val) * RATE_ETH_TO_LGAI).toLocaleString() : '');
    }
  };

  const handleSwap = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!ethAmount || parseFloat(ethAmount) <= 0) return;
    
    setIsSwapping(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Connect to the Presale Smart Contract!
      const presaleContract = new Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
      
      // Call buyTokens with the referrer address
      const tx = await presaleContract.buyTokens(referrerAddress, {
        value: parseEther(ethAmount)
      });
      
      alert(`Transaction Submitted to Smart Contract!\nHash: ${tx.hash}\nWaiting for confirmation...`);
      await tx.wait();
      
      alert(`Swap Successful! ${lgaiAmount} LGAI has been instantly transferred to your wallet via Smart Contract!`);
      if (referrerAddress !== "0x0000000000000000000000000000000000000000") {
        alert(`🎉 The Referrer (${formatAddr(referrerAddress)}) also received a 5% LGAI Bonus instantly!`);
      }

      setEthAmount('');
      setLgaiAmount('');
      await fetchBalance(walletAddress, provider); // Refresh balance
    } catch (error) {
      console.error(error);
      alert("Swap Failed or Rejected. Please check console.");
    } finally {
      setIsSwapping(false);
    }
  };

  const scrollToPresale = () => {
    document.getElementById('presale-widget').scrollIntoView({ behavior: 'smooth' });
  };

  const copyRefLink = () => {
    if(!walletAddress) return alert("Please connect wallet first!");
    const link = `https://legionai-hub.vercel.app/?ref=${walletAddress}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="global-bg">
        <div className="bg-stars" />
        <div className="bg-glow-sphere bg-glow-1" />
        <div className="bg-glow-sphere bg-glow-2" />
      </div>

      <nav className="navbar">
        <div className="nav-brand">
          <span style={{ fontSize: '28px', marginRight: '8px' }}>🔮</span>
          <span>LegionAI</span>
        </div>
        
        <div className="nav-links">
          <a href="#about">{t.nav_about}</a>
          <a href="#tokenomics">{t.nav_tokenomics}</a>
          <a href="#roadmap">{t.nav_roadmap}</a>
        </div>

        <div className="nav-actions">
          <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="kr">한국어</option>
          </select>
          
          <button className={`wallet-btn ${walletAddress ? 'connected' : ''}`} onClick={connectWallet}>
            {walletAddress ? (
              <>{parseFloat(lgaiBalance).toLocaleString()} LGAI | {formatAddr(walletAddress)}</>
            ) : (
              t.btn_connect
            )}
          </button>
        </div>
      </nav>

      <div className="app-layout">
        
        <section className="hero-section" id="about">
          <div className="badge">{t.badge_presale}</div>
          <h1 className="hero-title">
            {lang === 'en' ? (
              <>The First <span className="highlight">AI-Governed</span><br/>Crypto Empire</>
            ) : (
              <>최초의 <span className="highlight">AI 통치</span><br/>암호화폐 제국</>
            )}
          </h1>
          <p className="hero-subtitle">{t.hero_sub}</p>
          
          <div className="cta-group">
            <button className="btn-primary" onClick={scrollToPresale}>{t.btn_buy}</button>
            <button className="btn-secondary">{t.btn_wp}</button>
          </div>

          <div className="ai-ticker">
            <div className="ticker-dot"></div>
            <div className="typewriter" key={aiMessageIndex}>
              &gt; {AI_MESSAGES[aiMessageIndex]}
            </div>
          </div>

          <div id="presale-widget" className="presale-widget-container">
            <div className="presale-header">
              <div className="presale-title">{t.widget_title}</div>
              <div className="presale-status">● {t.widget_status}</div>
            </div>
            
            <div className="progress-container">
              <div className="progress-labels">
                <span>Raised: 650.4 ETH</span>
                <span>Goal: 1000 ETH</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill"></div>
              </div>
            </div>

            {/* If a referral link is active, show the referrer */}
            {referrerAddress !== "0x0000000000000000000000000000000000000000" && (
              <div style={{fontSize: '11px', color: 'var(--green)', marginBottom: '10px', textAlign: 'center'}}>
                ✅ Invited by: {formatAddr(referrerAddress)} (You both get benefits!)
              </div>
            )}

            <div className="swap-input-group">
              <div className="input-label"><span>{t.lbl_pay}</span><span>Balance: {walletAddress ? 'ETH' : '-'}</span></div>
              <div className="input-row">
                <input type="text" className="swap-input" placeholder="0.0" value={ethAmount} onChange={handleEthChange} disabled={isSwapping} />
                <div className="token-symbol">⟠ ETH</div>
              </div>
            </div>

            <div className="swap-arrow">
              <div className="swap-arrow-icon">↓</div>
            </div>

            <div className="swap-input-group">
              <div className="input-label"><span>{t.lbl_receive}</span></div>
              <div className="input-row">
                <input type="text" className="swap-input" placeholder="0" value={lgaiAmount} readOnly />
                <div className="token-symbol" style={{ color: 'var(--cyan)' }}>🔮 LGAI</div>
              </div>
            </div>

            <button 
              className={`swap-btn ${walletAddress && ethAmount > 0 ? 'enabled' : 'disabled'}`} 
              onClick={walletAddress ? handleSwap : connectWallet}
              disabled={isSwapping || (walletAddress && (!ethAmount || ethAmount <= 0))}
            >
              {isSwapping ? 'Processing Smart Contract...' : !walletAddress ? t.btn_connect : t.btn_swap}
            </button>
          </div>

          {walletAddress && (
            <div className="referral-box">
              <div className="ref-title">{t.ref_title}</div>
              <div className="ref-desc">{t.ref_desc}</div>
              <div className="ref-link-box">
                <div className="ref-link-text">
                  https://legionai-hub.vercel.app/?ref={walletAddress}
                </div>
                <button className="ref-copy-btn" onClick={copyRefLink}>
                  {copied ? t.ref_copied : t.ref_copy}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="section" id="tokenomics">
          <h2 className="section-title">{t.sec_tokenomics}</h2>
          <p className="section-subtitle">{t.sec_tokenomics_sub}</p>
          
          <div className="token-grid">
            <div className="token-card">
              <div className="token-value">400M</div>
              <div className="token-label">{t.lbl_public}</div>
            </div>
            <div className="token-card">
              <div className="token-value">300M</div>
              <div className="token-label">{t.lbl_liq}</div>
            </div>
            <div className="token-card">
              <div className="token-value">200M</div>
              <div className="token-label">{t.lbl_eco}</div>
            </div>
            <div className="token-card">
              <div className="token-value">100M</div>
              <div className="token-label">{t.lbl_team}</div>
            </div>
          </div>
        </section>

        <section className="section" id="roadmap">
          <h2 className="section-title">{t.sec_roadmap}</h2>
          <p className="section-subtitle">{t.sec_roadmap_sub}</p>
          
          <div className="roadmap-container">
            <div className="roadmap-item active">
              <div className="roadmap-phase">{t.ph1}</div>
              <div className="roadmap-content">
                <h3>{t.ph1_title}</h3>
                <p>{t.ph1_desc}</p>
              </div>
            </div>
            <div className="roadmap-item active">
              <div className="roadmap-phase">{t.ph2}</div>
              <div className="roadmap-content">
                <h3>{t.ph2_title}</h3>
                <p>{t.ph2_desc}</p>
              </div>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-phase">{t.ph3}</div>
              <div className="roadmap-content">
                <h3>{t.ph3_title}</h3>
                <p>{t.ph3_desc}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      {fomoAlert && (
        <div className="fomo-toast">
          <div className="fomo-icon">💸</div>
          <div className="fomo-content">
            <div className="fomo-title">{fomoAlert.address} bought {fomoAlert.amount} LGAI!</div>
            <div className="fomo-time">Just now from {fomoAlert.location}</div>
          </div>
        </div>
      )}

      <footer>
        {t.footer}
      </footer>
    </>
  );
}
