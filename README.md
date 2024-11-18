# devinci-web-expressjs-cdof2
# LearningFact API

An Express.js REST API with a PostgreSQL database for managing learning packages. This project demonstrates a backend application built with Node.js, Express, TypeScript, Sequelize (an ORM for PostgreSQL), and Docker. It includes API endpoints for creating, reading, updating, and searching learning packages, along with API documentation using Swagger.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Features

- **CRUD Operations**: Create, read, update, and delete learning packages.
- **Search Functionality**: Search packages by title and description.
- **Database Integration**: Uses PostgreSQL as the database.
- **ORM**: Implements Sequelize for object-relational mapping.
- **API Documentation**: Swagger UI for interactive API documentation.
- **Dockerized Environment**: Runs PostgreSQL in a Docker container for easy setup.
- **TypeScript**: Uses TypeScript for type safety and better development experience.

---

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Sequelize**: Promise-based ORM for Node.js and PostgreSQL.
- **PostgreSQL**: Open-source relational database.
- **Docker**: Platform for containerizing applications.
- **Swagger**: Tools for documenting and consuming RESTful web services.
- **Jest & Supertest**: Testing framework and library for HTTP assertions.

---

## Prerequisites

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher (comes with Node.js)
- **Docker**: Installed and running on your machine
- **Git**: For cloning the repository

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ESILV-4-A4-STD/devinci-web-expressjs-cdof4.git
cd devinci-web-expressjs-cdof4
git checkout kesteloot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

#### a. Create a `.env` File

Create a `.env` file in the project root with the following content:

```env
DB_NAME=LearningFactDb
DB_USER=learningDbUser
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
PORT=3000
```

- **DB_NAME**: Name of your PostgreSQL database.
- **DB_USER**: PostgreSQL username.
- **DB_PASSWORD**: PostgreSQL password.
- **DB_HOST**: Database host (use `localhost` if running locally).
- **DB_PORT**: Database port (default is `5432`).
- **PORT**: Port for the Express server (default is `3000`).
- **Note**: Replace `your_password` with a secure password.

#### b. Create a `.env.test` File

Create a `.env.test` file in the project root for the test environment:

```env
DB_NAME=LearningFactDb_test
DB_USER=learningDbUser
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
PORT=3001
NODE_ENV=test
```

- **DB_NAME**: Name of your PostgreSQL test database.
- **DB_USER**: PostgreSQL username (same as development).
- **DB_PASSWORD**: PostgreSQL password (same as development).
- **DB_HOST**: Database host (use `localhost` if running locally).
- **DB_PORT**: Database port (default is `5432`).
- **PORT**: Port for the Express server during tests (e.g., `3001`).
- **NODE_ENV**: Set to `test` to indicate the testing environment.
- **Note**: Ensure that the `DB_NAME` for testing is different from development to avoid data conflicts.

#### c. Important Notes

- **Security**: Never commit `.env` or `.env.test` files to version control. These files contain sensitive information. Ensure they are included in your `.gitignore` file.

  **Add to `.gitignore`:**

  ```gitignore
  # Environment files
  .env
  .env.test
  ```

### 4. Set Up PostgreSQL with Docker

#### a. Pull the PostgreSQL Docker Image

```bash
docker pull postgres
```

#### b. Run the PostgreSQL Container

```bash
docker run --name postgres-container \
  -e POSTGRES_USER=learningDbUser \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=LearningFactDb \
  -p 5432:5432 \
  -d postgres
```

- **Note**: Replace `your_password` with a secure password.

#### c. Verify the Container is Running

```bash
docker ps
```

You should see `postgres-container` in the list of running containers.

#### d. Optional: Use a Different Host Port

If port `5432` is already in use, you can map the container to a different port:

```bash
docker run --name postgres-container \
  -e POSTGRES_USER=learningDbUser \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=LearningFactDb \
  -p 5433:5432 \
  -d postgres
```

- Update your `.env` file with `DB_PORT=5433` if you change the port.

---

## Running the Application

### 1. Build the Project

Compile the TypeScript code to JavaScript:

```bash
npm run build
```

### 2. Start the Application

```bash
npm start
```

- The server should start on the port specified in your `.env` file (default is `3000`).
- You should see output similar to:

  ```
  Database synchronized successfully.
  Server is running at http://localhost:3000
  ```

