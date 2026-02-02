# 🐾 Pawsome Growth

Pawsome Growthは、愛犬の健康管理と成長記録をシンプルかつ美しく管理するためのアプリケーションです。
体重管理、食事の記録、そして毎日の日記を通じて、あなたと愛犬の絆を深めるお手伝いをします。

## ✨ 主な機能

- 🐶 **マルチドッグ対応**: 複数の愛犬のプロフィールを個別に管理。
- ⚖️ **体重記録 & グラフ**: 体重の変化をグラフで視覚的に把握。
- 🥣 **食事管理**: 毎日の給餌量を記録し、健康状態をチェック。
- 📖 **成長日記**: 写真（近日対応予定）やメモで日々の思い出を記録。
- 📅 **アクティビティカレンダー**: 記録をつけた日をひと目で確認。
- 🛠️ **プレミアムなUI/UX**: グラスモーフィズムを採用した洗練されたデザインと快適な操作感。

## 🚀 技術スタック

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend/Database**: Supabase (Auth, PostgreSQL, Storage)

## 📂 プロジェクト構造

```text
pawsome-growth/
├── src/
├── components/       # UIコンポーネント
│   ├── Auth.tsx             # 認証画面
│   ├── HealthChart.tsx      # 健康データグラフ
│   └── ...
├── hooks/            # カスタムフック (useHealthData.ts)
├── lib/              # Supabase設定・共通ユーティリティ
├── types.ts          # 型定義
└── App.tsx           # メインアプリケーションロジック
```

## 🛠️ ローカルでのセットアップ

### 前提条件
- Node.js (v18以上推奨)
- Supabaseプロジェクト (URLとAnon Keyが必要)

### 手順
1. リポジトリをクローン:
   ```bash
   git clone https://github.com/terisuke/pawsome-growth.git
   cd pawsome-growth
   ```

2. 依存関係のインストール:
   ```bash
   npm install
   ```

3. 環境変数の設定:
   `.env.local` ファイルを作成し、以下の情報を追加してください。
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

## 📄 ライセンス

This project is open-source. Created with ❤️ for dog lovers.
