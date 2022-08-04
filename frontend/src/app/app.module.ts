import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { BlogLayoutComponent } from './blog-layout/blog-layout.component';
import { HeaderComponent } from './blog-layout/header/header.component';
import { SidebarComponent } from './blog-layout/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { OtpverificationComponent } from './otpverification/otpverification.component';
import { GoogleLoginComponent } from './google-login/google-login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { AllusersDetailsComponent } from './allusers-details/allusers-details.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { CommentComponent } from './comment/comment.component';
import { AuthGuard } from './auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    BlogLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    ForgetpasswordComponent,
    OtpverificationComponent,
    GoogleLoginComponent,
    HomepageComponent,
    ErrorpageComponent,
    AllusersDetailsComponent,
    ProfileComponent,
    CreatePostComponent,
    EditPostComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ToastrModule.forRoot({ timeOut: 8000 }),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
