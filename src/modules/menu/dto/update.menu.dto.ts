import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  parentId: string;
}
