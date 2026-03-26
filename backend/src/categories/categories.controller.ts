import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

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
  async getAll(@Req() req: RequestWithUser) {
    return this.categoriesService.getAllCategories(req.user.userId);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.createCategory(
      createCategoryDto.name,
      req.user.userId,
    );
  }

  @Delete('sub/:id')
  async deleteSub(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.deleteSubCategory(id, req.user.userId);
  }

  @Post(':id/sub')
  async createSub(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.createSubCategory(name, id, req.user.userId);
  }

  @Patch('sub/:id/increment')
  async increment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.incrementSubCategory(id, req.user.userId);
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.deleteCategory(id, req.user.userId);
  }

  @Patch('sub/:id/decrement')
  async decrement(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.categoriesService.decrementSubCategory(id, req.user.userId);
  }
}
