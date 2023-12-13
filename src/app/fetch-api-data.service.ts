import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Delcaring the api url that will provide data for the client app
const apiUrl = "https://my-flix882023-9b8843449882.herokuapp.com/";
@Injectable({
  providedIn: 'root'
})

export class fetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available to via this.http

  constructor(private http: HttpClient) {}

   //Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
   }

  public userLogin(userDetails: any): Observable<any>{
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
   }

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

  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.get(apiUrl + "movies/" + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
  }

  getUser(userID: string): Observable<any>{
    const token = localStorage.getItem("token");
    return this.http.get(apiUrl + "users/" + userID, {
      headers: new HttpHeaders(
        {
          Authorization: "Bearer " + token,
        })
    }).pipe(map(this.extractResponseData), 
    catchError(this.handleError)
    );
  }

   // Non-typed response extraction
   private extractResponseData(res: Response): any {
    const body = res;
    return body || { };
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
