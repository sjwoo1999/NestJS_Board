import { OmitType, PickType } from '@nestjs/mapped-types';

import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends OmitType(CreatePostDto, ['title']) {}
