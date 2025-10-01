# Autonomix App

## Level Completed
Level: **2** <!-- Replace with 1, 2, or 3 depending on what you completed -->

## LLM API Used
- **API:** Gemini <!-- Replace with the one you used -->

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma  
- **Database:** PostgreSQL / Supabase
- **Frontend:** Next.js (hosted on Vercel)  
- **Deployment:** Render (Backend), Vercel (Frontend)

## Setup Instructions (Local Run)

1. **Clone the repository**
```bash
git clone https://github.com/sunil18Developer/autonomix_assignment.git
https://github.com/sunil18Developer/autonomix_backend_app.git

cd <repo-name>


backend:
npm install

.env
NODE_ENV=development
DATABASE_URL=<your-database-url>
GEMINI_API_KEY=""
PORT=5001

DB
npx prisma generate
npx prisma db push

To run backend
npm run dev



frontend:
npm install
npm run dev

.env
NEXT_PUBLIC_API_URL=http://localhost:5001/api





