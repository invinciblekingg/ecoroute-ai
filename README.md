# EcoRoute AI

EcoRoute AI is a clean, light-theme civic platform for waste reporting, AI triage, route optimization, worker coordination, and public transparency.

## What is included

- A fresh homepage built from the product design report
- Routed module pages under `/platform/[slug]`
- A full Next.js backend for reports, routes, workers, rewards, notifications, and pilots
- Durable production storage support with MongoDB
- Uploads served through `/api/uploads/[id]`
- A health check endpoint at `/api/health`

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
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB_NAME=ecoroute-ai
```

You can copy the template from [.env.example](C:/Users/DELL/Documents/Playground/.env.example).

## Notes

- Local development falls back to file storage automatically if `MONGODB_URI` is not set.
- Built-in operator login for demos: `admin@ecoroute.ai` / `Admin@12345`
- The site uses a light, premium visual style with a map-first hero and civic operations sections.
