import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogLayoutComponent } from './blog-layout/blog-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { OtpverificationComponent } from './otpverification/otpverification.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { AllusersDetailsComponent } from './allusers-details/allusers-details.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { CommentComponent } from './comment/comment.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: BlogLayoutComponent, children: [{ path: '', component: HomepageComponent },] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'googleLogin', component: GoogleLoginComponent },
  { path: 'forgetpassword', component: ForgetpasswordComponent },
  { path: 'otpverification', component: OtpverificationComponent },
  {
    path: 'layout', component: BlogLayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'homepage', component: HomepageComponent },
      { path: 'alluserdetails', component: AllusersDetailsComponent },
      { path: 'userprofile', component: ProfileComponent },
      { path: 'editpost/:id', component: EditPostComponent },
      { path: 'createpost', component: CreatePostComponent },
      { path: 'commentpost/:id', component: CommentComponent }
    ]
  },
  { path: '**', component: ErrorpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
