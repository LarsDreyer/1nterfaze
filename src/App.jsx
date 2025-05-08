import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector';

const languages = [
  { code: 'auto', label: 'Detect language' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'sv', label: 'Swedish' },
  { code: 'da', label: 'Danish' },
  { code: 'fi', label: 'Finnish' },
  { code: 'pl', label: 'Polish' },
  { code: 'ru', label: 'Russian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
  // add more as needed
];

export default function App() {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('fr');
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const translate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) throw new Error('Missing API key');

      const model = 'gemini-1.5-pro';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

      const prompt = buildPrompt(sourceLang, targetLang, sourceText);

      const body = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`API error: ${detail}`);
      }

      const data = await res.json();
      const translation =
        data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setTargetText(translation.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="logo">
          <span className="one">1</span>INTERFAZE
        </div>
      </header>

      <main>
        <h1>Translate</h1>
        <div className="panels">
          <div className="panel">
            <LanguageSelector
              value={sourceLang}
              onChange={setSourceLang}
              options={languages}
            />
            <textarea
              placeholder="Enter text"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
          </div>

          <div className="panel">
            <LanguageSelector
              value={targetLang}
              onChange={setTargetLang}
              options={languages.filter((l) => l.code !== 'auto')}
            />
            <textarea readOnly value={loading ? 'Translating…' : targetText} />
          </div>
        </div>

        <button onClick={translate} disabled={loading}>
          {loading ? 'Translating…' : 'Translate'}
        </button>

        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

function buildPrompt(src, tgt, text) {
  const srcLabel = langLabel(src);
  const tgtLabel = langLabel(tgt);

  if (src === 'auto') {
    return `Detect the language of the following text and translate it to ${tgtLabel}. Only provide the translated text.\n\n"${text}"`;
  }

  return `Translate the following text from ${srcLabel} to ${tgtLabel}. Only provide the translated text.\n\n"${text}"`;
}

function langLabel(code) {
  const match = languages.find((l) => l.code === code);
  return match ? match.label : code;
}
