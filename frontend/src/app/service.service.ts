import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  //route protection
  loggedIn() {
    return !! localStorage.getItem('usertoken')
  }

  //login service

  loginUser(data:any){
    return this.http.post(`${baseUrl}/login`,data)
  }

  //register service

  userRegister(user:any){
    return this.http.post(`${baseUrl}/signup`,user)
  }

  //forget password service

  forgetPassword(result:any){
    return this.http.post(`${baseUrl}/forgetpassword`,result);
      
  }

  //service for otpVerification
  otpVerificaton(result:any){
    return this.http.post(`${baseUrl}/otpverification`,result,
    {headers: new HttpHeaders(
      { 'Authorization': `${localStorage.getItem("token")}`}
    )}
    );
      
  }

  //which user is logged in now
  
  currentUser() {
    return this.http.get(`${baseUrl}/specificUser`,{
      headers: new HttpHeaders(
        { 'Authorization': `${localStorage.getItem("usertoken")}` }
      )
    })
  }

  //for deleting a specific post by admin or post's admin
  deletepost(id: any) {
    
    return this.http.delete(`${baseUrl}/deletePost/${id}`,{
      headers: new HttpHeaders(
        {'Authorization': `${localStorage.getItem("usertoken")}`}
      )
    });
  };

  //for showing user all posts
  usersPost(pageNum:any,limit:any) {
    return this.http.get(`${baseUrl}/usersPosts?page=${pageNum}&limit=${limit}`)
  }

  //for serching post by title name
  postSearch(title:any){
    return this.http.get(`${baseUrl}/postSearch?title=${title}`)
    }

  //for like the a specific post
  like(id: any) {

    return this.http.get(`${baseUrl}/likePost/${id}`,{
      headers: new HttpHeaders(
        { 'Authorization': `${localStorage.getItem("usertoken")}` }
      )
    })
  };

  //for showing all users
  userList(pageNum:any,limit:any){
    return this.http.get(`${baseUrl}/usersList?page=${pageNum}&limit=${limit}`)
  }

  //for searching users
  userSearch(user_name:any){
    return this.http.get(`${baseUrl}/userSearch?name=${user_name}`)
  }

  //for deleting specific user
  deleteUser(id: any) {

    return this.http.delete(`${baseUrl}/userDelete/${id}`,{
      headers: new HttpHeaders(
        {'Authorization': `${localStorage.getItem("usertoken")}`}
      )
    });
  };

  //for logged in user posts
  singleUserPosts(id:any){
    
    return this.http.get(`${baseUrl}/specificUserPost/${id}`,{
      headers: new HttpHeaders(
        { 'Authorization': `${localStorage.getItem("usertoken")}` }
      )
    })
    
  }

  //for edit the post
  editProfile(id:any,data:any){
    console.log(id)
    return this.http.put(`${baseUrl}/editProfile/${id}`, data,{
      headers: new HttpHeaders(
        { 'Authorization': `${localStorage.getItem("usertoken")}` }
      )
    })
  }

  //for changing the password
  changePassword(result:any){
    
    return this.http.post(`${baseUrl}/ChangePassword`,result,
    {headers: new HttpHeaders(
      { 'Authorization': `${localStorage.getItem("usertoken")}`}
    )}
    );
  }

  //create post
  createPost(data: any){

    return this.http.post(`${baseUrl}/createPost`, data, {
      headers: new HttpHeaders(
        { 'Authorization': `${localStorage.getItem("usertoken")}` }
      )
    })
  }

  //for showing all post
  postList(id:any){
    // console.log("wertyuiop",id)
    return this.http.get(`${baseUrl}/postList/${id}`)
  }

  //for editing the post
  editpost(id:any,data:any){
   
    return this.http.put(`${baseUrl}/editPost/${id}`, data,{
      headers: new HttpHeaders(
        { 'Authorization': `${localStorage.getItem("usertoken")}` }
      )
    })
  }

  //posts all comments
  userComment(id:any){
    return this.http.get(`${baseUrl}/userComments/${id}`)
  }

  //for doing comment on post
  comment(id: any, data:any) {

    return this.http.post(`${baseUrl}/Comment/${id}`, data,{
      headers: new HttpHeaders(
        { 'Authorization': `${localStorage.getItem("usertoken")}` }
      )
    })
  }

  //for deleting a specific comments
  
  deleteComment(id:any){
    return this.http.delete(`${baseUrl}/deleteComment/${id}`,{
      headers: new HttpHeaders(
        {'Authorization': `${localStorage.getItem("usertoken")}`}
      )
    });
  }

}
