
### File: `./backend/eslint.config.mjs`
```
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);

```


### File: `./backend/.gitignore`
```
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

/generated/prisma

```


### File: `./backend/nest-cli.json`
```
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}

```


### File: `./backend/package.json`
```
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@neondatabase/serverless": "^1.0.2",
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mapped-types": "^2.1.0",
    "@nestjs/platform-express": "^11.0.1",
    "@prisma/adapter-neon": "^7.5.0",
    "@prisma/adapter-pg": "^7.5.0",
    "@prisma/client": "^7.5.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.15.1",
    "pg": "^8.20.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.1",
    "@prisma/config": "^7.5.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^22.10.7",
    "@types/pg": "^8.18.0",
    "@types/supertest": "^6.0.2",
    "dotenv": "^17.3.1",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^16.0.0",
    "jest": "^30.0.0",
    "prettier": "^3.4.2",
    "prisma": "^7.5.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.20.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

```


### File: `./backend/.prettierrc`
```
{
  "singleQuote": true,
  "trailingComma": "all"
}

```


### File: `./backend/prisma/migrations/20260315211948_init_mastery_tiers/migration.sql`
```
-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

```


### File: `./backend/prisma/migrations/migration_lock.toml`
```
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"

```


### File: `./backend/prisma/schema.prisma`
```
generator client {
  provider = "prisma-client-js" 
}

datasource db {
  provider = "postgresql"
  // NOTICE: The URL is gone!
}

model Category {
  id       Int           @id @default(autoincrement())
  name     String
  children SubCategory[]
}

model SubCategory {
  id         Int      @id @default(autoincrement())
  name       String
  count      Int      @default(0)
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
}
```


### File: `./backend/README.md`
```
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```


### File: `./backend/src/app.controller.spec.ts`
```
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

```


### File: `./backend/src/app.controller.ts`
```
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


### File: `./backend/src/app.module.ts`
```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';

@Module({
  imports: [CategoriesModule, PrismaModule, SubCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```


### File: `./backend/src/app.service.ts`
```
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```


### File: `./backend/src/categories/categories.controller.spec.ts`
```
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

```


### File: `./backend/src/categories/categories.controller.ts`
```
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
@Controller('categories')
export class CategoriesController {
  // We inject the service (the brain) into the controller (the door)
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET http://localhost:3000/categories
  @Get()
  async getAll() {
    return this.categoriesService.getAllCategories();
  }

  // POST http://localhost:3000/categories
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto.name);
  }

  // POST http://localhost:3000/categories/:id/sub
  @Post(':id/sub')
  async createSub(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this.categoriesService.createSubCategory(name, id);
  }

  // PATCH http://localhost:3000/categories/sub/:id/increment
  @Patch('sub/:id/increment')
  async increment(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.incrementSubCategory(id);
  }
}

```


### File: `./backend/src/categories/categories.module.ts`
```
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}

```


### File: `./backend/src/categories/categories.service.spec.ts`
```
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

```


### File: `./backend/src/categories/categories.service.ts`
```
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  // Inject the clean, global database connection
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        include: { children: true },
      });

      return categories.map((category) => {
        const masteryTier =
          category.children.length > 0
            ? Math.min(...category.children.map((sub) => sub.count))
            : 0;

        return { ...category, masteryTier };
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  async createCategory(name: string) {
    try {
      return await this.prisma.category.create({
        data: { name },
      });
    } catch (error) {
      console.error(error); // This will print the REAL error to your terminal
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async createSubCategory(name: string, categoryId: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      return await this.prisma.subCategory.create({
        data: { name, categoryId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create sub-category');
    }
  }

  async incrementSubCategory(subCategoryId: number) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: subCategoryId },
      });

      if (!subCategory) {
        throw new NotFoundException(
          `Sub-category with ID ${subCategoryId} not found`,
        );
      }

      return await this.prisma.subCategory.update({
        where: { id: subCategoryId },
        data: { count: { increment: 1 } },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to increment sub-category',
      );
    }
  }
}

```


### File: `./backend/src/categories/dto/create-category.dto.ts`
```
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @MinLength(3, {
    message: 'Category name is too short (minimum 3 characters)',
  })
  @MaxLength(50, {
    message: 'Category name is too long (maximum 50 characters)',
  })
  name: string;
}