### 3. Access the API

- **Liveness Endpoint**: Check if the server is running.

  ```bash
  curl http://localhost:3000/api/liveness
  ```

- **Swagger UI**: Access API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## API Endpoints

### **GET** `/api/liveness`

- **Description**: Check if the server is running.
- **Response**: `200 OK`

### **GET** `/api/package`

- **Description**: Retrieve all learning packages.
- **Response**: Array of learning package objects.

### **GET** `/api/package/:id`

- **Description**: Retrieve a learning package by its ID.
- **Parameters**:
    - `id` (path parameter): ID of the learning package.
- **Response**: Learning package object or `404 Not Found` if not found.

### **POST** `/api/package`

- **Description**: Create a new learning package.
- **Request Body**: JSON object containing `title`, `description`, `category`, `targetAudience`, `difficultyLevel`.
- **Response**: The created learning package object.

### **PUT** `/api/package/:id`

- **Description**: Update an existing learning package.
- **Parameters**:
    - `id` (path parameter): ID of the learning package.
- **Request Body**: JSON object with fields to update.
- **Response**: The updated learning package object or `404 Not Found` if not found.

### **GET** `/api/package-summaries`

- **Description**: Retrieve summaries of all learning packages (only `id` and `title`).
- **Response**: Array of package summary objects.

### **GET** `/api/package-summaries/search`

- **Description**: Search for packages by `title` or `description`.
- **Query Parameters**:
    - `title` (optional): Title to search for.
    - `description` (optional): Description to search for.
- **Response**: Array of package summary objects matching the search criteria.

---

## Testing

### 1. Set Up the Test Database

Ensure you have a test database set up (you can use a separate Docker container or a local instance).

### 2. Configure Test Environment Variables

Create a `.env.test` file:

```env
DB_NAME=LearningFactDb_test
DB_USER=learningDbUser
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
PORT=3001
NODE_ENV=test
```

### 3. Run Tests

```bash
npm test
```

- Tests are written using Jest and Supertest.
- Ensure the test database is available and the credentials match those in `.env.test`.

---

## Project Structure

```
project-root/
├── src/
│   ├── app.ts           # Express application setup
│   ├── server.ts        # Entry point to start the server
│   ├── config/
│   │   └── database.ts  # Sequelize configuration
│   ├── models/
│   │   └── LearningPackage.ts  # Sequelize model
│   └── routes/          # API route handlers (if separated)
├── tests/
│   └── app.test.ts      # Test cases
├── dist/                # Compiled JavaScript files
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript configuration
├── .env                 # Environment variables (not committed)
├── .env.example         # Sample environment variables
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
└── Dockerfile           # Docker configuration for the app
```

---

## Additional Information

### Environment Variables

- **DB_NAME**: Name of the PostgreSQL database.
- **DB_USER**: Database username.
- **DB_PASSWORD**: Database password.
- **DB_HOST**: Hostname of the database server.
- **DB_PORT**: Port number of the database server.
- **PORT**: Port on which the Express server runs.

### Using Docker Compose (Optional)

You can use Docker Compose to run both the PostgreSQL database and the Node.js application in containers.

#### 1. Create a `docker-compose.yml` File

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DB_NAME=LearningFactDb
      - DB_USER=learningDbUser
      - DB_PASSWORD=your_password
      - DB_HOST=db
      - DB_PORT=5432
    depends_on:
      - db

  db:
    image: postgres
    environment:
      POSTGRES_USER: learningDbUser
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: LearningFactDb
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  pgdata:
```

#### 2. Build and Run with Docker Compose

```bash
docker-compose up --build
```

#### 3. Access the Application

- The API is available at `http://localhost:3000`.
- Swagger UI is available at `http://localhost:3000/api-docs`.

---

## Common Issues and Troubleshooting

### Port Conflicts

- If you encounter errors about ports already in use, ensure that no other services are running on those ports or change the ports in your `.env` file and Docker commands.

### Database Connection Errors

- Verify that your database credentials in the `.env` file match those used when starting the PostgreSQL container.
- Ensure the PostgreSQL container is running and accessible.

### Compilation Errors

- Ensure all dependencies are installed with `npm install`.
- Check for TypeScript errors during the build process.

### Missing `.env` File

- The application requires a `.env` file with the necessary environment variables.
- Create a `.env` file based on `.env.example`.

---