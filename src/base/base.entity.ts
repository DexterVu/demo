import { Column, BeforeInsert, BeforeUpdate } from 'typeorm';

export class BaseEntity {
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @Column({ name: 'created_by', length: 36, nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', length: 36, nullable: true })
  updatedBy: string;

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }
}