```


### File: `./backend/src/categories/README.md`
```
### Enterprise Technical Specification: Mastery Tiers API

**1. Executive Summary**
The Mastery Tiers API provides a robust backend architecture for tracking hierarchical skill progression. It allows clients to create top-level categories, nest sub-categories (skills) beneath them, and dynamically calculate a user's overall "Mastery Tier" based on their lowest completed sub-skill. Built on NestJS and Prisma 7, the system ensures type-safe database interactions and enforces a globally standardized HTTP response structure to streamline frontend consumption.

**2. Architectural Design**
The feature follows a strict three-tier architecture:

* **Routing Layer (Controller):** Handles incoming HTTP requests and enforces parameter typing (e.g., `ParseIntPipe` for IDs).
* **Business Logic Layer (Service):** Calculates the `masteryTier` dynamically using a `Math.min()` aggregation across nested sub-categories, ensuring the parent tier accurately reflects the minimum threshold of all child components.
* **Data Access Layer (PrismaService):** Interfaces with a serverless PostgreSQL instance (Neon). It utilizes Prisma 7's standard client configuration, bypassing edge-specific driver adapters to prioritize stability in a standard Node.js deployment environment.
* **Middleware (Global Wrappers):** A generic `TransformInterceptor` and `HttpExceptionFilter` wrap all outgoing traffic, guaranteeing a uniform data shape regardless of success or failure.

**3. Data Contracts**
All API responses conform to a strict interface, eliminating the need for frontend payload-guessing.

| Property | Type | Description |
| --- | --- | --- |
| `success` | `boolean` | Indicates if the operation completed without exceptions. |
| `statusCode` | `number` | The HTTP status code (e.g., 200, 201, 500). |
| `message` | `string` | Human-readable outcome description. |
| `data` | `T | null` | The requested payload (omitted or null on failure). |
| `error` | `string[]` | Array of error messages (omitted on success). |
| `timestamp` | `string` | ISO 8601 timestamp of the transaction. |
| `path` | `string` | The API endpoint that was accessed. |

**4. Deployment Standard Operating Procedures (SOP)**

1. **Environment Configuration:** Ensure `.env` contains a valid, pooled PostgreSQL connection string (`DATABASE_URL`).
2. **Schema Synchronization:** Run `bunx prisma db push` (or `migrate deploy` for production) to align the Neon database schema.
3. **Client Generation:** Run `bunx prisma generate` to build the TypeScript types into `node_modules`.
4. **Application Build:** Execute `bun run build` to compile the NestJS application.
5. **Service Startup:** Initialize the production server using `bun run start:prod`.

---

### Architecture Decision Record (ADR)

**Title:** Implementation of Computed Tiers and Standardized Interceptors
**Status:** Accepted

**Context:**
The Next.js frontend requires a predictable data structure to render UI components effectively, particularly when displaying aggregated category scores and handling API errors. Furthermore, persisting a `masteryTier` directly in the database introduces the risk of data staleness if sub-categories are modified or deleted.

**Decision:**

1. **Computed Properties:** We opted to calculate the `masteryTier` dynamically in the `CategoriesService` at request time, rather than storing it as a database column.
2. **Global Interceptors:** We implemented a `TransformInterceptor<T>` and an `HttpExceptionFilter` at the application bootstrap level (`main.ts`) to intercept all incoming requests and outgoing responses.

**Consequences:**

* **Positive:** The Next.js frontend can universally destructure `const { success, data, error } = await api.get(...)`. Database normalization is maintained with zero risk of desynchronized tier counts.
* **Negative/Mitigation:** Dynamic calculation slightly increases CPU load on `GET` requests, but the impact is negligible given the indexed foreign keys in PostgreSQL.

