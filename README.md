[Felt_README.md](https://github.com/user-attachments/files/28506971/Felt_README.md)
# Felt

Felt is a modern research and innovation platform website built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Overview

Felt presents research initiatives, strategic vision, roadmap planning, manifesto content, and organizational information through a modern and responsive web experience.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router

### Infrastructure
- Nginx
- Ubuntu Linux
- SSL (Certbot)
- Domain: felt.blog

## Features

- Responsive UI
- Modern landing page
- Research showcase
- Strategic roadmap
- About section
- Contact section
- Admin authentication interface
- Production-ready deployment

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Deployment

Deploy the generated `dist` folder behind Nginx.

Example:

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

## License

Private project.
