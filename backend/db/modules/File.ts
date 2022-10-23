import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";

import FileStructure from "./FileStructure";

@Table({
  paranoid: true,
})
export default class File extends Model<File> {
  @Column(DataType.TEXT("long"))
  content!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  structureId!: string;

  @ForeignKey(() => FileStructure)
  @Column(DataType.INTEGER)
  fileStructureId!: number;
}
