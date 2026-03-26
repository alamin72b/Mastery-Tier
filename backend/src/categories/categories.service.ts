import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories(userId: string) {
    try {
      const categories = await this.prisma.category.findMany({
        where: { userId },
        include: {
          children: {
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      });

      return categories.map((category) => ({
        ...category,
        masteryTier:
          category.children.length > 0
            ? Math.min(...category.children.map((sub) => sub.count))
            : 0,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  async createCategory(name: string, userId: string) {
    try {
      return await this.prisma.category.create({
        data: { name, userId },
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async createSubCategory(name: string, categoryId: number, userId: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true, userId: true },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      if (category.userId !== userId) {
        throw new ForbiddenException('You can only edit your own categories');
      }

      return await this.prisma.subCategory.create({
        data: { name, categoryId },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create sub-category');
    }
  }

  async deleteSubCategory(subCategoryId: number, userId: string) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: subCategoryId },
        include: { category: { select: { userId: true } } },
      });

      if (!subCategory) {
        throw new NotFoundException('Sub-category not found');
      }

      if (subCategory.category.userId !== userId) {
        throw new ForbiddenException('You can only delete your own topics');
      }

      return await this.prisma.subCategory.delete({
        where: { id: subCategoryId },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error('Error deleting sub-category:', error);
      throw new InternalServerErrorException('Failed to delete sub-category');
    }
  }

  async incrementSubCategory(subCategoryId: number, userId: string) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: subCategoryId },
        include: { category: { select: { userId: true } } },
      });

      if (!subCategory) {
        throw new NotFoundException(
          `Sub-category with ID ${subCategoryId} not found`,
        );
      }

      if (subCategory.category.userId !== userId) {
        throw new ForbiddenException('You can only edit your own topics');
      }

      return await this.prisma.subCategory.update({
        where: { id: subCategoryId },
        data: { count: { increment: 1 } },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to increment sub-category',
      );
    }
  }

  async decrementSubCategory(subCategoryId: number, userId: string) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: subCategoryId },
        include: { category: { select: { userId: true } } },
      });

      if (!subCategory) {
        throw new NotFoundException('Sub-category not found');
      }

      if (subCategory.category.userId !== userId) {
        throw new ForbiddenException('You can only edit your own topics');
      }

      if (subCategory.count <= 0) {
        return subCategory;
      }

      return await this.prisma.subCategory.update({
        where: { id: subCategoryId },
        data: { count: { decrement: 1 } },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to decrement');
    }
  }

  async deleteCategory(categoryId: number, userId: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: { userId: true },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (category.userId !== userId) {
        throw new ForbiddenException('You can only delete your own categories');
      }

      await this.prisma.subCategory.deleteMany({
        where: { categoryId },
      });

      return await this.prisma.category.delete({
        where: { id: categoryId },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error('Error deleting category:', error);
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
