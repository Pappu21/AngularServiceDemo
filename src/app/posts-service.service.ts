import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {

  httpUrl = "https://angular-http-service-d2a47.firebaseio.com/";

  constructor( private http: HttpClient) { }

  createAndStorePost( title: string, content: string) {
    const postData: Post = { title: title, content: content}
    this.http.post< { name: string}>(this.httpUrl + '/' + 'posts.json', postData).subscribe( responseData => {
      console.log("responseData>>>",responseData);
    });
  }

  fetchPosts() {
    return this.http.get<{[key: string]: Post}>(this.httpUrl + '/' + 'posts.json')
    .pipe(map(responseData =>{
      const postsArray: Post[] = [];
      for ( const key in responseData) {
        if(responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key});
        }
      }
      return postsArray;
    }))
  }

  deletePosts() {
    return this.http.delete(this.httpUrl + '/' + 'posts.json');
  }
}
