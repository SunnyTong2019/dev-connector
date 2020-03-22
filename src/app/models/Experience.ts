export class Experience {
  constructor(
    public title: string,
    public company: string,
    public from: Date,
    public location?: string,
    public to?: Date,
    public current?: boolean,
    public description?: string
  ) {}
}