```


### File: `./backend/src/common/filters/http-exception.filter.ts`
```
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 1. Get the raw response from NestJS
    const exceptionResponse = exception.getResponse();

    // 2. Define the exact shape instead of using 'any'
    // NestJS errors usually contain an optional message and error string.
    const parsedResponse = exceptionResponse as {
      message?: string | string[];
      error?: string;
    };

    response.status(status).json({
      success: false,
      statusCode: status,
      message: parsedResponse.message || exception.message,
      error: parsedResponse.error
        ? [parsedResponse.error]
        : [exception.message],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

```


### File: `./backend/src/common/interceptors/transform.interceptor.ts`
```
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      // 1. Explicitly type 'data' as 'T' so ESLint knows exactly what it is
      map((data: T) => ({
        success: true,
        statusCode: response.statusCode,
        message: 'Operation completed successfully',
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}

```


### File: `./backend/src/common/interfaces/api-response.interface.ts`
```
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
  path: string;
}

```


### File: `./backend/src/main.ts`
```
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common'; // 1. Import this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the global wrappers
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // 2. Enable Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
    }),
  );

  await app.listen(3000);
}
bootstrap();

```


### File: `./backend/src/prisma/prisma.module.ts`
```
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This decorator makes Prisma available everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This exports the service for other modules to use
})
export class PrismaModule {}

```


### File: `./backend/src/prisma/prisma.service.spec.ts`
```
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

```


### File: `./backend/src/prisma/prisma.service.ts`
```
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // We must manually grab the URL here to ensure it doesn't default to 127.0.0.1
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in .env file');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool as any);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}

```


### File: `./backend/src/sub-categories/dto/create-sub-category.dto.ts`
```
import { CreateCategoryDto } from '../../categories/dto/create-category.dto';

export class CreateSubCategoryDto extends CreateCategoryDto {}

```


### File: `./backend/src/sub-categories/dto/update-sub-category.dto.ts`
```
import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}

```


### File: `./backend/src/sub-categories/entities/sub-category.entity.ts`
```
export class SubCategory {}

```


### File: `./backend/src/sub-categories/README.md`
```
# Architecture Decision Record (ADR)

**ADR 002: Implementation of Nested Sub-Category API**

* **Status:** Accepted
* **Context:** The application requires a hierarchical relationship between Categories and Sub-Categories. We needed to decide how to represent this relationship in the REST API.
* **Decision:** We chose **Option A: Nested URL Routing** (`/categories/:id/subcategories`).
* **Consequences:** * **Pros:** Clearer hierarchical relationship; simplifies the frontend logic for "Add Sub-Category" inside a specific category view.
* **Cons:** Slightly more complex controller logic to handle path parameters alongside request bodies.



---

## Enterprise Technical Specification

**Project:** Mastery Tiers | **Feature:** Sub-Category Management (CRUD)

### 1. Executive Summary

This feature enables users to create, update, and delete granular "Sub-Categories" nested within parent Categories. It leverages the NestJS validation pipeline, Prisma's relational mapping, and `@nestjs/mapped-types` to ensure data integrity across the full lifecycle of a sub-category.

### 2. Architectural Design

The implementation follows a strict **Layered Architecture**:

* **Transport Layer:** NestJS Controller captures `:categoryId` and `:id` via URL parameters for scoped requests.
* **Validation Layer:** * `CreateSubCategoryDto` inherits from `CreateCategoryDto`.
* `UpdateSubCategoryDto` utilizes `PartialType` to allow optional field updates.


* **Domain Layer:** `SubCategoriesService` handles the business logic of connecting entities and executing updates/deletions.
* **Persistence Layer:** Prisma ORM executes relational queries (connect, update, delete) in PostgreSQL.

### 3. Data Contracts (API Interface)

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/categories/:categoryId/subcategories` | Create a new sub-category |
| **PATCH** | `/categories/:categoryId/subcategories/:id` | Update an existing sub-category |
| **DELETE** | `/categories/:categoryId/subcategories/:id` | Remove a sub-category |

**Response Wrapper (Global Interceptor):**
Standardized envelope applied to all successful responses: `{ "statusCode": 201/200, "data": { ... } }`.

---

### 4. Deployment Standard Operating Procedures (SOP)

1. **Dependency Audit:** Ensure `class-validator`, `class-transformer`, and `@nestjs/mapped-types` are in `package.json`.
2. **Schema Migration:** Verify `SubCategory` model exists in `schema.prisma`.
3. **Database Sync:** Run `bunx prisma migrate dev` for any schema changes.
4. **Verification:** Execute `curl -X PATCH` and `curl -X DELETE` against the nested endpoints.

```


