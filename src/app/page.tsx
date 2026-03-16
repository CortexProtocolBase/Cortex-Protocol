"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Wallet,
  Brain,
  TrendingUp,
  Bot,
  Layers,
  RefreshCw,
  Vote,
  Github,
  ChevronDown,
} from "lucide-react";

/* ───────────────────────── Particle Network Background ───────────────────────── */

function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const particleCount = 120;
    const connectionDistance = 180;
    const mouseRadius = 250;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius * 0.015;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Draw dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx!.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < connectionDistance) {
            const alpha = (1 - cdist / connectionDistance) * 0.2;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    function handleMouse(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY + window.scrollY;
    }

    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 1 }}
    />
  );
}

/* ───────────────────────── Scroll Reveal Hook ───────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      // Show everything immediately
      document
        .querySelectorAll(".reveal, .reveal-left, .reveal-scale")
        .forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-scale")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/* ───────────────────────── Data ───────────────────────── */

const footerLinks = [
  { label: "Docs", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Discord", href: "#" },
  { label: "Twitter", href: "#" },
];

/* ───────────────────────── Terminal sequences ───────────────────────── */

interface TerminalEntry {
  text: string;
  isCommand: boolean;
  typeSpeed: number; // ms per character
  delay: number; // pause after line finishes (ms)
}

const terminalSequence: TerminalEntry[] = [
  { text: "$ cortex init --network mainnet", isCommand: true, typeSpeed: 35, delay: 400 },
  { text: "Connecting to Ethereum mainnet...", isCommand: false, typeSpeed: 12, delay: 600 },
  { text: "Vault contract deployed at 0x7a3B...f91E", isCommand: false, typeSpeed: 10, delay: 300 },
  { text: "", isCommand: false, typeSpeed: 0, delay: 200 },
  { text: "$ cortex agent start --mode autonomous", isCommand: true, typeSpeed: 30, delay: 400 },
  { text: "Loading AI strategy engine...", isCommand: false, typeSpeed: 15, delay: 500 },
  { text: "Scanning 54 DeFi protocols...", isCommand: false, typeSpeed: 15, delay: 800 },
  { text: "Risk model calibrated: sharpe_ratio=2.4", isCommand: false, typeSpeed: 10, delay: 300 },
  { text: "", isCommand: false, typeSpeed: 0, delay: 200 },
  { text: "$ cortex allocate --strategy balanced", isCommand: true, typeSpeed: 30, delay: 300 },
  { text: "Allocating: DeFi Lending    → 35%", isCommand: false, typeSpeed: 8, delay: 150 },
  { text: "Allocating: DEX Liquidity   → 25%", isCommand: false, typeSpeed: 8, delay: 150 },
  { text: "Allocating: Options Vault   → 20%", isCommand: false, typeSpeed: 8, delay: 150 },
  { text: "Allocating: ETH Staking     → 15%", isCommand: false, typeSpeed: 8, delay: 150 },
  { text: "Allocating: Cash Reserve    →  5%", isCommand: false, typeSpeed: 8, delay: 400 },
  { text: "Portfolio rebalanced successfully.", isCommand: false, typeSpeed: 10, delay: 500 },
  { text: "", isCommand: false, typeSpeed: 0, delay: 200 },
  { text: "$ cortex status", isCommand: true, typeSpeed: 35, delay: 300 },
  { text: "TVL: $12,400,000 | APY: 18.7%", isCommand: false, typeSpeed: 10, delay: 200 },
  { text: "Active strategies: 5/8", isCommand: false, typeSpeed: 10, delay: 200 },
  { text: "Last rebalance: 2h ago", isCommand: false, typeSpeed: 10, delay: 500 },
  { text: "", isCommand: false, typeSpeed: 0, delay: 200 },
  { text: "$ cortex yield --distribute", isCommand: true, typeSpeed: 30, delay: 400 },
  { text: "Distributing $47,832 to 2,847 depositors...", isCommand: false, typeSpeed: 12, delay: 1000 },
  { text: "Yield distributed. Next cycle in 6h.", isCommand: false, typeSpeed: 10, delay: 500 },
  { text: "", isCommand: false, typeSpeed: 0, delay: 200 },
  { text: "$ cortex monitor --risk", isCommand: true, typeSpeed: 30, delay: 300 },
  { text: "Volatility: 12.1% | Max drawdown: -8.3%", isCommand: false, typeSpeed: 10, delay: 200 },
  { text: "Win rate: 73% | Confidence: 87%", isCommand: false, typeSpeed: 10, delay: 200 },
  { text: "All systems nominal.", isCommand: false, typeSpeed: 10, delay: 800 },
];

/* ───────────────────────── Animated Terminal ───────────────────────── */

function AnimatedTerminal() {
  const [lines, setLines] = useState<{ text: string; isCommand: boolean }[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [currentEntry, setCurrentEntry] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const maxVisibleLines = 16;

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, currentText]);

  const advanceLine = useCallback(() => {
    const entry = terminalSequence[currentEntry];
    // Push finished line
    if (entry.text) {
      setLines((prev) => {
        const next = [...prev, { text: entry.text, isCommand: entry.isCommand }];
        // Keep buffer trimmed
        return next.length > 50 ? next.slice(-50) : next;
      });
    } else {
      // Empty line spacer
      setLines((prev) => [...prev, { text: "", isCommand: false }]);
    }
    setCurrentText("");
    setCharIndex(0);
    // Loop back or advance
    setCurrentEntry((prev) => (prev + 1) % terminalSequence.length);
  }, [currentEntry]);

  // Typing effect
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const entry = terminalSequence[currentEntry];

    // Empty line — just push and move on
    if (!entry.text) {
      const t = setTimeout(() => advanceLine(), entry.delay);
      return () => clearTimeout(t);
    }

    // Still typing characters
    if (charIndex < entry.text.length) {
      const speed = prefersReduced ? 0 : entry.typeSpeed;
      const t = setTimeout(() => {
        setCurrentText(entry.text.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(t);
    }

    // Done typing this line — pause then advance
    const t = setTimeout(() => advanceLine(), entry.delay);
    return () => clearTimeout(t);
  }, [currentEntry, charIndex, advanceLine]);

  // Only show the last N lines
  const visibleLines = lines.slice(-maxVisibleLines);

  return (
    <div className="mx-auto mt-12 w-full max-w-2xl" aria-hidden="true">
      {/* Terminal chrome */}
      <div className="rounded-t-xl border border-border bg-card-solid px-4 py-3 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted font-mono">cortex@mainnet ~ </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="rounded-b-xl border border-t-0 border-border bg-[#0c0c0e] px-5 py-4 font-mono text-sm leading-relaxed overflow-hidden"
        style={{ height: "340px" }}
      >
        {visibleLines.map((line, i) => (
          <div key={i} className="min-h-[1.6em]">
            {line.text ? (
              <span className={line.isCommand ? "text-foreground" : "text-muted"}>
                {line.isCommand && (
                  <span className="text-primary">$ </span>
                )}
                {line.isCommand ? line.text.slice(2) : line.text}
              </span>
            ) : null}
          </div>
        ))}

        {/* Current typing line */}
        {currentText && (
          <div className="min-h-[1.6em]">
            <span className={terminalSequence[currentEntry]?.isCommand ? "text-foreground" : "text-muted"}>
              {terminalSequence[currentEntry]?.isCommand && (
                <span className="text-primary">$ </span>
              )}
              {terminalSequence[currentEntry]?.isCommand ? currentText.slice(2) : currentText}
            </span>
            <span
              className={`inline-block w-[8px] h-[15px] ml-[1px] -mb-[2px] bg-primary ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}

        {/* Cursor on empty prompt */}
        {!currentText && (
          <div className="min-h-[1.6em]">
            <span className="text-primary">$ </span>
            <span
              className={`inline-block w-[8px] h-[15px] ml-[1px] -mb-[2px] bg-primary ${
                showCursor ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── FAQ Section ───────────────────────── */

const faqItems = [
  {
    q: "What is CORTEX?",
    a: "CORTEX is a decentralized, AI-managed investment vault protocol built on Base. Users deposit ETH or USDC, and an autonomous AI agent manages the portfolio across the Base DeFi ecosystem.",
  },
  {
    q: "How does the AI work?",
    a: "The AI agent runs every 10 minutes, analyzing on-chain data, market sentiment, and liquidity flows. It generates trade proposals that are validated by smart contract guardrails before execution.",
  },
  {
    q: "What are the fees?",
    a: "2% annualized management fee on total AUM, 20% performance fee on net new profits (above high-water mark), and 0.5% withdrawal fee. Deposits are free.",
  },
  {
    q: "What are cVault shares?",
    a: "When you deposit, you receive cVault shares — an ERC-4626 receipt token proportional to your share of the vault. As the AI generates returns, your share value increases.",
  },
  {
    q: "How is risk managed?",
    a: "The AI allocates across three governance-controlled tiers: Core (70% default — ETH, cbBTC, USDC yields), Mid-Risk (20% — established Base tokens, Aerodrome pools), and Degen (10% — new launches, momentum plays). $CORTEX holders vote on these bands.",
  },
  {
    q: "Can I withdraw anytime?",
    a: "Yes. Redeem your cVault shares at any time for the underlying assets minus a 0.5% withdrawal fee. No lockups.",
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="reveal-left font-heading text-2xl font-bold tracking-tight text-foreground">
          Frequently asked questions
        </h2>

        <div className="mt-10">
          {faqItems.map((item, i) => (
            <div key={i} className="border-b border-border">
              <button
                className="flex justify-between items-center w-full py-4 text-left text-foreground font-medium cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {item.q}
                <ChevronDown
                  className={`h-5 w-5 text-muted transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <p className="text-muted text-sm pb-4">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  useScrollReveal();

  return (
    <div className="relative min-h-screen bg-background text-foreground font-body">
      <ParticleNetwork />
      <div className="relative z-10">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your portfolio,
              <br />
              <span className="text-muted">managed by AI.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base text-muted leading-relaxed">
              Deposit ETH or USDC into the CORTEX Vault on Base. An autonomous AI agent manages a mixed portfolio across the Base DeFi ecosystem — and distributes yield back to you.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/vault"
                className="cursor-pointer rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:opacity-90"
              >
                Open Vault
              </Link>
              <Link
                href="/dashboard"
                className="cursor-pointer rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:text-foreground hover:border-border-hover"
              >
                Dashboard
              </Link>
              <a
                href="#"
                className="cursor-pointer rounded-lg border border-border px-5 py-2.5 text-muted transition-all duration-200 hover:text-foreground hover:border-border-hover"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <AnimatedTerminal />
        </div>
      </section>

      {/* ─── NUMBERS ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="reveal-scale grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border lg:grid-cols-4">
            {[
              { value: "$12.4M", label: "TVL on Base" },
              { value: "18.7%", label: "avg. APY" },
              { value: "12", label: "active strategies" },
              { value: "2,847", label: "depositors" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card p-6 lg:p-8"
              >
                <p className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — left-aligned, numbered ─── */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="reveal-left font-heading text-2xl font-bold tracking-tight text-foreground">
            Three steps. That&apos;s it.
          </h2>

          <div className="mt-10 space-y-6 stagger">
            {[
              {
                n: "01",
                icon: Wallet,
                title: "Deposit ETH or USDC",
                desc: "Connect a wallet, pick an amount, and deposit into the CORTEX vault on Base. You receive cVault shares proportional to your deposit. No lockups, no minimums.",
              },
              {
                n: "02",
                icon: Brain,
                title: "AI builds your portfolio",
                desc: "The agent scans the Base DeFi ecosystem — Aave, Compound, Aerodrome, and more — weighs risk/reward, and spreads your capital across Core, Mid-Risk, and Degen tiers.",
              },
              {
                n: "03",
                icon: TrendingUp,
                title: "Yield flows back to you",
                desc: "Profits are distributed proportionally to your cVault share value. A 2% management fee and 20% performance fee apply — the rest is yours. Withdraw anytime.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="reveal flex gap-5 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-hover"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card-solid">
                  <step.icon className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <h3 className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-muted">{step.n}</span>
                    <span className="font-heading text-base font-semibold text-foreground">
                      {step.title}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT'S UNDER THE HOOD — asymmetric grid ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="reveal flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Under the hood
            </h2>
            <p className="text-sm text-muted max-w-sm">
              The protocol handles everything — from allocation to governance.
              Here&apos;s what runs behind the scenes.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12 stagger">
            {/* Large card */}
            <div className="reveal md:col-span-7 rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-border-hover">
              <Bot className="h-5 w-5 text-muted" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                Autonomous AI Agent
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Not a script — an actual decision-making agent on Base that evaluates market
                conditions, protocol risks, and yield opportunities before every
                allocation. It spreads capital across Core, Mid-Risk, and Degen tiers and runs every 10 minutes.
              </p>
            </div>

            {/* Smaller stacked cards */}
            <div className="reveal md:col-span-5 flex flex-col gap-4">
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-hover">
                <Layers className="h-5 w-5 text-muted" />
                <h3 className="mt-3 font-heading text-sm font-semibold text-foreground">
                  Multi-Strategy
                </h3>
              <p className="mt-1 text-sm text-muted">
                  Lending, LPs, options, staking across Base — never all in one basket.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-hover">
                <RefreshCw className="h-5 w-5 text-muted" />
                <h3 className="mt-3 font-heading text-sm font-semibold text-foreground">
                  Continuous Rebalancing
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Positions adjust as conditions change — not once a week, constantly.
                </p>
              </div>
            </div>

            {/* Bottom row: two equal cards */}
            <div className="reveal md:col-span-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-hover">
              <Vote className="h-5 w-5 text-muted" />
              <h3 className="mt-3 font-heading text-sm font-semibold text-foreground">
                On-Chain Governance
              </h3>
              <p className="mt-1 text-sm text-muted">
                CORTEX token holders vote on risk parameters, fee structures,
                and which strategies the AI is allowed to use.
              </p>
            </div>
            <div className="reveal md:col-span-6 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-hover">
              <TrendingUp className="h-5 w-5 text-muted" />
              <h3 className="mt-3 font-heading text-sm font-semibold text-foreground">
                Fee Sharing
              </h3>
              <p className="mt-1 text-sm text-muted">
                Protocol fees (2% management + 20% performance) go back to $CORTEX stakers — 50% to stakers, 50% to treasury.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <FaqSection />

      {/* ─── CTA ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="reveal-scale rounded-2xl border border-border bg-card p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Ready to try it?
              </h2>
              <p className="mt-2 text-sm text-muted max-w-md">
                Connect your wallet, deposit into the vault, and let the AI take it from there. No setup, no config, no maintenance.
              </p>
            </div>
            <Link
              href="/vault"
              className="cursor-pointer shrink-0 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-all duration-200 hover:opacity-90"
            >
              Open Vault
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-5xl px-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading text-sm font-bold text-foreground">
            CORTEX
          </p>

          <nav className="flex flex-wrap gap-5">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-xs text-muted">
            &copy; 2026 CORTEX &middot; Built on Base
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
