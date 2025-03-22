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
    rol:  string,
    group_id: number,
    photo?: string
  }

}
