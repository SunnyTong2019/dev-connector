import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PostService {
  constructor(private _http: HttpClient) {}

  // token will be attached to each request's headers by token.interceptor.ts
  public getAllPosts() {
    return this._http.get("/api/posts");
  }

  public submitPost(post) {
    return this._http.post("/api/posts", post);
  }

  public getPost(postID) {
    return this._http.get("/api/posts/" + postID);
  }

  public deletePost(postID) {
    return this._http.delete("/api/posts/" + postID);
  }

  public likePost(postID) {
    return this._http.put("/api/posts/like/" + postID, null);
  }

  public unlikePost(postID) {
    return this._http.put("/api/posts/unlike/" + postID, null);
  }

  public AddCommentToPost(postID, comment) {
    return this._http.put("/api/posts/comments/" + postID, comment);
  }

  public DeleteCommentFromPost(postID, commentID) {
    return this._http.put(
      "/api/posts/comments/" + postID + "/" + commentID,
      null
    );
  }
}
