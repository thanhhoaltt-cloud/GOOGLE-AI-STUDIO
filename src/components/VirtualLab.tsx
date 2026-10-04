import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Eye, 
  EyeOff, 
  Zap, 
  Clock, 
  Activity, 
  Sliders, 
  Info,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { SimulationState, TrialData, ExperimentMode } from '../types/physics';
import { 
  calculateTheoreticalAcceleration, 
  computeGateMeasurements 
} from '../utils/physicsEngine';

interface VirtualLabProps {
  simulationState: SimulationState;
  setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
  onSaveTrial: (trial: TrialData) => void;
  onNavigateToData: () => void;
  onNavigateToReasoning: () => void;
}

export const VirtualLab: React.FC<VirtualLabProps> = ({
  simulationState,
  setSimulationState,
  onSaveTrial,
  onNavigateToData,
  onNavigateToReasoning,
}) => {
  // Animation & simulation physics loop state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Dynamic values during motion
  const [cartPosCm, setCartPosCm] = useState(0); // 0 to 120 cm
  const [cartVel, setCartVel] = useState(0); // m/s
  const [elapsedTime, setElapsedTime] = useState(0); // s

  // Gate sensor states
  const [isGateABroken, setIsGateABroken] = useState(false);
  const [isGateBBroken, setIsGateBBroken] = useState(false);

  // Digital timer readings
  const [timerReadingA, setTimerReadingA] = useState<number | null>(null);
  const [timerReadingB, setTimerReadingB] = useState<number | null>(null);
  const [timerReadingAB, setTimerReadingAB] = useState<number | null>(null);
  const [currentTrialData, setCurrentTrialData] = useState<TrialData | null>(null);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Physics params
  const a_theory = calculateTheoreticalAcceleration(
    simulationState.mode,
    simulationState.angleDeg,
    simulationState.frictionCoeff
  );

  // Reset cart to start position
  const handleReset = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
    setCartPosCm(simulationState.cartInitialPosCm);
    setCartVel(
      simulationState.mode === 'incline_decel'
        ? 1.8
        : simulationState.mode === 'horizontal_brake'
        ? 1.5
        : simulationState.mode === 'horizontal_uniform'
        ? 1.0
        : 0
    );
    setElapsedTime(0);
    setIsGateABroken(false);
    setIsGateBBroken(false);
    setTimerReadingA(null);
    setTimerReadingB(null);
    setTimerReadingAB(null);
    setCurrentTrialData(null);
    setSavedSuccessNotice(false);
    lastTimeRef.current = null;
  };

  // Switch mode handler
  const handleModeChange = (newMode: ExperimentMode) => {
    let initialV = 0;
    let initialPos = 0;
    let angle = 8;

    if (newMode === 'incline_accel') {
      angle = 8;
      initialV = 0;
      initialPos = 0;
    } else if (newMode === 'incline_decel') {
      angle = 6;
      initialV = 1.8;
      initialPos = 0;
    } else if (newMode === 'horizontal_uniform') {
      angle = 0;
      initialV = 1.0;
      initialPos = 0;
    } else if (newMode === 'horizontal_brake') {
      angle = 0;
      initialV = 1.5;
      initialPos = 0;
    }

    setSimulationState((prev) => ({
      ...prev,
      mode: newMode,
      angleDeg: angle,
      initialVelocityMps: initialV,
      cartInitialPosCm: initialPos,
    }));

    handleReset();
  };

  // Start simulation
  const handleStart = () => {
    if (isComplete) {
      handleReset();
    }
    setIsRunning(true);
    setIsPaused(false);
    lastTimeRef.current = performance.now();
  };

  // Pause simulation
  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  // Animation frame loop
  useEffect(() => {
    if (!isRunning || isPaused) return;

    let timeEnteredA: number | null = null;
    let timeExitedA: number | null = null;
    let timeEnteredB: number | null = null;
    let timeExitedB: number | null = null;

    const flagWidthM = simulationState.flagWidthMm / 1000;
    const flagWidthCm = simulationState.flagWidthMm / 10;
    const gateACm = simulationState.gateAPosCm;
    const gateBCm = simulationState.gateBPosCm;

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const rawDt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Apply playback speed modifier
      const dt = Math.min(rawDt, 0.05) * simulationState.playbackSpeed;

      setCartPosCm((prevPosCm) => {
        let currentV = cartVel;
        const currentA = a_theory;

        // Kinematics step
        const nextV = currentV + currentA * dt;
        const displacementM = currentV * dt + 0.5 * currentA * dt * dt;
        const nextPosCm = prevPosCm + displacementM * 100;

        // Update velocity state
        setCartVel(nextV);
        setElapsedTime((prevT) => prevT + dt);

        // Check Photogate A interaction
        const flagFrontCm = nextPosCm + 5; // Flag center on cart
        const flagBackCm = flagFrontCm - flagWidthCm;

        const inGateA = flagFrontCm >= gateACm && flagBackCm <= gateACm;
        setIsGateABroken(inGateA);
        if (inGateA && timerReadingA === null) {
          // Compute gate A duration
          const vAtGate = Math.max(0.05, Math.abs(nextV));
          const tA = flagWidthM / vAtGate;
          setTimerReadingA(Number(tA.toFixed(4)));
        }

        // Check Photogate B interaction
        const inGateB = flagFrontCm >= gateBCm && flagBackCm <= gateBCm;
        setIsGateBBroken(inGateB);
        if (inGateB && timerReadingB === null) {
          const vAtGate = Math.max(0.05, Math.abs(nextV));
          const tB = flagWidthM / vAtGate;
          setTimerReadingB(Number(tB.toFixed(4)));

          // Calculate travel time between A and B
          if (timerReadingA !== null) {
            const vA = flagWidthM / timerReadingA;
            const vB = vAtGate;
            const deltaT = Math.abs(vB - vA) / Math.max(0.01, Math.abs(currentA));
            setTimerReadingAB(Number(deltaT.toFixed(4)));
          }
        }

        // Check end condition (reach end of 115cm track or stopped)
        if (
          nextPosCm >= 115 ||
          nextPosCm <= -2 ||
          (simulationState.mode === 'incline_decel' && nextV <= 0.02) ||
          (simulationState.mode === 'horizontal_brake' && nextV <= 0.02)
        ) {
          setIsRunning(false);
          setIsComplete(true);

          // Compute finalized trial data package
          const trial = computeGateMeasurements(simulationState, Date.now() % 100);
          setCurrentTrialData(trial);
          setTimerReadingA(trial.tA);
          setTimerReadingB(trial.tB);
          setTimerReadingAB(trial.deltaT);

          return Math.min(115, Math.max(0, nextPosCm));
        }

        return nextPosCm;
      });

      if (isRunning && !isPaused && !isComplete) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [
    isRunning,
    isPaused,
    isComplete,
    cartVel,
    a_theory,
    simulationState,
    timerReadingA,
    timerReadingB,
  ]);

  // Handle saving data to data table
  const handleSaveToTable = () => {
    let trialToSave = currentTrialData;
    if (!trialToSave) {
      trialToSave = computeGateMeasurements(simulationState, 0);
    }
    onSaveTrial(trialToSave);
    setSavedSuccessNotice(true);
    setTimeout(() => setSavedSuccessNotice(false), 3000);
  };

  // Helper coordinate conversions for SVG rendering
  // Track goes from (x: 100, y: 120 + elevation) to (x: 820, y: 340)
  const angleRad = (simulationState.angleDeg * Math.PI) / 180;
  const trackLengthPx = 720;
  const startX = 80;
  // Elevation height based on angle
  const elevationPx = Math.sin(angleRad) * 450;
  const startY = 320 - elevationPx;
  const endX = startX + Math.cos(angleRad) * trackLengthPx;
  const endY = startY + Math.sin(angleRad) * trackLengthPx;

  // Convert track distance (0 to 120 cm) to pixel coordinates
  const getTrackPoint = (distCm: number) => {
    const fraction = Math.min(1.0, Math.max(0, distCm / 120));
    const px = startX + fraction * (endX - startX);
    const py = startY + fraction * (endY - startY);
    return { x: px, y: py };
  };

  const cartCoords = getTrackPoint(cartPosCm);
  const gateACoords = getTrackPoint(simulationState.gateAPosCm);
  const gateBCoords = getTrackPoint(simulationState.gateBPosCm);

  // Normal angle of the track (in degrees for SVG transform)
  const trackAngleDeg = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

  return (
    <div className="space-y-6">
      {/* Top Banner: Educational Context */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Mô hình thực nghiệm chuẩn SGK Vật lí 10 · Bài 8</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Thí Nghiệm Khảo Sát Sự Biến Đổi Vận Tốc Trong Chuyển Động Thẳng
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Sử dụng máng nghiêng và đồng hồ đo thời gian hiện số kết nối hai cổng quang điện A và B để xác định vận tốc tức thời <span className="font-mono text-indigo-300">v_A</span>, <span className="font-mono text-indigo-300">v_B</span> và khoảng thời gian <span className="font-mono text-indigo-300">Δt</span>.
          </p>
        </div>

        {/* Quick action badges */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={onNavigateToReasoning}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 rounded-lg transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Phiếu Lập Luận</span>
          </button>
          <button
            onClick={onNavigateToData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-lg transition-colors"
          >
            <span>Xem Bảng Số Liệu</span>
          </button>
        </div>
      </div>

      {/* Main Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: The Visual Apparatus Stage (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-3 sm:p-4">
            {/* Visual stage header with state indicators */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-medium text-slate-300">
                  {simulationState.mode === 'incline_accel' && 'Máng Nghiêng · Thả dốc nhanh dần đều'}
                  {simulationState.mode === 'incline_decel' && 'Máng Nghiêng · Đẩy dốc chậm dần đều'}
                  {simulationState.mode === 'horizontal_uniform' && 'Máng Ngang · Chuyển động thẳng đều (a = 0)'}
                  {simulationState.mode === 'horizontal_brake' && 'Máng Ngang · Lực cản hãm phanh (a < 0)'}
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400 font-mono">
                  Góc nghiêng α = {simulationState.angleDeg}°
                </span>
              </div>

              {/* View options */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setSimulationState((prev) => ({
                      ...prev,
                      showVectors: !prev.showVectors,
                    }))
                  }
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    simulationState.showVectors
                      ? 'bg-indigo-900/60 text-indigo-200 border-indigo-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title="Bật/Tắt hiển thị véc-tơ v và véc-tơ a"
                >
                  {simulationState.showVectors ? (
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>Véc-tơ v⃗, a⃗</span>
                </button>
              </div>
            </div>

            {/* SVG Interactive Physics Apparatus Canvas */}
            <div className="w-full aspect-[16/9] min-h-[340px] max-h-[460px] relative select-none">
              <svg
                viewBox="0 0 920 480"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="railGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <marker
                    id="arrowGreen"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#10b981" />
                  </marker>
                  <marker
                    id="arrowAmber"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#f59e0b" />
                  </marker>
                </defs>

                {/* Laboratory Workbench Base */}
                <rect x="30" y="410" width="860" height="30" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                <rect x="50" y="440" width="40" height="35" fill="#0f172a" />
                <rect x="830" y="440" width="40" height="35" fill="#0f172a" />

                {/* Adjustable Elevation Stand at Left Support */}
                <rect x={startX - 18} y={startY} width="12" height={410 - startY} fill="#475569" stroke="#64748b" strokeWidth="1" />
                {/* Elevation Adjustment Wheel / Dial */}
                <circle cx={startX - 12} cy={startY + 20} r="10" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                {/* Angle Dial Indicator */}
                <g transform={`translate(${startX - 65}, ${Math.max(startY - 25, 40)})`}>
                  <rect x="0" y="0" width="50" height="24" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="1.2" />
                  <text x="25" y="16" fill="#818cf8" fontSize="11" fontWeight="600" textAnchor="middle" className="font-mono">
                    {simulationState.angleDeg}°
                  </text>
                </g>

                {/* Right Track End Support Block */}
                <rect x={endX - 10} y={endY} width="20" height={410 - endY} fill="#334155" stroke="#475569" strokeWidth="1" />

                {/* Electromagnet at Start (0 cm) */}
                <g transform={`translate(${startX - 22}, ${startY - 15}) rotate(${trackAngleDeg} 22 15)`}>
                  <rect x="0" y="5" width="20" height="20" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                  <rect x="20" y="9" width="6" height="12" fill="#94a3b8" />
                  <text x="10" y="19" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">
                    N
                  </text>
                </g>

                {/* The Inclined Rail Track Body */}
                <g transform={`translate(${startX}, ${startY}) rotate(${trackAngleDeg})`}>
                  {/* Rail bar */}
                  <rect x="-10" y="0" width={trackLengthPx + 20} height="14" rx="3" fill="url(#railGrad)" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Millimeter & Centimeter Ruler Markings */}
                  {Array.from({ length: 13 }).map((_, i) => {
                    const cm = i * 10;
                    const markX = (cm / 120) * trackLengthPx;
                    return (
                      <g key={cm}>
                        {/* Major centimeter tick mark */}
                        <line x1={markX} y1="14" x2={markX} y2="24" stroke="#e2e8f0" strokeWidth="1.2" />
                        {/* Centimeter label */}
                        <text
                          x={markX}
                          y="34"
                          fill="#cbd5e1"
                          fontSize="9"
                          fontWeight="500"
                          textAnchor="middle"
                          className="font-mono select-none"
                        >
                          {cm}
                        </text>
                        {/* Intermediate 5cm tick */}
                        {i < 12 && (
                          <line x1={markX + (5 / 120) * trackLengthPx} y1="14" x2={markX + (5 / 120) * trackLengthPx} y2="20" stroke="#94a3b8" strokeWidth="0.8" />
                        )}
                      </g>
                    );
                  })}
                  {/* Sub-label cm unit */}
                  <text x={trackLengthPx + 15} y="34" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="start">
                    (cm)
                  </text>
                </g>

                {/* Photogate A (Cổng quang điện A) */}
                <g transform={`translate(${gateACoords.x}, ${gateACoords.y}) rotate(${trackAngleDeg})`}>
                  {/* Mounting clamp */}
                  <rect x="-9" y="14" width="18" height="20" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.2" rx="2" />
                  {/* Photogate U-frame */}
                  <path
                    d="M -12,14 L -12,-44 L 12,-44 L 12,14 L 6,14 L 6,-36 L -6,-36 L -6,14 Z"
                    fill="#1d4ed8"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                  />
                  {/* Laser Beam Across Gate A */}
                  <line
                    x1="-6"
                    y1="-24"
                    x2="6"
                    y2="-24"
                    stroke={isGateABroken ? '#ef4444' : '#38bdf8'}
                    strokeWidth="2.5"
                    filter="url(#laserGlow)"
                    strokeDasharray={isGateABroken ? '2,2' : 'none'}
                  />
                  {/* LED Indicator Light */}
                  <circle
                    cx="0"
                    cy="-40"
                    r="3.5"
                    fill={isGateABroken ? '#ef4444' : '#22c55e'}
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                  {/* Label Gate A */}
                  <g transform="translate(0, -52)">
                    <rect x="-14" y="-12" width="28" height="15" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                    <text x="0" y="-1" fill="#c7d2fe" fontSize="10" fontWeight="700" textAnchor="middle">
                      CỔNG A
                    </text>
                  </g>
                  {/* Position pointer marker */}
                  <polygon points="0,14 -4,8 4,8" fill="#38bdf8" />
                </g>

                {/* Photogate B (Cổng quang điện B) */}
                <g transform={`translate(${gateBCoords.x}, ${gateBCoords.y}) rotate(${trackAngleDeg})`}>
                  {/* Mounting clamp */}
                  <rect x="-9" y="14" width="18" height="20" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.2" rx="2" />
                  {/* Photogate U-frame */}
                  <path
                    d="M -12,14 L -12,-44 L 12,-44 L 12,14 L 6,14 L 6,-36 L -6,-36 L -6,14 Z"
                    fill="#c2410c"
                    stroke="#fb923c"
                    strokeWidth="1.5"
                  />
                  {/* Laser Beam Across Gate B */}
                  <line
                    x1="-6"
                    y1="-24"
                    x2="6"
                    y2="-24"
                    stroke={isGateBBroken ? '#ef4444' : '#fb923c'}
                    strokeWidth="2.5"
                    filter="url(#laserGlow)"
                    strokeDasharray={isGateBBroken ? '2,2' : 'none'}
                  />
                  {/* LED Indicator Light */}
                  <circle
                    cx="0"
                    cy="-40"
                    r="3.5"
                    fill={isGateBBroken ? '#ef4444' : '#22c55e'}
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                  {/* Label Gate B */}
                  <g transform="translate(0, -52)">
                    <rect x="-14" y="-12" width="28" height="15" rx="3" fill="#431407" stroke="#f97316" strokeWidth="1" />
                    <text x="0" y="-1" fill="#fed7aa" fontSize="10" fontWeight="700" textAnchor="middle">
                      CỔNG B
                    </text>
                  </g>
                  {/* Position pointer marker */}
                  <polygon points="0,14 -4,8 4,8" fill="#fb923c" />
                </g>

                {/* The Dynamics Cart (Xe Thí Nghiệm) */}
                <g transform={`translate(${cartCoords.x}, ${cartCoords.y}) rotate(${trackAngleDeg})`}>
                  {/* Cart Body */}
                  <rect x="-35" y="-18" width="70" height="16" rx="4" fill="url(#cartGrad)" stroke="#60a5fa" strokeWidth="1.5" />
                  
                  {/* Front & Rear Low-Friction Wheels */}
                  <circle cx="-22" cy="-1" r="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
                  <circle cx="22" cy="-1" r="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.5" />
                  <circle cx="-22" cy="-1" r="1.5" fill="#94a3b8" />
                  <circle cx="22" cy="-1" r="1.5" fill="#94a3b8" />

                  {/* Flag Pole (Trụ gắn cờ chắn sáng) */}
                  <rect x="-2" y="-36" width="4" height="18" fill="#64748b" />
                  
                  {/* Light Interrupter Flag (Tấm chắn sáng bề rộng d = 20mm) */}
                  {/* Width proportional: 20mm on scale */}
                  <rect x="-7" y="-36" width="14" height="15" fill="#0f172a" stroke="#f8fafc" strokeWidth="1.2" rx="1" />
                  <text x="0" y="-26" fill="#f8fafc" fontSize="7" fontWeight="700" textAnchor="middle">
                    d
                  </text>

                  {/* Front Magnetic Tip */}
                  <rect x="35" y="-14" width="4" height="8" fill="#94a3b8" />

                  {/* Dynamic Physical Vector Overlays */}
                  {simulationState.showVectors && (
                    <g transform="translate(0, -48)">
                      {/* Velocity Vector (Mũi tên vận tốc v) */}
                      {Math.abs(cartVel) > 0.03 && (
                        <g>
                          <line
                            x1="0"
                            y1="0"
                            x2={cartVel * 55}
                            y2="0"
                            stroke="#10b981"
                            strokeWidth="3.5"
                            markerEnd="url(#arrowGreen)"
                          />
                          <text
                            x={cartVel * 55 + (cartVel > 0 ? 10 : -18)}
                            y="-4"
                            fill="#34d399"
                            fontSize="11"
                            fontWeight="700"
                            className="font-mono"
                          >
                            v⃗ ({cartVel.toFixed(2)} m/s)
                          </text>
                        </g>
                      )}

                      {/* Acceleration Vector (Mũi tên gia tốc a) */}
                      {Math.abs(a_theory) > 0.05 && (
                        <g transform="translate(0, -18)">
                          <line
                            x1="0"
                            y1="0"
                            x2={a_theory * 35}
                            y2="0"
                            stroke="#f59e0b"
                            strokeWidth="3"
                            markerEnd="url(#arrowAmber)"
                          />
                          <text
                            x={a_theory * 35 + (a_theory > 0 ? 10 : -18)}
                            y="-4"
                            fill="#fbbf24"
                            fontSize="11"
                            fontWeight="700"
                            className="font-mono"
                          >
                            a⃗ ({a_theory.toFixed(2)} m/s²)
                          </text>
                        </g>
                      )}
                    </g>
                  )}
                </g>

                {/* Distance Dimension Indicator Between A and B */}
                <g transform={`translate(0, ${Math.max(endY + 45, 380)})`}>
                  <line x1={gateACoords.x} y1="0" x2={gateBCoords.x} y2="0" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1={gateACoords.x} y1="-5" x2={gateACoords.x} y2="5" stroke="#818cf8" strokeWidth="1.5" />
                  <line x1={gateBCoords.x} y1="-5" x2={gateBCoords.x} y2="5" stroke="#818cf8" strokeWidth="1.5" />
                  <rect
                    x={(gateACoords.x + gateBCoords.x) / 2 - 40}
                    y="-11"
                    width="80"
                    height="22"
                    rx="4"
                    fill="#1e1b4b"
                    stroke="#4338ca"
                    strokeWidth="1"
                  />
                  <text
                    x={(gateACoords.x + gateBCoords.x) / 2}
                    y="4"
                    fill="#c7d2fe"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    s = {simulationState.gateBPosCm - simulationState.gateAPosCm} cm
                  </text>
                </g>
              </svg>
            </div>

            {/* Interactive Playback & Run Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isPaused ? 'Tiếp tục' : isComplete ? 'Chạy Lại' : 'Thả Xe (Bắt Đầu)'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 active:scale-95 rounded-xl shadow-lg shadow-amber-600/30 transition-all"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Tạm Dừng</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Đặt Lại</span>
                </button>
              </div>

              {/* Playback speed controls */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 px-2 font-medium">Tốc độ:</span>
                {[0.25, 0.5, 1.0].map((speed) => (
                  <button
                    key={speed}
                    onClick={() =>
                      setSimulationState((prev) => ({ ...prev, playbackSpeed: speed }))
                    }
                    className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                      simulationState.playbackSpeed === speed
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Save result button */}
              <button
                onClick={handleSaveToTable}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  savedSuccessNotice
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border-emerald-500/40'
                }`}
              >
                {savedSuccessNotice ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Đã Ghi Vào Bảng!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-emerald-400" />
                    <span>Ghi Số Liệu Này</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Guidance Callout */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4 text-xs text-slate-300 flex items-start gap-3">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white block">
                Quy trình thao tác thực nghiệm SGK Kết Nối Tri Thức:
              </span>
              <p>
                1. Cố định cổng quang điện A tại vị trí <span className="font-mono text-indigo-300 font-semibold">{simulationState.gateAPosCm} cm</span>. Di chuyển cổng B đến các vị trí khác nhau (<span className="font-mono text-indigo-300">40, 60, 80, 100 cm</span>).
              </p>
              <p>
                2. Nhấn <strong>"Thả Xe"</strong> để xe chuyển động qua 2 cổng. Đồng hồ hiện số sẽ tự động đo thời gian chắn sáng <span className="font-mono text-indigo-300">t_A</span>, <span className="font-mono text-indigo-300">t_B</span> và khoảng thời gian <span className="font-mono text-indigo-300">Δt</span>.
              </p>
              <p>
                3. Bấm <strong>"Ghi Số Liệu Này"</strong> sau mỗi lần đo để lập bảng khảo sát độ biến thiên vận tốc <span className="font-mono text-indigo-300">Δv</span> và tỉ số <span className="font-mono text-indigo-300">Δv / Δt</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Zone: Digital Multi-function Timer & Parameter Controls (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Digital Timer (Đồng hồ đo thời gian hiện số đa năng) */}
          <div className="bg-slate-900 rounded-2xl border-2 border-indigo-900/60 p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  Đồng Hồ Đo Thời Gian Hiện Số
                </span>
              </div>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                CHẾ ĐỘ: A ↔ B
              </span>
            </div>

            {/* LED 7-Segment Style Readout Displays */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {/* Channel tA */}
              <div className="bg-black/80 rounded-lg p-2.5 border border-indigo-900/40">
                <div className="text-[10px] text-slate-400 font-medium flex justify-between">
                  <span>Thời gian qua A (t_A)</span>
                  <span className="text-indigo-400 font-mono">CỔNG A</span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                  {timerReadingA !== null ? `${timerReadingA.toFixed(4)}` : '0.0000'}
                  <span className="text-xs text-slate-400 font-normal ml-1">s</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  v_A = d / t_A ={' '}
                  <span className="font-mono text-emerald-300 font-semibold">
                    {timerReadingA !== null
                      ? (simulationState.flagWidthMm / 1000 / timerReadingA).toFixed(3)
                      : '0.000'}{' '}
                    m/s
                  </span>
                </div>
              </div>

              {/* Channel tB */}
              <div className="bg-black/80 rounded-lg p-2.5 border border-indigo-900/40">
                <div className="text-[10px] text-slate-400 font-medium flex justify-between">
                  <span>Thời gian qua B (t_B)</span>
                  <span className="text-amber-400 font-mono">CỔNG B</span>
                </div>
                <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                  {timerReadingB !== null ? `${timerReadingB.toFixed(4)}` : '0.0000'}
                  <span className="text-xs text-slate-400 font-normal ml-1">s</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  v_B = d / t_B ={' '}
                  <span className="font-mono text-amber-300 font-semibold">
                    {timerReadingB !== null
                      ? (simulationState.flagWidthMm / 1000 / timerReadingB).toFixed(3)
                      : '0.000'}{' '}
                    m/s
                  </span>
                </div>
              </div>
            </div>

            {/* Travel Time Channel Delta T */}
            <div className="bg-black/90 rounded-lg p-3 border border-indigo-700/50 mb-3">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span>Thời gian chuyển động từ A đến B (Δt):</span>
                <span className="text-indigo-400 font-mono font-semibold">Δt = t_B - t_A</span>
              </div>
              <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums mt-1">
                {timerReadingAB !== null ? `${timerReadingAB.toFixed(4)}` : '0.0000'}
                <span className="text-xs text-slate-400 font-normal ml-1">giây (s)</span>
              </div>
            </div>

            {/* Live Acceleration Inference Summary */}
            <div className="bg-indigo-950/40 rounded-lg p-3 border border-indigo-800/50 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Biến thiên vận tốc (Δv):</span>
                <span className="font-mono text-white font-semibold">
                  {timerReadingA && timerReadingB
                    ? `${(
                        simulationState.flagWidthMm / 1000 / timerReadingB -
                        simulationState.flagWidthMm / 1000 / timerReadingA
                      ).toFixed(3)} m/s`
                    : '---'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Gia tốc thực nghiệm (a = Δv/Δt):</span>
                <span className="font-mono text-indigo-300 font-bold">
                  {timerReadingA && timerReadingB && timerReadingAB
                    ? `${(
                        (simulationState.flagWidthMm / 1000 / timerReadingB -
                          simulationState.flagWidthMm / 1000 / timerReadingA) /
                        timerReadingAB
                      ).toFixed(3)} m/s²`
                    : '---'}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-indigo-900/40">
                <span>Gia tốc lí thuyết (g·sinα):</span>
                <span className="font-mono text-slate-300">{a_theory.toFixed(3)} m/s²</span>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Control Panel */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Thiết Lập Thí Nghiệm
              </h3>
            </div>

            {/* Mode selection buttons */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Kịch bản chuyển động:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleModeChange('incline_accel')}
                  className={`px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border transition-colors ${
                    simulationState.mode === 'incline_accel'
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold">1. Nhanh dần đều</span>
                  <span className="text-[10px] text-slate-400">Thả xe xuống dốc</span>
                </button>

                <button
                  onClick={() => handleModeChange('incline_decel')}
                  className={`px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border transition-colors ${
                    simulationState.mode === 'incline_decel'
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold">2. Chậm dần đều</span>
                  <span className="text-[10px] text-slate-400">Đẩy xe lên dốc</span>
                </button>

                <button
                  onClick={() => handleModeChange('horizontal_uniform')}
                  className={`px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border transition-colors ${
                    simulationState.mode === 'horizontal_uniform'
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold">3. Thẳng đều</span>
                  <span className="text-[10px] text-slate-400">Mặt ngang a = 0</span>
                </button>

                <button
                  onClick={() => handleModeChange('horizontal_brake')}
                  className={`px-2.5 py-1.5 text-xs text-left font-medium rounded-lg border transition-colors ${
                    simulationState.mode === 'horizontal_brake'
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold">4. Hãm phanh</span>
                  <span className="text-[10px] text-slate-400">Có lực cản dừng</span>
                </button>
              </div>
            </div>

            {/* Slider: Track Angle alpha */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Góc nghiêng của máng (α):</span>
                <span className="font-mono text-indigo-400 font-semibold">
                  {simulationState.angleDeg}°
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={simulationState.angleDeg}
                disabled={
                  simulationState.mode === 'horizontal_uniform' ||
                  simulationState.mode === 'horizontal_brake'
                }
                onChange={(e) => {
                  setSimulationState((prev) => ({
                    ...prev,
                    angleDeg: Number(e.target.value),
                  }));
                  handleReset();
                }}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1° (Dốc thoai thoải)</span>
                <span>25° (Dốc cao)</span>
              </div>
            </div>

            {/* Slider: Position of Gate A */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Vị trí Cổng quang A (x_A):</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {simulationState.gateAPosCm} cm
                </span>
              </div>
              <input
                type="range"
                min="10"
                max={Math.min(50, simulationState.gateBPosCm - 10)}
                step="5"
                value={simulationState.gateAPosCm}
                onChange={(e) => {
                  setSimulationState((prev) => ({
                    ...prev,
                    gateAPosCm: Number(e.target.value),
                  }));
                  handleReset();
                }}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider: Position of Gate B */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Vị trí Cổng quang B (x_B):</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {simulationState.gateBPosCm} cm
                </span>
              </div>
              <input
                type="range"
                min={simulationState.gateAPosCm + 10}
                max="110"
                step="5"
                value={simulationState.gateBPosCm}
                onChange={(e) => {
                  setSimulationState((prev) => ({
                    ...prev,
                    gateBPosCm: Number(e.target.value),
                  }));
                  handleReset();
                }}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-slate-400">
                Khoảng cách đo: <span className="font-mono text-white font-medium">s_AB = {simulationState.gateBPosCm - simulationState.gateAPosCm} cm</span>
              </div>
            </div>

            {/* Toggle: Experimental Noise */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 font-medium block">
                  Sai số thực nghiệm
                </span>
                <span className="text-[10px] text-slate-400">
                  Mô phỏng rung lắc & sai số đo thực tế (±0.4%)
                </span>
              </div>
              <input
                type="checkbox"
                checked={simulationState.hasExperimentalNoise}
                onChange={(e) =>
                  setSimulationState((prev) => ({
                    ...prev,
                    hasExperimentalNoise: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
