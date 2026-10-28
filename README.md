# ProofPage ✳

> **"Your portfolio shouldn't look the same to everyone. Build a profile that adapts to who's viewing it."**

ProofPage is an interactive, proof-driven portfolio builder engineered for modern developers, creators, and product builders. Rather than presenting a static wall of text, ProofPage introduces **ProofPaths**—a Netflix-style decision-tree experience where visitors select what brings them to your page, and your portfolio dynamically rearranges itself to reveal the exact projects, credentials, and custom tabs relevant to them.

Built with **React**, **Vite**, a bespoke **Space Grotesk & DM Sans design system**, **Neon Serverless PostgreSQL**, and **Vercel Serverless Functions**.

---

## 🌟 Key Features & Capabilities

### 1. 🧭 ProofPaths™ Signature Decision Engine
Your portfolio adapts dynamically to who is visiting:
- **"What brings you here today?" Opening Prompt**: When visitors land on `/p/:handle`, they are greeted with an interactive opening question and customizable visitor persona tiles.
- **Netflix-Style Profile Chooser**: Visitors choose their intent from high-fidelity cards (e.g. *“I want to work with you”*, *“Show me what you've done”*, *“I’m just exploring”*, *“Let’s connect”*).
- **Adaptive Visitor Pipeline**: Based on the visitor's choice, ProofPage reveals only the sections mapped to that specific route (e.g., a recruiter gets Flagship Projects → Resume & Services → Contact, while an explorer gets About Me → Education → Honors).
- **Active Profile Banner & Switcher**: Visitors always see which persona is active at the top of the page, with a **`[ ↺ Switch Profile ]`** button to explore other paths at any moment.
- **Visual Decision Tree Studio**:
  - Blueprint dot-matrix canvas with interactive step pipelines.
  - Draggable branch cards with grip handles to visually reorder your tree branches.
  - Interactive simulator to preview how your page morphs for any selected visitor path.
  - Quick-toggle chips (`✓ Projects`, `+ Certs`, `+ Services`) directly on each branch card.
  - Full branch modal to customize labels, subtitles, icons, colors, and section visibility.

---

### 2. 📑 "All Pages" Hub & Modular Content
All modular credentials and pages are consolidated into a clean, segmented workspace hub:
- **Education & Academics**:
  - Record degrees, universities, bootcamps, and specialized coursework.
  - Display GPA, honors distinctions, and start/end years with date-range pills.
- **Certifications & Licenses**:
  - Showcase verified credentials (AWS, Meta, Google Cloud, Docker, Neon, etc.).
  - Store issuing organizations, issue dates, official credential IDs, and external verification links.
- **Achievements & Recognition**:
  - Highlight hackathon championships, open-source recognitions, speaking keynotes, and press mentions.
  - Include event dates, challenge descriptions, and direct announcement URLs.
- **Custom Tabs Engine (`+ Add Tab`)**:
  - Create unlimited bespoke portfolio tabs (e.g. *Services*, *Publications*, *Press*, *Bookings*, *Resume & CV*).
  - Every custom tab shows its own live counter badge in the subnav bar (e.g. `[ Services 2 ]`, `[ Publications 1 ]`).
  - Add and manage items inside custom tabs using the **exact same** card-grid interface and modal editor:
    - **Item Title** (e.g. *Full-Stack MVP Development*, *Published Case Study*)
    - **Subtitle / Role / Price** (e.g. *$3,500+ · Fixed Scope*, *Lead Architect*)
    - **Date / Timeline / Badge** (e.g. *2-3 weeks*, *2026*, *Available Now*)
    - **Detailed Description & Scope**
    - **Action / Resource URL** with external link icons

---

### 3. 🎯 Flagship Case Studies & Measurable Proof
ProofPage goes beyond simple screenshots to document the engineering and product decisions behind what you build:
- **Three-Stage Project Creator**:
  1. *Basics*: Title, subtitle, year, project color theme, and status tag.
  2. *Story*: Problem statement, architectural solution, and measurable outcomes.
  3. *Proof*: Substantiable metric badges (e.g. `42% Faster reporting`, `1.2s Page load`, `99.9% Uptime`), tech stack tags, live demo URL, and GitHub repository.
- **Category Filtering**: Quickly filter projects by category (Full-stack, Product Design, Open Source, etc.).

---

### 4. 👤 Unified Identity & "About Me" Hero
- **Comprehensive Narrative**: Replaced short bios with a dedicated long-form "About Me" narrative that takes center stage in the public portfolio hero.
- **Technical Skills Tag Cloud**: Visual skill pills with quick-add presets (TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS, GraphQL, Python, Redis) and interactive removal.
- **Direct Connect Links**: Clean social buttons for Email (`mailto:`), GitHub, and personal portfolio links.

---

### 5. 🚀 3-Step Guided Onboarding
A tailored onboarding experience for new users:
- **Step 1 — Who are you?**: Select primary persona (Student, Creator, Professional, Business Owner, Coach, Freelancer, Wellness, or Something Else) with support for "I wear multiple hats".
- **Step 2 — What do you want your page to do?**: Choose goals (Show what I do, Tell my story, Build credibility, Share resources, Find connections, or custom goals).
- **Step 3 — Choose your first ProofPath**: Automatically generates a starter decision tree based on the user's answers, paired with instant account creation.

---

### 6. 🔗 Standalone Shareable Public Links (`/p/:handle`)
- Every portfolio has a direct public URL at `/p/:handle` (e.g., `/p/alexbuilds`).
- Public links open in a **new browser tab** directly from the workspace, allowing you to edit in one tab and view your live page in another.
- Requires no login for visitors—delivers a fast, beautiful, and distraction-free portfolio.

---

### 7. ☁️ Neon PostgreSQL & Serverless Backend
- **Neon Serverless Postgres**: Persistent cloud database using `@neondatabase/serverless` connection pooling.
- **Extensible JSONB Storage**: Flexible zero-downtime schema storing `skills`, `education`, `certifications`, `achievements`, `custom_sections`, and `proofpaths` as native JSONB.
- **Automatic Sync & Offline Resilience**: Edits in the workspace automatically sync to Neon DB in real-time with automatic fallback to browser localStorage.
- **Secure Authentication**: Built-in JWT token issuance and `bcryptjs` password hashing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Lucide React Icons |
| **Typography** | Space Grotesk (Headings & Badges), DM Sans (Body) |
| **Styling** | Custom CSS3 with CSS Variables & Responsive Grid System |
| **Database** | Neon Serverless PostgreSQL (`@neondatabase/serverless`) |
| **Backend** | Vercel Serverless Function (`/api/index.js`) |
| **Auth** | JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcryptjs`) |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/proofpage.git
cd proofpage
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example`):
```env
DATABASE_URL=postgresql://neondb_owner:npg_xuPldryThb25@ep-solitary-dust-b5re3t7m-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=proofpage_super_secret_jwt_key_2026_neon
```

