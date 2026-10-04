import React, { useState } from 'react';
import { 
  BookOpen, 
  Compass, 
  Layers, 
  Gauge, 
  ArrowRight, 
  Check, 
  HelpCircle,
  Zap,
  ShieldAlert,
  Rocket
} from 'lucide-react';

interface CoreKnowledgeProps {
  onNavigateToQuiz: () => void;
  onNavigateToLab: () => void;
}

export const CoreKnowledge: React.FC<CoreKnowledgeProps> = ({
  onNavigateToQuiz,
  onNavigateToLab,
}) => {
  const [selectedExampleAccel, setSelectedExampleAccel] = useState<number>(3); // 3 m/s^2

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kiến Thức Trọng Tâm · Vật Lí 10</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Ý Nghĩa, Đơn Vị & Đặc Điểm Véc-tơ Của Gia Tốc
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Tổng hợp chuẩn xác theo chương trình SGK Kết Nối Tri Thức với Cuộc Sống.
          </p>
        </div>

        <button
          onClick={onNavigateToQuiz}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap self-start sm:self-auto"
        >
          <span>Làm Bài Tập Luyện Tập</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid: Meaning & Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Ý NGHĨA CỦA GIA TỐC */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center border border-indigo-700/50">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Ý Nghĩa Vật Lí Của Gia Tốc
              </h3>
              <span className="text-[11px] text-slate-400">Khái niệm cốt lõi</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/50 space-y-1.5">
              <p className="font-semibold text-white text-sm">
                Định nghĩa:
              </p>
              <p className="text-slate-200 leading-relaxed">
                Gia tốc là đại lượng vật lí đặc trưng cho <strong>độ biến thiên nhanh hay chậm của vận tốc theo thời gian</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <div>
                  <span className="font-semibold text-white">Nếu gia tốc có độ lớn lớn:</span>
                  <p className="text-slate-400 mt-0.5">
                    Vận tốc biến đổi rất nhanh trong thời gian ngắn (ví dụ: máy bay tiêm kích cất cánh, phanh gấp xe khi khẩn cấp).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <div>
                  <span className="font-semibold text-white">Nếu gia tốc có độ lớn nhỏ:</span>
                  <p className="text-slate-400 mt-0.5">
                    Vận tốc biến đổi từ từ, chậm rãi (ví dụ: tàu thủy chở hàng hàng vạn tấn rời cảng).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <div>
                  <span className="font-semibold text-white">Nếu gia tốc bằng 0 (a = 0):</span>
                  <p className="text-slate-400 mt-0.5">
                    Vận tốc không thay đổi theo thời gian ⇒ Vật thực hiện <strong>chuyển động thẳng đều</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: ĐƠN VỊ CỦA GIA TỐC */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-300 flex items-center justify-center border border-emerald-700/50">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Đơn Vị Của Gia Tốc Trong Hệ SI
              </h3>
              <span className="text-[11px] text-slate-400">Bản chất toán học và thực tế</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/50 space-y-1.5">
              <p className="font-semibold text-white text-sm">
                Kí hiệu đơn vị: <span className="font-mono text-emerald-300 font-bold">m/s²</span> (hoặc <span className="font-mono text-emerald-300">m·s⁻²</span>)
              </p>
              <p className="text-slate-200">
                Đọc là: <em>"Mét trên giây bình phương"</em>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-white block">
                Nguồn gốc của đơn vị m/s²:
              </span>
              <div className="font-mono text-center text-xs text-slate-200 bg-slate-900 py-2 rounded-lg border border-slate-700">
                Đơn vị của a = (Đơn vị của v) / (Đơn vị của t) = (m/s) / s = m / s²
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong>Ý nghĩa trực quan:</strong> <span className="font-mono text-emerald-300">(m/s)/s</span> cho biết trong <strong>mỗi 1 giây</strong> trôi qua, vận tốc của chuyển động thay đổi thêm bao nhiêu <strong>mét trên giây (m/s)</strong>.
              </p>
            </div>

            {/* Interactive intuitive timeline explorer */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Thử nghiệm ý nghĩa số:</span>
                <span className="font-mono text-indigo-400 font-bold">
                  a = {selectedExampleAccel} m/s²
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={selectedExampleAccel}
                onChange={(e) => setSelectedExampleAccel(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[10px] pt-1">
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-500">t = 0s</div>
                  <div className="text-white font-bold">0 m/s</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-500">t = 1s</div>
                  <div className="text-emerald-400 font-bold">+{selectedExampleAccel} m/s</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-500">t = 2s</div>
                  <div className="text-emerald-400 font-bold">+{selectedExampleAccel * 2} m/s</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-500">t = 3s</div>
                  <div className="text-emerald-400 font-bold">+{selectedExampleAccel * 3} m/s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive: Véc-tơ gia tốc & Dấu của gia tốc */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center border border-indigo-700/50">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              3. Tính Chất Véc-tơ & Dấu Của Gia Tốc Trong Chuyển Động Thẳng
            </h3>
            <span className="text-[11px] text-slate-400">
              Quy tắc xác định hướng của véc-tơ gia tốc a⃗
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-3">
          <p>
            Vì vận tốc là đại lượng véc-tơ nên gia tốc cũng là một <strong>đại lượng véc-tơ</strong>:
          </p>
          <div className="font-mono text-center text-sm font-bold text-indigo-300 bg-slate-950 py-2 rounded-xl border border-indigo-900/50">
            a⃗ = Δv⃗ / Δt = (v⃗_t - v⃗_0) / Δt
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Case: Nhanh dần đều */}
            <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">
                  A. Chuyển động thẳng nhanh dần đều
                </span>
                <span className="font-mono text-[11px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                  a · v {'>'} 0
                </span>
              </div>
              <p className="text-slate-300">
                - Vận tốc tăng dần theo thời gian.
              </p>
              <p className="text-slate-300">
                - Véc-tơ gia tốc <strong className="text-emerald-300">a⃗ cùng chiều</strong> với véc-tơ vận tốc <strong className="text-emerald-300">v⃗</strong>.
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-center gap-4 text-emerald-400 font-mono font-bold">
                <span>v⃗ ─────────►</span>
                <span>a⃗ ──────►</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nếu chọn chiều dương là chiều chuyển động (v {'>'} 0) thì <strong>a {'>'} 0</strong>.
              </p>
            </div>

            {/* Case: Chậm dần đều */}
            <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">
                  B. Chuyển động thẳng chậm dần đều
                </span>
                <span className="font-mono text-[11px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  a · v {'<'} 0
                </span>
              </div>
              <p className="text-slate-300">
                - Vận tốc giảm dần theo thời gian.
              </p>
              <p className="text-slate-300">
                - Véc-tơ gia tốc <strong className="text-amber-300">a⃗ ngược chiều</strong> với véc-tơ vận tốc <strong className="text-amber-300">v⃗</strong>.
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg flex items-center justify-center gap-4 text-amber-400 font-mono font-bold">
                <span>v⃗ ─────────►</span>
                <span>◄────── a⃗</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nếu chọn chiều dương là chiều chuyển động (v {'>'} 0) thì <strong>a {'<'} 0</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-world Scale Table: Các Giá Trị Gia Tốc Trong Đời Sống */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-900/60 text-cyan-300 flex items-center justify-center border border-cyan-700/50">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              4. Bảng So Sánh Gia Tốc Trong Thực Tế Cuộc Sống
            </h3>
            <span className="text-[11px] text-slate-400">
              Liên hệ thực tiễn sinh động theo định hướng SGK mới
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Đối tượng / Hiện tượng</th>
                <th className="px-4 py-2.5 font-mono">Gia tốc điển hình (m/s²)</th>
                <th className="px-4 py-2.5">Đặc điểm ý nghĩa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-2.5 font-sans font-medium text-white">🚶 Người đi bộ bình thường</td>
                <td className="px-4 py-2.5 text-cyan-400 font-bold">0,3 - 0,5 m/s²</td>
                <td className="px-4 py-2.5 font-sans text-slate-400">Tăng tốc êm dịu, không gây cảm giác giật</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-2.5 font-sans font-medium text-white">🚗 Xe ô tô gia đình tăng tốc</td>
                <td className="px-4 py-2.5 text-cyan-400 font-bold">2,0 - 3,5 m/s²</td>
                <td className="px-4 py-2.5 font-sans text-slate-400">Cảm giác dính nhẹ lưng vào ghế ngồi</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-2.5 font-sans font-medium text-white">🛑 Xe ô tô phanh khẩn cấp</td>
                <td className="px-4 py-2.5 text-amber-400 font-bold">-5,0 đến -7,0 m/s²</td>
                <td className="px-4 py-2.5 font-sans text-slate-400">Dây an toàn giữ người lại để tránh va đập</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-2.5 font-sans font-medium text-white">🌍 Vật rơi tự do gần mặt đất (g)</td>
                <td className="px-4 py-2.5 text-emerald-400 font-bold">≈ 9,8 m/s²</td>
                <td className="px-4 py-2.5 font-sans text-slate-400">Mỗi giây rơi xuống vận tốc tăng thêm 9,8 m/s</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-2.5 font-sans font-medium text-white">🏎️ Xe đua Công thức 1 (F1)</td>
                <td className="px-4 py-2.5 text-indigo-400 font-bold">15 - 20 m/s²</td>
                <td className="px-4 py-2.5 font-sans text-slate-400">Tăng tốc từ 0 lên 100 km/h dưới 2,2 giây</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-2.5 font-sans font-medium text-white">🚀 Tàu vũ trụ rời bệ phóng</td>
                <td className="px-4 py-2.5 text-rose-400 font-bold">30 - 40 m/s² (3-4g)</td>
                <td className="px-4 py-2.5 font-sans text-slate-400">Phi hành gia chịu lực ép gấp 3-4 lần trọng lượng cơ thể</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
