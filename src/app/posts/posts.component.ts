import { Component, OnInit } from "@angular/core";
import {
  faUser,
  faThumbsUp,
  faThumbsDown,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { PostService } from "../post.service";
import { Post } from "../models/Post";

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
  posts: Post[];
  newPost: Post = new Post("", null, null);

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe((res: Post[]) => {
      this.posts = res;
    });
  }

  submitPost() {
    this.postService.submitPost(this.newPost).subscribe((res: Post) => {
      // after new post is saved to database, update UI by adding the new post to the beginning of the array as the posts
      // are sorted by date in descending order
      this.posts.unshift(res);
      this.newPost.text = ""; // clear the text box
    });
  }
}
