import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Đại lượng nào sau đây đặc trưng cho độ biến thiên nhanh hay chậm của vận tốc theo thời gian?',
    options: [
      { key: 'A', text: 'Quãng đường đi được (s)' },
      { key: 'B', text: 'Gia tốc (a)' },
      { key: 'C', text: 'Độ dịch chuyển (d)' },
      { key: 'D', text: 'Vận tốc trung bình (v_tb)' },
    ],
    correctAnswer: 'B',
    explanation: 'Theo định nghĩa chuẩn SGK Kết Nối Tri Thức: Gia tốc là đại lượng vật lí đặc trưng cho độ biến thiên nhanh hay chậm của vận tốc theo thời gian: a = Δv / Δt.',
  },
  {
    id: 2,
    question: 'Trong hệ đơn vị quốc tế SI, đơn vị đo của gia tốc là:',
    options: [
      { key: 'A', text: 'm/s (mét trên giây)' },
      { key: 'B', text: 'm·s (mét nhân giây)' },
      { key: 'C', text: 'm/s² (mét trên giây bình phương)' },
      { key: 'D', text: 'km/h² (kilômét trên giờ bình phương)' },
    ],
    correctAnswer: 'C',
    explanation: 'Vì a = Δv / Δt nên đơn vị SI của gia tốc là (m/s) / s = m/s² (hoặc m·s⁻²). (Mặc dù km/h² cũng đo gia tốc nhưng không phải đơn vị cơ bản trong hệ chuẩn SI).',
  },
  {
    id: 3,
    question: 'Một chất điểm chuyển động thẳng nhanh dần đều theo chiều dương của trục tọa độ. Dấu của vận tốc v và gia tốc a thỏa mãn điều kiện nào?',
    options: [
      { key: 'A', text: 'v > 0 và a > 0 (a · v > 0)' },
      { key: 'B', text: 'v > 0 và a < 0 (a · v < 0)' },
      { key: 'C', text: 'v < 0 và a > 0' },
      { key: 'D', text: 'v > 0 và a = 0' },
    ],
    correctAnswer: 'A',
    explanation: 'Khi vật chuyển động nhanh dần đều, véc-tơ gia tốc a⃗ cùng hướng với véc-tơ vận tốc v⃗. Do vật chuyển động theo chiều dương nên v > 0, dẫn tới gia tốc a > 0. Tích a · v > 0 là dấu hiệu của chuyển động nhanh dần đều.',
  },
  {
    id: 4,
    question: 'Một xe máy bắt đầu khởi hành từ trạng thái nghỉ (v0 = 0). Sau 8 giây, vận tốc của xe đạt 16 m/s. Gia tốc của xe máy là:',
    options: [
      { key: 'A', text: '0,5 m/s²' },
      { key: 'B', text: '2,0 m/s²' },
      { key: 'C', text: '128 m/s²' },
      { key: 'D', text: '8,0 m/s²' },
    ],
    correctAnswer: 'B',
    explanation: 'Áp dụng công thức tính gia tốc: a = (v - v0) / t = (16 - 0) / 8 = 2,0 m/s². Cứ sau mỗi giây, vận tốc của xe máy tăng thêm 2 m/s.',
  },
  {
    id: 5,
    question: 'Một ô tô đang chạy với vận tốc 20 m/s thì người lái xe hãm phanh chuyển động chậm dần đều với độ lớn gia tốc 2,5 m/s². Thời gian từ lúc hãm phanh đến khi xe dừng hẳn là:',
    options: [
      { key: 'A', text: '5 giây' },
      { key: 'B', text: '8 giây' },
      { key: 'C', text: '10 giây' },
      { key: 'D', text: '50 giây' },
    ],
    correctAnswer: 'B',
    explanation: 'Chọn chiều dương là chiều chuyển động: v0 = 20 m/s; khi xe dừng hẳn thì v = 0. Do xe chuyển động chậm dần đều nên a = -2,5 m/s². Thời gian hãm phanh: t = (v - v0) / a = (0 - 20) / (-2,5) = 8 giây.',
  },
  {
    id: 6,
    question: 'Đồ thị vận tốc – thời gian (v – t) của một chuyển động thẳng biến đổi đều là một đoạn thẳng dốc lên. Đại lượng nào sau đây được xác định bằng hệ số góc (độ dốc) của đoạn thẳng đó?',
    options: [
      { key: 'A', text: 'Gia tốc của chuyển động' },
      { key: 'B', text: 'Quãng đường xe đi được' },
      { key: 'C', text: 'Thời gian chuyển động' },
      { key: 'D', text: 'Tọa độ ban đầu của xe' },
    ],
    correctAnswer: 'A',
    explanation: 'Trong đồ thị (v – t), hệ số góc k = tan α = Δv / Δt chính là gia tốc a của chuyển động. Đoạn thẳng dốc lên chứng tỏ a > 0 (vật chuyển động nhanh dần đều).',
  },
];

interface PracticeQuizProps {
  onNavigateToLab: () => void;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({ onNavigateToLab }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionKey: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Luyện Tập & Củng Cố Kiến Thức SGK</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Bài Kiểm Tra Nhanh: Khám Phá Gia Tốc Trong Chuyển Động Thẳng
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            6 câu hỏi trắc nghiệm khách quan đánh giá năng lực vật lí theo chuẩn SGK Kết Nối Tri Thức.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-indigo-700/60 shrink-0">
            <div>
              <div className="text-[11px] text-slate-400">Kết quả đạt được:</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {correctCount} / {QUIZ_QUESTIONS.length} câu đúng ({((correctCount / QUIZ_QUESTIONS.length) * 10).toFixed(1)} điểm)
              </div>
            </div>
            <button
              onClick={handleResetQuiz}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              title="Làm lại bài kiểm tra"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctAnswer;

          return (
            <div
              key={q.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3.5"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/40">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                {q.options.map((opt) => {
                  const isSelected = userChoice === opt.key;
                  let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60';

                  if (isSubmitted) {
                    if (opt.key === q.correctAnswer) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-indigo-950/70 border-indigo-500 text-indigo-200 font-semibold';
                  }

                  return (
                    <button
                      key={opt.key}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${optStyle}`}
                    >
                      <span>
                        <strong className="mr-1.5 font-mono">{opt.key}.</strong> {opt.text}
                      </span>
                      {isSubmitted && opt.key === q.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when submitted) */}
              {isSubmitted && (
                <div className="ml-9 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lời giải chi tiết:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Reset Actions */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          Đã trả lời: <span className="font-bold text-white font-mono">{Object.keys(selectedAnswers).length} / {QUIZ_QUESTIONS.length} câu</span>
        </div>

        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length === 0}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-indigo-600/30"
            >
              Nộp Bài Chấm Điểm
            </button>
          ) : (
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm Lại Lần Nữa</span>
            </button>
          )}

          <button
            onClick={onNavigateToLab}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/60 rounded-xl transition-colors"
          >
            <span>Quay Lại Thí Nghiệm</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
