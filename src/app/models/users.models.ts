import { GroupsI } from "./groups.models";

export namespace ModelsUsers {

  export interface UserI {
    id?: string;
    name: string;
    email: string;
  }

  export interface UsersI{
    id?: string,
    name: string,
    email: string,
    phone?: string,
    password: string,
    group_id: GroupsI,
    photo?: string
  }

  export interface UserssI{
    id?: string,
    name: string,
    email: string,
    password: string,
    rol:  string,
    group_id: string,
    photo?: string
  }
}
