
import { MessageSquare, Scale, Utensils, X } from 'lucide-react';
import React, { useId, useState } from 'react';

interface AddLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogName: string;
  onSave: (type: 'weight' | 'food', value: number, memo: string) => void;
}

export const AddLogModal: React.FC<AddLogModalProps> = ({ isOpen, onClose, dogName, onSave }) => {
  const [type, setType] = useState<'weight' | 'food'>('weight');
  const [value, setValue] = useState<string>('');
  const [memo, setMemo] = useState('');

  const valueInputId = useId();
  const memoInputId = useId();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(type, parseFloat(value), memo);
    setValue('');
    setMemo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-amber-50 relative">
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="absolute right-6 top-6 text-amber-900/40 hover:text-amber-900 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-amber-900">{dogName}の記録</h2>
          <p className="text-amber-800/60 text-sm">今日の様子を書き留めましょう</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('weight')}
              className={`flex-1 flex items-center justify-center py-2 rounded-xl text-sm font-bold transition-all ${type === 'weight' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-400'
                }`}
            >
              <Scale size={16} className="mr-2" /> 体重
            </button>
            <button
              type="button"
              onClick={() => setType('food')}
              className={`flex-1 flex items-center justify-center py-2 rounded-xl text-sm font-bold transition-all ${type === 'food' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-400'
                }`}
            >
              <Utensils size={16} className="mr-2" /> 食事
            </button>
          </div>

          <div>
            <label htmlFor={valueInputId} className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {type === 'weight' ? '体重 (kg)' : '食事量 (g)'}
            </label>
            <input
              id={valueInputId}
              type="number"
              step="0.1"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'weight' ? '0.0' : '0'}
              className="w-full text-3xl font-bold text-gray-700 bg-transparent border-b-2 border-amber-100 focus:border-amber-400 outline-none pb-2 transition-colors"
            />
          </div>

          <div>
            <label htmlFor={memoInputId} className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
              <MessageSquare size={14} className="mr-1" /> メモ
            </label>
            <textarea
              id={memoInputId}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="元気な様子、残した理由など..."
              rows={3}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-amber-100 focus:bg-white outline-none text-sm transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-[0.98]"
          >
            保存する
          </button>
        </form>
      </div>
    </div>
  );
};
