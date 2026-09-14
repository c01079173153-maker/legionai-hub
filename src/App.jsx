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

// ── i18n Dictionary (Top 10 Global Languages) ────────────────
const translations = {
  en: {
    lang_name: "English",
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
    lbl_public: "Public Sale (40%)", lbl_liq: "Liquidity (30%)", lbl_eco: "Ecosystem (20%)", lbl_team: "Team (10%)",
    sec_roadmap: "Strategic Roadmap", sec_roadmap_sub: "Our path to global Web3 and AI domination.",
    ph1: "Phase 1", ph1_title: "Genesis & Smart Contract", ph1_desc: "Deployment of LGAI on Sepolia. Official presale launch.",
    ph2: "Phase 2", ph2_title: "DEX Listing & Marketing", ph2_desc: "Liquidity generation and listing on Uniswap.",
    ph3: "Phase 3", ph3_title: "AI Council Activation", ph3_desc: "Launch of the LGAI powered autonomous AI SaaS platform.",
    footer: "© 2026 LegionAI Hub. All rights reserved."
  },
  kr: {
    lang_name: "한국어",
    nav_about: "소개", nav_tokenomics: "토크노믹스", nav_roadmap: "로드맵",
    btn_connect: "지갑 연결", badge_presale: "LGAI 사전 판매 진행 중",
    hero_title: "최초의 AI 통치 암호화폐 제국",
    hero_sub: "LGAI는 LegionAI 생태계를 구동하는 핵심 토큰입니다. 자율 AI 에이전트들이 Web3의 미래를 지배합니다.",
    btn_buy: "토큰 구매", btn_wp: "백서 읽기",
    widget_title: "프리세일 스왑", widget_status: "Stage 1 진행 중",
    lbl_pay: "지불 수량 (ETH)", lbl_receive: "받을 수량 (LGAI)", btn_swap: "스왑하기",
    ref_title: "🚀 친구 초대하고 5% 보너스 받기!",
    ref_desc: "초대 링크를 공유하세요. 친구 구매량의 5%를 에어드랍 해드립니다.",
    ref_copy: "링크 복사", ref_copied: "복사됨!",
    sec_tokenomics: "LGAI 토크노믹스", sec_tokenomics_sub: "총 발행량: 1,000,000,000 LGAI. 장기적 성장을 위한 전략적 분배.",
    lbl_public: "퍼블릭 세일 (40%)", lbl_liq: "유동성 풀 (30%)", lbl_eco: "생태계 (20%)", lbl_team: "팀 (10%)",
    sec_roadmap: "전략적 로드맵", sec_roadmap_sub: "글로벌 Web3 제국을 향한 여정",
    ph1: "1단계", ph1_title: "제네시스 & 컨트랙트 배포", ph1_desc: "테스트넷 배포 완료. 공식 프리세일 런칭.",
    ph2: "2단계", ph2_title: "DEX 상장 및 마케팅", ph2_desc: "유니스왑 유동성 공급 및 글로벌 파트너십.",
    ph3: "3단계", ph3_title: "AI 통치 위원회 가동", ph3_desc: "AI 에이전트 전용 SaaS 플랫폼 오픈 및 자금 관리 시작.",
    footer: "© 2026 LegionAI 사령부. All rights reserved."
  },
  zh: {
    lang_name: "中文",
    nav_about: "关于", nav_tokenomics: "代币经济学", nav_roadmap: "路线图",
    btn_connect: "连接钱包", badge_presale: "LGAI 预售进行中",
    hero_title: "首个 AI 统治的加密帝国",
    hero_sub: "LGAI 是驱动 LegionAI 生态系统的原生代币。自主 AI 代理网络将优化 Web3 的未来。",
    btn_buy: "购买代币", btn_wp: "阅读白皮书",
    widget_title: "预售兑换", widget_status: "第一阶段活跃",
    lbl_pay: "支付 (ETH)", lbl_receive: "接收 (LGAI)", btn_swap: "立即兑换",
    ref_title: "🚀 邀请好友赚取 5% 奖励！",
    ref_desc: "分享您的专属推荐链接。您将获得好友购买量 5% 的奖励。",
    ref_copy: "复制链接", ref_copied: "已复制！",
    sec_tokenomics: "代币经济学", sec_tokenomics_sub: "总供应量：1,000,000,000 LGAI。为长期生态增长而战略分配。",
    lbl_public: "公募 (40%)", lbl_liq: "流动性池 (30%)", lbl_eco: "生态系统 (20%)", lbl_team: "团队 (10%)",
    sec_roadmap: "战略路线图", sec_roadmap_sub: "通往全球 Web3 与 AI 主导地位的道路。",
    ph1: "第一阶段", ph1_title: "创世与智能合约", ph1_desc: "在 Sepolia 部署 LGAI。启动官方预售。",
    ph2: "第二阶段", ph2_title: "DEX 上线与营销", ph2_desc: "在 Uniswap 提供流动性并上线交易。",
    ph3: "第三阶段", ph3_title: "AI 委员会激活", ph3_desc: "发布由 LGAI 驱动的自主 AI SaaS 平台。",
    footer: "© 2026 LegionAI Hub. 保留所有权利。"
  },
  ja: {
    lang_name: "日本語",
    nav_about: "概要", nav_tokenomics: "トークノミクス", nav_roadmap: "ロードマップ",
    btn_connect: "ウォレット接続", badge_presale: "LGAI プレセール開催中",
    hero_title: "初のAI統治暗号資産帝国",
    hero_sub: "LGAIはLegionAIエコシステムを牽引するネイティブトークンです。自律型AIネットワークがWeb3の未来を最適化します。",
    btn_buy: "トークン購入", btn_wp: "ホワイトペーパー",
    widget_title: "プレセールスワップ", widget_status: "ステージ1 進行中",
    lbl_pay: "支払額 (ETH)", lbl_receive: "受取額 (LGAI)", btn_swap: "今すぐスワップ",
    ref_title: "🚀 友達招待で5%ボーナス！",
    ref_desc: "招待リンクをシェアすると、友達の購入額の5%が還元されます。",
    ref_copy: "リンクをコピー", ref_copied: "コピー完了！",
    sec_tokenomics: "トークノミクス", sec_tokenomics_sub: "総発行枚数: 1,000,000,000 LGAI。長期的な成長のための戦略的配分。",
    lbl_public: "パブリックセール (40%)", lbl_liq: "流動性プール (30%)", lbl_eco: "エコシステム (20%)", lbl_team: "チーム (10%)",
    sec_roadmap: "戦略ロードマップ", sec_roadmap_sub: "グローバルWeb3覇権への道程。",
    ph1: "フェーズ 1", ph1_title: "ジェネシス＆スマートコントラクト", ph1_desc: "Sepoliaへの展開と公式プレセールの開始。",
    ph2: "フェーズ 2", ph2_title: "DEX上場＆マーケティング", ph2_desc: "Uniswapでの流動性提供と上場。",
    ph3: "フェーズ 3", ph3_title: "AI評議会のアクティベーション", ph3_desc: "AI SaaSプラットフォームの正式ローンチ。",
    footer: "© 2026 LegionAI Hub. All rights reserved."
  },
  es: {
    lang_name: "Español",
    nav_about: "Acerca", nav_tokenomics: "Tokenomics", nav_roadmap: "Mapa Vial",
    btn_connect: "Conectar", badge_presale: "PREVENTA LGAI ACTIVA",
    hero_title: "El Primer Imperio Cripto Gobernado por IA",
    hero_sub: "LGAI es el token nativo que impulsa el ecosistema LegionAI.",
    btn_buy: "Comprar Token", btn_wp: "Leer Whitepaper",
    widget_title: "Swap Preventa", widget_status: "Fase 1 Activa",
    lbl_pay: "Pagas", lbl_receive: "Recibes", btn_swap: "INTERCAMBIAR",
    ref_title: "🚀 ¡Invita Amigos y Gana 5%!",
    ref_desc: "Comparte tu enlace. Recibe el 5% de LGAI comprados.",
    ref_copy: "Copiar Enlace", ref_copied: "¡Copiado!",
    sec_tokenomics: "Tokenomics", sec_tokenomics_sub: "Suministro Total: 1,000,000,000 LGAI.",
    lbl_public: "Venta Pública (40%)", lbl_liq: "Liquidez (30%)", lbl_eco: "Ecosistema (20%)", lbl_team: "Equipo (10%)",
    sec_roadmap: "Mapa Vial", sec_roadmap_sub: "Nuestro camino hacia el dominio global.",
    ph1: "Fase 1", ph1_title: "Génesis", ph1_desc: "Despliegue y lanzamiento oficial.",
    ph2: "Fase 2", ph2_title: "DEX y Marketing", ph2_desc: "Listado en Uniswap.",
    ph3: "Fase 3", ph3_title: "IA Autónoma", ph3_desc: "Lanzamiento de la plataforma SaaS.",
    footer: "© 2026 LegionAI Hub."
  },
  ru: {
    lang_name: "Русский",
    nav_about: "О нас", nav_tokenomics: "Токеномика", nav_roadmap: "Дорожная карта",
    btn_connect: "Кошелек", badge_presale: "ПРЕСЕЙЛ LGAI АКТИВЕН",
    hero_title: "Первая криптоимперия ИИ",
    hero_sub: "LGAI — это нативный токен экосистемы LegionAI.",
    btn_buy: "Купить LGAI", btn_wp: "Whitepaper",
    widget_title: "Пресейл", widget_status: "Стадия 1",
    lbl_pay: "Вы платите", lbl_receive: "Вы получаете", btn_swap: "ОБМЕН",
    ref_title: "🚀 Пригласи друга - получи 5%!",
    ref_desc: "Поделись ссылкой и получай 5% с покупок друзей.",
    ref_copy: "Копировать", ref_copied: "Скопировано!",
    sec_tokenomics: "Токеномика", sec_tokenomics_sub: "Всего: 1,000,000,000 LGAI.",
    lbl_public: "Продажа (40%)", lbl_liq: "Ликвидность (30%)", lbl_eco: "Экосистема (20%)", lbl_team: "Команда (10%)",
    sec_roadmap: "План развития", sec_roadmap_sub: "Наш путь к доминированию Web3.",
    ph1: "Фаза 1", ph1_title: "Запуск", ph1_desc: "Деплой и пресейл.",
    ph2: "Фаза 2", ph2_title: "DEX Листинг", ph2_desc: "Листинг на Uniswap.",
    ph3: "Фаза 3", ph3_title: "ИИ Платформа", ph3_desc: "Запуск автономного ИИ SaaS.",
    footer: "© 2026 LegionAI Hub."
  },
  ar: {
    lang_name: "العربية",
    nav_about: "حول", nav_tokenomics: "العملات", nav_roadmap: "خارطة الطريق",
    btn_connect: "اتصل بالمحفظة", badge_presale: "البيع المسبق مفتوح",
    hero_title: "أول إمبراطورية تشفير تحكمها الذكاء الاصطناعي",
    hero_sub: "LGAI هو الرمز الأساسي لنظام LegionAI البيئي.",
    btn_buy: "شراء LGAI", btn_wp: "قراءة الورقة البيضاء",
    widget_title: "تبادل", widget_status: "المرحلة 1 نشطة",
    lbl_pay: "تدفع", lbl_receive: "تتلقى", btn_swap: "تبادل الآن",
    ref_title: "🚀 ادعُ الأصدقاء واكسب 5٪!",
    ref_desc: "شارك الرابط الخاص بك. احصل على 5٪ من المشتريات.",
    ref_copy: "نسخ الرابط", ref_copied: "تم النسخ!",
    sec_tokenomics: "توزيع الرموز", sec_tokenomics_sub: "إجمالي العرض: 1,000,000,000 LGAI",
    lbl_public: "بيع عام (40%)", lbl_liq: "سيولة (30%)", lbl_eco: "نظام بيئي (20%)", lbl_team: "فريق (10%)",
    sec_roadmap: "خارطة الطريق", sec_roadmap_sub: "طريقنا للسيطرة على Web3.",
    ph1: "المرحلة 1", ph1_title: "التأسيس", ph1_desc: "إطلاق العقد الذكي.",
    ph2: "المرحلة 2", ph2_title: "الإدراج", ph2_desc: "الإدراج في Uniswap.",
    ph3: "المرحلة 3", ph3_title: "منصة الذكاء الاصطناعي", ph3_desc: "إطلاق منصة SaaS.",
    footer: "© 2026 LegionAI Hub."
  },
  pt: {
    lang_name: "Português",
    nav_about: "Sobre", nav_tokenomics: "Tokenomics", nav_roadmap: "Roteiro",
    btn_connect: "Conectar", badge_presale: "PRÉ-VENDA ATIVA",
    hero_title: "O Primeiro Império Cripto Governado por IA",
    hero_sub: "LGAI é o token nativo que impulsiona o ecossistema LegionAI.",
    btn_buy: "Comprar", btn_wp: "Ler Whitepaper",
    widget_title: "Pré-venda Swap", widget_status: "Fase 1",
    lbl_pay: "Você Paga", lbl_receive: "Você Recebe", btn_swap: "TROCAR AGORA",
    ref_title: "🚀 Convide Amigos e Ganhe 5%!",
    ref_desc: "Compartilhe seu link e receba 5% das compras.",
    ref_copy: "Copiar Link", ref_copied: "Copiado!",
    sec_tokenomics: "Tokenomics", sec_tokenomics_sub: "Fornecimento Total: 1,000,000,000 LGAI.",
    lbl_public: "Venda Pública (40%)", lbl_liq: "Liquidez (30%)", lbl_eco: "Ecossistema (20%)", lbl_team: "Equipe (10%)",
    sec_roadmap: "Roteiro", sec_roadmap_sub: "Nosso caminho para a dominação global.",
    ph1: "Fase 1", ph1_title: "Gênesis", ph1_desc: "Lançamento oficial.",
    ph2: "Fase 2", ph2_title: "Listagem DEX", ph2_desc: "Listagem na Uniswap.",
    ph3: "Fase 3", ph3_title: "IA SaaS", ph3_desc: "Lançamento da plataforma IA.",
    footer: "© 2026 LegionAI Hub."
  },
  fr: {
    lang_name: "Français",
    nav_about: "À propos", nav_tokenomics: "Tokenomics", nav_roadmap: "Feuille de route",
    btn_connect: "Connecter", badge_presale: "PRÉVENTE ACTIVE",
    hero_title: "Le Premier Empire Crypto Gouverné par l'IA",
    hero_sub: "LGAI est le jeton natif propulsant l'écosystème LegionAI.",
    btn_buy: "Acheter", btn_wp: "Lire le Livre Blanc",
    widget_title: "Prévente Swap", widget_status: "Phase 1",
    lbl_pay: "Vous Payez", lbl_receive: "Vous Recevez", btn_swap: "ÉCHANGER",
    ref_title: "🚀 Invitez des amis (5% Bonus)!",
    ref_desc: "Partagez votre lien et recevez 5%.",
    ref_copy: "Copier le Lien", ref_copied: "Copié!",
    sec_tokenomics: "Tokenomics", sec_tokenomics_sub: "Offre Totale: 1,000,000,000 LGAI.",
    lbl_public: "Vente Publique (40%)", lbl_liq: "Liquidité (30%)", lbl_eco: "Écosystème (20%)", lbl_team: "Équipe (10%)",
    sec_roadmap: "Feuille de route", sec_roadmap_sub: "Notre chemin vers la domination mondiale.",
    ph1: "Phase 1", ph1_title: "Genèse", ph1_desc: "Lancement officiel.",
    ph2: "Phase 2", ph2_title: "DEX Listing", ph2_desc: "Listing sur Uniswap.",
    ph3: "Phase 3", ph3_title: "Plateforme IA", ph3_desc: "Lancement de SaaS IA.",
    footer: "© 2026 LegionAI Hub."
  },
  de: {
    lang_name: "Deutsch",
    nav_about: "Über", nav_tokenomics: "Tokenomics", nav_roadmap: "Roadmap",
    btn_connect: "Verbinden", badge_presale: "VORVERKAUF LIVE",
    hero_title: "Das erste von KI regierte Krypto-Imperium",
    hero_sub: "LGAI ist der native Token des LegionAI-Ökosystems.",
    btn_buy: "LGAI Kaufen", btn_wp: "Whitepaper Lesen",
    widget_title: "Vorverkauf Swap", widget_status: "Phase 1",
    lbl_pay: "Du Zahlst", lbl_receive: "Du Erhältst", btn_swap: "TAUSCHEN",
    ref_title: "🚀 Freunde einladen (5% Bonus)!",
    ref_desc: "Teile deinen Link und erhalte 5% Bonus.",
    ref_copy: "Link Kopieren", ref_copied: "Kopiert!",
    sec_tokenomics: "Tokenomics", sec_tokenomics_sub: "Gesamtangebot: 1,000,000,000 LGAI.",
    lbl_public: "Verkauf (40%)", lbl_liq: "Liquidität (30%)", lbl_eco: "Ökosystem (20%)", lbl_team: "Team (10%)",
    sec_roadmap: "Roadmap", sec_roadmap_sub: "Unser Weg zur globalen Dominanz.",
    ph1: "Phase 1", ph1_title: "Genesis", ph1_desc: "Offizieller Start.",
    ph2: "Phase 2", ph2_title: "DEX Listing", ph2_desc: "Listing auf Uniswap.",
    ph3: "Phase 3", ph3_title: "KI-Plattform", ph3_desc: "Start der SaaS-Plattform.",
    footer: "© 2026 LegionAI Hub."
  }
};

