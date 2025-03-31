# Comprehensive Guide to Setting Up NestJS
## Introduction

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It leverages TypeScript and follows the modular architecture inspired by Angular.
This guide will walk you through setting up a NestJS project from scratch.

## Prerequisites
Before setting up a NestJS project, ensure you have the following installed:

- Node.js (LTS version recommended)
- `npm` or `yarn`
- Nest CLI

To verify installations, run:
```
node -v
npm -v
```

### Step 1: Install NestJS CLI
Install NestJS CLI globally:
```
npm install -g @nestjs/cli
```
Verify the installation:
```
nest --version
```

### Step 2: Create a New NestJS Project
Generate a new NestJS project using the CLI:
```
nest new project-name
```
You'll be prompted to select a package manager (npm or yarn). Choose your preferred one.

### Step 3: Navigate to Project Directory
```
cd project-name
```
### Step 4: Run the Application
Start the development server:
```
npm run start
```
For live reload, use:
```
npm run start:dev
```
The application will be available at http://localhost:3000/ by default.
## Project Structure

A basic NestJS project includes:
```
project-name/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
├── test/
├── .eslintrc.js
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
```
`src/` contains all the application logic.</br>
`app.module.ts` is the root module.</br>
`app.controller.ts` handles incoming requests.</br>
`app.service.ts` contains business logic.</br>
