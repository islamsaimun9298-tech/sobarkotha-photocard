# সবার কথা ফটোকার্ড স্টুডিও

বাংলা সংবাদ ফটোকার্ড তৈরির responsive browser app। ৪:৫ অনুপাতের ১০৮০×১৩৫০ PNG তৈরি হয়। ছবি, শিরোনাম, তারিখ, লোগো ও ফুটার সম্পাদনা করা যায়; ছবি ব্রাউজারের বাইরে পাঠানো হয় না।

## লাইভ

Production: https://sobarkotha-photocard.vercel.app

## লোকালি চালান

```bash
npm install
npm run dev
```

প্রোডাকশন bundle যাচাই করতে `npm run build` চালান। React/Vite app-এর source `src/`-এ; Vercel direct deployment-এর self-contained HTML `vercel-static.html`-এ।

## Vercel

Vercel project `sobarkotha-photocard` তৈরি করা হয়েছে এবং production URL-এ deploy আছে। Production URL-টি public; Vercel Authentication কেবল preview deployments-এ প্রযোজ্য। GitHub source repo private: https://github.com/islamsaimun9298-tech/sobarkotha-photocard

Vercel-এর auto-deploy Git link platform থেকে verify করা যায়নি; তাই বর্তমান production version static HTML হিসেবে সরাসরি publish হয়েছে। ভবিষ্যতে Git push থেকে auto-deploy করতে Vercel project-এর **Settings → Git** থেকে private repo-টি যুক্ত করুন। তারপর repo-র `vercel-static.html`-কে `index.html` হিসেবে publish বা Vite app build (`npm run build`, output `dist`) ব্যবহার করতে পারবেন। Vercel CLI-তে `vercel --prod`-ও ব্যবহার করা যায়।