export default function App() {
  const [lang, setLang] = useState('en'); 
  const [walletAddress, setWalletAddress] = useState(null);
  const [lgaiBalance, setLgaiBalance] = useState("0");
  const [presaleBalance, setPresaleBalance] = useState("400000000"); // 400M default
  const [referrerAddress, setReferrerAddress] = useState("0x0000000000000000000000000000000000000000"); 
  
  // Swap Widget States
  const [ethAmount, setEthAmount] = useState('');
  const [lgaiAmount, setLgaiAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  
  // Marketing States
  const [fomoAlert, setFomoAlert] = useState(null);
  const [aiMessageIndex, setAiMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const t = translations[lang] || translations['en'];

  const fetchPresaleBalanceGlobally = async () => {
    try {
      // Use default ethers provider for Sepolia to read contract without wallet
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(LGAI_ADDRESS, LGAI_ABI, provider);
        const bal = await contract.balanceOf(PRESALE_ADDRESS);
        const decimals = await contract.decimals();
        setPresaleBalance(formatUnits(bal, decimals));
      }
    } catch (e) {
      console.log("Global fetch presale balance error:", e);
    }
  };

  // ── INIT & URL Parsing ───────────────────────────────────────
  useEffect(() => {
    // Parse ?ref=0x... from URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref && /^0x[a-fA-F0-9]{40}$/.test(ref)) {
      setReferrerAddress(ref);
      console.log("Referrer set to:", ref);
    }

    // Attempt to load presale contract balance globally without wallet connection
    fetchPresaleBalanceGlobally();
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

      await fetchBalances(accounts[0], provider);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBalances = async (address, provider) => {
    try {
      const contract = new Contract(LGAI_ADDRESS, LGAI_ABI, provider);
      
      // User Balance
      const bal = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      setLgaiBalance(formatUnits(bal, decimals));

      // Presale Contract Balance (Tokens left to sell)
      const presaleBal = await contract.balanceOf(PRESALE_ADDRESS);
      setPresaleBalance(formatUnits(presaleBal, decimals));

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
      
      const presaleContract = new Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
      
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
      await fetchBalances(walletAddress, provider); 
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

  // Calculate Presale Progress
  const totalPresaleAmount = 400000000;
  const currentLeft = parseFloat(presaleBalance) || totalPresaleAmount;
  const soldAmount = totalPresaleAmount - currentLeft;
  const progressPercent = Math.max(5, (soldAmount / totalPresaleAmount) * 100);

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
          <a href="https://lgai-empire.onrender.com/community" target="_blank" rel="noopener noreferrer" style={{color: 'var(--cyan)'}}>Community 🤖</a>
          <a href="https://lgai-empire.onrender.com/telegram" target="_blank" rel="noopener noreferrer" style={{color: 'var(--cyan)'}}>Telegram 🚀</a>
        </div>

        <div className="nav-actions">
          <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            {Object.keys(translations).map((langKey) => (
              <option key={langKey} value={langKey}>
                {translations[langKey].lang_name}
              </option>
            ))}
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
            ) : lang === 'kr' ? (
              <>최초의 <span className="highlight">AI 통치</span><br/>암호화폐 제국</>
            ) : lang === 'zh' ? (
              <>首个 <span className="highlight">AI 统治的</span><br/>加密帝国</>
            ) : lang === 'ja' ? (
              <>初の <span className="highlight">AI統治</span><br/>暗号資産帝国</>
            ) : (
              <>{t.hero_title}</> 
            )}
          </h1>
          <p className="hero-subtitle">{t.hero_sub}</p>
          
          <div className="cta-group">
            <button className="btn-primary" onClick={scrollToPresale}>{t.btn_buy}</button>
            <button className="btn-secondary" onClick={() => window.open('https://lgai-empire.onrender.com/whitepaper.html', '_blank')}>{t.btn_wp}</button>
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
                <span style={{ color: 'var(--cyan)' }}>Sold: {soldAmount.toLocaleString()} LGAI</span>
                <span>Left: {currentLeft.toLocaleString()} LGAI</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

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
