export interface APIError {
  error: string;
}

export interface Category {
  id: number;
  name: string;
  picture?: string | null;
  parentId?: number;
  children?: Category[];
  productsCount?: number;
  count?: number;
  recursiveCount?: number;
  title?: string;
}

export interface Product {
  id: number;
  name: string;
  picture?: string | null;
  categoryId: number;
  category?: { name: string };
}

export interface TreeItem {
  id: number;
  name: string;
  picture: null | string;
  children: TreeItem[];
}
