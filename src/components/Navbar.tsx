import React from 'react';
import { RotateCcw, HelpCircle, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'lab' | 'data' | 'reasoning' | 'theory' | 'quiz';
  setActiveTab: (tab: 'lab' | 'data' | 'reasoning' | 'theory' | 'quiz') => void;
  onResetExperiment: () => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetExperiment,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            a⃗
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-none">
              Vật Lí 10 · Khám Phá Gia Tốc
            </span>
            <span className="text-xs text-slate-400 font-normal">
              SGK Kết Nối Tri Thức với Cuộc Sống
            </span>
          </div>
        </div>

        {/* Zone 2: 5 clean text navigation links / segmented items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'lab'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Phòng Thí Nghiệm
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Bảng Số Liệu & Đồ Thị
          </button>
          <button
            onClick={() => setActiveTab('reasoning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'reasoning'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Phiếu Lập Luận Rút Ra Công Thức
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'theory'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Ý Nghĩa & Đơn Vị
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Luyện Tập
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            title="Xem sơ đồ dụng cụ thí nghiệm thực tế"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Dụng Cụ SGK</span>
          </button>
          <button
            onClick={onResetExperiment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            title="Đặt lại trạng thái ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt Lại</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-800/90 border-t border-slate-700/70 gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'lab' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Thí Nghiệm
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'data' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Số Liệu & Đồ Thị
        </button>
        <button
          onClick={() => setActiveTab('reasoning')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'reasoning' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Lập Luận Công Thức
        </button>
        <button
          onClick={() => setActiveTab('theory')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'theory' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Ý Nghĩa & Đơn Vị
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Luyện Tập
        </button>
      </div>
    </header>
  );
};
