# 📘 JWT Authentication in NestJS 
## 🔐 What is JWT?
JWT (JSON Web Token) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.
A typical JWT contains:
- Header
- Payload (user data)
- Signature

## 🛠 How JWT Works
1. User logs in with credentials.
2. Server verifies credentials and generates a token.
3. Token is sent back to the client.
4. Client stores token (e.g., in localStorage).
5. On every request, client sends token in Authorization header.
6. Server verifies token and grants access.

## 🚀 Why Use JWT in NestJS?
- Stateless and scalable
- Easy to integrate with Passport (authentication middleware)
- Built-in support via `@nestjs/jwt` and `@nestjs/passport`
```ts
class Logger {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string) {
    this.logger.log(`User ${name} created`);
  }
}

const logger = new Logger();
const userService = new UserService(logger);
userService.createUser("Alice");
```
</details>

**Super Constructor**

<details>
<summary> View Example </summary>

```ts
class Cook {
  constructor(public tool: string) {
    console.log(`Cook is ready with ${tool}`);
  }

  prepare() {
    console.log("Cook is preparing something...");
  }
}

class Chef extends Cook {
  constructor(tool: string) {
    super(tool); // Parent constructor
  }

  prepare() {
    super.prepare(); // Call base method
    console.log("Chef is preparing a gourmet meal!");
  }
}

const chef = new Chef("knife");
chef.prepare();

// Output:
// Cook is ready with knife
// Cook is preparing something...
// Chef is preparing a gourmet meal!
```
</details>

### 📄Accessing .env Variables Using process in NestJS
🧠 What is process?
In Node.js, process is a global object that provides information and control over the current Node.js process. It includes a special object called:
```
console.log(process.env.PORT);
console.log(process.env.JWT_SECRET);
```
---
## 🧱 Project Setup
```ts
npm i -g @nestjs/cli
nest new jwt-auth-demo
cd jwt-auth-demo
```
## 📦 Installing Required Packages
```
npm install @nestjs/mongoose mongoose
npm install @nestjs/passport passport passport-local passport-jwt
npm install @nestjs/jwt bcryptjs
npm install --save-dev @types/passport-jwt @types/bcryptjs
```
## 🗂️ Folder Structure Overview
```
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│
├── users/
│   ├── user.schema.ts
│   ├── users.service.ts
│   ├── users.module.ts
│
├── app.module.ts
```
## 🧩 Creating the Auth Module
```
nest generate module auth
nest generate service auth
nest generate controller auth
```
## Also create a user module:
```
nest generate module users
nest generate service users
```
## 🧱 Connect MongoDB
In `app.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-auth'),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
```
## 👤 User Schema
`users/user.schema.ts`:
```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```
## 🛠 Users Service
`users/users.service.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: Partial<User>) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
}
```
`users/users.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```
## 🔐 Auth Service
`auth/auth.service.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.create({ username, password: hashed });
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```
## ⚙️ JWT Strategy
`auth/jwt.strategy.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt_secret', // Use ENV in production
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```
## 🛡 JWT Auth Guard
`auth/jwt-auth.guard.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```
## 📡 Auth Controller
`auth/auth.controller.ts`:
```ts
import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) return { message: 'Invalid credentials' };
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
```
## 🧩 Auth Module
`auth/auth.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```
# ✅ Test It Out
## ➕ Register a User
```
POST /auth/register
{
  "username": "ram",
  "password": "1234"
}
```
## 🔐 Login
```
POST /auth/login
{
  "username": "ram",
  "password": "1234"
}
```
**Response:**
```
{
  "access_token": "eyJhbGciOiJI..."
}
```
## 🔒 Access Protected Route
```
GET /auth/profile
Authorization: Bearer <access_token>
```
