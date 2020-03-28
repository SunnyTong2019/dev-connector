import { Component, OnInit } from "@angular/core";
import {
  faUser,
  faThumbsUp,
  faThumbsDown,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { PostService } from "../post.service";
import { AuthService } from "../auth.service";
import { Post } from "../models/Post";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"]
})
export class PostsComponent implements OnInit {
  faUser = faUser;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faTimes = faTimes;
  posts: Post[] = [];
  newPost: Post = new Post("", null, null);
  userID: string = "";

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe((res: Post[]) => {
      this.posts = res;
    });

    this.authService.getUserByToken().subscribe(
      res => {
        this.userID = res["_id"];
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  submitPost() {
    this.postService.submitPost(this.newPost).subscribe((res: Post) => {
      // after new post is saved to database, update UI by adding the new post to the beginning of the array as the posts
      // are sorted by date in descending order
      this.posts.unshift(res);
      this.newPost.text = ""; // clear the text box
    });
  }

  deletePost(postID) {
    this.postService.deletePost(postID).subscribe(res => {
      // after post is deleted in database, remove it from UI
      this.posts = this.posts.filter(post => post._id !== postID);
    });
  }

  likePost(postID) {
    this.postService.likePost(postID).subscribe((res: Post) => {
      // When you like post, the backend will return the whole post object with updated likes array
      // so just need to update the likes array for that post
      this.posts.forEach(post => {
        if (post._id === postID) {
          post.likes = res.likes;
        }
      });
    });
  }

  unlikePost(postID) {
    this.postService.unlikePost(postID).subscribe((res: Post) => {
      console.log(res);
      this.posts.forEach(post => {
        if (post._id === postID) {
          post.likes = res.likes;
        }
      });
    });
  }
}
