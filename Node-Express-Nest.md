# Comparison: Node.js vs Express.js vs Nest.js

## 1. Overview

### Node.js
- A runtime environment that allows JavaScript to run on the server-side.
- Provides core modules for handling HTTP, file system, and networking.
- Enables asynchronous, event-driven programming.

### Express.js

- A minimal web framework built on top of Node.js.
- Provides a simple way to manage routing, middleware, and request handling.
- Reduces boilerplate code compared to pure Node.js.

### Nest.js

- A full-fledged framework built on top of Express.js (or Fastify) for scalable applications.
- Uses TypeScript by default and follows modular architecture.
- Implements Dependency Injection (DI) and is inspired by Angular.

## 2. Detailed Comparison
| Feature           | Node.js 🟢 | Express.js 🚀 | Nest.js 🏛️ |
|------------------|-----------|--------------|-------------|
| **Definition**   | A runtime for executing JavaScript outside the browser. | A minimal web framework for Node.js. | A scalable, opinionated framework built on Express.js. |
| **Complexity**   | Low-level (requires more setup). | Medium (reduces boilerplate). | High (follows strict patterns and modularity). |
| **Performance**  | Fast but requires manual optimization. | Lightweight, faster development than Node.js. | Can be slightly heavier due to abstractions but optimized for large-scale apps. |
| **Built-in Features** | Core modules (HTTP, File System, Streams, etc.). | Routing, middleware, template engines (optional). | Dependency Injection, decorators, modules, TypeScript support. |
| **Routing**      | Manually handled with `http.createServer()`. | `app.get('/route', callback)`. | Decorator-based (`@Get()`, `@Post()`). |
| **Middleware**   | Requires third-party modules. | Built-in middleware support (`app.use()`). | Advanced middleware system with Guards, Interceptors, Pipes. |
| **Scalability**  | Needs manual structuring. | Moderate; suitable for mid-sized apps. | Highly scalable with modular architecture. |
| **Use Case**     | Backend services, APIs, CLI tools. | Web apps, REST APIs, microservices. | Enterprise applications, microservices, monolithic apps. |


## 3. Code Examples
## Using Pure Node.js
Using Pure Node.Js
Steps to Create a Basic Express.js Project:
<br>

<details>

<summary>Click to expand</summary>

<br>


**1. Initialize the Project:**
- Create a new directory and initialize a Node.js project:
```
mkdir express-project
cd express-project
npm init -y
```
**2. Install Express:**
- Install the Express package:
```
npm install express
```
**3. Create Server:**
- Create an `index.js` file and set up a basic Express server:
```js
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});
server.listen(3000, () => console.log('Server running on port 3000'));
```


<br>
</details>

## Using Express.js
Steps to Create a Basic Express.js Project:
<br>
<details>

<summary>Click to expand</summary>

<br>


**1. Initialize the Project:**
- Create a new directory and initialize a Node.js project:
```
mkdir express-project
cd express-project
npm init -y
```
**2. Install Express:**
- Install the Express package:
```
npm install express
```
**3. Create Server:**
- Create an `index.js` file and set up a basic Express server:
```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
</details>

## Using Nest.js
Steps to Create a Basic Nest.js Project:
<br>

<details>

<summary>Click to expand</summary>

<br>

**1. Install Nest CLI:**
- Install the Nest CLI globally:
```
npm install -g @nestjs/cli
```
**2. Create a New Project:**
- Use the CLI to create a new Nest.js project:
```
nest new nestjs-project
```
**3. Run the Application:**
- Navigate into the project folder and run the development server:
```
cd nestjs-project
npm run start
```
**4. Create a New Module (optional):**
- Generate a new module, controller, and service using the CLI:
```
nest generate module users
nest generate controller users
nest generate service users
```
**5. Modify app.controller.ts to add your logic:**
`main.ts`
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```
`app.module.ts`
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
`app.controller.ts`
```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
`app.service.ts`
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```
 
</details>

## 4. When to Use What?

- `Use Node.js` if you need a low-level backend with custom configurations.
- `Use Express.js` if you want a lightweight web framework for quick API development.
- `Use Nest.js` if you need a robust, scalable, and maintainable enterprise-level application.






