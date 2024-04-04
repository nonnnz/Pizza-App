# Pizza-App
## Description

This project contains a frontend and a backend, orchestrated using Docker Compose. The backend includes integration with Stripe for payment processing.

## Collaborators

- **[W. Romrampha](https://github.com/KaTang-lu)**: Project Manager
- **[vsluuooq](https://github.com/vsluuooq)**: System Analyst
- **[Chutikarng](https://github.com/Chutikarng)**: UX/UI Design
- **[nonnnz](https://github.com/nonnnz)**: Software Engineer
- **[J-SUKI](https://github.com/J-SUKI)**: Tester

## Prerequisites

- Docker Engine
- Docker Compose

## Installation
1. Clone the repository:
   ```bash
    git clone https://github.com/nonnnz/Pizza-App.git
   ```
2. Navigate to the project directory:
   ```bash
    cd Pizza-App
   ```
## Usage

To run the project using Docker Compose:

1. Open a terminal and navigate to the project directory.
2. Run the following command:
   ```bash
    docker compose up
   ```
  This command will build the Docker images for the frontend and backend, create containers, and start the services.
  The frontend application will be accessible at [http://localhost:3000](http://localhost:3000), and the backend API will be available at [http://localhost:4000](http://localhost:4000).
  To stop the services, press Ctrl + C in the terminal where Docker Compose is running.

## Frontend

### Overview

frontend application built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/).

### Getting Started

To run the frontend locally, follow these steps:

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to http://localhost:3000 to view the application.

## Backend

### Overview

backend application built with [Express](https://expressjs.com/) and [Prisma](https://www.prisma.io/) using [PostgreSQL](https://www.postgresql.org/) as the database.

### Getting Started

To run the frontend locally, follow these steps:

1. Install PostgreSQL and set up your database.
2. Update the `.env` file with your PostgreSQL database connection details.
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start the backend server:
   ```bash
   node index-new.js
   ```
5. Deploy seed data:
   ```bash
   node prisma/seed.js
   ```

## License
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

**Asset Credit:** Images used in this project were obtained from [Freepik](https://www.freepik.com) 


