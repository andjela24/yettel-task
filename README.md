# REST API for User and Task Management

This project is a REST API built with **Express.js**, and **Sequelize** using **PostgreSQL** as the database. It is containerized with **Docker**, tested with **Jest**, and documented with **Swagger**. API functionality includes user management, task management, and role-based permissions.

## Features

### User Model

The `User` model includes the following fields:

- **firstName**: First name of the user.
- **lastName**: Last name of the user.
- **username**: Unique username.
- **email**: Unique email address.
- **password**: User's password.
- **role**: Defines the user's role (**basic** or **admin**).

### Task Model

The `Task` model includes:

- **body**: Content of the task.

### Permissions and Functionality

- **Basic User**:
  - Create, update, and list their own tasks.
  - Update their personal information.
- **Admin User**:
  - List tasks of all users.
  - Update and delete tasks of any user.
  - Update their own and other users' personal information.

### Additional Features

- **Pagination**: Task listing supports pagination.
- **Sorting**: Tasks can be sorted by creation date (newest to oldest and vice versa).
- **Validation**: Prevent duplicate usernames or email addresses.

## Tech Stack

- **Backend**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Testing**: Jest
- **API Documentation**: Swagger
- **API Testing**: Postman

## Prerequisites

- **Node.js** and **npm** installed
- **Docker** installed
- **PostgreSQL** installed and configured

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/andjela24/yettel-task.git
   cd yettel-taks
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables by creating a `.env` file (not recommended to expose in production):

   ```env
   DB_USER=<your-database-user>
   DB_PASSWORD=<your-database-password>
   DB_NAME=<your-database-name>
   DB_HOST=<your-database-host>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Run the application:
   ```bash
   npm run start:migrate
   ```

## Scripts

- **Start Development**: `npm run start:dev` (uses Nodemon)
- **Database Create**: `npm run db:create`
- **Database Drop**: `npm run db:drop`
- **Run Migrations**: `npm run migrate`
- **Run with Migrations**: `npm run start:migrate`
- **Prepare Database for Tests**: `npm run test:prepare`
- **Run Tests**: `npm run test`

## Notes

- Although this project is written in JavaScript, migration to **TypeScript** is feasible. At the time of development, Sequelize TypeScript associations methods were still under development.
- Sensitive files like `.env` would typically be added to `.gitignore`, but for the purpose of this job interview task, it has been left accessible.

## API Documentation

API documentation is available via **Swagger**. Once the application is running, visit:

```
http://localhost:3000/api-docs
```

## Testing

Tests are written using **Jest**. To run tests:

```bash
npm run test
```

## Docker Support

This application can be run using Docker. It includes a `Dockerfile` and a `docker-compose.yaml` file for easy setup.

### Dockerfile

- Uses the official **Node.js 18.20.4** image.
- Sets up the application in `/usr/src/app`.
- Installs dependencies and exposes port 3000.
- Starts the application with the `start:migrate` script.

### Docker Compose

The `docker-compose.yaml` file defines two services:

1. **App Service**:

   - Builds the application using the Dockerfile.
   - Uses an environment file `.env` for configuration.
   - Mounts the project directory as a volume for live updates.
   - Maps port `13000` (host) to `3000` (container).
   - Depends on the `db` service.
   - Runs the `start:migrate` command.

2. **Database Service**:
   - Uses the official **PostgreSQL** image.
   - Exposes port `5432`.
   - Configures environment variables for the PostgreSQL database:
     - `POSTGRES_USERNAME`: `postgres`
     - `POSTGRES_PASSWORD`: `postgres`
     - `POSTGRES_NAME`: `yettel_task_db`

### Docker Commands

To start the application using Docker Compose:

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
2. If already built, first bring down existing containers and remove volumes, and run again build command :

   ```bash
   docker-compose down --volumes
   ```
