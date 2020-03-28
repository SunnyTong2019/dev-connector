import { User } from "./User";

export class Comment {
  constructor(
    public text: string,
    public date?: Date,
    public user?: User,
    public _id?: string
  ) {}
}