### 4. Start the Development Server
```bash
npm run dev
```

The application will start at:
- **Workspace & Editor**: [http://localhost:5173/](http://localhost:5173/)
- **Live Demo Portfolio**: [http://localhost:5173/p/alexbuilds](http://localhost:5173/p/alexbuilds)

> **Demo Account Credentials**:
> - **Username**: `alexbuilds`
> - **Password**: `demo123456`

---

## 🚢 Deploying to Vercel

1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository and set the configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the **Environment Variables**:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `JWT_SECRET`: A secure random secret string for JWT authentication.
5. Click **Deploy**.

Once deployed, your application and public portfolios will be live at:
```
https://<your-project>.vercel.app/p/<username>
```

---

## 📁 Project Structure

```text
proofpage/
├── api/
│   ├── db.js             # Neon PostgreSQL initialization, schema migrations & seed data
│   └── index.js          # Serverless API routes (auth, sync, public profile queries)
├── src/
│   ├── main.jsx          # Complete application logic (Workspace, ProofPaths Studio, All Pages, Public View)
│   └── style.css         # Cohesive design system & responsive styling
├── index.html            # HTML entry point with Space Grotesk & DM Sans webfonts
├── package.json          # Dependencies & build scripts
├── vercel.json           # Vercel serverless rewrites & routing configuration
├── vite.config.js        # Vite configuration & dev server proxy
└── README.md             # Comprehensive project documentation
```

---

## 📄 License
MIT License. Built for builders who care about the evidence behind their craft. ✳
