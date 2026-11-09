# Grip Force Training Shop

Online store for fitness and grip accessories. Brand: matte black + neon green. Tagline: **TRAIN HARD. GRIP STRONG.**

Built with [Lovable](https://lovable.dev) (project id `a04ff47b-f252-41fd-b558-c4ef36b7708c`).

## Start here
| File | What it is |
|---|---|
| [HANDOVER.md](./HANDOVER.md) | How to run, how to work, what is done, what is next |
| [docs/DATABASE.md](./docs/DATABASE.md) | All tables, security rules, how to change the DB |
| [roadmap.md](./roadmap.md) | Phase checklist (live status) |
| [AGENTS.md](./AGENTS.md) | Architecture rules (read before coding) |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md) | What changed and when |
| [docs/ORIGINAL_BRIEF.md](./docs/ORIGINAL_BRIEF.md) | Owner's first request |

## Stack
React 19, TanStack Start (file routes in `src/routes`), Tailwind 4, shadcn/ui, framer-motion, Swiper, react-three-fiber, Supabase (Lovable Cloud).

## Run locally
```sh
bun install      # or: npm i
bun run dev      # or: npm run dev
bun run build
bun run test
```
The `.env` file holds only public Supabase keys. Never put a service-role key in the repo.
