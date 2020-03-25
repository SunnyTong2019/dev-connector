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

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe((res: Post[]) => {
      this.posts = res;
      console.log(this.posts);
    });
  }
}
