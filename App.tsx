
import { Bell, BookOpen, Camera, ChevronRight, CreditCard, Heart, LogOut, Pencil, Plus, Scale, Settings, Shield, User, Utensils } from 'lucide-react';
import React, { useState } from 'react';
import { ActivityCalendar } from './components/ActivityCalendar';
import { AddDogModal } from './components/AddDogModal';
import { AddLogModal } from './components/AddLogModal';
import { Auth } from './components/Auth';
import { DogSelector } from './components/DogSelector';
import { HealthChart } from './components/HealthChart';
import { useHealthData } from './hooks/useHealthData';
import { uploadDogImage } from './lib/storage';
import { calculateAge } from './src/utils/date';



const App: React.FC = () => {
  const {
    dogs, activeDogId, setActiveDogId, activeDog,
    weightLogs, foodLogs, diaries, addWeightLog, addFoodLog, addDog, updateDog, deleteDog, addDiary, allLogs,
    loading, user, signOut
  } = useHealthData();

  const [activeTab, setActiveTab] = useState<'home' | 'diary' | 'health' | 'settings'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDogModalOpen, setIsAddDogModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-amber-900 font-bold font-sans">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : '--';
  const latestFood = foodLogs.length > 0 ? foodLogs[foodLogs.length - 1].amount : '--';

  const activityDates = [
    ...new Set([
      ...allLogs.weightLogs.filter(l => l.dogId === activeDogId).map(l => l.date),
      ...allLogs.foodLogs.filter(l => l.dogId === activeDogId).map(l => l.date)
    ])
  ];

  const handleSaveLog = (type: 'weight' | 'food', value: number, memo: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (activeDogId) {
      if (type === 'weight') {
        addWeightLog({ dogId: activeDogId, date: today, weight: value });
      } else {
        addFoodLog({ dogId: activeDogId, date: today, amount: value, memo });
      }
    }
  };

  const handleAddDog = async (name: string, breed: string, birthday: string, image: string | File) => {
    let imageUrl = image;
    if (image instanceof File) {
      setUploading(true);
      try {
        imageUrl = await uploadDogImage(image, user.id);
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('画像のアップロードに失敗しました。');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    await addDog({ name, breed, image: imageUrl, birthday });
    setIsAddDogModalOpen(false);
    setActiveTab('home');
  };

  const handleUpdateDog = async (id: string, name: string, breed: string, birthday: string, image: string | File) => {
    let imageUrl = image;
    if (image instanceof File) {
      setUploading(true);
      try {
        imageUrl = await uploadDogImage(image, user.id);
      } catch (error) {
        console.error('Image update failed:', error);
        alert('画像のアップロードに失敗しました。');
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    await updateDog(id, { name, breed, image: imageUrl, birthday });
    setIsAddDogModalOpen(false);
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <section className="bg-gradient-to-br from-amber-50/50 to-orange-100/50 backdrop-blur-md p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(251,191,36,0.1)] flex items-center space-x-4 border border-white/50">
        <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-inner bg-white p-1 ring-4 ring-amber-100/30">
          {activeDog?.image ? (
            <img src={activeDog.image} alt={activeDog.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <div className="w-full h-full bg-amber-50 flex items-center justify-center text-amber-300">
              <Camera size={24} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-amber-900 tracking-tight">{activeDog?.name}</h2>
          <div className="flex items-center text-[10px] text-amber-800/60 font-bold uppercase tracking-wider mt-0.5">
            <span className="bg-white/80 px-2 py-0.5 rounded-full mr-2 shadow-sm border border-orange-50/50">{activeDog?.breed}</span>
            <span className="bg-amber-100/50 px-2 py-0.5 rounded-full border border-orange-50/50">{activeDog?.birthday ? calculateAge(activeDog.birthday) : '0歳'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddDogModalOpen(true)}
            aria-label="プロフィールを編集"
            className="bg-white/80 p-2.5 rounded-2xl text-amber-500 hover:text-amber-600 hover:scale-110 active:scale-95 transition-all shadow-sm border border-orange-50/50"
          >
            <Pencil size={18} />
          </button>
          <div className="bg-white/80 p-2.5 rounded-2xl text-rose-400 shadow-sm border border-orange-50/50">
            <Heart size={20} fill="currentColor" />
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400 mb-3">
            <Scale size={20} />
          </div>
          <p className="text-xs text-gray-400 font-bold">現在の体重</p>
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-gray-700">{latestWeight}</span>
            <span className="text-xs font-bold text-gray-400 ml-1">kg</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-400 mb-3">
            <Utensils size={20} />
          </div>
          <p className="text-xs text-gray-400 font-bold">今日の食事</p>
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-gray-700">{latestFood}</span>
            <span className="text-xs font-bold text-gray-400 ml-1">g</span>
          </div>
        </div>
      </section>

      {/* Recent Diary Preview */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-700 flex items-center">
            <BookOpen size={18} className="mr-2 text-orange-300" />
            最近の日記
          </h3>
          <button onClick={() => setActiveTab('diary')} className="text-xs font-bold text-amber-500">もっと見る</button>
        </div>
        {diaries.length > 0 ? (
          <div className="p-4 bg-orange-50/50 rounded-2xl">
            <p className="text-[10px] text-orange-400 font-bold uppercase mb-1">{diaries[0].date}</p>
            <h4 className="font-bold text-gray-700 mb-1">{diaries[0].title}</h4>
            <p className="text-sm text-gray-500 line-clamp-2">{diaries[0].content}</p>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 italic py-4">まだ日記がありません</p>
        )}
      </section>

      {/* Calendar */}
      <ActivityCalendar logs={activityDates} />
    </div>
  );

  const renderDiary = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-amber-900">{activeDog?.name}の日記帳</h2>
        <button
          onClick={() => {
            const title = prompt('タイトルを入力してください');
            const content = prompt('内容を入力してください');
            if (activeDogId && title && content) {
              addDiary({ dogId: activeDogId, date: new Date().toISOString().split('T')[0], title, content });
            }
          }}
          aria-label="日記を追加"
          className="p-3 bg-amber-100 text-amber-600 rounded-2xl hover:bg-amber-200 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>
      <div className="space-y-4">
        {diaries.length > 0 ? diaries.map(diary => (
          <div key={diary.id} className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
            <p className="text-[10px] text-orange-400 font-bold mb-1">{diary.date}</p>
            <h4 className="font-bold text-lg text-gray-700 mb-2">{diary.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{diary.content}</p>
          </div>
        )) : (
          <div className="text-center py-12 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p>日記がまだありません</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-amber-900">健康データ解析</h2>
      {/* Weight Chart */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50">
        <h3 className="font-bold text-gray-700 flex items-center mb-2">
          <Scale size={18} className="mr-2 text-blue-300" />
          体重の推移 (kg)
        </h3>
        <HealthChart data={weightLogs} type="weight" color="#93c5fd" />
      </section>

      {/* Food Chart */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50">
        <h3 className="font-bold text-gray-700 flex items-center mb-2">
          <Utensils size={18} className="mr-2 text-emerald-300" />
          食事量の推移 (g)
        </h3>
        <HealthChart data={foodLogs} type="food" color="#6ee7b7" />
      </section>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 pb-20">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-white shadow-md flex items-center justify-center text-amber-500 overflow-hidden">
          <User size={40} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">ドッグ・ペアレント</h2>
          <p className="text-sm text-gray-400 font-medium">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">アカウント設定</p>
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-orange-50">
          {[
            { icon: User, label: 'プロフィール編集', color: 'text-blue-400' },
            { icon: Shield, label: 'プライバシーとセキュリティ', color: 'text-emerald-400' },
            { icon: Bell, label: '通知設定', color: 'text-orange-400' },
            { icon: CreditCard, label: 'サブスクリプション', color: 'text-purple-400' },
          ].map((item, idx) => (
            <button key={idx} className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50/30 transition-colors border-b border-orange-50 last:border-0">
              <div className="flex items-center">
                <div className={`p-2 rounded-xl bg-gray-50 ${item.color} mr-4`}>
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-2">
        <button
          onClick={() => signOut()}
          className="w-full py-4 bg-rose-50 text-rose-500 font-bold rounded-2xl flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 text-gray-800">
      {uploading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex items-center justify-center text-amber-900 font-bold">
          画像をアップロード中...
        </div>
      )}
      {/* Header */}
      <header className="pt-8 px-6 bg-white/50 backdrop-blur-md sticky top-0 z-30 border-b border-orange-50/50">
        <div className="flex justify-between items-center mb-4">
          <div onClick={() => setActiveTab('home')} className="cursor-pointer">
            <h1 className="text-2xl font-black text-amber-900 tracking-tight">Pawsome Growth</h1>
            <p className="text-xs text-amber-700/60 font-bold uppercase tracking-widest">愛犬の成長記録</p>
          </div>
          <div className="flex space-x-2">
            <button
              aria-label="通知"
              className="p-3 bg-white rounded-2xl shadow-sm text-amber-400 border border-orange-50 hover:bg-orange-50/50 transition-colors"
            >
              <Bell size={20} />
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              aria-label="設定"
              className={`p-3 rounded-2xl shadow-sm border transition-all ${activeTab === 'settings' ? 'bg-amber-400 text-white border-amber-400' : 'bg-white text-amber-400 border-orange-50 hover:bg-orange-50/50'}`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {activeTab !== 'settings' && (
          <DogSelector
            dogs={dogs}
            activeId={activeDogId || ''}
            onSelect={setActiveDogId}
            onAddClick={() => setIsAddDogModalOpen(true)}
          />
        )}
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 max-w-2xl mx-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'diary' && renderDiary()}
        {activeTab === 'health' && renderHealth()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* FAB - Action Button */}
      {activeTab !== 'settings' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="記録を追加"
            className="bg-amber-400 text-white w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl shadow-amber-200 hover:scale-110 hover:bg-amber-500 active:scale-95 transition-all"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-orange-50 h-20 px-8 flex items-center justify-between z-30">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-amber-500' : 'text-gray-300'}`}
        >
          <Heart size={24} fill={activeTab === 'home' ? "currentColor" : "none"} />
          <span className="text-[10px] font-bold mt-1">ホーム</span>
        </button>
        <button
          onClick={() => setActiveTab('diary')}
          className={`flex flex-col items-center transition-colors ${activeTab === 'diary' ? 'text-amber-500' : 'text-gray-300'}`}
        >
          <BookOpen size={24} />
          <span className="text-[10px] font-bold mt-1">日記</span>
        </button>
        <div className="w-12"></div> {/* Space for FAB */}
        <button
          onClick={() => setActiveTab('health')}
          className={`flex flex-col items-center transition-colors ${activeTab === 'health' ? 'text-amber-500' : 'text-gray-300'}`}
        >
          <Scale size={24} />
          <span className="text-[10px] font-bold mt-1">健康</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center transition-colors ${activeTab === 'settings' ? 'text-amber-500' : 'text-gray-300'}`}
        >
          <User size={24} />
          <span className="text-[10px] font-bold mt-1">設定</span>
        </button>
      </nav>

      {/* Modals */}
      <AddLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dogName={activeDog?.name || ''}
        onSave={handleSaveLog}
      />

      <AddDogModal
        isOpen={isAddDogModalOpen}
        onClose={() => setIsAddDogModalOpen(false)}
        onAdd={handleAddDog}
        onUpdate={handleUpdateDog}
        onDelete={deleteDog}
        dog={activeDog}
      />
    </div>
  );
};

export default App;
