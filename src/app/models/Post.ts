import { User } from "./User";
import { Comment } from "./Comment";

export class Post {
  constructor(
    public text: string,
    public user: User,
    public date: Date,
    public _id?: string,
    public likes?: User[],
    public comments?: Comment[]
  ) {}
}
