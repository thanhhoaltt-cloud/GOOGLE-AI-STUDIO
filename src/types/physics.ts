export type ExperimentMode = 
  | 'incline_accel'      // Thả trượt trên máng nghiêng (nhanh dần đều)
  | 'incline_decel'      // Đẩy xe lên dốc (chậm dần đều)
  | 'horizontal_uniform'  // Chuyển động thẳng đều trên máng ngang
  | 'horizontal_brake';  // Chuyển động có lực cản hãm phanh

export interface TrialData {
  id: string;
  trialNumber: number;
  modeName: string;
  angleDeg: number;
  xA: number;           // Vị trí cổng A (cm)
  xB: number;           // Vị trí cổng B (cm)
  distance: number;     // s_AB = xB - xA (cm)
  flagWidthMm: number;  // Độ rộng cờ chắn sáng d (mm)
  tA: number;           // Thời gian chắn sáng tại A (s)
  tB: number;           // Thời gian chắn sáng tại B (s)
  vA: number;           // Vận tốc tức thời tại A (m/s)
  vB: number;           // Vận tốc tức thời tại B (m/s)
  deltaT: number;       // Thời gian chuyển động từ A đến B (s)
  deltaV: number;       // Biến thiên vận tốc vB - vA (m/s)
  accelExp: number;     // Gia tốc thực nghiệm a = deltaV / deltaT (m/s^2)
  accelTheory: number;  // Gia tốc lý thuyết (m/s^2)
  timestamp: string;
}

export interface SimulationState {
  mode: ExperimentMode;
  angleDeg: number;         // Góc nghiêng máng (độ)
  flagWidthMm: number;      // Bề rộng tấm chắn sáng (mm), mặc định 20mm (0.02m)
  gateAPosCm: number;       // Vị trí cổng A (cm), ví dụ 20cm
  gateBPosCm: number;       // Vị trí cổng B (cm), ví dụ 80cm
  cartInitialPosCm: number; // Vị trí ban đầu của xe (cm), mặc định 0cm
  cartMassKg: number;       // Khối lượng xe (kg)
  initialVelocityMps: number;// Vận tốc đầu v0 (m/s)
  frictionCoeff: number;    // Hệ số ma sát mu
  hasExperimentalNoise: boolean; // Thêm sai số đo thực nghiệm nhỏ ngẫu nhiên
  showVectors: boolean;     // Hiển thị mũi tên vận tốc và gia tốc
  showTrajectoryTrail: boolean; // Vệt quỹ đạo
  playbackSpeed: number;    // Tốc độ mô phỏng (0.25x, 0.5x, 1x)
}
