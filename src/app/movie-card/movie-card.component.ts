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

  /**
   * gets all movies
   * @returns an array with all movie objects
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      //console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Opens a dialog box for a movie's description
   * @param movie 
   */
  openDescriptionDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: "Synopsis",
        content: movie.Description,
      },
    });
  }

  /**
   * Opens a dialog about a movie's genre
   * @param movie 
   */
  openGenreDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title:  movie.Genre.Name,
        content: movie.Genre.Description,
      },
    });
  }

  /**
   * Opens a dialog about a movie's director
   * @param movie 
   */
  openDirectorDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        title: movie.Director.Name,
        content: movie.Director.Bio,
      },
    });
  }

  /**
   * 
   * @param movieID 
   * @returns a boolean if a movie is on the user's favorite list or not
   */
  isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (user) {
      return user.FavoriteMovies.includes(movieID);
    } else {
      return false;
    }
  }

  /**
   * Adds a movie to the user's favorite list
   * @param movieID 
   */
  addFavoriteMovie(movieID: string): void {
    this.fetchApiData.addUserFavorites(movieID).subscribe(() => {
      this.snackBar.open("Added movie to favorites", "OK", {
        duration: 2000,
      });
    });
  }

  /**
   * Deletes a movie from the user's favorite list
   * @param movieID 
   */
  deleteFavoriteMovie(movieID: string): void {
    this.fetchApiData.deleteUserFavorites(movieID).subscribe(() => {
      this.snackBar.open("Removed movie from favorites", "OK", {
        duration: 2000,
      });
    });
    console.log("Removed movie")
  }

}
