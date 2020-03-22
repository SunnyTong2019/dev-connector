export class Education {
  constructor(
    public school: string,
    public degree: string,
    public fieldofstudy: string,
    public from: Date,
    public to?: Date,
    public current?: boolean,
    public description?: string
  ) {}
}
