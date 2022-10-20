import { Sequelize } from "sequelize-typescript";

import { sqlLogger } from "../../utils/log4js";

export default new Sequelize("file_manage", "root", "return0412", {
  host: "localhost",
  dialect: "mysql", // 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql'
  logging(msg: any) {
    sqlLogger.info(msg);
  },
});
