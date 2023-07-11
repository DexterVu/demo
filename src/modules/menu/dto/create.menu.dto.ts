import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  parentId: string;
}
