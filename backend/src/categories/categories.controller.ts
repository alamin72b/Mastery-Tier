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
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // 👈 1. Import Request from Express
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

// 👈 2. Define exactly what your JWT Strategy attaches to the request
interface RequestWithUser extends Request {
  user: {
    userId: string; // (Change this to number if your user IDs are integers)
    // You can add email, role, etc. here if your JWT payload includes them
  };
}

@Controller('categories')
@UseGuards(AuthGuard('jwt')) // 🔒 Locks down EVERY route in this controller
export class CategoriesController {
  // We inject the service (the brain) into the controller (the door)
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET http://localhost:3001/categories
  @Get()
  async getAll(@Req() req: RequestWithUser) {
    // 👈 3. Replace 'any' with our new interface
    // TypeScript now fully understands that req.user.userId is a safe string!
    return this.categoriesService.getAllCategories(req.user.userId);
  }

  // POST http://localhost:3001/categories
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: RequestWithUser, // 👈 4. Replace 'any' here as well
  ) {
    // req.user is automatically populated by your JwtStrategy!
    return this.categoriesService.createCategory(
      createCategoryDto.name,
      req.user.userId,
    );
  }
  // DELETE http://localhost:3001/categories/sub/:id
  @Delete('sub/:id')
  async deleteSub(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteSubCategory(id);
  }
  // POST http://localhost:3001/categories/:id/sub
  @Post(':id/sub')
  async createSub(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this.categoriesService.createSubCategory(name, id);
  }

  // PATCH http://localhost:3001/categories/sub/:id/increment
  @Patch('sub/:id/increment')
  async increment(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.incrementSubCategory(id);
  }
  // DELETE http://localhost:3001/categories/:id
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }

  // PATCH http://localhost:3001/categories/sub/:id/decrement
  @Patch('sub/:id/decrement')
  async decrement(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.decrementSubCategory(id);
  }
}
