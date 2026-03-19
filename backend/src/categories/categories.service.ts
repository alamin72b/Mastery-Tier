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

  /**
   * Retrieves all categories belonging to a specific user
   * and calculates the masteryTier dynamically.
   */
  async getAllCategories(userId: string) {
    try {
      const categories = await this.prisma.category.findMany({
        // Filter by the logged-in user's ID
        where: { userId },
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
      console.error('Error fetching categories:', error);
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  /**
   * Creates a new category linked to a specific user.
   */
  async createCategory(name: string, userId: string) {
    try {
      return await this.prisma.category.create({
        data: {
          name,
          userId, // Links the category to the User model in Neon
        },
      });
    } catch (error) {
      console.error('Error creating category:', error);
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
