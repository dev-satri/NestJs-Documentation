# Basic CRUD

A basic CRUD (Create, Read, Update, Delete) Project using Nest Js without using the database to familarize students with how Rest API Works  

<details>
  <summary>REST API Table</summary>
  <br>

| Method | Endpoint               | Description          | Request Body Example |
|--------|------------------------|----------------------|----------------------|
| POST   | `/api/add-item`        | Create a new item   | `{ "name": "Item1", "description": "Description1" }` |
| GET    | `/api/all`             | Get all items       | - |
| GET    | `/api/get-item/:id`    | Get item by ID      | - |
| PUT    | `/api/update-item/:id` | Update an item      | `{ "name": "Updated Item" }` |
| DELETE | `/api/delete-item/:id` | Delete an item      | - |
  </details>

<details>
  <summary> CRUD Project</summary>
  
## 1. Create a new NestJS project:
```
nest new nestjs-crud-array
```
## 2. Navigate to the project directory:
```
cd nestjs-crud-array
```

# Implementing the CRUD Operations
## Create the DTO with Validation: 
`src/items/dto/create-item.dto.ts`
```ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemDto {
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
```
## Create Service:
`src/items/items.service.ts`
```ts
import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  private items: CreateItemDto[] = [];

  // Create an item
  create(item: CreateItemDto) {
    item.id = this.items.length + 1;
    this.items.push(item);
    return item;
  }

  // Get all items
  findAll(): CreateItemDto[] {
    return this.items;
  }

  // Get an item by ID
  findOne(id: number): CreateItemDto | undefined {
    return this.items.find(item => item.id === id);
  }

  // Update an item
  update(id: number, updatedItem: Partial<CreateItemDto>) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) return null;
    this.items[itemIndex] = { ...this.items[itemIndex], ...updatedItem };
    return this.items[itemIndex];
  }

  // Delete an item
  remove(id: number): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }
}
```
## Create Controller:
`src/items/items.controller.ts`
```ts
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('api')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('/add-item')
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get('/all')
  findAll() {
    return this.itemsService.findAll();
  }

  @Get('/get-item/:id')  // Fixed the incorrect route format
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(Number(id));
  }

  @Put('/update-item/:id') // Added consistency in route names
  update(@Param('id') id: string, @Body() updateItemDto: Partial<CreateItemDto>) {
    return this.itemsService.update(Number(id), updateItemDto);
  }

  @Delete('/delete-item/:id') // Added consistency in route names
  remove(@Param('id') id: string) {
    return this.itemsService.remove(Number(id));
  }
}
```

<details> 

<summary>Parts of API</summary>


### ✅ Parts of an API Request in NestJS

| Decorator           | Extracts From         | Use Case                                                                 | Example Usage                                             |
|---------------------|------------------------|--------------------------------------------------------------------------|------------------------------------------------------------|
| `@Body()`           | Request Body           | Used to get POST/PUT/PATCH data sent in JSON or form.                   | `createUser(@Body() data: CreateUserDto)`                 |
| `@Param()`          | URL Parameters         | Used to get dynamic route params like `/user/:id`.                      | `getUser(@Param('id') id: string)`                        |
| `@Query()`          | Query Parameters       | Used to get data from query string like `/search?term=abc`.             | `search(@Query('term') term: string)`                     |
| `@Headers()`        | Request Headers        | Used to access custom or standard headers in a request.                 | `getData(@Headers('authorization') token: string)`        |
| `@Req()`            | Full Request Object    | Gives access to the entire request object (like in Express).            | `handle(@Req() req: Request)`                             |
| `@Res()`            | Full Response Object   | Gives access to the full response object; used for manual response.     | `handle(@Res() res: Response)`                            |
| `@Ip()`             | Client IP Address      | Used to get the IP address of the incoming request.                     | `getIp(@Ip() ip: string)`                                 |
| `@HostParam()`      | Host Parameter         | Used with wildcard hosts to extract dynamic values from host.           | `handle(@HostParam('account') account: string)`           |
| `@Session()`        | Session Data (if used) | Gets the current session if sessions are configured.                    | `getSession(@Session() session: Record<string, any>)`     |
| `@UploadedFile()`   | Uploaded File (Single) | Used with `@UseInterceptors(FileInterceptor())` for file upload.        | `upload(@UploadedFile() file: Express.Multer.File)`       |
| `@UploadedFiles()`  | Uploaded Files (Multiple) | Used with `FilesInterceptor()` for multiple files.                    | `upload(@UploadedFiles() files: Express.Multer.File[])`   |

</details>

## Create Module:
`src/items/items.module.ts`
```ts
import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ValidationPipe } from '@nestjs/common';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
```
# Testing the API
## Start the server:
```
npm run start
```
## Start Server (Watch Mode)
```
npm run start:dev
```
</details>
