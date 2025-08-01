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
