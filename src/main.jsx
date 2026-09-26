import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const W = 1080;
const H = 1350;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function coverImage(ctx, image, x, y, width, height, focusY = 50) {
  const scale = Math.max(width / image.width, height / image.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (image.width - sw) / 2;
  const sy = Math.max(0, Math.min(image.height - sh, (image.height - sh) * focusY / 100));
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of (text || '').split('\n')) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) { lines.push(''); continue; }
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function drawLogo(ctx, image) {
  const x = 925, y = 30, width = 125, height = 82;
  if (image) {
    const scale = Math.min(width / image.width, height / image.height);
    const w = image.width * scale, h = image.height * scale;
    ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
    return;
  }
  ctx.save();
  ctx.fillStyle = 'rgba(22, 22, 23, .88)';
  ctx.beginPath(); ctx.roundRect(x, y, width, height, 5); ctx.fill();
  ctx.fillStyle = '#df202d';
  ctx.fillRect(x + 8, y + 8, width - 16, 34);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.font = '800 34px "Noto Sans Bengali", sans-serif';
  ctx.fillText('সবার', x + width / 2, y + 26, width - 18);
  ctx.font = '800 30px "Noto Sans Bengali", sans-serif';
  ctx.fillText('কথা', x + width / 2, y + 64, width - 20);
  ctx.restore();
}

function drawCard(canvas, data, image, logoImage) {
  const ctx = canvas.getContext('2d');
  canvas.width = W;
  canvas.height = H;

  // Upper image field.
  ctx.fillStyle = '#050506';
  ctx.fillRect(0, 0, W, 682);
  if (image) coverImage(ctx, image, 0, 0, W, 682, data.cropY);
  drawLogo(ctx, logoImage);

  // Date ribbon and the signature red rule.
  const ribbon = ctx.createLinearGradient(210, 0, 870, 0);
  ribbon.addColorStop(0, 'rgba(191, 24, 47, 0)');
  ribbon.addColorStop(.22, 'rgba(190, 26, 49, .84)');
  ribbon.addColorStop(.78, 'rgba(190, 26, 49, .84)');
  ribbon.addColorStop(1, 'rgba(191, 24, 47, 0)');
  ctx.fillStyle = ribbon;
  ctx.fillRect(200, 625, 680, 57);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0,0,0,.55)';
  ctx.shadowBlur = 5;
  ctx.font = '700 34px "Noto Serif Bengali", serif';
  ctx.fillText(data.date || '', W / 2, 654, 600);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#c51e39';
  ctx.fillRect(0, 682, W, 15);

  // Blue gradient lower panel, sampled from the provided visual direction.
  const blue = ctx.createRadialGradient(540, 705, 35, 540, 1120, 790);
  blue.addColorStop(0, '#2929df');
  blue.addColorStop(.52, '#17189a');
  blue.addColorStop(1, '#060d50');
  ctx.fillStyle = blue;
  ctx.fillRect(0, 697, W, H - 697);

  // Fit both headline colors together in the generous center zone.
  const maxWidth = 930;
  let fontSize = 94;
  let firstLines = [];
  let secondLines = [];
  let lineHeight = 1.2;
  while (fontSize >= 48) {
    ctx.font = `900 ${fontSize}px "Noto Serif Bengali", serif`;
    firstLines = wrapText(ctx, data.headline || '', maxWidth);
    secondLines = wrapText(ctx, data.highlight || '', maxWidth);
    const totalLines = firstLines.length + secondLines.length;
    lineHeight = fontSize * 1.25;
    if (totalLines * lineHeight <= 430) break;
    fontSize -= 2;
  }
  const totalLines = firstLines.length + secondLines.length;
  const headlineTop = 915 - (totalLines * lineHeight) / 2;
  let baseline = headlineTop + lineHeight * .78;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(3, 6, 48, .55)';
  ctx.shadowColor = 'rgba(2, 5, 35, .28)';
  ctx.shadowBlur = 3;
  ctx.font = `900 ${fontSize}px "Noto Serif Bengali", serif`;
  for (const line of firstLines) {
    ctx.strokeText(line, W / 2, baseline, maxWidth);
    ctx.fillStyle = '#fff'; ctx.fillText(line, W / 2, baseline, maxWidth);
    baseline += lineHeight;
  }
  for (const line of secondLines) {
    ctx.strokeText(line, W / 2, baseline, maxWidth);
    ctx.fillStyle = '#ffea00'; ctx.fillText(line, W / 2, baseline, maxWidth);
    baseline += lineHeight;
  }
  ctx.shadowBlur = 0;

  // Footer labels.
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.font = '600 30px "Noto Serif Bengali", serif';
  ctx.fillText(data.comment || '', 66, 1300, 430);
  ctx.textAlign = 'right';
  ctx.font = '400 29px Arial, sans-serif';
  ctx.fillText(data.website || '', 1010, 1300, 470);
}

