import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Delcaring the api url that will provide data for the client app
const apiUrl = "https://my-flix882023-9b8843449882.herokuapp.com/";
@Injectable({
  providedIn: 'root'
})

export class fetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available to via this.http

  constructor(private http: HttpClient) {}

  /**
   * Making the api call for the user registration endpoint
   * @param userDetails 
   * @returns user registered in database
   */
  //Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any>{
    return this.http.post(apiUrl + 'users/register', userDetails).pipe(
      catchError(this.handleError)
    );
   }
  /**
   * Making the api call for the user login
   * @param userDetails 
   * @returns user is logged in with credintials and a token
   */
  public userLogin(userDetails: any): Observable<any>{
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
   }

   /**
    * Making the api call for all movies
    * @returns a list of all movies
    */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiUrl + "movies", {headers: new HttpHeaders(
      {
        Authorization: "Bearer " + token,
      })
    }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
   }

   /**
    * Making the api call for a specific movie
    * @param movieID 
    * @returns specific movie details from the database
    */
  getOneMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiUrl + "movies/" + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
   }

   /**
    * Making an api call for information on a specific director
    * @param directorName 
    * @returns information about a specific director
    */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiUrl + "movies/director/" + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
  }

  /**
   * Making an api call for information on a specific genre
   * @param genreName 
   * @returns information about specific genre
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiUrl + "movies/genre/" + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
  }

  /**
   * Making an api call to specific user
   * @returns json object of specific user
   */
  getUser(): Observable<any>{
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    return this.http.get(apiUrl + "users/" + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
  }

  /**
   * Making an api call to update the user
   * @param updates 
   * @returns updated user json object
   */
  editUser(updates: any): Observable<any>{
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    return this.http.put(apiUrl + "users/" + user.Username, updates, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        }
      )
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
  }

  /**
   * Making an api call to delete user
   * @returns message of confirmation of deletion
   */
  deleteUser(): Observable<any>{
    
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    //console.log((user._id));
    return this.http.delete(apiUrl + "users/" + user._id, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe( 
    catchError(this.handleError)
    );
  }

  //this just gets the whole of the user, not specifically their favorites.

  /**
   * Making an api call to get updated user so favorites can be used
   * @returns updated user json object
   */
  getUserFavorites(): Observable<any>{
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    return this.http.get(apiUrl + "users/" + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
  }

  /**
   * Making an api call to add a movie to the user's FavoriteMovies list
   * @param movieID 
   * @returns updated user json object
   */
  addUserFavorites(movieID: string): Observable<any>{
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || '{}');

    //adds movie to local favorites list and then stringifys user back up
    user.FavoriteMovies.push(movieID);  
    localStorage.setItem("user", JSON.stringify(user));

    return this.http.post(apiUrl + "users/" + user.Username + "/favorites/" + movieID, {}, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
    );
  }

  /**
   * Making an api call to delete a movie from the user's FavoriteMovies list
   * @param movieID 
   * @returns updated user json object
   */
  deleteUserFavorites(movieID: string): Observable<any>{
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || '{}');

    //removes movie from local favorites list and then stringifys user back up
    const index = user.FavoriteMovies.indexOf(movieID);
    if (index > -1){
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem("user", JSON.stringify(user));

    return this.http.delete(apiUrl + "users/" + user.Username + "/favorites/" + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
    );
  }

  // isFavoriteMovie(movieID: string): boolean {
  //   const user = JSON.parse(localStorage.getItem("user") || '{}');
  //   if (user) {
  //     return user.FavoriteMovies.includes(movieID);
  //   } else {
  //     return false;
  //   }
  // }

   // Non-typed response extraction
   private extractResponseData(res: any): any {
    const body = res;
    return body || {};
   }




   private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent){
      console.error("Some error occurred:", error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status},` + `Error body is: ${error.error}`);
    }
    return throwError(
      "Something bad happend; please try again later."
    );
   }
}
