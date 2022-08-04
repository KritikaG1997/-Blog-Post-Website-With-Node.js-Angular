import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { baseUrl } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileEditForm: any
  file: any
  userList: any
  image: any = `${baseUrl}/`
  tempImagePage: any
  id: any
  singleUserPosts: any;
  userData: any = []
  forList: any
  changePasswordForm: any

  constructor(private userService: ServiceService,
    private route: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.userService.singleUserPosts(this.id).subscribe((userPosts: any) => {

      this.singleUserPosts = userPosts["data"]
    })

    this.userService.currentUser().subscribe((result: any) => {

      this.userList = result
      this.userData.push(this.userList["data"])
      this.forList = this.userData[0]
      // console.log(this.userData)

      this.profileEditForm = new FormGroup({
        user_name: new FormControl(`${this.forList.user_name}`, [Validators.required]),
        user_gender: new FormControl(`${this.forList.user_gender}`, [Validators.required]),
        user_profile: new FormControl(``),
        user_location: new FormControl(`${this.forList.user_location}`, [Validators.required])
      });

    })

    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(``, [Validators.required]),
      user_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl(false)
    })
  }

  upload(event: any) {
    this.file = event.target.files[0]

  };

  getUser() {

    this.userService.currentUser().subscribe((result: any) => {
      // console.log(result)
      this.userList = result
      return
    })

  }

  readURL(event: any): void {

    this.tempImagePage = event.target.files[0]
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.file = reader.result;

      reader.readAsDataURL(file);

    }
  }

  update(id: any) {
    try {

      if (confirm("Are you sure to edit it " + id)) {
        let user_data: FormData = new FormData();
        user_data.append("user_name", this.profileEditForm.value.user_name)
        user_data.append("user_gender", this.profileEditForm.value.user_gender)
        user_data.append("testimage", this.tempImagePage)
        user_data.append("user_location", this.profileEditForm.value.user_location)
        const data = this.userService.editProfile(id, user_data).subscribe(
          (result: any) => {
            if (result.message == "Successfully updated the item.") {
              
              this.toastr.success('Success', result.message);
              this.route.navigate(['layout/userprofile'])
                .then(() => {
                  window.location.reload();
                });
            }

          },
          (err: any) => {

            this.toastr.error(err.error.message);
            // console.log(this.errors.message)
            if (err.error.message == 'token not verified') {

              this.route.navigateByUrl('layout/login');
            }
            if (err.error.message == "Only Admin Can Edit The Post") {

              this.toastr.error(err.error.message);
              this.route.navigateByUrl('layout/userprofile');
            }

          }
        );
      } else {
        this.route.navigateByUrl('layout/userprofile');
      }

    }
    catch (error: any) {

      this.toastr.error(error);
      return;
    }
  }


  deleteUser(id: any) {

    if (confirm("Are you sure to delete " + id)) {
      this.userService.deleteUser(id).subscribe(
        (result: any) => {

          this.toastr.success('Success', result.message);
          this.route.navigateByUrl('/login');
          localStorage.removeItem('role')
          localStorage.removeItem('usertoken')

        },
        (err: any) => {

          this.toastr.error(err.error.message);

          if (err.error.message == "sorry you can not delete this account..") {

            this.route.navigateByUrl('layout/homepage');
          }
        }
      );
    } else {
      this.route.navigateByUrl('layout/userprofile');
    }


  };


  deletePost(id: any) {
    try {

      if (confirm("Are you sure to delete " + id)) {

        this.userService.deletepost(id).subscribe(
          (result: any) => {
            this.getUser()
            this.toastr.success('Success', result.message);
            this.route.navigate(['layout/userprofile'])
                .then(() => {
                  window.location.reload();
                });
            // this.route.navigateByUrl('layout/userprofile');            
          },
          (err: any) => {

            if (err.error.message == 'token not verified') {

              this.toastr.error(err.error.message);

              this.route.navigateByUrl('/login');
            }
            if (err.error.message == "Only Admin Can Delete The POst") {

              this.toastr.error(err.error.message);

              this.route.navigateByUrl('layout/userprofile');
            }
          }

        );
      }
      else {
        this.route.navigateByUrl('layout/userprofile');

      }

    }
    catch (error: any) {

      this.toastr.error(error);

      return;
    }

  };

  changePassword() {

    try {

      if (confirm("Are you sure to change it ")) {
        if (this.changePasswordForm.valid) {
          const data = this.userService.changePassword(this.changePasswordForm.value).subscribe(
            (result: any) => {

              this.toastr.success('Success', result.message);
              this.route.navigate(['layout/userprofile'])
                .then(() => {
                  window.location.reload();
                });
              // this.route.navigateByUrl('layout/userprofile');
            },
            (err: any) => {
              this.toastr.error(err.error.message);
              if (err.error.message == 'token not verified') {

                this.toastr.error(err.error.message);

                this.route.navigateByUrl('/login');
              }
              if (err.error.message == "Only Admin Can Edit The Post") {

                this.toastr.error(err.error.message);

                this.route.navigateByUrl('layout/userprofile');
              }

            }
          );

        }
      }
      this.route.navigateByUrl('layout/userprofile');
    }
    catch (error: any) {

      this.toastr.error(error);

      return;
    }
  }
}
