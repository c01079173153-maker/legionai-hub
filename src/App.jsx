import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits, parseEther } from 'ethers';
import './index.css';

// ── Web3 Constants ─────────────────────────────────────────────
const LGAI_ADDRESS = "0xC8C2D7B7736C3B5eC4eD0F547791E4389A054512";
const COMMANDER_WALLET = "0x68B56EAc0209B3230891B4e74a78b276f3b74610";
const LGAI_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];
const RATE_ETH_TO_LGAI = 10000; // 1 ETH = 10,000 LGAI

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
    sec_tokenomics: "LGAI 토크노믹스", sec_tokenomics_sub: "총 발행량: 1,000,000,000 LGAI. 장기적인 생태계 성장을 위한 전략적 분배.",
    lbl_public: "퍼블릭 세일 (40%)", lbl_liq: "유동성 풀 (30%)", lbl_eco: "생태계 기금 (20%)", lbl_team: "팀 및 파운더 (10%)",
    sec_roadmap: "전략적 로드맵", sec_roadmap_sub: "글로벌 Web3 및 AI 제국을 향한 여정",
    ph1: "1단계", ph1_title: "제네시스 & 스마트 컨트랙트 배포", ph1_desc: "LGAI 테스트넷 배포 완료. 글로벌 커뮤니티 구축 및 공식 프리세일 런칭.",
    ph2: "2단계", ph2_title: "탈중앙화 거래소(DEX) 상장 및 마케팅", ph2_desc: "유니스왑 유동성 공급 및 상장. 글로벌 인플루언서 파트너십 체결.",
    ph3: "3단계", ph3_title: "AI 통치 위원회 가동", ph3_desc: "LGAI 전용 AI SaaS 플랫폼 공식 오픈. AI 에이전트들의 자금 관리 시작.",
    footer: "© 2026 LegionAI 사령부. All rights reserved."
  },
  cn: {
    nav_about: "关于", nav_tokenomics: "代币经济学", nav_roadmap: "路线图",
    btn_connect: "连接钱包", badge_presale: "LGAI 预售进行中",
    hero_title: "首个由 AI 统治的加密帝国",
    hero_sub: "LGAI 是驱动 LegionAI 生态系统的核心效用代币。自主 AI 代理网络将优化 Web3 的未来。",
    btn_buy: "购买 LGAI", btn_wp: "阅读白皮书",
    widget_title: "预售交易", widget_status: "第一阶段进行中",
    lbl_pay: "您支付", lbl_receive: "您收到", btn_swap: "立即交换",
    sec_tokenomics: "代币经济学", sec_tokenomics_sub: "总供应量：1,000,000,000 LGAI。为长期生态增长而战略性分配。",
    lbl_public: "公开销售 (40%)", lbl_liq: "流动性池 (30%)", lbl_eco: "生态系统 (20%)", lbl_team: "团队 (10%)",
    sec_roadmap: "战略路线图", sec_roadmap_sub: "通往全球 Web3 与 AI 统治之路。",
    ph1: "第一阶段", ph1_title: "创世与智能合约部署", ph1_desc: "在 Sepolia 部署 LGAI。社区建设和官方预售启动。",
    ph2: "第二阶段", ph2_title: "DEX 上市与全球营销", ph2_desc: "Uniswap 流动性生成与上市。全球影响者合作。",
    ph3: "第三阶段", ph3_title: "AI 委员会激活", ph3_desc: "启动由 LGAI 驱动的自主 AI SaaS 平台。AI 代理开始管理资金库。",
    footer: "© 2026 LegionAI Hub. 版权所有."
  },
  jp: {
    nav_about: "概要", nav_tokenomics: "トークノミクス", nav_roadmap: "ロードマップ",
    btn_connect: "ウォレット接続", badge_presale: "LGAI プレセール開催中",
    hero_title: "初のAI統治暗号通貨帝国",
    hero_sub: "LGAIはLegionAIエコシステムを駆動するネイティブトークンです。自律型AIエージェントがWeb3の未来を最適化します。",
    btn_buy: "LGAIを購入", btn_wp: "ホワイトペーパー",
    widget_title: "プレセールスワップ", widget_status: "ステージ1 進行中",
    lbl_pay: "支払う額", lbl_receive: "受け取る額", btn_swap: "今すぐスワップ",
    sec_tokenomics: "トークノミクス", sec_tokenomics_sub: "総発行量: 1,000,000,000 LGAI。長期的な成長のための戦略的配分。",
    lbl_public: "パブリックセール (40%)", lbl_liq: "流動性プール (30%)", lbl_eco: "エコシステム (20%)", lbl_team: "チーム (10%)",
    sec_roadmap: "戦略的ロードマップ", sec_roadmap_sub: "グローバルWeb3とAI支配への道。",
    ph1: "フェーズ 1", ph1_title: "ジェネシス＆スマートコントラクト導入", ph1_desc: "SepoliaでのLGAI展開。コミュニティ構築とプレセール開始。",
    ph2: "フェーズ 2", ph2_title: "DEX上場とグローバルマーケティング", ph2_desc: "Uniswapでの流動性生成と上場。グローバルインフルエンサーとの提携。",
    ph3: "フェーズ 3", ph3_title: "AI評議会の活性化", ph3_desc: "LGAI駆動の自律型AI SaaSプラットフォームの立ち上げ。AIが資金管理を開始。",
    footer: "© 2026 LegionAI Hub. 無断複写・転載を禁じます."
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [walletAddress, setWalletAddress] = useState(null);
  const [lgaiBalance, setLgaiBalance] = useState("0");
  
  // Swap Widget States
  const [ethAmount, setEthAmount] = useState('');
  const [lgaiAmount, setLgaiAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  
  const t = translations[lang];

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

      const contract = new Contract(LGAI_ADDRESS, LGAI_ABI, provider);
      const bal = await contract.balanceOf(accounts[0]);
      const decimals = await contract.decimals();
      setLgaiBalance(formatUnits(bal, decimals));
    } catch (error) {
      console.error(error);
    }
  };

  const formatAddr = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  // ── Swap Logic ──────────────────────────────────────────────
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
      
      // ETH -> 사령관님 지갑으로 전송 (Presale 모의 결제)
      const tx = await signer.sendTransaction({
        to: COMMANDER_WALLET,
        value: parseEther(ethAmount)
      });
      
      alert(`Transaction Submitted!\nHash: ${tx.hash}\nWaiting for confirmation...`);
      await tx.wait();
      alert(`Swap Successful! ${lgaiAmount} LGAI will be airdropped shortly.`);
      setEthAmount('');
      setLgaiAmount('');
    } catch (error) {
      console.error(error);
      alert("Swap Failed or Rejected.");
    } finally {
      setIsSwapping(false);
    }
  };

  const scrollToPresale = () => {
    document.getElementById('presale-widget').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="global-bg">
        <div className="bg-stars" />
        <div className="bg-glow-sphere bg-glow-1" />
        <div className="bg-glow-sphere bg-glow-2" />
      </div>

      {/* NAVBAR */}
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
            <option value="cn">中文</option>
            <option value="jp">日本語</option>
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
        
        {/* HERO SECTION */}
        <section className="hero-section" id="about">
          <div className="badge">{t.badge_presale}</div>
          <h1 className="hero-title">
            {lang === 'en' ? (
              <>The First <span className="highlight">AI-Governed</span><br/>Crypto Empire</>
            ) : lang === 'kr' ? (
              <>최초의 <span className="highlight">AI 통치</span><br/>암호화폐 제국</>
            ) : lang === 'cn' ? (
              <>首个由 <span className="highlight">AI 统治</span> 的<br/>加密帝国</>
            ) : (
              <>初の <span className="highlight">AI統治</span><br/>暗号通貨帝国</>
            )}
          </h1>
          <p className="hero-subtitle">{t.hero_sub}</p>
          <div className="cta-group">
            <button className="btn-primary" onClick={scrollToPresale}>{t.btn_buy}</button>
            <button className="btn-secondary">{t.btn_wp}</button>
          </div>

          {/* PRESALE SWAP WIDGET */}
          <div id="presale-widget" className="presale-widget-container">
            <div className="presale-header">
              <div className="presale-title">{t.widget_title}</div>
              <div className="presale-status">● {t.widget_status}</div>
            </div>
            
            <div className="progress-container">
              <div className="progress-labels">
                <span>Raised: 650 ETH</span>
                <span>Goal: 1000 ETH</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill"></div>
              </div>
            </div>

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
              {isSwapping ? 'Processing...' : !walletAddress ? t.btn_connect : t.btn_swap}
            </button>
          </div>
        </section>

        {/* TOKENOMICS SECTION */}
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

        {/* ROADMAP SECTION */}
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
            <div className="roadmap-item">
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
      
      <footer>
        {t.footer}
      </footer>
    </>
  );
}
