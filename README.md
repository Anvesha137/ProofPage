# ProofPage

A polished, proof-driven portfolio builder for developers and product builders. Built with React, Vite, plain CSS, Neon PostgreSQL, and Serverless API routes, ready to deploy to Vercel.

## 🚀 Key Updates & Features

- **Shareable Public Links (`/p/:handle`)**: Share your personal link with anyone. Visitors directly view your public portfolio without needing an account or workspace controls.
- **Neon PostgreSQL Database**: Connected and configured with your Neon DB connection pooler.
- **User Authentication**: Secure Sign Up & Sign In powered by bcrypt password hashing and JWT authentication.
- **Cloud Portfolio Sync**: Edits to profiles and projects are saved straight to Neon DB and cached locally.
- **Quick Demo Account**: Seeded demo account (`alexbuilds` / `demo123456`) ready for instant testing.
- **Interactive Project Cards**: Capture the problem, approach, outcome, metrics, live demo, and GitHub links.
- **Vercel Serverless Ready**: Uses `/api/index.js` for serverless API endpoints and `vercel.json` for routing.

## 💻 Run Locally

```bash
npm install
npm run dev
```

Visit:
- Workspace: [http://localhost:5173/](http://localhost:5173/)
- Public Alex Demo: [http://localhost:5173/p/alexbuilds](http://localhost:5173/p/alexbuilds)

## 🌐 Deploy to Vercel

1. Push this project to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add the following **Environment Variables** in Vercel Project Settings:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_xuPldryThb25@ep-solitary-dust-b5re3t7m-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `JWT_SECRET`: `proofpage_super_secret_jwt_key_2026_neon` (or your custom secret)
7. Click **Deploy**.

Once deployed, your shareable public portfolios will be live at:
`https://<your-project>.vercel.app/p/<your_handle>`
