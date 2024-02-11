import { ServiceService } from './../services/service.service';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Pipe } from '@angular/core';
import { error } from 'console';
import { response } from 'express';
import { AppError } from '../common/app-error';
import { NotFoundError, throwError } from 'rxjs';
import { BadInput } from '../common/bad-input-error';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent  implements OnInit{
  status = true;
  posts : any[] = [];
  title: any;
  body: any;
  post : any = {
    title : "" ,
    body : "",
    id: 0,
  }

  constructor (private postService : ServiceService )
  {
   
  }
  ngOnInit()
  {
    this.getPosts();
  }

  getPosts()
  {
    this.postService.getAll()
      .subscribe({
        next: (response: any) => {
          this.posts = response;
        },
        error: (error: any) => {
          alert('An unexpected error occurred');
          console.error(error);
          // You can also handle the error in a different way, such as by showing an error message to the user
        }
      });
  }

  createPost()
  {
    this.postService.create(this.post)
    .subscribe({ 
      next : (response : any) => {
      this.post.id = response.id;
      this.posts.unshift(this.post);
        
      this.post = {
        title : "" ,
        body : "",
        id: 0,
      }},
    error: (error : AppError) => {
      if(error instanceof BadInput)
      {
        console.log('thanks for verify information');
        
      }else
      {
        alert('error unexpected')
        console.log(error);
      }
    }
    });
  }

  editPost(post : any)
  {
    this.post = post
    this.status = false;
  }

  updatePost()
  {
    this.postService.update(this.post)
    .subscribe({ 
      next : (response : any) => {
      this.post.id = response.id;
      this.posts.unshift(this.post);
        
      this.post = {
        title : "" ,
        body : "",
        id: 0,
      }},
    error: (error : any) => {
      alert('error unexpected')
      console.log(error);
      
    }
    });
    this.status = true;
  }

  deletePost(post: any) {
    this.postService.delete(post)
      .subscribe({
        next: (response: any) => {
          let index = this.posts.indexOf(post);
          // if (index !== -1) {
            this.posts.splice(index, 1);
          // }
        },
        // mzl khsni n9adha
        error: (error: AppError) => {
          if (error instanceof NotFoundError) {
            alert('Post already deleted');
          } else {
            alert('Unexpected error');
            console.error(error);
          }
        }
      });
  }
}
