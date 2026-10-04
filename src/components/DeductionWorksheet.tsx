import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  Lightbulb, 
  Check, 
  AlertCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface DeductionWorksheetProps {
  onNavigateToTheory: () => void;
  onNavigateToLab: () => void;
}

export const DeductionWorksheet: React.FC<DeductionWorksheetProps> = ({
  onNavigateToTheory,
  onNavigateToLab,
}) => {
  // Interactive Step States
  const [step1Answer, setStep1Answer] = useState<string | null>(null);
  const [step1Feedback, setStep1Feedback] = useState<boolean | null>(null);

  const [step2Choice, setStep2Choice] = useState<string | null>(null);
  const [step2Feedback, setStep2Feedback] = useState<boolean | null>(null);

  const [step3Fill, setStep3Fill] = useState<string>('');
  const [step3Feedback, setStep3Feedback] = useState<boolean | null>(null);

  const [step4Answer, setStep4Answer] = useState<string | null>(null);
  const [step4Feedback, setStep4Feedback] = useState<boolean | null>(null);

  // Score count
  const completedSteps = [
    step1Feedback === true,
    step2Feedback === true,
    step3Feedback === true,
    step4Feedback === true,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Phương Pháp Bàn Tay Nặn Bột & Phát Triển Năng Lực</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Phiếu Lập Luận Sư Phạm: Rút Ra Công Thức Tính Gia Tốc
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Dựa trên kết quả đo biến đổi vận tốc, hãy cùng từng bước tư duy để xây dựng nên công thức gia tốc.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700/70 shrink-0">
          <Award className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400">Tiến trình: </span>
            <span className="font-bold text-white font-mono">{completedSteps}/4 bước</span>
          </div>
        </div>
      </div>

      {/* 4 Pedagogical Steps */}
      <div className="space-y-5">
        {/* BƯỚC 1: Hiện tượng biến đổi vận tốc */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-500/40">
              1
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Bước 1: Quan Sát Sự Biến Đổi Vận Tốc Trong Chuyển Động
              </h3>
              <p className="text-xs text-slate-300">
                Khi xe trượt không vận tốc đầu từ đỉnh máng nghiêng xuống, ta đo được vận tốc tức thời tại cổng A là <span className="font-mono text-emerald-400">v_A</span> và tại cổng B là <span className="font-mono text-amber-400">v_B</span>.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
            <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-900/40 text-slate-200">
              <strong>Khái niệm độ biến thiên vận tốc:</strong> Đại lượng biểu diễn lượng thay đổi của vận tốc sau khoảng thời gian Δt được tính bởi hiệu số:
              <div className="font-mono text-center text-sm font-bold text-white my-2">
                Δv = v_B - v_A (hoặc Δv = v_t - v_0)
              </div>
            </div>

            {/* Interactive Question Step 1 */}
            <div className="pt-2">
              <p className="font-medium text-white mb-2">
                ❓ Câu hỏi suy luận: Trong thí nghiệm thả xe trượt xuống dốc (nhanh dần đều), dấu của độ biến thiên vận tốc Δv là gì?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setStep1Answer('A');
                    setStep1Feedback(true);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    step1Answer === 'A'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block">A. Δv {'>'} 0 (Dương)</span>
                  <span className="text-[11px] text-slate-400">
                    Vì vận tốc lúc sau v_B lớn hơn vận tốc lúc đầu v_A (xe chuyển động nhanh lên).
                  </span>
                </button>

                <button
                  onClick={() => {
                    setStep1Answer('B');
                    setStep1Feedback(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    step1Answer === 'B'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block">B. Δv {'<'} 0 (Âm)</span>
                  <span className="text-[11px] text-slate-400">
                    Vì vận tốc lúc sau nhỏ hơn vận tốc lúc trước.
                  </span>
                </button>
              </div>

              {step1Feedback !== null && (
                <div
                  className={`mt-3 p-3 rounded-xl flex items-start gap-2 text-xs ${
                    step1Feedback
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                  }`}
                >
                  {step1Feedback ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {step1Feedback ? (
                      <span>
                        <strong>Chính xác!</strong> Khi xe thả trượt xuống dốc, vận tốc tăng dần nên <span className="font-mono">v_B {'>'} v_A ⇒ Δv = v_B - v_A {'>'} 0</span>. (Ngược lại, khi xe leo dốc chậm dần thì <span className="font-mono">Δv {'<'} 0</span>).
                      </span>
                    ) : (
                      <span>
                        Chưa đúng. Khi xe trượt xuống dốc, xe đi ngày càng nhanh hơn, nên <span className="font-mono">v_B {'>'} v_A</span>, do đó hiệu số phải dương (<span className="font-mono">Δv {'>'} 0</span>). Hãy chọn lại nhé!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BƯỚC 2: Tình huống có vấn đề - Tại sao delta v là chưa đủ? */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-500/40">
              2
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Bước 2: Tình Huống Có Vấn Đề – Tại Sao Chỉ Dùng Δv Là Chưa Đủ?
              </h3>
              <p className="text-xs text-slate-300">
                Hãy xét tình huống thực tế sau để nhận ra sự cần thiết phải gắn độ biến thiên vận tốc với thời gian.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-amber-400 block">🏎️ Xe Đua Công Thức 1 (F1):</span>
                <p className="text-slate-300">
                  Tăng tốc từ <span className="font-mono text-white">0 km/h</span> lên <span className="font-mono text-white">108 km/h (30 m/s)</span> trong thời gian <span className="font-mono text-cyan-400 font-bold">2 giây</span>.
                </p>
                <div className="font-mono text-[11px] text-slate-400">Δv = 30 m/s trong Δt = 2 s</div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-cyan-400 block">🚌 Xe Buýt Chở Khách:</span>
                <p className="text-slate-300">
                  Cũng tăng tốc từ <span className="font-mono text-white">0 km/h</span> lên <span className="font-mono text-white">108 km/h (30 m/s)</span> nhưng mất thời gian <span className="font-mono text-cyan-400 font-bold">20 giây</span>.
                </p>
                <div className="font-mono text-[11px] text-slate-400">Δv = 30 m/s trong Δt = 20 s</div>
              </div>
            </div>

            {/* Interactive Question Step 2 */}
            <div className="pt-2">
              <p className="font-medium text-white mb-2">
                ❓ Nhận xét: Cả hai xe đều có cùng độ tăng vận tốc <span className="font-mono text-emerald-400">Δv = 30 m/s</span>. Xe nào tăng tốc nhanh hơn? Làm thế nào để định lượng mức độ "tăng tốc nhanh hơn"?
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setStep2Choice('A');
                    setStep2Feedback(true);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    step2Choice === 'A'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block">
                    A. Xe đua F1 tăng tốc nhanh hơn vì trong mỗi 1 giây vận tốc của nó tăng nhiều hơn.
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Cần so sánh độ biến thiên vận tốc trong 1 đơn vị thời gian (1 giây): Lấy Δv chia cho Δt.
                  </span>
                </button>

                <button
                  onClick={() => {
                    setStep2Choice('B');
                    setStep2Feedback(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    step2Choice === 'B'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block">
                    B. Hai xe tăng tốc như nhau vì đều đạt độ tăng vận tốc Δv = 30 m/s.
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Thời gian không ảnh hưởng đến mức độ tăng tốc.
                  </span>
                </button>
              </div>

              {step2Feedback !== null && (
                <div
                  className={`mt-3 p-3 rounded-xl flex items-start gap-2 text-xs ${
                    step2Feedback
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                  }`}
                >
                  {step2Feedback ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {step2Feedback ? (
                      <span>
                        <strong>Rất xuất sắc!</strong> Trong 1 giây: Xe F1 tăng được <span className="font-mono">30 / 2 = 15 m/s</span>; còn xe buýt chỉ tăng được <span className="font-mono">30 / 20 = 1.5 m/s</span>. Rõ ràng đại lượng <span className="font-mono font-bold text-white">Δv / Δt</span> chính là thước đo sự biến đổi nhanh hay chậm của vận tốc!
                      </span>
                    ) : (
                      <span>
                        Chưa hợp lí. Dù cùng tăng thêm 30 m/s, nhưng xe đua chỉ mất 2 giây trong khi xe buýt mất tới 20 giây. Bạn hãy chọn lại phương án A để xem giải thích chi tiết!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BƯỚC 3: Hình thành thương số delta v / delta t */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-500/40">
              3
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Bước 3: Khảo Sát Tính Chất Của Thương Số (Δv / Δt) Trong Thực Nghiệm
              </h3>
              <p className="text-xs text-slate-300">
                Kiểm chứng thương số này với số liệu thu được từ thí nghiệm máng nghiêng SGK.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
            <p className="text-slate-200">
              Từ bảng số liệu thí nghiệm khi ta đo ở các vị trí cổng B khác nhau:
            </p>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto">
              <table className="w-full text-center font-mono text-[11px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="pb-1 text-left">Đoạn dịch chuyển</th>
                    <th className="pb-1">Δv (m/s)</th>
                    <th className="pb-1">Δt (s)</th>
                    <th className="pb-1 text-indigo-300 font-bold">Thương số (Δv / Δt)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-1 text-left font-sans">s1 = 20 cm</td>
                    <td className="py-1">0.354</td>
                    <td className="py-1">0.281</td>
                    <td className="py-1 text-indigo-400 font-bold">≈ 1.26 m/s²</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-left font-sans">s2 = 40 cm</td>
                    <td className="py-1">0.638</td>
                    <td className="py-1">0.506</td>
                    <td className="py-1 text-indigo-400 font-bold">≈ 1.26 m/s²</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-left font-sans">s3 = 60 cm</td>
                    <td className="py-1">0.865</td>
                    <td className="py-1">0.687</td>
                    <td className="py-1 text-indigo-400 font-bold">≈ 1.26 m/s²</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Step 3 Interaction */}
            <div className="pt-2 space-y-2">
              <p className="font-medium text-white">
                ❓ Nhận xét quan trọng: Giá trị của thương số <span className="font-mono text-indigo-300">Δv / Δt</span> đối với một độ nghiêng nhất định của máng có tính chất gì?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setStep3Fill('const');
                    setStep3Feedback(true);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    step3Fill === 'const'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block">A. Là một hằng số không đổi (Δv/Δt = const)</span>
                  <span className="text-[11px] text-slate-400">
                    Đặc trưng riêng cho sự biến đổi vận tốc của chuyển động này.
                  </span>
                </button>

                <button
                  onClick={() => {
                    setStep3Fill('varies');
                    setStep3Feedback(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    step3Fill === 'varies'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block">B. Tăng dần theo quãng đường</span>
                  <span className="text-[11px] text-slate-400">
                    Quãng đường càng dài thì thương số càng lớn.
                  </span>
                </button>
              </div>

              {step3Feedback !== null && (
                <div
                  className={`mt-3 p-3 rounded-xl flex items-start gap-2 text-xs ${
                    step3Feedback
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                  }`}
                >
                  {step3Feedback ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {step3Feedback ? (
                      <span>
                        <strong>Hoàn toàn chính xác!</strong> Thương số <span className="font-mono">Δv / Δt</span> giữ giá trị không đổi. Vì nó là hằng số đặc trưng cho sự biến thiên vận tốc theo thời gian, các nhà vật lí đã đặt tên cho đại lượng này là <strong>Gia Tốc</strong>.
                      </span>
                    ) : (
                      <span>
                        Hãy nhìn vào cột cuối cùng trong bảng số liệu: Cả 3 lần đo đều cho kết quả xấp xỉ bằng <span className="font-mono">1.26 m/s²</span>. Như vậy thương số này là một hằng số không đổi!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BƯỚC 4: Rút ra công thức định nghĩa gia tốc */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-500/40">
              4
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Bước 4: Rút Ra Công Thức Tính Gia Tốc & Phương Trình Vận Tốc
              </h3>
              <p className="text-xs text-slate-300">
                Tổng quát hóa các lập luận trên thành công thức giải tích chuẩn mực.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
            {/* The Formula Card */}
            <div className="p-4 bg-indigo-950/50 rounded-xl border border-indigo-700/60 text-center space-y-2">
              <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">
                Công thức tính gia tốc trong chuyển động thẳng (SGK Vật lí 10)
              </span>

              {/* Big Display Formula */}
              <div className="inline-block py-2 px-6 bg-black/60 rounded-xl border border-indigo-600/50 text-white font-mono text-base sm:text-lg font-bold">
                a = <span className="text-amber-300">Δv</span> / <span className="text-cyan-300">Δt</span> = (v_t - v_0) / (t - t_0)
              </div>

              <p className="text-slate-300 text-xs max-w-lg mx-auto">
                Nếu chọn mốc thời gian tại thời điểm ban đầu <span className="font-mono text-cyan-300">t_0 = 0</span>, vật có vận tốc ban đầu là <span className="font-mono text-amber-300">v_0</span>, tại thời điểm <span className="font-mono text-cyan-300">t</span> vật có vận tốc là <span className="font-mono text-amber-300">v</span>:
              </p>

              <div className="inline-block py-1.5 px-4 bg-black/40 rounded-lg text-emerald-400 font-mono text-sm font-semibold">
                v = v_0 + a · t
              </div>
            </div>

            {/* Step 4 Quick Test */}
            <div className="pt-2">
              <p className="font-medium text-white mb-2">
                ❓ Vận dụng: Một đoàn tàu đang chạy với vận tốc <span className="font-mono text-amber-300">v_0 = 10 m/s</span> thì bắt đầu tăng tốc với gia tốc <span className="font-mono text-indigo-300">a = 0.5 m/s²</span>. Sau thời gian <span className="font-mono text-cyan-300">t = 20 giây</span>, vận tốc của tàu là bao nhiêu?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'opt1', label: '15 m/s', correct: false },
                  { id: 'opt2', label: '20 m/s', correct: true },
                  { id: 'opt3', label: '25 m/s', correct: false },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setStep4Answer(item.id);
                      setStep4Feedback(item.correct);
                    }}
                    className={`p-3 rounded-xl border text-center font-mono font-bold transition-all ${
                      step4Answer === item.id
                        ? item.correct
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-rose-950/60 border-rose-500 text-rose-300'
                        : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {step4Feedback !== null && (
                <div
                  className={`mt-3 p-3 rounded-xl flex items-start gap-2 text-xs ${
                    step4Feedback
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                  }`}
                >
                  {step4Feedback ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {step4Feedback ? (
                      <span>
                        <strong>Rất giỏi!</strong> Áp dụng công thức vừa rút ra: <span className="font-mono">v = v_0 + a·t = 10 + 0.5 × 20 = 10 + 10 = 20 m/s</span>.
                      </span>
                    ) : (
                      <span>
                        Chưa chính xác. Áp dụng công thức: <span className="font-mono">v = v_0 + a·t = 10 + (0.5 × 20)</span>. Hãy tính lại phép nhân trước rồi cộng nhé!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Trophy Card */}
      {completedSteps === 4 && (
        <div className="bg-gradient-to-r from-emerald-950/50 via-indigo-950/50 to-slate-900 p-6 rounded-2xl border-2 border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-2xl border border-emerald-500/40 shrink-0">
              🎉
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Chúc Mừng Em Đã Hoàn Thành Phiếu Lập Luận Sư Phạm!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Em đã tự mình xây dựng công thức tính gia tốc từ quan sát thực nghiệm. Tiếp theo, hãy chuyển sang tìm hiểu sâu về <strong>Ý nghĩa và Đơn vị</strong> của gia tốc nhé!
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToTheory}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap shrink-0"
          >
            <span>Xem Ý Nghĩa & Đơn Vị</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
