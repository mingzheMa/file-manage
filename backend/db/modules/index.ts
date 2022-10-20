import User from "./User";
import FileStructure from "./FileStructure";
import File from "./File";
import db from "./db";

db.addModels([User, FileStructure, File]);

db.sync({ alter: true });
