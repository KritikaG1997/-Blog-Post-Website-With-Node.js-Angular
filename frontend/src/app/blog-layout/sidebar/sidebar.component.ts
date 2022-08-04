import { Component, OnInit } from '@angular/core';
import { baseUrl } from 'src/environments/environment';
import { ServiceService } from 'src/app/service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userList: any
  image: any = `${baseUrl}/`
  userData: any = []

  constructor(private userService: ServiceService,
    private route: Router) { }

  ngOnInit(): void {
    this.userService.currentUser().subscribe((result: any) => {
      // console.log("........................",result)
      this.userList = result
      this.userData.push(this.userList["data"])
      console.log(this.userData)

    })
  }

  loggedIn() {
    return localStorage.getItem('usertoken')
  }

  onLogOut() {  
    // this.spinner.hide();
    this.route.navigateByUrl('/login');
    localStorage.removeItem('role')
    return localStorage.removeItem('usertoken')

  }
}
