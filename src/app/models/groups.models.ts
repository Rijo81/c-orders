export interface GroupsI{
  id?: string;
  name: string;
  parentid?: string | null;
  permition_states?: boolean;
  permition_groups?: boolean;
  permition_users?: boolean;
  permition_typerequests?: boolean;
  permition_requests?: boolean;
  permition_viewsolic?: boolean;
}

export interface GroupI{
  id?: number;
  name: string;
  parentId: number | null;
}
