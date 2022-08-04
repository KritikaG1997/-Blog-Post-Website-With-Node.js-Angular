import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { baseUrl } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  commentList: any
  image: any = `${baseUrl}/`
  postList: any
  public id: any
  commentform: any


  constructor(private userService: ServiceService,
    private router: ActivatedRoute,
    public route: Router,
    private toastr: ToastrService) {

      
    this.id = this.router.snapshot.paramMap.get('id');
    this.userService.userComment(this.id).subscribe((list) => {
      // console.log(list)

      this.commentList = list
      // console.log(this.commentList[0]["_id"])
    })
    this.id = this.router.snapshot.paramMap.get('id');
    this.userService.postList(this.id).subscribe((result) => {

      // console.log("result",result)
      this.postList = result
      // console.log(this.postList[0].Picture)
    })
  }


  ngOnInit(): void {

    this.getAllComment();

    this.commentform = new FormGroup({

      comment: new FormControl('', [Validators.required]),

    })
  }

  getAllComment() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.userService.userComment(this.id).subscribe((list) => {

      // console.log("list",list)
      this.commentList = list
      return
    })
  }

  deleteComment(id: any) {
    if (confirm("Are you sure to delete " + id)) {

      this.userService.deleteComment(id).subscribe(
        (result: any) => {
         
          this.toastr.success('Success', result.message);
          this.route.navigate(['layout/homepage'])
                .then(() => {
                  window.location.reload();
                });

        },
        err => {
          this.toastr.error(err.error.message);

          if (err.error.message == 'token not verified') {
            this.toastr.error(err.error.message);

            this.route.navigateByUrl('layout/login');
          }
        }

      );
    }
  };

  commentPost() {
    try {
      if (this.commentform.valid) {
        this.id = this.router.snapshot.paramMap.get('id');

        this.userService.comment(this.id, this.commentform.value).subscribe(
          (result: any) => {
            this.toastr.success('Success', result.message);

            this.route.navigateByUrl('layout/homepage');
          },
          (err: any) => {
           
            this.toastr.error(err.error.message);

            if (err.error.message == 'token not verified') {
              this.toastr.error(err.error.message);

              this.route.navigateByUrl('layout/login');
            }

          }
        );
      }

    }
    catch (error: any) {
     
      this.toastr.error(error);

      return;
    }
  }

}
