import user from "./user";
import fileStructure from "./fileStructure";
import file from "./file";

export default [
  {
    path: "/api/user",
    router: user,
  },
  {
    path: "/api/file-structure",
    router: fileStructure,
  },
  {
    path: "/api/file",
    router: file,
  },
];