### File: `./backend/src/sub-categories/sub-categories.controller.spec.ts`
```
import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesController } from './sub-categories.controller';
import { SubCategoriesService } from './sub-categories.service';

describe('SubCategoriesController', () => {
  let controller: SubCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoriesController],
      providers: [SubCategoriesService],
    }).compile();

    controller = module.get<SubCategoriesController>(SubCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

```


### File: `./backend/src/sub-categories/sub-categories.controller.ts`
```
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Controller('categories/:categoryId/subcategories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  create(
    @Param('categoryId') categoryId: string,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    // Pass both the parent ID (converted to a number) and the JSON body to the service
    return this.subCategoriesService.create(+categoryId, createSubCategoryDto);
  }

  @Get()
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoriesService.update(+id, updateSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoriesService.remove(+id);
  }
}

```


### File: `./backend/src/sub-categories/sub-categories.module.ts`
```
import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Import the file

@Module({
  imports: [PrismaModule], // 2. Add it to the imports array here!
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}

```


### File: `./backend/src/sub-categories/sub-categories.service.spec.ts`
```
import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesService } from './sub-categories.service';

describe('SubCategoriesService', () => {
  let service: SubCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubCategoriesService],
    }).compile();

    service = module.get<SubCategoriesService>(SubCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

```


### File: `./backend/src/sub-categories/sub-categories.service.ts`
```
import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class SubCategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(categoryId: number, createSubCategoryDto: CreateSubCategoryDto) {
    // Tell Prisma to create the subcategory and connect it to the parent ID
    return this.prisma.subCategory.create({
      data: {
        name: createSubCategoryDto.name,
        category: {
          connect: { id: categoryId }, // Links to the parent!
        },
      },
    });
  }

  findAll() {
    return `This action returns all subCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    return this.prisma.subCategory.update({
      where: { id },
      data: updateSubCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prisma.subCategory.delete({
      where: { id },
    });
  }
}

```


### File: `./backend/test/app.e2e-spec.ts`
```
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

```


### File: `./backend/test/jest-e2e.json`
```
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}

```


### File: `./backend/tsconfig.build.json`
```
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}

```


### File: `./backend/tsconfig.json`
```
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "resolvePackageJsonExports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}

```


### File: `./frontend/app/globals.css`
```
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```


### File: `./frontend/app/layout.tsx`
```
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

```


### File: `./frontend/app/page.tsx`
```
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

```


### File: `./frontend/eslint.config.mjs`
```
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```


### File: `./frontend/.gitignore`
```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```


### File: `./frontend/next.config.ts`
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```


### File: `./frontend/package.json`
```
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "ignoreScripts": [
    "sharp",
    "unrs-resolver"
  ],
  "trustedDependencies": [
    "sharp",
    "unrs-resolver"
  ]
}

```


### File: `./frontend/postcss.config.mjs`
```
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```


### File: `./frontend/public/file.svg`
```
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
```


### File: `./frontend/public/globe.svg`
```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```


### File: `./frontend/public/next.svg`
```
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```


### File: `./frontend/public/vercel.svg`
```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
```


### File: `./frontend/public/window.svg`
```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
```


### File: `./frontend/README.md`
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```


### File: `./frontend/tsconfig.json`
```
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```


### File: `./.gitignore`
```
# =========================
# Node & Dependencies
# =========================
node_modules/
npm-debug.log
yarn-error.log

# (Note: We do NOT ignore bun.lockb or package-lock.json. Lock files should be committed!)

# =========================
# Next.js (Frontend)
# =========================
frontend/.next/
frontend/out/
frontend/build/

# =========================
# NestJS (Backend)
# =========================
backend/dist/
backend/coverage/

# =========================
# Prisma & Database
# =========================
*.db
*.db-journal

# =========================
# Environment Variables
# =========================
.env
.env.local
.env.development
.env.test
.env.production

# =========================
# OS & Editor Files
# =========================
.DS_Store
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.swp
```

