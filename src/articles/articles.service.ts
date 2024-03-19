import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlesEntity } from './entities/articles.entity';
import { ArticlesDto, ArticlesUpdateDto } from './dto/articles.dto';
import { UsersService } from '../users/users.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { IJwtPayload } from '../auth/interfaces/jwt.interface';
import { RolesEnum } from '../roles/enums/roles.enum';
import { PaginationResDto } from './dto/pagination.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesEntity)
    private articlesRepository: Repository<ArticlesEntity>,

    private usersService: UsersService,
  ) {}

  async getById(id: string): Promise<ArticlesEntity> {
    const article = await this.articlesRepository.findOneBy({ id });

    if (!article) {
      throw new NotFoundException('Article with this id not exist!');
    }

    return article;
  }

  async getByUser(userId: string): Promise<ArticlesEntity[]> {
    const user = await this.usersService.getById(userId, { articles: true });
    return user.articles;
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResDto> {
    return paginate<ArticlesEntity>(this.articlesRepository, { page, limit });
  }

  async create(
    data: ArticlesDto,
    payload: IJwtPayload,
  ): Promise<ArticlesEntity> {
    const creator = await this.usersService.getById(payload.id);
    if (!creator) {
      throw new BadRequestException('Creator not exist!');
    }

    const newArticle = await this.articlesRepository.save({
      title: data.title,
      body: data.body,
      user: creator,
    });

    delete newArticle.user;
    return newArticle;
  }

  async update(
    id: string,
    data: ArticlesUpdateDto,
    payload: IJwtPayload,
  ): Promise<ArticlesEntity> {
    if (payload.role === RolesEnum.Editor) {
      const article = await this.articlesRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (article?.user?.id !== payload.id) {
        throw new ForbiddenException('This is not your article!');
      }
    }
    await this.articlesRepository.update({ id }, data);

    return await this.getById(id);
  }

  async delete(id: string, payload: IJwtPayload): Promise<void> {
    if (payload.role === RolesEnum.Editor) {
      const article = await this.articlesRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (article.user.id !== payload.id) {
        throw new ForbiddenException('This is not your article!');
      }
    }

    await this.articlesRepository.delete({ id });
    return;
  }
}
