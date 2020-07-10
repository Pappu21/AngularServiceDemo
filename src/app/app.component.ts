import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { map, catchError } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsServiceService } from './posts-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  loadedPosts: Post[] = [];
  httpUrl = "https://angular-http-service-d2a47.firebaseio.com/";
  isFetching = false;
  error = null;
  private errorSub: Subscription;


  constructor(private http: HttpClient, private postsService: PostsServiceService) {}

  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe( errorMessage => {
      this.error = errorMessage;
    })
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message
    });
  }

  onCreatePost(postData: Post) {
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
      console.log(error);
    });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {
      //this.loadedPosts = [];
      this.loadedPosts.splice(0,1);
    })
  }

  onHandleError() {
    this.error = null;
    this.isFetching = false;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
