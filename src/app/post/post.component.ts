import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PostService } from "../post.service";
import { AuthService } from "../auth.service";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"]
})
export class PostComponent implements OnInit {
  faTimes = faTimes;
  post: Post;
  newComment = new Comment("");
  userID: string = "";

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    let postID = this.route.snapshot.paramMap.get("postid");

    this.postService.getPost(postID).subscribe(
      (res: Post) => {
        this.post = res;

        // sort the comments based on comment date in descending order, so latest comment is displayed on top
        this.post.comments.sort(function(a, b) {
          let dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );

    this.authService.getUserByToken().subscribe(
      res => {
        this.userID = res["_id"];
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  submitComment(postID) {
    this.postService.AddCommentToPost(postID, this.newComment).subscribe(
      (res: Post) => {
        // update post's comments array and sort it, so UI can re-render
        this.post.comments = res.comments;
        this.post.comments.sort(function(a, b) {
          let dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        // clear text box
        this.newComment.text = "";
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  deleteComment(postID, commentID) {
    this.postService.DeleteCommentFromPost(postID, commentID).subscribe(
      (res: Post) => {
        // update post's comments array and sort it, so UI can re-render
        this.post.comments = res.comments;
        this.post.comments.sort(function(a, b) {
          let dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
}
