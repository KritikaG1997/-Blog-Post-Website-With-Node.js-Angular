import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.component.html',
  styleUrls: ['./otpverification.component.css']
})
export class OtpverificationComponent implements OnInit {

  errors:any
  otpform: any
  constructor(public router: Router,
     private userService: ServiceService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.otpform = new FormGroup({
      otp: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      reConfirm: new FormControl('', [Validators.required]),
    });

  }

  otpverification() {
    try{
      if (this.otpform.valid) {

        this.userService.otpVerificaton(this.otpform.value,).subscribe(
          (data:any) => {
            
              this.toastr.success('Success', data.message);
            this.router.navigateByUrl('/login');
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
