# Interfaze AI Translator

A lightweight web translator powered by Google's Gemini 1.5 Pro model.

## Quick start (local)

```bash
npm install
npm run dev
```

Create a `.env` file with:

```
VITE_GEMINI_API_KEY=YOUR_REAL_KEY
```

## Production build & GitHub Pages

The repo includes a GitHub Actions workflow that builds the Vite project
and deploys the static `dist/` folder to the **gh-pages** branch.  
Push to `main`, wait for the action to finish, then ensure Pages is
enabled in repo → Settings → Pages with branch **gh-pages**.

A `CNAME` file is committed so GitHub automatically maps  
`translate.1nterfaze.com` to the site once you configure the DNS A/ALIAS
record at your domain registrar.

---
MIT License
