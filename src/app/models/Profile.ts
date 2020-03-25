import { User } from "./User";
import { Social } from "./Social";
import { Experience } from "./Experience";
import { Education } from "./Education";
export class Profile {
  constructor(
    public status: string,
    public skills: string,
    public user?: User,
    public company?: string,
    public website?: string,
    public location?: string,
    public githubusername?: string,
    public bio?: string,
    public social?: Social,
    public experience?: Experience[],
    public education?: Education[]
  ) {}
}
