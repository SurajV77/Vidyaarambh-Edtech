# 🎓 Vidyaarambh — Tuition Management Web App

> **A dignified, disciplined, and institutional web application engineered for private coaching tutors and educational coaching institutes.**

Vidyaarambh bridges the gap between academic mentorship, student accountability, and institutional administration. Designed with a classical academic aesthetic (Deep Obsidian Navy, Warm Gold, and Parchment Ivory), it features real-time dynamic typography, interactive 3D perspective elements, transparent fee accounting, and comprehensive study material distribution.

---

## 🌟 Key Features

### 👨‍🏫 Teacher / Administrator Portal
* **Academic Overview Dashboard**:
  - Live Real-Time Activity Marquee Ticker with synchronization indicators.
  - Animated numerical counters for students, monthly revenue, total revenue, and dues.
  - Dual-mode responsive charts (Monthly Ledger Bar Comparison & Smooth Wave Growth Area Chart).
  - Quick-action shortcuts for student enrollment and document publishing.
* **Student Directory & Roster**:
  - Comprehensive student profiles with roll ID, standard (Classes 8–12), batch schedules, and parent contact information.
  - One-click student enrollment with automated password assignment and active/inactive status toggles.
* **Tuition Fee Ledger & Accounting**:
  - Monthly fee tracking per student with status categorization (`Paid`, `Partial`, `Pending`).
  - Cash, UPI, Bank Transfer, and Cheque payment channels.
  - **Official Printable Tuition Fee Receipts** featuring the institutional crest, receipt reference number, student particulars, and teacher signature line.
* **Study Material & Question Paper Repository**:
  - Cloud-powered PDF document uploads (Homework Worksheets, Revision Notes, and Unit Examination Papers).
  - Target class filtering, submission deadlines, and total test marks allocation.
* **Institute Notice Board**:
  - Pin announcements, holiday bulletins, and mock examination schedules directly to student portals.

### 🎒 Student Learning Portal
* **Student Dashboard**:
  - Personalized academic salutation with class and roll ID badges.
  - Real-time summary of assigned homework worksheets, revision sheets, and test papers.
  - Tuition fee balance indicators.
* **Study Materials Repository**:
  - Filterable by Homework, Notes, and Exam Papers with one-click direct PDF downloads.
* **Tuition Statement & Receipts**:
  - Real-time payment history and instant access to view and print official digital receipts.

### 🎨 Visual & Interactive Highlights
* **Typewriter Typography**: Animated character-by-character focus messages on landing and dashboard views.
* **Interactive 3D Tilt Cards**: Physics-based perspective rotation (`perspective: 1000px`) with specular light sheen overlays.
* **Academic Design Language**: Clean serif display headers (`Playfair Display`), crisp data typography (`Plus Jakarta Sans`), and authentic document corner-notch styling (`.doc-notch`).

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, TanStack React Query, Recharts, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, REST API Architecture |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) & bcryptjs password hashing |
| **File Storage** | Cloudinary API with Multer & resilient local disk fallback |
| **Styling** | Vanilla CSS custom components & Tailwind CSS |

---

## 📂 Project Architecture

```text
Vidyaarambh/
├── client/                     # Frontend Vite + React SPA
│   ├── public/                 # Static assets (Favicons, Logo)
│   ├── src/
│   │   ├── api/                # Axios client with interceptors
│   │   ├── components/         # Reusable layouts, 3D tilt, and typewriter components
│   │   ├── context/            # AuthContext with persistent session management
│   │   ├── pages/              # Admin, Student, and Landing page routes
│   │   ├── App.jsx             # React Router route definitions
│   │   └── main.jsx            # React root mount
│   ├── tailwind.config.js      # Custom academic tokens (Navy, Gold, Ivory, Ink)
│   ├── vercel.json             # SPA routing rewrite rules for Vercel deployment
│   └── package.json
│
├── server/                     # Backend Node.js + Express API
│   ├── config/                 # MongoDB and Cloudinary configurations
│   ├── controllers/            # Route controllers (Admin, Student, Fees, Materials, Notices)
│   ├── middleware/             # JWT auth & role protection middlewares
│   ├── models/                 # Mongoose schemas (User, Fee, StudyMaterial, Notice)
│   ├── routes/                 # Express API endpoints
│   ├── scripts/                # Database seeding scripts
│   ├── uploads/                # Local storage fallback directory for PDFs
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── .gitignore                  # Git ignore rules for node_modules and .env files
└── README.md                   # Project documentation
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free cluster)
- [Cloudinary](https://cloudinary.com) account (free tier for PDF storage)

### 2. Clone the Repository
```bash
git clone https://github.com/SurajV77/Vidyaarambh-Edtech.git
cd Vidyaarambh-Edtech
```

### 3. Server Configuration
Navigate to `server/` and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Default Administrator Seed
ADMIN_NAME=Suraj
ADMIN_EMAIL=surajvarude14@gmail.com
ADMIN_PASSWORD=your_admin_password
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 4. Client Configuration
Open a new terminal, navigate to `client/`, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory (optional for local development, as it defaults to `/api` proxy):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 100% Free Production Deployment

### 1. Backend on Render (Free Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com) and click **New + -> Web Service**.
2. Connect this GitHub repository (`Vidyaarambh-Edtech`).
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install` and **Start Command** to `node server.js`.
5. Add your environment variables from `server/.env` (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, etc.).
6. Click **Create Web Service**.

### 2. Frontend on Vercel (Free Edge Hosting)
1. Go to [Vercel Dashboard](https://vercel.com) and import `Vidyaarambh-Edtech`.
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add the environment variable:
   - `VITE_API_URL` = `https://your-render-backend.onrender.com/api`
5. Click **Deploy**.
6. Update `CLIENT_URL` in your Render backend settings to your new Vercel domain (e.g. `https://vidyaarambh.vercel.app`).

---

## 🔒 Security Best Practices
- Passwords hashed using salted `bcryptjs` routines.
- Strictly isolated Role-Based Access Control (`admin` vs `student`) with JWT bearer tokens.
- File size validation capped at 25MB with strict MIME-type validation limited to PDF documents.
- Sensitive environment variables are excluded from source control via `.gitignore`.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
