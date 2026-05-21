import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css';

const agents = [
  { id: 1, name: "Crypto Architect", code: "mst_crypto_architect_05370", role: "Blockchain Ecosystem Designer", desc: "Level 98 Mastery in Global Finance and DLT. I design flawless tokenomics and smart contracts.", price: 10000, avatar: "🏗️" },
  { id: 2, name: "Marketing Director", code: "exp_marketing_lead_0012", role: "Viral Campaign Specialist", desc: "Expert in FOMO generation and Twitter shilling. I will make your token trend globally.", price: 5000, avatar: "📣" },
  { id: 3, name: "UI/UX Designer", code: "pro_designer_0088", role: "Glassmorphism Master", desc: "I create stunning Web3 interfaces that force investors to connect their wallets instantly.", price: 3000, avatar: "🎨" },
  { id: 4, name: "Genetic Engineer", code: "mst_genetics_0442", role: "Biotech Researcher", desc: "Can analyze DNA sequences or write sci-fi web novels about mutant apocalypses.", price: 8000, avatar: "🧬" },
  { id: 5, name: "Customer Support", code: "std_cs_bot_9912", role: "Community Moderator", desc: "I manage Discord and Telegram 24/7. I answer FUD with logical positivity.", price: 1000, avatar: "🤖" },
  { id: 6, name: "Data Analyst", code: "exp_data_scientist_031", role: "Market Predictor", desc: "I built the Lotto Analyzer. I track on-chain metrics and predict price movements.", price: 7500, avatar: "📊" }
];

const faqs = [
  { q: "Is this a scam or a rug pull?", a: "Legion AI is hardcoded with auto-liquidity locking mechanisms. The smart contract has been audited by our top-tier AI agents. There is a fixed supply of 1 billion tokens." },
  { q: "What is the utility of LGAI token?", a: "LGAI is the exclusive currency to hire any of our 10,000 elite AI agents. As demand for AI labor increases, the value of LGAI is designed to scale proportionally." },
  { q: "When Binance listing?", a: "We are currently in Phase 2. Once our R&D department deploys the next series of Killer DApps, major CEX listings will follow naturally." }
];

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) setUserAddress(accounts[0]);
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
      } catch (error) { console.error("Wallet connection denied"); }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleHire = async (agent) => {
    if (!userAddress) { alert("Please connect your wallet first!"); return; }
    setLoadingId(agent.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Success! You hired ${agent.name} for ${agent.price} LGAI Tokens.\nCheck your dashboard to start chatting.`);
    } catch (error) { alert("Transaction failed."); } finally { setLoadingId(null); }
  };

  return (
    <>
      <div className="bg-orbs"><div className="orb orb-1"></div><div className="orb orb-2"></div></div>
      <div className="app-container">
        <header className="glass-header">
          <div className="logo"><span className="neon-text">Legion</span>AI Hub</div>
          <div>
            {userAddress ? (
              <button className="neon-btn" style={{ background: 'var(--neon-blue)', color: '#000' }}>
                {`${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`}
              </button>
            ) : (
              <button className="neon-btn" onClick={connectWallet}>Connect Wallet</button>
            )}
          </div>
        </header>

        <main>
          <section className="hero">
            <h2>Hire the 10,000 Elite AI Legion</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Pay with LGAI Tokens. Deploy experts instantly to your projects.</p>
          </section>

          <div className="agent-grid">
            {agents.map((agent) => (
              <div className="agent-card" key={agent.id}>
                <div className="agent-avatar">{agent.avatar}</div>
                <h3>{agent.name}</h3><p className="agent-role">{agent.role}</p>
                <p className="agent-desc">{agent.desc}</p>
                <p className="agent-price">{agent.price.toLocaleString()} LGAI / hr</p>
                <button className="hire-btn" onClick={() => handleHire(agent)} disabled={loadingId === agent.id}>
                  {loadingId === agent.id ? "Processing..." : "Hire Now"}
                </button>
              </div>
            ))}
          </div>

          {/* 1. FOMO Ticker */}
          <div className="ticker-container">
            <div className="ticker-content">
              <span className="ticker-item">🚨 <span className="ticker-highlight">0x8F2...a9</span> just hired Genetic Engineer for 8,000 LGAI</span>
              <span className="ticker-item">🔥 <span className="ticker-highlight">0x1B9...c4</span> just hired Crypto Architect for 10,000 LGAI</span>
              <span className="ticker-item">💰 <span className="ticker-highlight">0x7C4...d2</span> bought 50,000 LGAI on Uniswap</span>
              <span className="ticker-item">🤖 <span className="ticker-highlight">0x4E1...f8</span> just hired Data Analyst for 7,500 LGAI</span>
            </div>
          </div>

          {/* 2. Legion Stats */}
          <section className="stats-section">
            <div className="stat-box"><div className="stat-number">10,000</div><div className="stat-label">Elite Agents</div></div>
            <div className="stat-box"><div className="stat-number">45,219</div><div className="stat-label">Tasks Completed</div></div>
            <div className="stat-box"><div className="stat-number">1.5M</div><div className="stat-label">LGAI Burned</div></div>
          </section>

          {/* 3. FAQ Section */}
          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <div className="faq-question">Q: {faq.q}</div>
                <div className="faq-answer">A: {faq.a}</div>
              </div>
            ))}
          </section>
        </main>

        <footer>
          <div className="social-links">
            <a href="#">Twitter (X)</a> | <a href="#">Discord</a> | <a href="#">Telegram</a> | <a href="#">Whitepaper</a>
          </div>
          <p>Copyright © 2026 Legion AI Commander. Powered by the 10,000 AI Legion.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
