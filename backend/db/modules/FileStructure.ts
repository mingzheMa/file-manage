import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";

import User from "./User";
import File from "./File";

interface Structure {
  name: string;
  id: string;
  children?: Structure[];
}

@Table({
  paranoid: true,
})
export default class FileStructure extends Model<FileStructure> {
  @Column(DataType.TEXT("long"))
  get structure(): Structure[] {
    // @ts-ignore
    return JSON.parse(this.getDataValue("structure"));
  }

  set structure(value: Structure[]) {
    // @ts-ignore
    this.setDataValue("structure", JSON.stringify(value));
  }

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @HasMany(() => File)
  fileId!: number;
}
