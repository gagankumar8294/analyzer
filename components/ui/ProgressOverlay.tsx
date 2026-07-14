'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Circle } from 'lucide-react';

interface ProgressOverlayProps {
  isVisible: boolean;
  username: string;
  isZipMode?: boolean;
}

interface Step {
  id: number;
  label: string;
  tip: string;
  duration: number;
}

const API_STEPS: Step[] = [
  { id: 1, label: 'Connecting to Instagram data source...', tip: 'We fetch publicly available profile data through secure APIs', duration: 2500 },
  { id: 2, label: 'Fetching profile metadata & stats...', tip: 'Bio, follower count, following, profile picture, and verification status', duration: 2000 },
  { id: 3, label: 'Downloading recent posts & engagement metrics...', tip: 'Likes, comments, hashtags, captions, and posting frequency', duration: 3000 },
  { id: 4, label: 'Running AI brand analysis...', tip: 'Gemini identifies your niche, tone, audience, and content pillars', duration: 4000 },
  { id: 5, label: 'Evaluating competitors & market gaps...', tip: 'Finding similar accounts and identifying opportunities', duration: 3500 },
  { id: 6, label: 'Building your personalized action plan...', tip: 'Generating a 90-day content calendar and growth roadmap', duration: 3000 },
];

const ZIP_STEPS: Step[] = [
  { id: 1, label: 'Reading your uploaded ZIP archive...', tip: 'All parsing happens locally in your browser — nothing leaves your device', duration: 1500 },
  { id: 2, label: 'Extracting profile information...', tip: 'Pulling account details from your Instagram data export', duration: 1500 },
  { id: 3, label: 'Parsing post history & engagement data...', tip: 'Analysing your posts, comments, and interaction patterns', duration: 3000 },
  { id: 4, label: 'Running AI brand analysis...', tip: 'Gemini identifies your niche, tone, audience, and content pillars', duration: 4000 },
  { id: 5, label: 'Evaluating competitors & market gaps...', tip: 'Finding similar accounts and identifying opportunities', duration: 3500 },
  { id: 6, label: 'Building your personalized action plan...', tip: 'Generating a 90-day content calendar and growth roadmap', duration: 3000 },
];

const API_ANALYZING_MESSAGES = [
  "🚀 Initializing secure connection to public Instagram nodes...",
  "🔍 Fetching bio details, follower counts, and verification status...",
  "📊 Downloading recent post metadata & calculating engagement rates...",
  "🤖 Feeding raw profile metrics to Gemini AI strategy models...",
  "💡 Running competitor mapping and detecting market gaps...",
  "📈 Analyzing post frequency, peak engagement hours, and content formats...",
  "📅 Formulating a customized 90-day action plan and content pillars...",
  "🎨 Rendering charts, statistics, and generating PDF download bundle...",
  "✨ Almost there! Polishing final details and assembling your report..."
];

const ZIP_ANALYZING_MESSAGES = [
  "📁 Unzipping and mounting your uploaded Instagram archive locally...",
  "🔍 Verifying directory structure and parsing JSON file feeds...",
  "📊 Compiling posting history, likes, and message frequencies...",
  "🤖 Forwarding localized performance data to Gemini AI models...",
  "💡 Structuring niche opportunities and personalized brand analysis...",
  "📈 Pinpointing top-performing days, engagement trends, and growth loops...",
  "📅 Drafting a bespoke 90-day content calendar based on your past posts...",
  "🎨 Setting up dashboard widgets and generating downloadable PDF report...",
  "✨ Wrapping up! Preparing your comprehensive analytics dashboard..."
];

export default function ProgressOverlay({ isVisible, username, isZipMode = false }: ProgressOverlayProps) {
  const steps = isZipMode ? ZIP_STEPS : API_STEPS;
  const analyzingMessages = isZipMode ? ZIP_ANALYZING_MESSAGES : API_ANALYZING_MESSAGES;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0);
      setFade(true);
      return;
    }

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % analyzingMessages.length);
        setFade(true);
      }, 300); // matches transition duration
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, analyzingMessages]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStepIndex(0);
      setProgress(0);
      return;
    }

    let active = true;
    let stepTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runStep = (index: number) => {
      if (index >= steps.length) {
        setProgress(100);
        return;
      }

      if (!active) return;
      setCurrentStepIndex(index);

      const step = steps[index];
      const stepDuration = step.duration;
      const startProgress = (index / steps.length) * 100;
      const targetProgress = ((index + 1) / steps.length) * 100;
      const progressStep = (targetProgress - startProgress) / 50;

      let currentProg = startProgress;
      progressInterval = setInterval(() => {
        if (currentProg < targetProgress - progressStep) {
          currentProg += progressStep;
          setProgress(Math.min(currentProg, 98));
        }
      }, stepDuration / 50);

      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        runStep(index + 1);
      }, stepDuration);
    };

    runStep(0);

    return () => {
      active = false;
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  }, [isVisible, steps]);

  if (!isVisible) return null;

  const estimatedSeconds = Math.max(1, Math.round(
    steps.slice(currentStepIndex).reduce((s, step) => s + step.duration, 0) / 1000
  ));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 animate-fade-in"
      style={{ background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="w-full max-w-xl flex flex-col gap-10 text-center">

        {/* Animated logo/spinner */}
        <div className="relative flex justify-center items-center">
          <div
            className="absolute w-28 h-28 rounded-full animate-spin"
            style={{ border: '2px solid rgba(99,102,241,0.15)', borderTopColor: 'var(--brand-primary)' }}
          />
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center animate-float"
            style={{ width: '72px', height: '72px', background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {isZipMode ? 'Analyzing Uploaded Archive' : `Analyzing @${username}`}
          </h3>
          <div className="h-12 flex items-center justify-center">
            <p 
              className={`text-sm leading-relaxed max-w-md mx-auto font-semibold transition-all duration-300 ${fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'}`}
              style={{ color: 'var(--brand-accent)' }}
            >
              {analyzingMessages[messageIndex]}
            </p>
          </div>
          <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            This takes about 15-20 seconds. Gemini AI is generating your comprehensive Instagram growth report.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-3">
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%`, background: 'var(--gradient-brand)' }}
            />
          </div>
          <div className="flex justify-between text-xs font-medium px-1" style={{ color: 'var(--text-muted)' }}>
            <span>{Math.round(progress)}% complete</span>
            <span>~{estimatedSeconds}s remaining</span>
          </div>
        </div>

        {/* Steps List */}
        <div
          className="text-left flex flex-col gap-4 p-6 max-h-[320px] overflow-y-auto rounded-2xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col gap-1">
                <div
                  className="flex items-center gap-3 transition-colors duration-300"
                  style={{ color: isCompleted ? 'var(--color-success)' : isCurrent ? 'var(--text-primary)' : 'var(--text-disabled)' }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-success)' }} />
                  ) : isCurrent ? (
                    <div className="relative shrink-0 flex items-center justify-center">
                      <span className="absolute inline-flex h-3 w-3 rounded-full animate-ping" style={{ background: 'rgba(99,102,241,0.3)' }} />
                      <Circle className="w-4 h-4 shrink-0" style={{ color: 'var(--brand-primary)', fill: 'rgba(99,102,241,0.15)' }} />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 shrink-0" style={{ color: 'var(--text-disabled)' }} />
                  )}
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {isCurrent && (
                  <p className="text-xs ml-7 animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                    {step.tip}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
