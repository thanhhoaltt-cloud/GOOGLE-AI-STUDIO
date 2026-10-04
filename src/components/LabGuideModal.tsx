import React from 'react';
import { X, CheckCircle, Lightbulb, Shield, BookOpen } from 'lucide-react';

interface LabGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabGuideModal: React.FC<LabGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-5 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Sơ Đồ Dụng Cụ Thí Nghiệm Đo Gia Tốc · SGK Vật Lí 10
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-slate-300">
          {/* Lab Setup Image */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative aspect-[16/9] max-h-72">
            <img
              src="/src/assets/images/physics_lab_kinematics_1791119817567.jpg"
              alt="Mô hình thí nghiệm khảo sát chuyển động biến đổi đều với máng nghiêng và cổng quang điện"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Zero-broken-image fallback
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
              <div>
                <span className="text-white font-semibold block text-sm">
                  Bộ thí nghiệm cơ học: Máng đệm khí / máng nghiêng & Cổng quang điện
                </span>
                <span className="text-slate-300 text-[11px]">
                  Thiết bị chuẩn phòng thí nghiệm trường THPT theo chương trình GDPT 2018
                </span>
              </div>
            </div>
          </div>

          {/* List of Apparatus */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>1. Danh mục dụng cụ thí nghiệm (SGK Kết Nối Tri Thức):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-indigo-300 block">1. Máng nghiêng hợp kim nhôm:</span>
                <p className="text-slate-400">
                  Dài 120 cm, có gắn thước chia độ chính xác đến từng milimét (mm), rãnh dẫn hướng chuyển động thẳng.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-300 block">2. Xe thí nghiệm & cờ chắn sáng:</span>
                <p className="text-slate-400">
                  Xe con 4 bánh có ổ bi ma sát rất nhỏ. Trên xe gắn cắm thẳng đứng tấm cản quang hẹp có bề rộng d = 20 mm.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-amber-300 block">3. Hai cổng quang điện (A và B):</span>
                <p className="text-slate-400">
                  Phát tia hồng ngoại sang đầu thu quang điện. Khi cờ chắn sáng đi qua sẽ ngắt chùm tia và phát tín hiệu điện.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-cyan-300 block">4. Đồng hồ đo hiện số đa năng:</span>
                <p className="text-slate-400">
                  Độ chính xác 0,001 s hoặc 0,0001 s, tự động đo thời gian cờ chắn qua cổng A, qua cổng B và thời gian từ A đến B.
                </p>
              </div>
            </div>
          </div>

          {/* Experimental Procedure */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>2. Tiến trình các bước thực nghiệm:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <li>
                Lắp đặt máng nghiêng với góc dốc nhỏ (từ 5° đến 12°) để xe chuyển động với gia tốc vừa phải, dễ quan sát.
              </li>
              <li>
                Cố định cổng quang điện A tại vị trí <span className="font-mono text-indigo-300 font-semibold">x_A = 20 cm</span>. Cố định cổng B tại vị trí ban đầu <span className="font-mono text-indigo-300 font-semibold">x_B = 40 cm</span>.
              </li>
              <li>
                Bật nguồn đồng hồ hiện số, chọn chế độ đo liên hoàn thời gian qua A, qua B và thời gian giữa A - B.
              </li>
              <li>
                Đặt xe sát nam châm điện ở đỉnh máng (v_0 = 0). Nhấn nút nhả nam châm điện để xe lăn tự do không vận tốc đầu.
              </li>
              <li>
                Ghi nhận số liệu hiển thị trên đồng hồ: <span className="font-mono text-slate-200">t_A</span>, <span className="font-mono text-slate-200">t_B</span>, <span className="font-mono text-slate-200">Δt</span>.
              </li>
              <li>
                Lần lượt dời cổng quang điện B đến các vị trí <span className="font-mono text-indigo-300">60 cm, 80 cm, 100 cm</span> và lặp lại thao tác đo.
              </li>
            </ol>
          </div>

          {/* Minimizing Error */}
          <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-800/40 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-white block">
                Bí quyết giảm thiểu sai số trong bài thực hành SGK:
              </span>
              <p className="text-slate-300">
                - Cần đo chính xác bề rộng của cờ chắn sáng bằng thước kẹp panme (<span className="font-mono">d = 20,00 ± 0,05 mm</span>).
                <br />
                - Giữ cho máng nghiêng thật phẳng và sạch bụi bẩn trên rãnh ray để đảm bảo chuyển động thẳng không đổi hướng.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-900 px-5 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            Đã Hiểu, Bắt Đầu Thí Nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
