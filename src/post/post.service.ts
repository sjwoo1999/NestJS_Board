import _ from 'lodash';

import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RemovePostDTO } from './dto/remove-post.dto';

@Injectable()
export class PostService {
  private articles: { id: number; title: string; content: string }[] = [];
  private articlePasswords = new Map<number, number>();

  create(createPostDto: CreatePostDto) {
    const { title, content, password } = createPostDto;
    const id = this.articles.length + 1;

    this.articles.push({ id, title, content });
    this.articlePasswords.set(id, password);

    return { id };
  }

  findAll() {
    return this.articles.map(({ id, title }) => ({ id, title }));
  }

  findOne(id: number) {
    return this.articles.find((article) => article.id === id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const { content, password } = updatePostDto;
    const article = this.articles.find((article) => article.id === id);

    if (_.isNil(article)) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const articlePassword = this.articlePasswords.get(id);
    if (!_.isNil(articlePassword) && articlePassword !== password) {
      throw new NotFoundException('비밀번호가 일치하지 않습니다.');
    }

    article.content = content;
  }

  remove(id: number, deletePostDto: RemovePostDTO) {
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id,
    );

    if (articleIndex === -1) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const articlePassword = this.articlePasswords.get(id);
    if (
      !_.isNil(articlePassword) &&
      articlePassword !== deletePostDto.password
    ) {
      throw new NotFoundException('비밀번호가 일치하지 않습니다.');
    }

    this.articles.splice(articleIndex, 1);
  }
}
