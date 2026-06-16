# LCU Academic Portal

A modern university course registration portal built with React + Vite + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Credentials

| Role     | Email                    | Password     |
|----------|--------------------------|--------------|
| Admin    | admin@lcu.edu.ng         | admin123     |
| Lecturer | a.okonkwo@lcu.edu.ng     | lecturer123  |
| Student  | Register a new account   | —            |

## Build for Production

```bash
npm run build
```

## Migrate to Firebase/Supabase

All data logic is in `src/services/`. Swap out `storageService.js`, `authService.js`, `courseService.js`, and `timetableService.js` — each has inline comments showing where to plug in Firebase or Supabase.

## License: MIT
"# uniportal" 
