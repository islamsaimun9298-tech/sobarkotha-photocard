# সবার কথা ফটোকার্ড স্টুডিও

বাংলা সংবাদ ফটোকার্ড তৈরির responsive browser app। ৪:৫ অনুপাতের ১০৮০×১৩৫০ PNG তৈরি হয়। ছবি, শিরোনাম, তারিখ, লোগো ও ফুটার সম্পাদনা করা যায়; ছবি ব্রাউজারের বাইরে পাঠানো হয় না।

## লাইভ

Production: https://sobarkotha-photocard.vercel.app

## ব্যবহার ও লোকাল ডেভেলপমেন্ট

ছবি আপলোড করুন, চাইলে নিজস্ব লোগো দিন, তারিখ/শিরোনাম/ফুটার সম্পাদনা করুন, তারপর **PNG ডাউনলোড করুন** চাপুন।

```bash
npm install
npm run dev
```

Production build পরীক্ষা করতে `npm run build` চালান। React/Vite source `src/`-এ; `vercel-static.html` standalone deployment fallback/reference হিসেবে রাখা আছে।

## GitHub ও Vercel

- Public source: https://github.com/islamsaimun9298-tech/sobarkotha-photocard
- Vercel project: `sobarkotha-photocard`
- GitHub `main` branch Vercel-এ যুক্ত; `main`-এ push করলে স্বয়ংক্রিয়ভাবে build ও deploy হয়।
- Production URL public; preview deployment-গুলোতে Vercel sign-in protection থাকে।
- Vercel build command: `npm run build`; output: `dist/`।
