# Dot Soft Backend Task

This is a backend web application for an air ticket reservations system created using Node.js, TypeScript, Prisma, and PostgreSQL.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [System Admin Accounts](#system-admin-accounts)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or above)
- npm (version 10 or above)
- PostgreSQL (latest version recommended)
- Git

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MahmoudSamir22/Dot-Soft-NodeJs-Task.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <project-directory>
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

## Environment Setup

1. **Create a `.env` file in the root of your project and add your environment variables:**

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/database"
   ```

   Replace `user`, `password`, `localhost`, `5432`, and `database` with your PostgreSQL credentials and database name.

## Database Setup

1. **Run database migrations:**

   ```bash
   npx prisma db push
   ```

## Running the Application

1. **Start the development server:**

   ```bash
   npm run dev
   ```

   This command will start the server using `ts-node` in watch mode.

## System Admin Accounts

The system includes three pre-configured system admin accounts for testing purposes. You can use the following credentials to log in:

| Login Name   | Password      |
|--------------|---------------|
| sys_admin    | Pa$$word123   |
| sys_admin1   | Pa$$word123   |
| sys_admin2   | Pa$$word123   |