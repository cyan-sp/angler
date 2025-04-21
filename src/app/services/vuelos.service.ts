// src/app/services/vuelos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Vuelo } from '../models/Vuelo.model';

@Injectable({
  providedIn: 'root'
})
export class VuelosService {
  private apiUrl = '/api/vuelos';  // Using proxy to handle CORS

  constructor(private http: HttpClient) { }

  getVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.apiUrl)
      .pipe(
        tap(response => console.log('Vuelos response:', response)), // Debug log
        catchError(error => {
          console.error('Error fetching flights:', error);
          return throwError(() => new Error('Failed to load flights. Please try again later.'));
        })
      );
  }

  getVuelo(id: number): Observable<Vuelo> {
    return this.http.get<Vuelo>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching flight with ID ${id}:`, error);
          return throwError(() => new Error('Failed to load flight details. Please try again later.'));
        })
      );
  }

  createVuelo(vuelo: Vuelo): Observable<Vuelo> {
    return this.http.post<Vuelo>(this.apiUrl, vuelo)
      .pipe(
        catchError(error => {
          console.error('Error creating flight:', error);
          return throwError(() => new Error('Failed to create flight. Please try again later.'));
        })
      );
  }

  updateVuelo(id: number, vuelo: Vuelo): Observable<Vuelo> {
    console.log(`Sending PUT to update flight ID ${id}:`, vuelo); // Debug log
    return this.http.put<Vuelo>(`${this.apiUrl}/${id}`, vuelo)
      .pipe(
        catchError(error => {
          console.error('Error updating flight:', error);
          return throwError(() => new Error('Failed to update flight. Please try again later.'));
        })
      );
  }

  deleteVuelo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting flight:', error);
          return throwError(() => new Error('Failed to delete flight. Please try again later.'));
        })
      );
  }
}
