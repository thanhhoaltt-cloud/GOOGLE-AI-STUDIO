/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VirtualLab } from './components/VirtualLab';
import { DataTableAndGraph } from './components/DataTableAndGraph';
import { DeductionWorksheet } from './components/DeductionWorksheet';
import { CoreKnowledge } from './components/CoreKnowledge';
import { PracticeQuiz } from './components/PracticeQuiz';
import { LabGuideModal } from './components/LabGuideModal';
import { SimulationState, TrialData } from './types/physics';
import { generateStandardTextbookDataset } from './utils/physicsEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lab' | 'data' | 'reasoning' | 'theory' | 'quiz'>('lab');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Initialize simulation parameters
  const [simulationState, setSimulationState] = useState<SimulationState>({
    mode: 'incline_accel',
    angleDeg: 8,
    flagWidthMm: 20, // 20mm = 0.02m standard textbook flag
    gateAPosCm: 20,
    gateBPosCm: 80,
    cartInitialPosCm: 0,
    cartMassKg: 0.2,
    initialVelocityMps: 0,
    frictionCoeff: 0.01,
    hasExperimentalNoise: false,
    showVectors: true,
    showTrajectoryTrail: true,
    playbackSpeed: 1.0,
  });

  // Recorded experimental trials list (seeded with standard textbook set for immediate exploratory discovery)
  const [trials, setTrials] = useState<TrialData[]>(() => generateStandardTextbookDataset(8));

  const handleSaveTrial = (newTrial: TrialData) => {
    setTrials((prev) => [...prev, newTrial]);
  };

  const handleClearTrials = () => {
    setTrials([]);
  };

  const handleResetSimulation = () => {
    setSimulationState((prev) => ({
      ...prev,
      mode: 'incline_accel',
      angleDeg: 8,
      gateAPosCm: 20,
      gateBPosCm: 80,
      cartInitialPosCm: 0,
      initialVelocityMps: 0,
      playbackSpeed: 1.0,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Universal Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetExperiment={handleResetSimulation}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Learning Hub Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'lab' && (
          <VirtualLab
            simulationState={simulationState}
            setSimulationState={setSimulationState}
            onSaveTrial={handleSaveTrial}
            onNavigateToData={() => setActiveTab('data')}
            onNavigateToReasoning={() => setActiveTab('reasoning')}
          />
        )}

        {activeTab === 'data' && (
          <DataTableAndGraph
            trials={trials}
            onSetTrials={setTrials}
            onClearTrials={handleClearTrials}
            onNavigateToReasoning={() => setActiveTab('reasoning')}
          />
        )}

        {activeTab === 'reasoning' && (
          <DeductionWorksheet
            onNavigateToTheory={() => setActiveTab('theory')}
            onNavigateToLab={() => setActiveTab('lab')}
          />
        )}

        {activeTab === 'theory' && (
          <CoreKnowledge
            onNavigateToQuiz={() => setActiveTab('quiz')}
            onNavigateToLab={() => setActiveTab('lab')}
          />
        )}

        {activeTab === 'quiz' && (
          <PracticeQuiz onNavigateToLab={() => setActiveTab('lab')} />
        )}
      </main>

      {/* Educational Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Vật Lí 10</span>
            <span>·</span>
            <span>Sách Giáo Khoa Kết Nối Tri Thức với Cuộc Sống</span>
            <span>·</span>
            <span>Chương trình GDPT 2018</span>
          </div>

          <div className="text-slate-500 text-center sm:text-right">
            Học phần: Chuyển động biến đổi · Khái niệm, công thức, ý nghĩa & đơn vị của gia tốc
          </div>
        </div>
      </footer>

      {/* Lab Guide Modal */}
      <LabGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
