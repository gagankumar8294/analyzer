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
  duration: number; // simulated duration in ms
}

const API_STEPS: Step[] = [
  { id: 1, label: 'Connecting to Instagram API...', duration: 2500 },
  { id: 2, label: 'Fetching profile metadata & follower stats...', duration: 2000 },
  { id: 3, label: 'Downloading recent posts & media metrics...', duration: 3000 },
  { id: 4, label: 'Running AI brand positioning & content pillar analysis...', duration: 4000 },
  { id: 5, label: 'Evaluating competitive intelligence & gaps...', duration: 3500 },
  { id: 6, label: 'Synthesizing 90-day content calendar...', duration: 3000 },
];

const ZIP_STEPS: Step[] = [
  { id: 1, label: 'Reading uploaded ZIP archive...', duration: 1500 },
  { id: 2, label: 'Extracting profile JSON details...', duration: 1500 },
  { id: 3, label: 'Parsing post history, comments & stories locally...', duration: 3000 },
  { id: 4, label: 'Running AI brand positioning & content pillar analysis...', duration: 4000 },
  { id: 5, label: 'Evaluating competitive intelligence & gaps...', duration: 3500 },
  { id: 6, label: 'Synthesizing 90-day content calendar...', duration: 3000 },
];

export default function ProgressOverlay({ isVisible, username, isZipMode = false }: ProgressOverlayProps) {
  const steps = isZipMode ? ZIP_STEPS : API_STEPS;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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
          setProgress(Math.min(currentProg, 98)); // hold just before 100% until next step
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

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-glow" />

      <div className="w-full max-w-lg flex flex-col gap-8 text-center">
        {/* Animated logo/spinner */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-24 h-24 rounded-full border-2 border-brand/20 border-t-brand animate-spin" />
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Text Pitch */}
        <div className="flex flex-col gap-2">
          <h3 className="text-heading-2 font-extrabold text-primary">
            Analyzing @{username}
          </h3>
          <p className="text-body-sm text-muted">
            This takes about 15–20 seconds as Gemini generates comprehensive recommendations.
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-2.5 bg-elevated border border-default rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-gradient transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-caption text-muted font-semibold px-0.5">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="card text-left flex flex-col gap-3.5 bg-surface/50 border-default p-5 max-h-[300px] overflow-y-auto">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 transition-colors duration-300
                  ${isCompleted ? 'text-green-400' : isCurrent ? 'text-primary font-medium' : 'text-muted'}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 animate-scale-in" />
                ) : isCurrent ? (
                  <div className="relative shrink-0 flex items-center justify-center">
                    <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-brand/35 animate-ping" />
                    <Circle className="w-4 h-4 text-brand fill-brand/20 shrink-0" />
                  </div>
                ) : (
                  <Circle className="w-4 h-4 text-muted shrink-0" />
                )}
                <span className="text-body-sm truncate">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
