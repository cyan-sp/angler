import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Aeropuerto } from '../models/Aeropuerto.model';

@Injectable({
  providedIn: 'root'
})
export class AeropuertosService {
  private apiUrl = '/api/aeropuertos';  // Using proxy to handle CORS

  constructor(private http: HttpClient) { }

  getAeropuertos(): Observable<Aeropuerto[]> {
    return this.http.get<Aeropuerto[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching airports:', error);
          return throwError(() => new Error('Failed to load airports. Please try again later.'));
        })
      );
  }

  getAeropuerto(id: number): Observable<Aeropuerto> {
    return this.http.get<Aeropuerto>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching airport with ID ${id}:`, error);
          return throwError(() => new Error('Failed to load airport details. Please try again later.'));
        })
      );
  }

  createAeropuerto(aeropuerto: Aeropuerto): Observable<Aeropuerto> {
    return this.http.post<Aeropuerto>(this.apiUrl, aeropuerto)
      .pipe(
        catchError(error => {
          console.error('Error creating airport:', error);
          return throwError(() => new Error('Failed to create airport. Please try again later.'));
        })
      );
  }

  updateAeropuerto(id: number, aeropuerto: Aeropuerto): Observable<Aeropuerto> {
    return this.http.put<Aeropuerto>(`${this.apiUrl}/${id}`, aeropuerto)
      .pipe(
        catchError(error => {
          console.error('Error updating airport:', error);
          return throwError(() => new Error('Failed to update airport. Please try again later.'));
        })
      );
  }

  deleteAeropuerto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting airport:', error);
          return throwError(() => new Error('Failed to delete airport. Please try again later.'));
        })
      );
  }
}
