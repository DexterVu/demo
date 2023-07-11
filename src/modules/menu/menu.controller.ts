import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDTO } from './dto/create.menu.dto';
import { UpdateMenuDTO } from './dto/update.menu.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private menuServie: MenuService) {}

  @Post()
  async create(@Body() createMenuDTO: CreateMenuDTO) {
    return this.menuServie.create(createMenuDTO);
  }

  @Get()
  async getTree() {
    return this.menuServie.getTree();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMenuDTO: UpdateMenuDTO) {
    console.log(id, 999);
    return this.menuServie.update(id, updateMenuDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.menuServie.delete(id);
  }
}
