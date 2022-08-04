import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  passwordform: any
 

  constructor(private userService:ServiceService,
     private router:Router, 
     private toastr: ToastrService ) {}

  ngOnInit(): void {
    this.passwordform = new FormGroup({
      user_email: new FormControl('',[Validators.required,Validators.email]),
    });
    
  }

  forgetpassword(){
    
    try{
      if(this.passwordform.valid){
       
  
        this.userService.forgetPassword(this.passwordform.value).subscribe(
          (result:any) => {
           
        this.toastr.success('Success', result.message);

            localStorage.setItem ('token', result.cookie);
            this.router.navigateByUrl('otpverification');
          },
          err => {
           
            
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
  

}
