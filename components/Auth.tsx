import { Heart, LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('確認メールを送信しました。メールフォルダを確認してください。');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || '認証に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-6 text-gray-800">
      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-100 p-4 rounded-3xl text-amber-500 mb-4">
            <Heart size={40} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black text-amber-900">Pawsome Growth</h1>
          <p className="text-gray-400 text-sm font-medium">愛犬の成長を記録しましょう</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-amber-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              placeholder="example@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:border-amber-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-white font-black rounded-2xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isSignUp ? (
              <>
                <UserPlus size={20} />
                <span>サインアップ</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>ログイン</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-amber-600 font-bold text-sm hover:underline"
          >
            {isSignUp ? '既にアカウントをお持ちですか？ ログイン' : '新しくアカウントを作成しますか？ サインアップ'}
          </button>
        </div>
      </div>
    </div>
  );
};
