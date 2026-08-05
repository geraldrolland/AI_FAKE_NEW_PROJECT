"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function Counter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1.6, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => setDisplay(Math.round(latest)));
  }, [spring]);

  return (
    <div ref={ref} className="text-center">
      <p className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

const features = [
  {
    title: "Headless scraping",
    icon: "🕵️",
    description:
      "We open the article in a headless Chrome browser and extract every headline on the page — no manual work required.",
  },
  {
    title: "ML classification",
    icon: "🧠",
    description:
      "Each headline is run through a trained neural network that scores how likely it is to be real or fabricated.",
  },
  {
    title: "Live progress",
    icon: "⚡",
    description:
      "Follow the pipeline in real time over a WebSocket — from scraping, to analysis, to your final credibility report.",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste a URL",
    description: "Drop in any news article link you want to verify.",
  },
  {
    number: "02",
    title: "We scrape & analyze",
    description: "Headlines are extracted and scored by our detection model.",
  },
  {
    number: "03",
    title: "Get your verdict",
    description: "See each headline flagged as Real or Fake with confidence.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1 overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6 py-24">
        {/* Animated background */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_60%)]" />
          <motion.div
            className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
            animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-teal-500/15 blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, -40, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto w-full max-w-4xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mx-auto mb-6 w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 font-mono text-xs tracking-widest text-emerald-300"
          >
            AI-POWERED NEWS ANALYSIS
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl"
          >
            Don&apos;t get
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              fooled by headlines.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400"
          >
            Paste any news article URL and our machine-learning model will
            scrape its headlines and flag the ones that look untrustworthy —
            with confidence scores you can see.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/analyze"
              className="group relative inline-flex h-13 items-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 hover:shadow-emerald-500/40"
            >
              Analyze an article
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900/60 px-8 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-16 flex items-center justify-center gap-3 font-mono text-xs text-zinc-500"
          >
            {["Scrape", "Analyze", "Verify"].map((word, i) => (
              <motion.span
                key={word}
                className="flex items-center gap-3"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              >
                {word}
                {i < 2 && <span className="text-emerald-500/60">•</span>}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/30 py-14">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-10 px-6 sm:grid-cols-4">
          <Counter value={95} suffix="%" label="Model accuracy" />
          <Counter value={24} suffix="/7" label="Headline throughput" />
          <Counter value={1000} suffix="+" label="Articles verified" />
          <Counter value={60} suffix="s" label="Avg. analysis time" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-14 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-3 font-mono text-xs tracking-widest text-emerald-400"
          >
            WHY VERISCOPE
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything you need to spot disinformation
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-colors hover:border-emerald-500/40"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl transition-transform group-hover:scale-110">
                {feature.icon}
              </span>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/30 py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-14 text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 font-mono text-xs tracking-widest text-emerald-400"
            >
              HOW IT WORKS
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              From URL to verdict in seconds
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-10 md:grid-cols-3"
          >
            {steps.map((step, i) => (
              <motion.div key={step.number} variants={cardVariants} className="relative">
                <motion.span
                  className="absolute -top-4 left-0 font-mono text-6xl font-black text-zinc-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.number}
                </motion.span>
                <div className="pt-14">
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    aria-hidden
                    className="absolute -right-5 top-8 hidden text-zinc-700 md:block"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden py-24">
        <div aria-hidden className="absolute inset-0 -z-10">
          <motion.div
            className="absolute left-1/2 top-1/2 h-96 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mx-auto w-full max-w-3xl px-6 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Verify a headline{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              before you share it.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mx-auto mt-4 max-w-xl text-zinc-400"
          >
            Misinformation spreads in seconds. Give yourself a credibility
            check before amplifying the next story.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-10">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:scale-105 hover:bg-emerald-500"
            >
              Start analyzing — it&apos;s free
              <span>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
