export interface GroupsI{
  id?: string;
  name: string;
  parentId?: string | null;
  permition_states?: boolean;
  permition_groups?: boolean;
  permition_users?: boolean;
  permition_typerequests?: boolean;
  permition_requests?: boolean;
  permition_viewsolic?: boolean;
  permition_state_requests?: boolean;
}

export interface GroupI{
  id?: number;
  name: string;
  parentId: number | null;
}
