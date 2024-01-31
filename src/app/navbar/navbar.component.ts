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

  /**
   * 
   * @returns boolean if user is logged in or not
   */
  isLoggedIn(): boolean {
    const user = localStorage.getItem("user");
    return user !== null && user !== undefined;
  }

  /**
   * Logs out user by removing locally stored token and user object
   */
  logoutUser(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("User logged out");
    this.snackBar.open("You have been logged out", "OK", {
      duration: 2000,
    });
    this.router.navigate(["welcome"]);
  }

  /**
   * Navigates to user profile page
   */
  navigateToProfile(): void {
    console.log("Button clicked")

    this.router.navigate(["profile"])
  }

}
