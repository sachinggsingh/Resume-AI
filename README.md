# 🧠 Resume-AI

Resume-AI is an AI-powered resume analyzer built with **Next.js** and **Google Gemini API**, which evaluates resumes based on **ATS (Applicant Tracking System)** standards. It extracts the resume content from PDFs, converts them into images via **Cloudinary**, and then generates smart suggestions and scores using Gemini's LLM.

![Resume AI Preview](public/demo-preview.png) <!-- Optional: Add your own image here -->

## 🚀 Features

- 📄 **PDF to Image Conversion** using Cloudinary  
- 🧠 **Resume Analysis with Gemini API (Google Generative AI)**  
- 📊 **ATS Score Calculation** with improvement suggestions  
- 🔍 **Job-based Matching** using job title input  
- 🌙 **Responsive Dark Mode UI** with Tailwind CSS  
- ⚙️ Built with Next.js App Router, TypeScript, and ShadCN UI  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, ShadCN UI  
- **AI Integration:** Google Gemini API  
- **Media Handling:** Cloudinary (PDF to JPG conversion)  
- **Deployment:** Vercel  

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/sachinggsingh/Resume-AI.git
cd Resume-AI
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn
\`\`\`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_google_generative_ai_key
\`\`\`

### 4. Run the Dev Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 How It Works

1. **Upload Resume (PDF):** Users upload their resume.  
2. **Cloudinary Conversion:** Resume is converted to a JPG (1st page only).  
3. **Gemini Prompting:** Image and job title are sent to the Gemini API.  
4. **AI Response:** Gemini returns ATS score, recommendations, and keyword analysis.  
5. **UI Rendering:** Summary and ATS insights are rendered dynamically.  

---

## 📦 Folder Structure

\`\`\`bash
/app
  ├── api/summary         # API Route to communicate with Gemini
  ├── components/         # UI Components
  ├── lib/                # Utility functions
  └── page.tsx            # Main Upload and Summary UI
\`\`\`

---

## 📄 Gemini Prompt Sample

<<<<<<< HEAD
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXT_AUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

## Google OAuth Setup

To enable Google OAuth authentication:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file
=======
> "You are an ATS evaluator. Analyze this resume for the role of ‘Frontend Developer’. Return structured JSON with fields: atsScore, recommendations, keywordAnalysis, and overallAssessment."

---

## 📤 Deploy on Vercel

You can deploy this project instantly on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sachinggsingh/Resume-AI)

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)  
- [Cloudinary Docs](https://cloudinary.com/documentation)  
- [Google Generative AI (Gemini)](https://ai.google.dev/)  
- [ShadCN UI](https://ui.shadcn.com/)  

---

## 📬 Contact

Built by [Sachin Singh](https://github.com/sachinggsingh)  
📧 [sachingajendrasingh@gmail.com](mailto:sachingajendrasingh@gmail.com)

---

## ⭐️ Give a Star

If you like this project, consider starring it on [GitHub](https://github.com/sachinggsingh/Resume-AI) — it helps others discover it too!
>>>>>>> 2c994089cc64ff659dbca60fb4c082a84d7dac86
