

export interface FileTree {
  name: string;
  id: string;
  children?: FileTree[];
  title?: any; // 接口返回数据会递归增加title属性
}

export interface FileTreeInfo {
  id: number;
  userId: number;
  structure: FileTree[];
}
