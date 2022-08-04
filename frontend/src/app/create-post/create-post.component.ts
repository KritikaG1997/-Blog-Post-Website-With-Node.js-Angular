import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  file: any
  postform: any
  tempImagePage:any

  constructor(private userService: ServiceService, 
    public router:Router, 
    private toastr: ToastrService ){}

  ngOnInit(): void {

    this.postform = new FormGroup({
      Title: new FormControl('', [Validators.required]),
      Blog: new FormControl('', [Validators.required]),
      Picture: new FormControl('', [Validators.required]),
    })
  }

  readURL(event: any): void {

    this.tempImagePage = event.target.files[0]
    // alert(this.tempImagePage)
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.file = reader.result;

        reader.readAsDataURL(file);

    }
}

postcreate() {
  try{
    if (this.postform.valid) {
      
      let user_data : FormData = new FormData();
      user_data.append("Title",this.postform.value.Title)
      user_data.append("Blog",this.postform.value.Blog)
      user_data.append("testimage",  this.tempImagePage)

      const data = this.userService.createPost(user_data).subscribe(
        (result:any) => {
          
          this.toastr.success('Success', result.message);
          
          this.router.navigateByUrl('layout/homepage');
        },
        (err:any) => {
          
          this.toastr.error(err.error.message);

          if(err.error.message=='token not verified'){
            this.toastr.error(err.error.message);

            this.router.navigateByUrl('layout/login');
          }
          
        }
      );
     
        
    } 
  }
  catch (error:any) {
    
    this.toastr.error(error);
    
    return;
  }
}

}
