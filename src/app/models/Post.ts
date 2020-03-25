import { User } from "./User";
import { Comment } from "./Comment";

export class Post {
  constructor(
    public _id: string,
    public text: string,
    public user: User,
    public date: Date,
    public likes?: User[],
    public comments?: Comment[]
  ) {}
}
