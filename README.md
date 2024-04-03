## Full-Stack E-Commerce With Fastify & Vue.js

## Table of Contents

- [Full-Stack E-Commerce With Fastify & Vue.js](#full-stack-e-commerce-with-fastify--vuejs)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Contribution](#contribution)
- [License](#license)

## Full-Stack E-Commerce With Fastify & Vue.js

This project implements a web application for managing product categories and their associated products. It utilizes a hierarchical structure to organize products within categories.

### Tech Stack

- **Backend**: Node.js (Fastify) with TypeScript
- **Frontend**: Vue.js v3 with Vuetify
- **ORM**: Prisma
- **Database**: MySQL
- **Authentication**: Fastify JWT
- **Testing**: Jest
- **Deployment**: Docker and Docker Compose

### Installation

**Prerequisites:**

- Node.js (version >= 20.x) and npm
- MySQL database server

1. Clone this repository.
2. Install dependencies for both backend and frontend

```bash
# backend
cd ./backend
npm install

# frontend
cd ./frontend
npm install
```

### Copy copy or rename `.env.example` file to `.env` and set suitable values

**Make sure to make three .env files. One for the project's root directory, one for frontend, and one more for backend**

### Development

1. Start the development server for both backend and frontend

```bash
# backend
cd ./backend
npm run dev

# frontend
cd ./frontend
npm install
```

**Or using `docker compose`**

```bash
# cd to the projects root
docker compose -f docker-compose.dev.yml build
docker compose -f docker-compose.dev.yml up
```

This will start the Fastify server and the Vue development server concurrently. The application will be accessible at http://localhost:3000 by default for backend and at http://localhost:5173 for frontend.

3. Run database migrations and seeds

- Make sure MySQL is running.

- Navigate to the `backend` directory and run

```bash
# Run migrations
npm run migrate
```

```bash
# Run data seeds
npm run seed:script ./prisma/seeds/seed_001_categories.ts
npm run seed:script ./prisma/seeds/seed_002_products.ts
```

2. Make code changes and the development server will automatically reload the browser.

### Deployment

**Coming Soon!**

Instructions for deploying the application to a production environment will be added soon.

### Demo


https://github.com/AhmedHafez13/e-commerce-fastify-vue/assets/53107590/81e2a9c0-a7e2-4f23-be7e-cf06688a26d7


### Contribution

We welcome contributions to this project. Please refer to the CONTRIBUTING.md file (to be added) for guidelines on how to contribute.

### License

This project is licensed under the MIT License (see LICENSE.md).
