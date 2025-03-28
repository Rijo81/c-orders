import { CategoriesI } from "./category.models";
import { GroupI, GroupsI } from "./groups.models";

export interface TypeRequestsI {
  id: number;
  name: string;
  category?: CategoriesI,
  group_origin?: GroupsI,
  group_destine?: GroupsI;
  fields: FieldsRequestsI[];
}

export interface FieldsRequestsI {
  name: string;
  type: 'string' | 'number' | 'document' | 'checkbox' | 'radiobutton' | 'list';
  options?: string[];
}

  export interface RequestI {
    id: number;
    formData: Record<string, any>;
    group_origin: { id: number; name: string; parentId?: number };
    group_destine: { id: number; name: string; parentId?: number };
    typeName: string;
  }

export interface RequestsI {
  id?: string;
  formData: Record<string, any>;
  group_origin: { id?: string; name: string; parentId?: string };
  group_destine: { id?: string; name: string; parentId?: string };
  typeName: string;
}

export interface TypeRI {
  id: string;
  name: string;
  group_origin?: GroupsI,
  group_destine?: GroupsI;
  fields: FieldsI[];
}

export interface FieldsI {
  name: string;
  type: 'string' | 'number' | 'document' | 'checkbox' | 'radiobutton' | 'list';
  options?: string[];
}
