import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  // abc:boolean = true
  
  loginform:any
  successMessage:any

  constructor( 
    public userService:ServiceService,
    public router: Router, 
    private toastr: ToastrService,
    ) {}



  ngOnInit(): void {

    this.loginform = new FormGroup({
      user_email: new FormControl('',[Validators.required, Validators.email]),
      user_password: new FormControl('',[Validators.required]),
    });
  };
  
  

  login(){
    console.log("ertyuio")
    // console.log(this.loginform.value)
    try{
      if(this.loginform.valid){
        // console.log(this.loginform.value)
        const data = this.userService.loginUser(this.loginform.value).subscribe(
          (result:any) => {
           
            // console.log(result.message)
            this.toastr.success('Success', result.message);
          
            localStorage.setItem ('usertoken', result.cookie);
            localStorage.setItem ('role', result.user_role);
            this.router.navigate(['layout/homepage'])
                .then(() => {
                  window.location.reload();
                });
          },
          (err:any) => {
            
            // console.log(err.error.message)
            this.toastr.error(err.error.message);
          }
        );
        
      }
    }
    catch (error:any) {
     
      this.toastr.error(error);
      
      return;
    }
    
  };


};
