
import { Camera, Trash2, X } from 'lucide-react';
import React, { useEffect, useId, useState } from 'react';
import { Dog } from '../types';

interface AddDogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, breed: string, birthday: string, image: any) => void;
  onUpdate?: (id: string, name: string, breed: string, birthday: string, image: any) => void;
  onDelete?: (id: string) => void;
  dog?: Dog | null;
}

export const AddDogModal: React.FC<AddDogModalProps> = ({ isOpen, onClose, onAdd, onUpdate, onDelete, dog }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState(new Date().toISOString().split('T')[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const nameInputId = useId();
  const breedInputId = useId();
  const birthdayInputId = useId();

  useEffect(() => {
    if (dog) {
      setName(dog.name);
      setBreed(dog.breed);
      setBirthday(dog.birthday || new Date().toISOString().split('T')[0]);
      setPreviewUrl(dog.image);
    } else {
      setName('');
      setBreed('');
      setBirthday(new Date().toISOString().split('T')[0]);
      setPreviewUrl(null);
    }
    setImageFile(null);
  }, [dog, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed) return;

    // Pass either file or default/existing image
    let imageToUpload: any = imageFile || previewUrl;
    if (!imageToUpload) {
      const randomId = Math.floor(Math.random() * 1000);
      imageToUpload = `https://images.unsplash.com/photo-${1537151608828 + randomId}-f5104be9f509?auto=format&fit=crop&q=80&w=200&h=200`;
    }

    if (dog && onUpdate) {
      onUpdate(dog.id, name, breed, birthday, imageToUpload);
    } else {
      onAdd(name, breed, birthday, imageToUpload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm text-gray-800">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-orange-50 relative">
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="absolute right-6 top-6 text-orange-900/40 hover:text-orange-900 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold text-orange-900">{dog ? 'プロフィールを編集' : '新しい家族を追加'}</h2>
          <p className="text-orange-800/60 text-sm">{dog ? '情報を更新しましょう' : 'プロフィールを作成しましょう'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex justify-center">
            <label className="relative cursor-pointer group" aria-label="写真を選択">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="w-24 h-24 rounded-full bg-orange-100 border-4 border-dashed border-orange-200 flex flex-col items-center justify-center text-orange-300 overflow-hidden group-hover:border-orange-300 transition-all">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={24} />
                    <span className="text-[10px] font-bold mt-1">写真を追加</span>
                  </>
                )}
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor={nameInputId} className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">なまえ</label>
              <input
                id={nameInputId}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: ポチ"
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-100 focus:bg-white outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor={breedInputId} className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">犬種</label>
              <input
                id={breedInputId}
                type="text"
                required
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="例: チワワ"
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-100 focus:bg-white outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor={birthdayInputId} className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">お誕生日</label>
              <input
                id={birthdayInputId}
                type="date"
                required
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-100 focus:bg-white outline-none text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
          >
            {dog ? '更新する' : '登録する'}
          </button>

          {dog && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm('本当に削除しますか？')) {
                  onDelete(dog.id);
                  onClose();
                }
              }}
              className="w-full py-4 text-rose-500 font-bold flex items-center justify-center space-x-2"
            >
              <Trash2 size={18} />
              <span>プロフィールを削除</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
