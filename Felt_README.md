# Felt

**Building ideas that deserve to exist.**

Felt is a research-driven innovation platform focused on exploring emerging technologies, long-term opportunities, and meaningful digital products. The platform serves as the public face of the Felt initiative, presenting research areas, strategic priorities, roadmap planning, and organizational vision through a modern web experience.

---

## Vision

Felt exists to investigate, validate, and develop ideas that can create meaningful impact.

Rather than focusing solely on short-term products, Felt emphasizes:

- Research-first thinking
- Long-term technological exploration
- Human-centered innovation
- Strategic product development
- Sustainable digital ecosystems

---

## Platform Overview

The website is designed as a modern research and innovation portal featuring:

### Home
Landing experience introducing the Felt initiative.

### About
Overview of the organization's purpose, philosophy, and operating principles.

### Manifesto
Core beliefs and guiding principles that shape decision-making.

### Research Areas
Exploration of strategic focus areas and emerging technologies.

### Strategic Roadmap
Long-term planning and future objectives.

### Contact
Communication and collaboration channels.

### Admin Panel
Internal content management and administration interface.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router

### Deployment

- Ubuntu Linux
- Nginx
- SSL via Certbot
- GitHub
- Domain: felt.blog

---

## Project Structure

```text
src/
├── assets/
├── components/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── services/
├── types/
└── App.tsx
```

---

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

---

## Production Deployment

```bash
/var/www/felt/dist
```

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name felt.blog www.felt.blog;

    root /var/www/felt/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable SSL:

```bash
sudo certbot --nginx -d felt.blog -d www.felt.blog
```

---

## Design Principles

- Simplicity over complexity
- Clarity over decoration
- Research before execution
- Long-term thinking
- Consistent visual language
- Accessibility and responsiveness

---

## Roadmap

- Content management system
- Research publication workflows
- Newsletter infrastructure
- Analytics dashboard
- Multi-language support
- Collaboration tools

---

## License

Private project. All rights reserved.
