import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PostService } from "../post.service";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"]
})
export class PostComponent implements OnInit {
  post: Post;
  newComment = new Comment("");

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    let postID = this.route.snapshot.paramMap.get("postid");

    this.postService.getPost(postID).subscribe((res: Post) => {
      console.log(res);
      this.post = res;
    });
  }

  submitComment(postID) {
    this.postService
      .AddCommentToPost(postID, this.newComment)
      .subscribe(res => {
        console.log(res);
      });
  }
}
