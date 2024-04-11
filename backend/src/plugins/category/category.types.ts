export interface CategoryData {
  name: string;
  picture: string | null;
  parentId: number | null;
}

export interface CategoryItem extends CategoryData {
  id: number;
  count: number;
  recursiveCount: number;
  path: string;
}
