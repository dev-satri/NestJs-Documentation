# Comprehensive Guide to DTOs in NestJS
## 📌 What is a DTO?
DTO (Data Transfer Object) is an object that defines how data will be sent over the network. In NestJS, DTOs are typically used to define the structure of data that is expected in incoming requests (e.g., `POST`, `PUT`, `PATCH`), helping validate and type-check the data.

## 🎯 Why Use DTOs?
✅ Ensures type-safety using TypeScript.
✅ Validates incoming data.
✅ Prevents injection of unintended fields.
✅ Improves maintainability and documentation.
✅ Separates internal models/entities from exposed APIs.

## 🛠️ How to Create a DTO in NestJS
### 1. Create a DTO Class
```ts
// create-user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```
> DTOs are simple classes (not interfaces) to enable decorators and transformation features.

## ✅ Validating DTOs using `class-validator` and `class-transformer`
Install required packages:
```
npm install class-validator class-transformer
```
Update your DTO:
```
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```
### Apply Validation Globally
In `main.ts`:
```ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(3000);
}
bootstrap();
```
- `whitelist: true` removes fields not defined in DTO.
- `forbidNonWhitelisted: true` throws an error on unexpected fields.
## 🧠 DTOs in Action – Controller Example
```ts
// users.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return `User created with name: ${createUserDto.name}`;
  }
}
```
## 🧪 Example – DTO Validation Error Response
Request:
```
POST /users
{
  "email": "not-an-email",
  "password": "123"
}
```
Response:
```
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```
## 🔐 Advanced: Nested DTOs
```ts
// address.dto.ts
import { IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  city: string;

  @IsString()
  country: string;
}
```
```ts
// user.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';

export class CreateUserDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```
## 🚨 Best Practices
✅ Use DTOs in Controllers, not Services.
✅ Always validate incoming data.
✅ Use @Type() for nested objects to ensure proper transformation.
✅ Avoid using interfaces for DTOs when you need decorators.
✅ Leverage utility types to keep your DTOs DRY (Don't Repeat Yourself).
## 📁 Folder Structure Recommendation
```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── login.dto.ts
│   └── users.controller.ts
│   └── users.service.ts
```
## 🔚 Conclusion
DTOs are a powerful tool in NestJS for structuring, validating, and transforming data. By leveraging class-validator and class-transformer, NestJS DTOs provide a robust system for handling user input securely and predictably.








