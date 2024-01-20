import { Component, OnInit, Input } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
import { fetchApiDataService } from '../fetch-api-data.service';
//This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type User = {
  _id?: string;
  username?: string;
  password?: string;
  email?: string;
  birthday?: string;
  FavoriteMovies?: any[];
}
//There might be a typo with "FavoriteMoives" somewhere
//type FavoriteMovies = [];


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})

export class ProfilePageComponent implements OnInit {

  user: User = {};
  FaveMovies: any[] = []; 

  @Input() userData = { Username: "", Password: "", Email: "", Birthday: ""};

  constructor(
    public fetchApiData: fetchApiDataService,
    //public dialogRef: MatDialogRef<ProfilePageComponent>,
    public snackBar: MatSnackBar,
    public router: Router) { }

  ngOnInit(): void {
    const user = this.getUser();
    const FaveMovies = this.getFavoriteMovies();
    //console.log("Page loaded")

    if (!user._id) {
      this.router.navigate(["welcome"]);
      return;
    }

    this.user = user;

    this.userData = {
      Username: user.username || "",
      Password: "",
      Email: user.email || "",
      Birthday: user.birthday || ""
    };
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem("user") || '{}');
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      localStorage.setItem("user", JSON.stringify(result));
      this.router.navigate(["movies"]).then(() => {
        this.snackBar.open("Account updated successfully.", "OK", {
          duration: 3000
        });
      })
     
      //setTimeout(location.reload.bind(location), 2000);
    })
  }

  deleteUser(): void {
    if(confirm("Are you sure you want to permantly delete account?")){
      this.router.navigate(["welcome"]).then(() => {
        console.log("User Deleted");
        localStorage.clear();
        this.snackBar.open("Account deleted successfully.", "OK", {
          duration: 3000
        });
      })
      this.fetchApiData.deleteUser().subscribe((response) => {
        //console.log(response);
      });
    }
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.FaveMovies = response.filter((movie: any) => this.user.FavoriteMovies?.includes(movie._id));
    });
  }
}
