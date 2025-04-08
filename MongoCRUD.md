# Nest CRUD (Using MongoDB)
## ✅ Project Name: `nest-mongo-crud`
### Project Structure
```
nest-mongo-crud/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   └── books/
│       ├── books.controller.ts
│       ├── books.service.ts
│       ├── books.module.ts
│       └── schemas/
│           └── book.schema.ts
├── .env
├── package.json

```
## Database (MongoDB)
**Community Edition:** [Link](https://www.mongodb.com/try/download/community-edition)

## 🧱 Tech Stack
- NestJS
- MongoDB (accessed using MongoDB Compass)

## 📦 Setup NestJS Project
```
npm i -g @nestjs/cli
nest new nest-mongo-crud
cd nest-mongo-crud
```
## 📦 Install Mongoose
```
npm install @nestjs/mongoose mongoose
```
## 🧩 Create a Module, Controller, and Service
Let’s say we want to manage "Books".
```
nest g module books
nest g controller books
nest g service books
```
## 📦: Install @nestjs/config
```
npm install @nestjs/config
```
## 🗂️ Create .env File at the Root (MongoDB Compass)
```
MONGO_URI=mongodb://localhost:27017/nestmongo
PORT=3000
```
If you're using MongoDB Atlas, it could look like this:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nestmongo?retryWrites=true&w=majority
PORT=3000
```
## 🧠 Setup MongoDB Connection
Edit `app.module.ts:`
```
/* eslint-disable prettier/prettier */
// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import in every module
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    BooksModule,
  ],
})
export class AppModule { }
```
> Replace the MongoDB URI if you're using MongoDB Atlas or another custom database.

Edit `main.ts:`
```
/* eslint-disable prettier/prettier */
// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap();
```
## 📄 Create Schema (Book)
Create file: `src/books/schemas/book.schema.ts`
```
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop({ required: true })
    title: string;

    @Prop()
    author: string;

    @Prop()
    publishedYear: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
```
## 🔌 Register the Schema in BooksModule
Update `books.module.ts`:
```
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
```
## ⚙️ CRUD in Service
```
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
    constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) { }

    async create(book: Book): Promise<Book> {
        const newBook = new this.bookModel(book);
        return newBook.save();
    }

    async findAll(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }

    async findOne(id: string): Promise<Book | null> {
        return this.bookModel.findById(id).exec();
    }

    async update(id: string, book: Partial<Book>): Promise<Book | null> {
        return this.bookModel.findByIdAndUpdate(id, book, { new: true }).exec();
    }

    async delete(id: string): Promise<Book | null> {
        return this.bookModel.findByIdAndDelete(id).exec();
    }
}
```
## 🌐 API Routes in Controller
Update `books.controller.ts`:
```
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    create(@Body() book: Book) {
        return this.booksService.create(book);
    }

    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() book: Partial<Book>) {
        return this.booksService.update(id, book);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.booksService.delete(id);
    }
}
```
## 🧪 Test it out
You can now use Postman or curl to test the following endpoints:

`POST /books` — Create a book

`GET /books` — Get all books

 `GET /books/:id` — Get one book

`PUT /books/:id` — Update a book

`DELETE /books/:id` — Delete a book

## 📘 Bonus: Using MongoDB Compass
1. Open MongoDB Compass.
2. Connect to `mongodb://localhost:27017/.`
3. Navigate to nestmongo database.
4. You’ll see a books collection auto-created after inserting data via API.
