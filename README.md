# 🎵 あなたの音楽周波数を見つける

**Music Frequency Diagnosis App** - Rhythm, Personality & Mood Analysis

![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 概要

このアプリケーションは、以下の4つのステップであなたの「音楽周波数」を診断します：

1. **Step 1: リズム複雑度診断** 
   - 30秒間のタップテンポ測定
   - CV（変動係数）で7段階のリズム複雑度を判定

2. **Step 2: 外向性・内向性診断**
   - 3つの質問で外向性スコア（-3.0 ～ +3.0）を算出
   - Eysenck の性格理論に基づく

3. **Step 3: 気分選択**
   - Kate Hevner の8点感情円環から選択
   - 霊的、悲しい、夢のような、叙情的、こっけいな、喜ばしい、興奮、元気

4. **Step 4: エネルギーレベル選択**
   - 0〜5の6段階（Empty, Tired, Low Energy, Neutral, Activated, Energized）

---

## 🎯 今すぐ試す

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uno-N/yuno-music-therapy-app)

**👆 CodeSandbox で今すぐブラウザで試す（デプロイ不要）**

---

## 📊 診断結果

以下の情報が自動生成されます：

- **推奨キー** （E Major, G Major, など）
- **ハーモニー色** （明るい、温か、激しい、など）
- **高周波帯** （周波数範囲）
- **倍音構造** （脳領域への作用）
- **ホルモン状態** （ドーパミン、セロトニン、アドレナリン）

---

## 🛠 ローカルで実行
```bash
# リポジトリをクローン
git clone https://github.com/uno-N/yuno-music-therapy-app.git

# ディレクトリに移動
cd yuno-music-therapy-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザで http://localhost:3000 にアクセス

---

## 📚 理論背景

### リズム複雑度（Rhythm Complexity Level）

**計算方法：** CV（変動係数）
```
CV = (標準偏差 / 平均IOI) × 100

Level 1: CV 0-5%      → 完全規則的ビート
Level 2: CV 5-10%     → 規則的ビート + わずかな変動
Level 3: CV 10-20%    → 複数層のビート（推奨範囲）
Level 4: CV 20-35%    → 中程度の複雑性
Level 5: CV 35-50%    → 複雑なリズム
Level 6: CV 50-70%    → 高度な複雑性
Level 7: CV 70%+      → 極度の複雑性
```

**参考文献：**
- Rose et al. (2020). "Comparison of Spontaneous Motor Tempo during Finger Tapping..."
- Povel & Essens (1985). "Perception of Temporal Patterns."

### 外向性スコア（Extraversion Score）

Eysenck の性格理論に基づき、3つの質問から算出：
```
外向性スコア = (Q1 + Q2 + Q3) / 3

範囲：-3.0（極度に内向的）〜 +3.0（極度に外向的）
```

### 気分の円環（Mood Circumplex Model）

**Kate Hevner の8点感情円環**
```
1. 霊的      → E Major
2. 悲しい    → G Major
3. 夢のような → F Major / C Major
4. 叙情的な  → C Major
5. こっけいな → Cm / Fm
6. 喜ばしい  → Am
7. 興奮した  → Dm / Gm
8. 元気な    → D Major
```

---

## 🎨 UI/UX

- **グラデーション背景** （紫系カラー）
- **レスポンシブデザイン** （モバイル対応）
- **インタラクティブなボタン** （選択状態の可視化）
- **セクション分けされた結果表示** （見やすさ重視）

---

## 📝 使用技術

- **React 18.2** - UI フレームワーク
- **CSS3** - スタイリング
- **JavaScript ES6+** - ロジック実装

---

## 📄 ライセンス

MIT License - 自由に使用、修正、配布できます

---

## 👨‍💻 作者

**Yuno**

- Music Therapist + Software Developer
- 音楽療法とテクノロジーの融合を探索中

---

## 🔗 関連リンク

- **Qiita 記事**: [[「あなたの今のリズムは？」音楽でセルフケアを行うレジリエンスツールプロト開発](https://qiita.com/s2sbvky33/items/583161adac5e0276c4b7)]
- **CodeSandbox**: https://codesandbox.io/s/github/uno-N/yuno-music-therapy-app

---

## 🤝 貢献

バグ報告や機能提案は、Issues や Pull Requests で歓迎します！

---

**楽しい診断を！🎵**
