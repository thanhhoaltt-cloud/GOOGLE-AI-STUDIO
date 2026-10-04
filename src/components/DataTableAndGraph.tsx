import React, { useState } from 'react';
import { 
  Table, 
  Trash2, 
  Download, 
  Sparkles, 
  LineChart, 
  ArrowRight, 
  Calculator,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { TrialData } from '../types/physics';
import { generateStandardTextbookDataset } from '../utils/physicsEngine';

interface DataTableAndGraphProps {
  trials: TrialData[];
  onSetTrials: (trials: TrialData[]) => void;
  onClearTrials: () => void;
  onNavigateToReasoning: () => void;
}

export const DataTableAndGraph: React.FC<DataTableAndGraphProps> = ({
  trials,
  onSetTrials,
  onClearTrials,
  onNavigateToReasoning,
}) => {
  const [selectedGraphType, setSelectedGraphType] = useState<'v_t' | 'a_t'>('v_t');

  // Compute average experimental acceleration
  const validAccels = trials.filter((t) => !isNaN(t.accelExp) && isFinite(t.accelExp));
  const avgAccel =
    validAccels.length > 0
      ? validAccels.reduce((sum, t) => sum + t.accelExp, 0) / validAccels.length
      : 0;

  // Handle loading textbook standard dataset
  const handleLoadTextbookData = () => {
    const textbookData = generateStandardTextbookDataset(8);
    onSetTrials(textbookData);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (trials.length === 0) return;
    const headers = [
      'Lần đo',
      'Chế độ',
      'Góc nghiêng (°)',
      'x_A (cm)',
      'x_B (cm)',
      's_AB (cm)',
      't_A (s)',
      'v_A (m/s)',
      't_B (s)',
      'v_B (m/s)',
      'Delta t (s)',
      'Delta v (m/s)',
      'a_thực nghiệm (m/s^2)',
      'a_lí thuyết (m/s^2)',
    ];
    const rows = trials.map((t) => [
      t.trialNumber,
      `"${t.modeName}"`,
      t.angleDeg,
      t.xA,
      t.xB,
      t.distance,
      t.tA,
      t.vA,
      t.tB,
      t.vB,
      t.deltaT,
      t.deltaV,
      t.accelExp,
      t.accelTheory,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'bang_so_lieu_gia_toc_vatli10.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Bar */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Table className="w-3.5 h-3.5" />
            <span>Thu Thập & Xử Lý Số Liệu Thực Nghiệm</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Bảng Kết Quả Đo & Đồ Thị Vận Tốc – Thời Gian (v – t)
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Dữ liệu ghi nhận từ 2 cổng quang điện A và B khi thay đổi quãng đường chuyển động.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoadTextbookData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 rounded-lg transition-colors"
            title="Nạp 4 lần đo mẫu chuẩn trong SGK Kết Nối Tri Thức"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nạp Bộ Số Liệu Mẫu SGK</span>
          </button>

          {trials.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="Tải bảng số liệu dạng file CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xuất CSV</span>
              </button>
              <button
                onClick={onClearTrials}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 bg-rose-950/30 hover:bg-rose-900/40 rounded-lg border border-rose-800/50 transition-colors"
                title="Xóa tất cả các lần đo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Bảng</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bảng Số Liệu Khảo Sát Tỉ Số (Δv / Δt)
            </h3>
            <span className="text-xs text-slate-400 font-normal">
              (Bề rộng cờ chắn sáng d = 20 mm = 0,02 m)
            </span>
          </div>

          {trials.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-800/50">
              <Calculator className="w-3.5 h-3.5" />
              <span>Gia tốc trung bình: ā = {avgAccel.toFixed(3)} m/s²</span>
            </div>
          )}
        </div>

        {trials.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Table className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-medium text-white">Chưa có số liệu thực nghiệm</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Hãy quay lại tab <strong>"Phòng Thí Nghiệm"</strong> và bấm <strong>"Ghi Số Liệu Này"</strong> sau khi xe chạy qua 2 cổng quang, hoặc bấm nút dưới đây để nạp nhanh bộ 4 lần đo mẫu chuẩn SGK.
            </p>
            <button
              onClick={handleLoadTextbookData}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nạp Bộ Số Liệu Mẫu SGK Ngay</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3 text-center">Lần đo</th>
                  <th className="px-3 py-3">Vị trí A (cm)</th>
                  <th className="px-3 py-3">Vị trí B (cm)</th>
                  <th className="px-3 py-3">s = xB - xA (cm)</th>
                  <th className="px-3 py-3 bg-emerald-950/20 text-emerald-300">t_A (s)</th>
                  <th className="px-3 py-3 bg-emerald-950/20 text-emerald-300">v_A = d/t_A (m/s)</th>
                  <th className="px-3 py-3 bg-amber-950/20 text-amber-300">t_B (s)</th>
                  <th className="px-3 py-3 bg-amber-950/20 text-amber-300">v_B = d/t_B (m/s)</th>
                  <th className="px-3 py-3 bg-cyan-950/20 text-cyan-300">Δt (s)</th>
                  <th className="px-3 py-3 font-semibold text-white">Δv = v_B - v_A (m/s)</th>
                  <th className="px-4 py-3 bg-indigo-950/40 text-indigo-300 font-bold text-right">
                    a = Δv / Δt (m/s²)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono tabular-nums text-slate-200">
                {trials.map((trial, idx) => (
                  <tr key={trial.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3.5 py-2.5 text-center font-sans font-medium text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{trial.xA}</td>
                    <td className="px-3 py-2.5 text-slate-300">{trial.xB}</td>
                    <td className="px-3 py-2.5 font-medium text-indigo-300">{trial.distance}</td>
                    <td className="px-3 py-2.5 bg-emerald-950/10 text-emerald-400">{trial.tA.toFixed(4)}</td>
                    <td className="px-3 py-2.5 bg-emerald-950/10 text-emerald-300 font-semibold">{trial.vA.toFixed(3)}</td>
                    <td className="px-3 py-2.5 bg-amber-950/10 text-amber-400">{trial.tB.toFixed(4)}</td>
                    <td className="px-3 py-2.5 bg-amber-950/10 text-amber-300 font-semibold">{trial.vB.toFixed(3)}</td>
                    <td className="px-3 py-2.5 bg-cyan-950/10 text-cyan-300 font-semibold">{trial.deltaT.toFixed(4)}</td>
                    <td className="px-3 py-2.5 font-semibold text-white">
                      {trial.deltaV > 0 ? `+${trial.deltaV.toFixed(3)}` : trial.deltaV.toFixed(3)}
                    </td>
                    <td className="px-4 py-2.5 bg-indigo-950/30 text-indigo-300 font-bold text-right text-sm">
                      {trial.accelExp.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {trials.length > 1 && (
                <tfoot className="bg-slate-950/90 font-mono border-t-2 border-indigo-900/60 font-semibold">
                  <tr>
                    <td colSpan={10} className="px-4 py-3 text-right font-sans text-xs text-slate-300">
                      Giá trị trung bình gia tốc (ā):
                    </td>
                    <td className="px-4 py-3 text-right text-indigo-300 font-bold text-sm bg-indigo-950/40">
                      {avgAccel.toFixed(3)} m/s²
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* Observation Deduction Box */}
        {trials.length > 0 && (
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nhận xét rút ra từ thực nghiệm:</span>
              </span>
              <p>
                Khi thay đổi vị trí cổng B dọc theo máng nghiêng (quãng đường s tăng dần từ 20 cm lên 80 cm), vận tốc <span className="font-mono text-amber-300">v_B</span> và thời gian <span className="font-mono text-cyan-300">Δt</span> đều tăng theo, nhưng tỉ số <span className="font-mono text-indigo-300 font-bold">Δv / Δt ≈ {avgAccel.toFixed(3)} m/s²</span> luôn xấp xỉ không đổi (hằng số)!
              </p>
            </div>

            <button
              onClick={onNavigateToReasoning}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Xem Lập Luận Sư Phạm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Graphical Representation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph Display Area (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Đồ Thị Động Thực Nghiệm
              </h3>
            </div>

            {/* Switch graph type */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setSelectedGraphType('v_t')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedGraphType === 'v_t'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Đồ Thị Vận Tốc v(t)
              </button>
              <button
                onClick={() => setSelectedGraphType('a_t')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedGraphType === 'a_t'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Đồ Thị Gia Tốc a(t)
              </button>
            </div>
          </div>

          {/* SVG Graph Canvas */}
          <div className="w-full aspect-[16/9] min-h-[300px] relative select-none bg-slate-950 rounded-xl p-2 border border-slate-850">
            <svg viewBox="0 0 640 360" className="w-full h-full">
              <defs>
                <pattern id="graphGrid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect x="60" y="30" width="540" height="270" fill="url(#graphGrid)" />

              {/* Coordinate Axes */}
              {/* Vertical Axis */}
              <line x1="60" y1="30" x2="60" y2="300" stroke="#94a3b8" strokeWidth="2" />
              {/* Horizontal Axis */}
              <line x1="60" y1="300" x2="600" y2="300" stroke="#94a3b8" strokeWidth="2" />

              {/* Axis Arrowheads */}
              <polygon points="60,25 56,35 64,35" fill="#94a3b8" />
              <polygon points="605,300 595,296 595,304" fill="#94a3b8" />

              {/* Axis Titles */}
              <text x="60" y="18" fill="#e2e8f0" fontSize="11" fontWeight="700" textAnchor="middle">
                {selectedGraphType === 'v_t' ? 'v (m/s)' : 'a (m/s²)'}
              </text>
              <text x="590" y="325" fill="#e2e8f0" fontSize="11" fontWeight="700" textAnchor="middle">
                t (s)
              </text>
              <text x="50" y="315" fill="#94a3b8" fontSize="10" className="font-mono">
                0
              </text>

              {/* Grid Ticks & Values */}
              {/* Horizontal time ticks: 0.5s, 1.0s, 1.5s, 2.0s, 2.5s */}
              {[0.5, 1.0, 1.5, 2.0, 2.5].map((tVal, idx) => {
                const tickX = 60 + ((idx + 1) * 540) / 6;
                return (
                  <g key={tVal}>
                    <line x1={tickX} y1="300" x2={tickX} y2="305" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x={tickX} y="320" fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-mono">
                      {tVal}
                    </text>
                  </g>
                );
              })}

              {selectedGraphType === 'v_t' ? (
                // Graph v(t)
                <>
                  {/* Vertical velocity ticks */}
                  {[0.5, 1.0, 1.5, 2.0].map((vVal, idx) => {
                    const tickY = 300 - ((idx + 1) * 270) / 5;
                    return (
                      <g key={vVal}>
                        <line x1="55" y1={tickY} x2="60" y2={tickY} stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="45" y={tickY + 3} fill="#94a3b8" fontSize="10" textAnchor="end" className="font-mono">
                          {vVal.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Linear v(t) Theoretical Trend Line: v = v0 + a * t */}
                  {/* For standard incline: v0 ~ 0, a ~ avgAccel */}
                  {avgAccel > 0 ? (
                    <g>
                      <line
                        x1="60"
                        y1="300"
                        x2="520"
                        y2={300 - (avgAccel * 2.2 * 270) / 2.5}
                        stroke="#6366f1"
                        strokeWidth="3"
                      />

                      {/* Slope Triangle Annotation */}
                      <g opacity="0.9">
                        {/* Triangle vertices at t = 0.8s and t = 1.8s */}
                        <polygon
                          points={`
                            ${60 + (0.8 / 2.5) * 450},${300 - (avgAccel * 0.8 * 270) / 2.5} 
                            ${60 + (1.8 / 2.5) * 450},${300 - (avgAccel * 0.8 * 270) / 2.5} 
                            ${60 + (1.8 / 2.5) * 450},${300 - (avgAccel * 1.8 * 270) / 2.5}
                          `}
                          fill="rgba(99, 102, 241, 0.15)"
                          stroke="#818cf8"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                        {/* Horizontal side label: Delta t */}
                        <text
                          x={60 + (1.3 / 2.5) * 450}
                          y={300 - (avgAccel * 0.8 * 270) / 2.5 + 14}
                          fill="#818cf8"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          className="font-mono"
                        >
                          Δt
                        </text>
                        {/* Vertical side label: Delta v */}
                        <text
                          x={60 + (1.8 / 2.5) * 450 + 18}
                          y={300 - (avgAccel * 1.3 * 270) / 2.5}
                          fill="#818cf8"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="start"
                          className="font-mono"
                        >
                          Δv
                        </text>
                      </g>

                      {/* Slope formula label */}
                      <g transform="translate(180, 70)">
                        <rect x="0" y="0" width="180" height="34" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2" />
                        <text x="90" y="22" fill="#c7d2fe" fontSize="12" fontWeight="700" textAnchor="middle" className="font-mono">
                          Hệ số góc k = Δv/Δt = a
                        </text>
                      </g>
                    </g>
                  ) : (
                    // Flat line when a = 0
                    <line x1="60" y1="180" x2="560" y2="180" stroke="#6366f1" strokeWidth="3" />
                  )}

                  {/* Render Data Points from trials */}
                  {trials.map((t, i) => {
                    const ptX = 60 + Math.min(500, (t.deltaT / 2.5) * 450);
                    const ptY = Math.max(40, 300 - ((t.vB) / 2.5) * 270);
                    return (
                      <g key={t.id}>
                        <circle cx={ptX} cy={ptY} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={ptX} y={ptY - 8} fill="#fbbf24" fontSize="9" fontWeight="600" textAnchor="middle" className="font-mono">
                          #{i + 1}
                        </text>
                      </g>
                    );
                  })}
                </>
              ) : (
                // Graph a(t): Horizontal Line
                <>
                  {/* Vertical accel ticks */}
                  {[0.5, 1.0, 1.5, 2.0].map((aVal, idx) => {
                    const tickY = 300 - ((idx + 1) * 270) / 5;
                    return (
                      <g key={aVal}>
                        <line x1="55" y1={tickY} x2="60" y2={tickY} stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="45" y={tickY + 3} fill="#94a3b8" fontSize="10" textAnchor="end" className="font-mono">
                          {aVal.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Horizontal line a = const */}
                  {avgAccel > 0 && (
                    <g>
                      <line
                        x1="60"
                        y1={300 - (avgAccel * 270) / 2.5}
                        x2="560"
                        y2={300 - (avgAccel * 270) / 2.5}
                        stroke="#10b981"
                        strokeWidth="3.5"
                      />
                      <g transform={`translate(260, ${Math.max(40, 300 - (avgAccel * 270) / 2.5 - 28)})`}>
                        <rect x="0" y="0" width="160" height="24" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                        <text x="80" y="16" fill="#a7f3d0" fontSize="11" fontWeight="700" textAnchor="middle" className="font-mono">
                          a = hằng số = {avgAccel.toFixed(3)} m/s²
                        </text>
                      </g>
                    </g>
                  )}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Right Explanatory & Deduction Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Ý Nghĩa Hình Học Của Đồ Thị
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/40 space-y-1">
                <span className="font-semibold text-indigo-300 block">
                  1. Độ dốc (Hệ số góc) của đồ thị (v – t):
                </span>
                <p>
                  Đồ thị vận tốc theo thời gian trong chuyển động biến đổi đều là một <strong>đường thẳng</strong>.
                </p>
                <div className="font-mono text-center text-xs text-white bg-slate-950/80 py-1.5 rounded my-1 border border-indigo-900/60">
                  tan α = Δv / Δt = a
                </div>
                <p className="text-[11px] text-slate-400">
                  Độ dốc của đường thẳng chính là độ lớn của gia tốc <span className="font-mono text-indigo-300">a</span>. Đường càng dốc thì gia tốc càng lớn, vận tốc biến đổi càng nhanh.
                </p>
              </div>

              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40 space-y-1">
                <span className="font-semibold text-emerald-300 block">
                  2. Đồ thị gia tốc – thời gian (a – t):
                </span>
                <p>
                  Trong chuyển động thẳng biến đổi đều, gia tốc không đổi theo thời gian (<span className="font-mono text-emerald-400">a = const</span>).
                </p>
                <p className="text-[11px] text-slate-400">
                  Do đó, đồ thị (a – t) là một đường thẳng song song với trục thời gian Ot.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={onNavigateToReasoning}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Chuyển Sang Phiếu Lập Luận Sư Phạm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
