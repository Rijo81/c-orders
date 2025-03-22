export interface GroupsI{
  id?: string;
  name: string;
  parentId?: string | null;
}

export interface GroupI{
  id?: number;
  name: string;
  parentId: number | null;
}
