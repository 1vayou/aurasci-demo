"use client";

import { useRouter } from "next/navigation";
import {
  FlaskConical,
  Gem,
  ShieldCheck,
  ArrowRight,
  Atom,
  Zap,
  Lock,
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "@/store";

export default function LandingPage() {
  const router = useRouter();
  const setUserRole = useAppStore((s) => s.setUserRole);

  const handleScientist = () => {
    setUserRole("scientist");
    router.push("/onboarding/scientist");
  };

  const handlePatron = () => {
    setUserRole("patron");
    router.push("/market");
  };

  return (
    <div className="hero-gradient grid-pattern min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-40 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Green Shield badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 mb-8">
          <ShieldCheck className="w-4 h-4 green-shield shield-pulse" />
          <span className="text-xs font-medium text-green-400 tracking-wide uppercase">
            AI-Verified Research Funding
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          <span className="text-white">From</span>{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Proof
          </span>{" "}
          <span className="text-white">to</span>{" "}
          <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Capital
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed">
          Milestone-based open science funding infrastructure
          <br />
          powered by AI Agents.
        </p>

        <p className="text-sm text-white/30 max-w-xl mx-auto mb-16">
          Scientists publish research intents. AI verifies milestones. Patrons
          fund breakthroughs. Capital flows when proof lands.
        </p>

        {/* Two Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Scientist Card */}
          <button
            onClick={handleScientist}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-left transition-all duration-500 hover:scale-[1.02] card-glow-green"
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/15 transition-colors">
              <FlaskConical className="w-7 h-7 text-green-400" />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-semibold text-white mb-3">
              I&apos;m a Scientist
            </h2>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Publish your research intent, set milestones, submit proof of
              progress, and receive milestone-based patronage for your
              breakthrough work.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-white/30">
                <Atom className="w-3.5 h-3.5 text-green-500/60" />
                <span>Publish Intent Assets</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500/60" />
                <span>AI-Verified Milestones</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <TrendingUp className="w-3.5 h-3.5 text-green-500/60" />
                <span>Milestone-Based Funding</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <span>Start Publishing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Patron Card */}
          <button
            onClick={handlePatron}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-left transition-all duration-500 hover:scale-[1.02] card-glow-purple"
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/15 transition-colors">
              <Gem className="w-7 h-7 text-purple-400" />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-semibold text-white mb-3">
              I&apos;m a Patron
            </h2>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Browse AI-verified research intents, provide patronage to
              promising science, and track milestone-based progress of funded
              projects.
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-white/30">
                <Zap className="w-3.5 h-3.5 text-purple-500/60" />
                <span>Browse Verified Research</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <Lock className="w-3.5 h-3.5 text-purple-500/60" />
                <span>Escrow-Protected Patronage</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500/60" />
                <span>AI Trust Loop Verification</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
              <span>Explore Market</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Bottom tagline */}
        <div className="mt-16 flex items-center justify-center gap-6 text-xs text-white/20">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500/40" />
            AI Verified
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span>Milestone-Based</span>
          <span className="w-px h-3 bg-white/10" />
          <span>Escrow-Protected</span>
          <span className="w-px h-3 bg-white/10" />
          <span>Open Science</span>
        </div>
      </section>
    </div>
  );
}
