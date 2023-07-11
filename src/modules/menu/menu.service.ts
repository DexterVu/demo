import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Menu } from './entity/menu.entity';
import { Repository, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDTO } from './dto/create.menu.dto';
import * as _ from 'lodash';
import { MessError } from 'src/utils/mess';
import { UpdateMenuDTO } from './dto/update.menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private repository: Repository<Menu>,
    private connection: Connection,
  ) {}

  async create(createMenuDTO: CreateMenuDTO) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // check exist
      const checkMenu = await queryRunner.manager.findOne(
        this.repository.metadata.tableName,
        { where: createMenuDTO },
      );
      if (checkMenu) {
        throw new HttpException(MessError.MENU_CONFLICT, HttpStatus.CONFLICT);
      }

      // create menu
      const dataMenu = new Menu();
      _.assign(dataMenu, createMenuDTO);
      const menu = await queryRunner.manager.save(dataMenu);

      await queryRunner.commitTransaction();
      return menu;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private buildTreeMenu(menus: Menu[], parentId: string | null): Menu[] {
    const treeMenu: Menu[] = [];

    menus.forEach((menu) => {
      if (menu.parentId == parentId) {
        const children = this.buildTreeMenu(menus, menu.id);
        menu.children = children.length ? children : undefined;
        treeMenu.push(menu);
      }
    });

    return treeMenu;
  }

  async getTree() {
    // get data menu
    const menus = await this.repository.find();

    // build tree menu
    return this.buildTreeMenu(menus, null);
  }

  async delete(id: string) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // check exist
      const checkMenu = await queryRunner.manager.findOne(
        this.repository.metadata.tableName,
        { where: { id } },
      );
      if (!checkMenu) {
        throw new HttpException(MessError.MENU_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      // delete menu
      const menu = await queryRunner.manager.delete(
        this.repository.metadata.tableName,
        { id },
      );

      await queryRunner.commitTransaction();
      return menu;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateMenuDTO: UpdateMenuDTO) {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // check exist
      const checkMenu = await queryRunner.manager.findOne(
        this.repository.metadata.tableName,
        {
          where: { id },
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        },
      );
      if (!checkMenu) {
        throw new HttpException(MessError.MENU_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      // check conflict
      const checkMenuConflict = await queryRunner.manager.findOne(
        this.repository.metadata.tableName,
        {
          where: {
            name: updateMenuDTO.name ? updateMenuDTO.name : checkMenu.name,
            parentId: updateMenuDTO.parentId
              ? updateMenuDTO.parentId
              : checkMenu.parentId,
          },
        },
      );
      if (checkMenuConflict) {
        throw new HttpException(MessError.MENU_CONFLICT, HttpStatus.CONFLICT);
      }

      // update menu
      const menu = await queryRunner.manager.update(
        this.repository.metadata.tableName,
        { id },
        updateMenuDTO,
      );

      await queryRunner.commitTransaction();
      return menu;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
