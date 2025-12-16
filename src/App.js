import React, { useState, useRef } from 'react';
import './styles.css';

export default function App() {
  const [step, setStep] = useState(0);
  const [tapTimes, setTapTimes] = useState([]);
  const [isTapping, setIsTapping] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [rhythmLevel, setRhythmLevel] = useState(null);
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [extraversion, setExtraversion] = useState(null);
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [result, setResult] = useState(null);
  
  const tapStartTimeRef = useRef(null);
  const tapTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // ========== リズム複雑度計算 ==========
  const calculateRhythmComplexityLevel = (tapTimesArray) => {
    if (tapTimesArray.length < 5) {
      return { level: null, message: '5回以上タップしてください' };
    }

    const ioi = [];
    for (let i = 1; i < tapTimesArray.length; i++) {
      ioi.push(tapTimesArray[i] - tapTimesArray[i - 1]);
    }

    const validIOI = ioi.filter(interval => interval > 200 && interval < 5000);

    if (validIOI.length < 3) {
      return { level: null, message: '有効なタップペアが不足しています' };
    }

    const meanIOI = validIOI.reduce((a, b) => a + b, 0) / validIOI.length;
    const variance = validIOI.reduce((sum, val) => sum + Math.pow(val - meanIOI, 2), 0) / validIOI.length;
    const stdIOI = Math.sqrt(variance);

    const cv = (stdIOI / meanIOI) * 100;

    let level, levelName;
    if (cv < 5) {
      level = 1;
      levelName = '完全規則的ビート';
    } else if (cv < 10) {
      level = 2;
      levelName = '規則的ビート + わずかな変動';
    } else if (cv < 20) {
      level = 3;
      levelName = '複数層のビート';
    } else if (cv < 35) {
      level = 4;
      levelName = '中程度の複雑性';
    } else if (cv < 50) {
      level = 5;
      levelName = '複雑なリズム';
    } else if (cv < 70) {
      level = 6;
      levelName = '高度な複雑性';
    } else {
      level = 7;
      levelName = '極度の複雑性';
    }

    const estimatedBpm = Math.round(60000 / meanIOI);

    return {
      level,
      levelName,
      cv: Math.round(cv * 100) / 100,
      estimatedBpm,
      validIOICount: validIOI.length,
      confidence: validIOI.length >= 20 ? 'HIGH' : validIOI.length >= 10 ? 'MODERATE' : 'LOW'
    };
  };

  // ========== Step 1: リズムタップ ==========
  const handleStartTap = () => {
    setTapTimes([]);
    setTapCount(0);
    setTimeRemaining(30);
    setIsTapping(true);
    setRhythmLevel(null);
    tapStartTimeRef.current = Date.now();

    // 30秒後に自動終了
    tapTimerRef.current = setTimeout(() => {
      // タイマー終了時点のtapTimesを使用
      setIsTapping(false);
      clearInterval(countdownTimerRef.current);
    }, 30000);

    let countdown = 30;
    countdownTimerRef.current = setInterval(() => {
      countdown--;
      setTimeRemaining(countdown);
      if (countdown <= 0) {
        clearInterval(countdownTimerRef.current);
      }
    }, 1000);
  };

  const handleTap = () => {
    if (!isTapping) return;
    const now = Date.now();
    setTapTimes((prev) => [...prev, now]);
    setTapCount((prev) => prev + 1);
  };

  const handleStopTap = () => {
    setIsTapping(false);
    clearTimeout(tapTimerRef.current);
    clearInterval(countdownTimerRef.current);

    const result = calculateRhythmComplexityLevel(tapTimes);
    if (result.level) {
      setRhythmLevel(result);
      setStep(1);
    } else {
      alert(result.message);
    }
  };

  // ========== 30秒終了後の自動判定 ==========
  React.useEffect(() => {
    if (!isTapping && tapTimes.length > 0) {
      // isTappingがfalseになった時点でtapTimesから判定
      const result = calculateRhythmComplexityLevel(tapTimes);
      if (result.level) {
        setRhythmLevel(result);
        setStep(1);
      } else {
        alert(result.message);
      }
    }
  }, [isTapping]);

  // ========== Step 2: 外向性診断 ==========
  const handleExtraversion = () => {
    if (q1 === null || q2 === null || q3 === null) {
      alert('全ての質問に答えてください');
      return;
    }
    const score = ((q1 + q2 + q3) / 3).toFixed(1);
    setExtraversion(parseFloat(score));
    setStep(2);
  };

  // ========== Step 3: 気分選択 ==========
  const handleMoodSelect = (moodId) => {
    setMood(moodId);
    setStep(3);
  };

  // ========== Step 4: エネルギー選択 ==========
  const handleEnergySelect = (energyLevel) => {
    setEnergy(energyLevel);
    generateResult(rhythmLevel, extraversion, mood, energyLevel);
    setStep(4);
  };

  // ========== 結果生成（Kate Hevner 感情円環） ==========
  const generateResult = (rhyLevel, extScore, moodId, energyLvl) => {
    // Kate Hevner の8点感情円環（日本語ラベル版）
    const moodMap = {
      1: {
        label: '霊的',
        key: 'E Major',
        harmony: '明るい（ドーパミン++）',
        frequency: '5kHz-10kHz',
        hormone: 'ドーパミン++',
        overtone: '前頭葉・視覚系'
      },
      2: {
        label: '悲しい',
        key: 'G Major',
        harmony: '温か（セロトニン++）',
        frequency: '2kHz-6kHz',
        hormone: 'セロトニン++',
        overtone: '前頭葉・感情'
      },
      3: {
        label: '夢のような',
        key: 'F Major / C Major',
        harmony: '温か・安定',
        frequency: '瞑え（1kHz未満）',
        hormone: 'セロトニン・ドーパミン均衡',
        overtone: '脳幹・副交感神経'
      },
      4: {
        label: '叙情的な',
        key: 'C Major',
        harmony: '明るい・中立',
        frequency: '3kHz-8kHz',
        hormone: 'ドーパミン（低）→上昇傾向',
        overtone: '側頭葉・新規性'
      },
      5: {
        label: 'こっけいな',
        key: 'Cm / Fm',
        harmony: '暗い・深い（セロトニン低下）',
        frequency: '短3度（6:5）・短6度',
        hormone: 'セロトニン低下',
        overtone: '深部脳領域・無意識'
      },
      6: {
        label: '喜ばしい',
        key: 'Am',
        harmony: '温か・深い（ノルアドレナリン優位）',
        frequency: '短3度・短6度',
        hormone: 'ノルアドレナリン優位',
        overtone: '前頭葉・感情・海馬'
      },
      7: {
        label: '興奮した',
        key: 'Dm / Gm',
        harmony: '激しい・暗い（アドレナリン++）',
        frequency: '5kHz以上',
        hormone: 'アドレナリン++',
        overtone: '脳体・興奮刺激'
      },
      8: {
        label: '元気な',
        key: 'D Major',
        harmony: '明るい・活力',
        frequency: '5kHz-10kHz',
        hormone: 'ドーパミン・アドレナリン',
        overtone: '視覚系・活性化'
      }
    };

    const moodData = moodMap[moodId];

    const resultData = {
      rhythmLevel: rhyLevel.level,
      rhythmLevelName: rhyLevel.levelName,
      estimatedBpm: rhyLevel.estimatedBpm,
      cv: rhyLevel.cv,
      extraversion: extScore,
      moodLabel: moodData.label,
      moodId: moodId,
      key: moodData.key,
      harmony: moodData.harmony,
      frequency: moodData.frequency,
      hormone: moodData.hormone,
      overtone: moodData.overtone,
    };

    setResult(resultData);
  };

  // ========== UI レンダリング ==========
  return (
    <div className="app-container">
      <h1>🎵 回復力をもたらす音楽を見つける</h1>

      {/* Step 0: リズムタップ */}
      {step === 0 && (
        <div className="step-card">
          <h2>Step 1: リズムを測定します</h2>
          <p>30秒間、あなたのリズムで自由にタップしてください</p>
          
          {!isTapping ? (
            <>
              <p style={{ fontSize: '0.9em', color: '#999' }}>タップ回数: {tapCount}</p>
              <button className="btn-primary" onClick={handleStartTap}>
                タップ開始
              </button>
            </>
          ) : (
            <>
              <div className="timer-display">
                <div className="time-remaining">{timeRemaining}秒</div>
                <div className="tap-count">タップ回数: {tapCount}</div>
              </div>
              <button
                className="btn-tap"
                onClick={handleTap}
                style={{ fontSize: '3em', padding: '40px', marginTop: '20px' }}
              >
                👊 タップ
              </button>
              <button className="btn-secondary" onClick={handleStopTap} style={{ marginTop: '20px' }}>
                終了
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 1: 外向性診断 */}
      {step === 1 && (
        <div className="step-card">
          <h2>Step 2: あなたについて教えてください</h2>

          <div className="question">
            <p>Q1. 新しい人に会うのは好きですか？</p>
            <div className="question-buttons">
              <button className={q1 === 3 ? 'selected' : ''} onClick={() => setQ1(3)}>
                A. とても好き（心が躍る）
              </button>
              <button className={q1 === 2 ? 'selected' : ''} onClick={() => setQ1(2)}>
                B. 好きな方
              </button>
              <button className={q1 === 0 ? 'selected' : ''} onClick={() => setQ1(0)}>
                C. どちらでもない
              </button>
              <button className={q1 === -2 ? 'selected' : ''} onClick={() => setQ1(-2)}>
                D. 苦手な方
              </button>
              <button className={q1 === -3 ? 'selected' : ''} onClick={() => setQ1(-3)}>
                E. とても苦手（疲れる）
              </button>
            </div>
          </div>

          <div className="question">
            <p>Q2. 一人の時間は必要ですか？</p>
            <div className="question-buttons">
              <button className={q2 === 3 ? 'selected' : ''} onClick={() => setQ2(3)}>
                A. 全く必要ない
              </button>
              <button className={q2 === 2 ? 'selected' : ''} onClick={() => setQ2(2)}>
                B. あまり必要ない
              </button>
              <button className={q2 === 0 ? 'selected' : ''} onClick={() => setQ2(0)}>
                C. どちらでもない
              </button>
              <button className={q2 === -2 ? 'selected' : ''} onClick={() => setQ2(-2)}>
                D. ある程度必要
              </button>
              <button className={q2 === -3 ? 'selected' : ''} onClick={() => setQ2(-3)}>
                E. 非常に必要
              </button>
            </div>
          </div>

          <div className="question">
            <p>Q3. グループ活動 vs 個人活動、どちらを好みますか？</p>
            <div className="question-buttons">
              <button className={q3 === 3 ? 'selected' : ''} onClick={() => setQ3(3)}>
                A. グループ活動が好き
              </button>
              <button className={q3 === 2 ? 'selected' : ''} onClick={() => setQ3(2)}>
                B. グループ活動の方が好き
              </button>
              <button className={q3 === 0 ? 'selected' : ''} onClick={() => setQ3(0)}>
                C. どちらでもない
              </button>
              <button className={q3 === -2 ? 'selected' : ''} onClick={() => setQ3(-2)}>
                D. 個人活動の方が好き
              </button>
              <button className={q3 === -3 ? 'selected' : ''} onClick={() => setQ3(-3)}>
                E. 個人活動が好き
              </button>
            </div>
          </div>

          <button className="btn-primary" onClick={handleExtraversion} style={{ marginTop: '20px' }}>
            次へ
          </button>
        </div>
      )}

      {/* Step 2: 気分選択 */}
      {step === 2 && (
        <div className="step-card">
          <h2>Step 3: 今の気分に近いものを選んでください</h2>
          <div className="mood-circle">
            {[
              { id: 1, label: '霊的', emoji: '😊' },
              { id: 2, label: '悲しい', emoji: '😢' },
              { id: 3, label: '夢のような', emoji: '😌' },
              { id: 4, label: '叙情的な', emoji: '😐' },
              { id: 5, label: 'こっけいな', emoji: '😄' },
              { id: 6, label: '喜ばしい', emoji: '😃' },
              { id: 7, label: '興奮した', emoji: '🤩' },
              { id: 8, label: '元気な', emoji: '💪' },
            ].map((m) => (
              <button
                key={m.id}
                className={`mood-btn ${mood === m.id ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(m.id)}
              >
                {m.emoji}
                <br />
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: エネルギー選択 */}
      {step === 3 && (
        <div className="step-card">
          <h2>Step 4: 今のエネルギーレベルを選んでください</h2>
          <div className="energy-slider">
            {[
              { level: 0, name: 'Empty (空っぽ)', emoji: '😴' },
              { level: 1, name: 'Tired (疲れた)', emoji: '😪' },
              { level: 2, name: 'Low Energy (低)', emoji: '😒' },
              { level: 3, name: 'Neutral (中程度)', emoji: '😐' },
              { level: 4, name: 'Activated (活動的)', emoji: '😊' },
              { level: 5, name: 'Energized (高・活力)', emoji: '🤩' },
            ].map((e) => (
              <button
                key={e.level}
                className={`energy-btn ${energy === e.level ? 'selected' : ''}`}
                onClick={() => handleEnergySelect(e.level)}
              >
                <div className="energy-emoji">{e.emoji}</div>
                <div className="energy-name">{e.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: 結果表示 */}
      {step === 4 && (
        <div className="step-card">
          <h2>あなたに効果的な音楽特性</h2>
          {result && (
            <div className="result-card">
              <div className="result-section">
                <h3>🎵 リズム複雑度</h3>
                <div className="result-row">
                  <strong>Level:</strong>
                  <span>{result.rhythmLevel} - {result.rhythmLevelName}</span>
                </div>
                <div className="result-row">
                  <strong>推定BPM:</strong>
                  <span>{result.estimatedBpm}</span>
                </div>
                <div className="result-row">
                  <strong>変動係数（CV）:</strong>
                  <span>{result.cv}%</span>
                </div>
              </div>

              <div className="result-section">
                <h3>🧠 パーソナリティ</h3>
                <div className="result-row">
                  <strong>外向性スコア:</strong>
                  <span>{result.extraversion}</span>
                </div>
              </div>

              <div className="result-section">
                <h3>🎹 気分 & 推奨キー</h3>
                <div className="result-row">
                  <strong>気分:</strong>
                  <span>{result.moodId}. {result.moodLabel}</span>
                </div>
                <div className="result-row">
                  <strong>推奨キー:</strong>
                  <span>{result.key}</span>
                </div>
                <div className="result-row">
                  <strong>ハーモニー色:</strong>
                  <span>{result.harmony}</span>
                </div>
              </div>

              <div className="result-section">
                <h3>🌊 音響特性</h3>
                <div className="result-row">
                  <strong>高周波帯:</strong>
                  <span>{result.frequency}</span>
                </div>
                <div className="result-row">
                  <strong>倍音構造:</strong>
                  <span>{result.overtone}</span>
                </div>
              </div>

              <div className="result-section">
                <h3>⚗️ ホルモン状態</h3>
                <div className="result-row">
                  <strong>ホルモン:</strong>
                  <span>{result.hormone}</span>
                </div>
              </div>
            </div>
          )}
          <button
            className="btn-primary"
            onClick={() => {
              setStep(0);
              setTapTimes([]);
              setTapCount(0);
              setTimeRemaining(30);
              setRhythmLevel(null);
              setQ1(null);
              setQ2(null);
              setQ3(null);
              setExtraversion(null);
              setMood(null);
              setEnergy(null);
              setResult(null);
            }}
          >
            もう一度試す
          </button>
        </div>
      )}
    </div>
  );
}
