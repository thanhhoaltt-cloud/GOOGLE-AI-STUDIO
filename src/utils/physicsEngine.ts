import { ExperimentMode, SimulationState, TrialData } from '../types/physics';

export const GRAVITY_G = 9.8; // m/s^2

/**
 * Tính toán gia tốc lí thuyết dựa theo chế độ và tham số vật lý
 */
export function calculateTheoreticalAcceleration(
  mode: ExperimentMode,
  angleDeg: number,
  frictionCoeff: number
): number {
  const angleRad = (angleDeg * Math.PI) / 180;

  switch (mode) {
    case 'incline_accel': {
      // Xe trượt xuống dốc: a = g * (sin(alpha) - mu * cos(alpha))
      const a = GRAVITY_G * (Math.sin(angleRad) - frictionCoeff * Math.cos(angleRad));
      return Math.max(0.1, Number(a.toFixed(3)));
    }
    case 'incline_decel': {
      // Xe chạy ngược lên dốc chậm dần: a = -g * (sin(alpha) + mu * cos(alpha))
      const a = -GRAVITY_G * (Math.sin(angleRad) + frictionCoeff * Math.cos(angleRad));
      return Number(a.toFixed(3));
    }
    case 'horizontal_uniform': {
      // Chuyển động thẳng đều: a = 0
      return 0;
    }
    case 'horizontal_brake': {
      // Xe hãm phanh trên đường thẳng: a = -mu * g
      const effectiveMu = Math.max(0.08, frictionCoeff * 5);
      const a = -effectiveMu * GRAVITY_G;
      return Number(a.toFixed(3));
    }
    default:
      return 1.0;
  }
}

/**
 * Tính toán dữ liệu đo thực nghiệm tại 2 cổng quang điện A và B
 */
