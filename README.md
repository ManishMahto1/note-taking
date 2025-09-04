# 📒 Note Taking Dashboard (Next.js + Tailwind + MongoDB)

A modern note-taking app with authentication, OTP verification, and dashboard UI.  
Built using **Next.js App Router, TailwindCSS, TypeScript, MongoDB, and lucide-react icons**.

---

## 🚀 Features
- 🔑 Signup, Login, OTP Verification (JWT-based auth)
- 📝 Create, View, and Delete Notes
- 📅 Dashboard with User Info 
- 🎨 Modern UI with TailwindCSS + lucide-react icons
- 🔐 Middleware-based route protection

---

## ⚡ Tech Stack
- [Next.js (App Router)](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) with Mongoose

---

## 🛠️ Installation & Setup

### 1. Clone the repo
```bash
git clone https://github.com/ManishMahto1/note-taking.git
cd note-taking
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file:
```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

EMAIL_USER="your@gmail.com"
EMAIL_PASS="password"
SENDER_EMAIL="your@gmail.com"
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📂 Project Structure
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify-otp/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── me/
│   │   │   ├── request-login-otp/
│   │   │   ├── resend-otp/
│   │   │   ├── signup/
│   │   │   └── verify-otp/
│   │   └── notes/
│   │       ├── route.ts
│   │       └── [id]/
│   ├── dashboard/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── CustomSignIn.tsx
│   │   └── CustomSignUp.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Loader.tsx
│       └── ErrorMessage.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── email.ts
│   └── otp.ts
├── models/
│   ├── Note.ts
│   └── User.ts
└── middleware.ts
```

---

## 📸 Screenshots
![signup Page](/public/screenshots/signup.png)
![Sign In Page](/public/screenshots/signin.png)
![dashboard](/public/screenshots/dashboard.png)




---

## 📜 License
MIT License © 2025 Manish Mahto