const initial = {
  date: '১৯ সেপ্টেম্বর ২০২৬',
  headline: 'বুড়িগঙ্গা থেকে অজ্ঞাত দুই',
  highlight: 'ব্যক্তির মরদেহ উদ্ধার',
  comment: 'বিস্তারিত কমেন্টে',
  website: 'www.sobarkotha.com',
  cropY: 50,
};

function App() {
  const [form, setForm] = useState(initial);
  const [photo, setPhoto] = useState('');
  const [logo, setLogo] = useState('');
  const [notice, setNotice] = useState('');
  const photoInput = useRef(null);
  const logoInput = useRef(null);
  const exportCanvas = useRef(null);

  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const readImage = (event, setter) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setNotice('একটি ছবির ফাইল বেছে নিন।'); return; }
    if (file.size > 20 * 1024 * 1024) { setNotice('ছবিটি ২০ MB-এর মধ্যে রাখুন।'); return; }
    const reader = new FileReader();
    reader.onload = () => { setter(String(reader.result)); setNotice(''); };
    reader.onerror = () => setNotice('ছবিটি খোলা যায়নি—আবার চেষ্টা করুন।');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const exportPng = async () => {
    setNotice('কার্ড তৈরি হচ্ছে…');
    try {
      await document.fonts.ready;
      await Promise.all([
        document.fonts.load('900 90px "Noto Serif Bengali"'),
        document.fonts.load('800 32px "Noto Sans Bengali"'),
      ]);
      const [image, logoImage] = await Promise.all([
        photo ? loadImage(photo) : Promise.resolve(null),
        logo ? loadImage(logo) : Promise.resolve(null),
      ]);
      drawCard(exportCanvas.current, form, image, logoImage);
      exportCanvas.current.toBlob((blob) => {
        if (!blob) { setNotice('PNG তৈরি করা যায়নি। আবার চেষ্টা করুন।'); return; }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sobarkotha-photocard-${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
        URL.revokeObjectURL(url);
        setNotice('কার্ডটি ডাউনলোড হয়েছে।');
      }, 'image/png');
    } catch (error) {
      console.error(error);
      setNotice('কার্ড তৈরি হয়নি। ছবিটি আবার আপলোড করে চেষ্টা করুন।');
    }
  };

  const today = new Date();
  const dateToday = `${today.getDate()} ${['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'][today.getMonth()]} ${today.getFullYear()}`;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="সবার কথা ফটোকার্ড স্টুডিও">
          <span className="brand-mark"><span>সবার</span><b>কথা</b></span>
          <span className="brand-copy"><strong>ফটোকার্ড স্টুডিও</strong><small>SOBARKOTHA · NEWSROOM TOOL</small></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> আপনার কার্ড, আপনার ব্রাউজারেই তৈরি</div>
      </header>

      <main id="top" className="workspace">
        <section className="intro">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> NEWS CARD MAKER</p>
            <h1>খবরের কার্ড তৈরি করুন,<br /><em>সহজেই।</em></h1>
            <p className="intro-copy">ছবি দিন, শিরোনাম লিখুন—সবার কথার চেনা ফ্রেমে রেডি কার্ড ডাউনলোড করুন।</p>
          </div>
          <div className="format-badge"><span>4:5</span><small>সোশ্যাল মিডিয়া<br />রেডি</small></div>
        </section>

        <section className="studio-grid">
          <div className="editor-panel">
            <div className="panel-heading"><div><span className="step">01</span><div><h2>কার্ড সাজান</h2><p>লেখা আর ছবি যোগ করুন</p></div></div><button className="reset-button" onClick={() => { setForm(initial); setPhoto(''); setLogo(''); setNotice('ফর্ম আবার আগের মতো হয়েছে।'); }}>রিসেট</button></div>

            <div className="form-section">
              <div className="section-label"><span className="section-icon">▧</span><div><strong>মূল ছবি</strong><small>কার্ডের উপরের অংশে দেখাবে</small></div></div>
              <input ref={photoInput} className="visually-hidden" type="file" accept="image/*" onChange={(e) => readImage(e, setPhoto)} />
              <button className={`upload-box ${photo ? 'has-photo' : ''}`} onClick={() => photoInput.current?.click()}>
                {photo ? <><img src={photo} alt="আপলোড করা ছবির ছোট প্রিভিউ" /><span className="upload-overlay">ছবি বদলান</span></> : <><span className="upload-icon">＋</span><strong>ছবি বেছে নিন</strong><small>JPG, PNG বা WEBP · সর্বোচ্চ ২০ MB</small></>}
              </button>
              {photo && <><div className="range-label"><span>ছবির অবস্থান</span><span>{form.cropY}%</span></div><input aria-label="ছবির উল্লম্ব অবস্থান" className="range" type="range" min="0" max="100" value={form.cropY} onChange={(e) => update('cropY', Number(e.target.value))} /></>}
              <div className="section-label logo-label"><span className="section-icon">▣</span><div><strong>লোগো <small className="optional">ঐচ্ছিক</small></strong><small>নিজস্ব লোগো দিলে ডিফল্ট লোগোর বদলে বসবে</small></div></div>
              <input ref={logoInput} className="visually-hidden" type="file" accept="image/*" onChange={(e) => readImage(e, setLogo)} />
              <div className="logo-row"><span className="mini-brand"><b>সবার</b><strong>কথা</strong></span><button className="secondary-button" onClick={() => logoInput.current?.click()}>{logo ? 'লোগো বদলান' : 'লোগো আপলোড'}</button>{logo && <button className="icon-button" aria-label="লোগো মুছুন" onClick={() => setLogo('')}>×</button>}</div>
            </div>

            <div className="form-divider" />
            <div className="form-section text-fields">
              <div className="section-label"><span className="section-icon">T</span><div><strong>কার্ডের লেখা</strong><small>প্রিভিউতে সাথে সাথে বদলে যাবে</small></div></div>
              <label className="field-label" htmlFor="date">তারিখ</label>
              <div className="input-with-action"><input id="date" value={form.date} maxLength={38} onChange={(e) => update('date', e.target.value)} /><button title="আজকের তারিখ বসান" onClick={() => update('date', dateToday)}>আজ</button></div>
              <label className="field-label" htmlFor="headline">শিরোনাম <span>সাদা রঙে</span></label>
              <textarea id="headline" rows="2" maxLength={95} value={form.headline} onChange={(e) => update('headline', e.target.value)} placeholder="শিরোনামের প্রথম অংশ লিখুন" />
              <label className="field-label" htmlFor="highlight">শিরোনামের হাইলাইট <span className="yellow-label">হলুদ রঙে</span></label>
              <textarea id="highlight" rows="2" maxLength={95} value={form.highlight} onChange={(e) => update('highlight', e.target.value)} placeholder="যে অংশটি হলুদ হবে" />
              <div className="field-pair"><div><label className="field-label" htmlFor="comment">নিচের বাম লেখা</label><input id="comment" value={form.comment} maxLength={45} onChange={(e) => update('comment', e.target.value)} /></div><div><label className="field-label" htmlFor="website">ওয়েবসাইট</label><input id="website" value={form.website} maxLength={50} onChange={(e) => update('website', e.target.value)} /></div></div>
            </div>
            <div className="privacy-note"><span>◉</span><p>আপনার ছবি কোথাও আপলোড হয় না। সব কাজ আপনার ব্রাউজারেই হয়।</p></div>
          </div>

          <div className="preview-column">
            <div className="preview-heading"><div><span className="step">02</span><div><h2>লাইভ প্রিভিউ</h2><p>আপনার কার্ড দেখতে যেমন হবে</p></div></div><span className="size-chip">1080 × 1350 px</span></div>
            <div className="preview-stage">
              <div className="card-preview" aria-label="ফটোকার্ডের লাইভ প্রিভিউ">
                <div className="card-photo">
                  {photo ? <img className="preview-photo" src={photo} alt="কার্ডের ছবি" style={{ objectPosition: `center ${form.cropY}%` }} /> : <div className="photo-empty"><span className="empty-frame">▧</span><strong>আপনার ছবিটি এখানে দেখাবে</strong><small>বাম পাশ থেকে ছবি আপলোড করুন</small></div>}
                  {logo ? <img className="preview-logo custom-logo" src={logo} alt="নিজস্ব লোগো" /> : <span className="preview-logo"><b>সবার</b><strong>কথা</strong></span>}
                  <div className="date-ribbon"><span>{form.date || 'তারিখ'}</span></div>
                </div>
                <div className="red-rule" />
                <div className="card-lower">
                  <div className="card-headline"><div className="headline-white">{form.headline || 'আপনার শিরোনাম'}</div><div className="headline-yellow">{form.highlight || 'হাইলাইট করা অংশ'}</div></div>
                  <div className="card-footer"><span>{form.comment}</span><span>{form.website}</span></div>
                </div>
              </div>
            </div>
            <div className="export-row"><div className="export-copy"><span className="export-check">✓</span><span><strong>ডাউনলোডের জন্য প্রস্তুত</strong><small>হাই-কোয়ালিটি PNG · ৪:৫ অনুপাত</small></span></div><button className="download-button" onClick={exportPng}><span>↓</span> PNG ডাউনলোড করুন</button></div>
            {notice && <p className="notice" role="status">{notice}</p>}
            <p className="preview-footnote">ডাউনলোড করা কার্ড সরাসরি ফেসবুক, ইনস্টাগ্রাম বা ওয়েবসাইটে ব্যবহার করতে পারবেন।</p>
          </div>
        </section>
        <footer className="page-footer"><span>© সবার কথা · ফটোকার্ড স্টুডিও</span><span>একটি সহজ newsroom tool</span></footer>
      </main>
      <canvas ref={exportCanvas} className="export-canvas" aria-hidden="true" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
