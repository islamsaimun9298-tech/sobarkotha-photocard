# সবার কথা ফটোকার্ড স্টুডিও

বাংলা সংবাদ ফটোকার্ড তৈরি ও PNG ডাউনলোডের জন্য একটি static React/Vite app। ৪:৫ অনুপাতের ১০৮০×১৩৫০ পিক্সেল কার্ড তৈরি হয়। ছবির ফাইল browser-এর বাইরে পাঠানো হয় না।

## ব্যবহার

```bash
npm install
npm run dev
```

ছবি আপলোড করুন, চাইলে নিজের লোগো দিন, তারিখ/শিরোনাম/ফুটারের লেখা বদলান, তারপর **PNG ডাউনলোড করুন** চাপুন। ছবি-ক্রপের slider উপরের ছবির উল্লম্ব অবস্থান সামলায়।

## Vercel deploy

প্রজেক্টটি Vercel-এ একটি নতুন Vite/static project হিসেবে import করুন, অথবা Vercel CLI ব্যবহার করুন:

```bash
npm install -g vercel
vercel
vercel --prod
```

`vercel.json`-এ build command (`npm run build`) ও output directory (`dist`) সেট করা আছে। কোনো environment variable বা backend service প্রয়োজন নেই।

## Build check

```bash
npm run build
```
