# EcoRoute AI

EcoRoute AI is a clean, light-theme civic platform for waste reporting, AI triage, route optimization, worker coordination, and public transparency.

## What is included

- A fresh homepage built from the product design report
- Routed module pages under `/platform/[slug]`
- A full Next.js backend for reports, routes, workers, rewards, notifications, and Delhi region data
- Durable production storage support with Supabase
- Uploads served through `/api/uploads/[id]`
- A health check endpoint at `/api/health`
- A Delhi region endpoint at `/api/regions/delhi`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production storage

By default, the app stores data locally in `data/` for easy development.

To enable durable storage for Vercel or any real deployment, set:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can copy the template from [.env.example](C:/Users/DELL/Documents/Playground/.env.example).

Then run the SQL in [supabase/schema.sql](C:/Users/DELL/Documents/Playground/supabase/schema.sql) inside the Supabase SQL editor.

## Notes

- Local development falls back to file storage automatically if `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is not set.
- Built-in operator login for demos: `admin@ecoroute.ai` / `Admin@12345`
- The site uses a light, premium visual style with Delhi-focused civic operations sections and GSAP motion.
