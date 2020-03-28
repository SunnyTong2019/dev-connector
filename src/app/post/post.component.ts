import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PostService } from "../post.service";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"]
})
export class PostComponent implements OnInit {
  faTimes = faTimes;
  post: Post;
  newComment = new Comment("");

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    let postID = this.route.snapshot.paramMap.get("postid");

    this.postService.getPost(postID).subscribe((res: Post) => {
      this.post = res;

      // sort the comments based on comment date in descending order, so latest comment is displayed on top
      this.post.comments.sort(function(a, b) {
        let dateA = new Date(a.date),
          dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      console.log(this.post);
    });
  }

  submitComment(postID) {
    this.postService
      .AddCommentToPost(postID, this.newComment)
      .subscribe((res: Post) => {
        console.log(res);
        // update post's comments array and sort it, so UI can re-render
        this.post.comments = res.comments;
        this.post.comments.sort(function(a, b) {
          let dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        // clear text box
        this.newComment.text = "";
      });
  }
}
