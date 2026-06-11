# FELT Web Platform

FELT Web Platform is the official website and content management system of FELT. The platform provides public-facing pages, an administration panel, content management capabilities, application workflows, and communication tools in a single system.

## Features

- Public website
- Admin panel
- CMS-driven page management
- About page management
- Programs management
- Events management
- Blog management
- Research & publications management
- Application tracking
- Contact message management
- Newsletter subscriptions
- PostgreSQL database
- Alembic migrations
- Docker-based deployment

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Playwright

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT Authentication

## Installation

Clone the repository:

```bash
git clone https://github.com/didarbilgin/Felt.git
cd Felt
```

Create your environment configuration:

```bash
cp backend/.env.example backend/.env
```

Update the `.env` file according to your environment.

## Running with Docker

Start all services:

```bash
docker compose up -d --build
```

Run database migrations:

```bash
docker compose exec api python -m alembic upgrade head
```

Seed the database with initial content:

```bash
docker compose exec api python seed.py
```

## Development

Install frontend dependencies and start the development server:

```bash
npm install
npm run dev
```

## Database Migrations

Create a new migration:

```bash
cd backend
alembic revision --autogenerate -m "migration message"
```

Apply migrations:

```bash
alembic upgrade head
```

Or inside Docker:

```bash
docker compose exec api python -m alembic upgrade head
```

## Seed System

The project includes an idempotent seed system for fresh installations.

The seed process may create:

- Default admin user
- CMS pages and sections
- About page content
- Sample program
- Sample event
- Sample blog post
- Sample research/publication entry

Run the seed process:

```bash
docker compose exec api python seed.py
```

Running the command multiple times will not create duplicate records.

## Testing

Build the frontend:

```bash
npm run build
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run lint checks:

```bash
npm run lint
```

## Deployment

Update the server:

```bash
git pull origin main
```

Rebuild services:

```bash
docker compose up -d --build
```

Apply migrations:

```bash
docker compose exec api python -m alembic upgrade head
```

Run seeds if required:

```bash
docker compose exec api python seed.py
```


## Production Domain

`felthk.com`

## License

Developed for FELT.
