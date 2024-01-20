import { Component, OnInit } from '@angular/core';
import { fetchApiDataService } from '../fetch-api-data.service';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  
  constructor(
    public fetchApiData: fetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar){ }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      //console.log(this.movies);
      return this.movies;
    });
  }
  openDescriptionDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: "Synopsis",
        content: movie.Description,
      },
    });
  }
  openGenreDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title:  movie.Genre.Name,
        content: movie.Genre.Description,
      },
    });
  }
  openDirectorDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: movie.Director.Name,
        content: movie.Director.Bio,
      },
    });
  }

  isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (user) {
      return user.FavoriteMovies.includes(movieID);
    } else {
      return false;
    }
  }

  addFavoriteMovie(movieID: string): void {
    this.fetchApiData.addUserFavorites(movieID).subscribe(() => {
      this.snackBar.open("Added movie to favorites", "OK", {
        duration: 2000,
      });
    });
  }

  deleteFavoriteMovie(movieID: string): void {
    this.fetchApiData.deleteUserFavorites(movieID).subscribe(() => {
      this.snackBar.open("Removed movie from favorites", "OK", {
        duration: 2000,
      });
    });
    console.log("Removed movie")
  }

}
