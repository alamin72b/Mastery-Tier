import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // 1. Import Request from express
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

// 2. Define exactly what your JWT Strategy attaches to the request
interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  // 3. Replace 'any' with 'RequestWithUser'
  async getAll(@Req() req: RequestWithUser) {
    return this.categoriesService.getAllCategories(req.user.userId);
  }

  @Post()
  // 4. Replace 'any' with 'RequestWithUser'
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.createCategory(
      createCategoryDto.name,
      req.user.userId,
    );
  }

  // ... rest of your controller
}
