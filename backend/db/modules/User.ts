import {
  Model,
  Table,
  Column,
  DataType,
  AllowNull,
  HasOne,
  BeforeCreate,
  BeforeBulkCreate,
} from "sequelize-typescript";

import FileStructure from "./FileStructure";
import sha256 from "../utils/sha256";

@Table({
  paranoid: true,
})
export default class User extends Model<User> {
  @Column(DataType.STRING(16))
  nick_name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  mobile!: string;

  // 微信openId
  @Column(DataType.STRING)
  openId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(128))
  get password(): string {
    return this.getDataValue("password");
  }

  set password(value: string) {
    this.setDataValue("password", sha256(value));
  }

  @BeforeCreate
  @BeforeBulkCreate
  static setNickName(instance: User | User[]) {
    if (!Array.isArray(instance)) {
      instance = [instance];
    }

    instance.forEach((item) => {
      if (!item.nick_name) {
        item.nick_name = `用户 #${item.mobile}`;
      }
    });
  }

  @HasOne(() => FileStructure)
  fileStructureId!: number;
}