export function computeGateMeasurements(
  sim: SimulationState,
  trialCount: number
): TrialData {
  const xA_m = sim.gateAPosCm / 100;
  const xB_m = sim.gateBPosCm / 100;
  const flag_m = sim.flagWidthMm / 1000;
  const a_theory = calculateTheoreticalAcceleration(sim.mode, sim.angleDeg, sim.frictionCoeff);
  
  let v0 = sim.initialVelocityMps;
  if (sim.mode === 'incline_accel') {
    v0 = 0;
  } else if (sim.mode === 'incline_decel' && v0 <= 0.2) {
    v0 = 1.8;
  } else if (sim.mode === 'horizontal_brake' && v0 <= 0.2) {
    v0 = 1.5;
  } else if (sim.mode === 'horizontal_uniform' && v0 <= 0.1) {
    v0 = 1.0;
  }

  const sA = Math.max(0, xA_m - sim.cartInitialPosCm / 100);
  const sB = Math.max(0, xB_m - sim.cartInitialPosCm / 100);

  // Vận tốc lí thuyết tại A và B: v^2 = v0^2 + 2*a*s
  const vA_squared = Math.max(0.001, v0 * v0 + 2 * a_theory * sA);
  const vB_squared = Math.max(0.001, v0 * v0 + 2 * a_theory * sB);
  
  let vA_calc = Math.sqrt(vA_squared);
  let vB_calc = Math.sqrt(vB_squared);

  // Thời gian di chuyển giữa 2 cổng quang
  let deltaT_calc = 0;
  if (Math.abs(a_theory) < 0.001) {
    // Chuyển động đều
    deltaT_calc = (xB_m - xA_m) / vA_calc;
  } else {
    deltaT_calc = (vB_calc - vA_calc) / a_theory;
  }
  deltaT_calc = Math.max(0.01, Math.abs(deltaT_calc));

  // Thời gian chắn sáng tại A và B: t = d / v
  let tA_calc = flag_m / vA_calc;
  let tB_calc = flag_m / vB_calc;

  // Nếu bật tính năng sai số ngẫu nhiên thực nghiệm
  if (sim.hasExperimentalNoise) {
    const jitterA = (Math.random() - 0.5) * 0.008; // ±0.4%
    const jitterB = (Math.random() - 0.5) * 0.008;
    const jitterT = (Math.random() - 0.5) * 0.006;

    tA_calc *= (1 + jitterA);
    tB_calc *= (1 + jitterB);
    deltaT_calc *= (1 + jitterT);

    vA_calc = flag_m / tA_calc;
    vB_calc = flag_m / tB_calc;
  }

  const deltaV = vB_calc - vA_calc;
  const accelExp = deltaV / deltaT_calc;

  const modeNames: Record<ExperimentMode, string> = {
    incline_accel: 'Thả dốc nhanh dần đều',
    incline_decel: 'Đẩy lên dốc chậm dần đều',
    horizontal_uniform: 'Thẳng đều (máng ngang)',
    horizontal_brake: 'Hãm phanh (đường thẳng)',
  };

  return {
    id: `trial-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    trialNumber: trialCount + 1,
    modeName: modeNames[sim.mode],
    angleDeg: sim.angleDeg,
    xA: sim.gateAPosCm,
    xB: sim.gateBPosCm,
    distance: Number((sim.gateBPosCm - sim.gateAPosCm).toFixed(1)),
    flagWidthMm: sim.flagWidthMm,
    tA: Number(tA_calc.toFixed(4)),
    tB: Number(tB_calc.toFixed(4)),
    vA: Number(vA_calc.toFixed(3)),
    vB: Number(vB_calc.toFixed(3)),
    deltaT: Number(deltaT_calc.toFixed(4)),
    deltaV: Number(deltaV.toFixed(3)),
    accelExp: Number(accelExp.toFixed(3)),
    accelTheory: a_theory,
    timestamp: new Date().toLocaleTimeString('vi-VN'),
  };
}

/**
 * Sinh bộ 4 số liệu mẫu chuẩn SGK Kết Nối Tri Thức với cổng B ở các vị trí tăng dần
 */
export function generateStandardTextbookDataset(angleDeg: number = 8): TrialData[] {
  const xA = 20; // Cố định cổng A tại 20cm
  const xB_positions = [40, 60, 80, 100]; // Dịch cổng B lần lượt 40, 60, 80, 100cm
  const flagWidthMm = 20; // 20mm = 0.02m
  const flag_m = 0.02;
  const angleRad = (angleDeg * Math.PI) / 180;
  const a_theory = Number((GRAVITY_G * (Math.sin(angleRad) - 0.01 * Math.cos(angleRad))).toFixed(3)); // ~ 1.26 m/s^2

  return xB_positions.map((xB, index) => {
    const sA = (xA - 0) / 100;
    const sB = (xB - 0) / 100;

    const vA_calc = Math.sqrt(2 * a_theory * sA);
    const vB_calc = Math.sqrt(2 * a_theory * sB);

    const deltaT_calc = (vB_calc - vA_calc) / a_theory;
    const tA_calc = flag_m / vA_calc;
    const tB_calc = flag_m / vB_calc;

    // Sai số thực tế rất nhỏ của cổng quang SGK: ±0.2%
    const noise = (index % 2 === 0 ? 0.002 : -0.002) * (index + 1);
    const finalT_A = tA_calc * (1 + noise * 0.5);
    const finalT_B = tB_calc * (1 - noise * 0.5);
    const finalDeltaT = deltaT_calc * (1 + noise * 0.3);

    const final_vA = flag_m / finalT_A;
    const final_vB = flag_m / finalT_B;
    const final_deltaV = final_vB - final_vA;
    const accelExp = final_deltaV / finalDeltaT;

    return {
      id: `preset-${index + 1}`,
      trialNumber: index + 1,
      modeName: 'Thả dốc nhanh dần đều',
      angleDeg,
      xA,
      xB,
      distance: xB - xA,
      flagWidthMm,
      tA: Number(finalT_A.toFixed(4)),
      tB: Number(finalT_B.toFixed(4)),
      vA: Number(final_vA.toFixed(3)),
      vB: Number(final_vB.toFixed(3)),
      deltaT: Number(finalDeltaT.toFixed(4)),
      deltaV: Number(final_deltaV.toFixed(3)),
      accelExp: Number(accelExp.toFixed(3)),
      accelTheory: a_theory,
      timestamp: `Mẫu chuẩn ${index + 1}`,
    };
  });
}
