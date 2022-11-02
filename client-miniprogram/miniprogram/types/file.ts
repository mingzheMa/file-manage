export interface FileTree {
  name: string;
  id: string;
  children?: FileTree[];
}

export interface FileTreeInfo {
  id: number;
  userId: number;
  structure: FileTree[];
}

export interface File {
  id: number;
  content: string;
  name: string;
  structureId: string;
  fileStructureId: number;
}

export interface DisplayFile {
  originalname: string;
  mimetype: string;
  filepath: string;
}
