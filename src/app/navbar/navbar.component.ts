import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  isLoggedIn(): boolean {
    const user = localStorage.getItem("user");
    return user !== null && user !== undefined;
  }

  logoutUser(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("User logged out");
    this.snackBar.open("You have been logged out", "OK", {
      duration: 2000,
    });
    this.router.navigate(["welcome"]);
  }

  navigateToProfile(): void {
    console.log("Button clicked")

    this.router.navigate(["profile"])
  }

}
