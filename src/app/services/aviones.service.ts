import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Avion } from '../models/Avion.model';

@Injectable({
  providedIn: 'root'
})
export class AvionesService {
  private apiUrl = '/api/aviones';

  constructor(private http: HttpClient) { }

  getAviones(): Observable<Avion[]> {
    return this.http.get<Avion[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching planes:', error);
          return throwError(() => new Error('Failed to load planes. Please try again later.'));
        })
      );
  }

  getAvion(id: number): Observable<Avion> {
    return this.http.get<Avion>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching plane with ID ${id}:`, error);
          return throwError(() => new Error('Failed to load plane details. Please try again later.'));
        })
      );
  }

  createAvion(avion: Avion): Observable<Avion> {
    return this.http.post<Avion>(this.apiUrl, avion)
      .pipe(
        catchError(error => {
          console.error('Error creating plane:', error);
          return throwError(() => new Error('Failed to create plane. Please try again later.'));
        })
      );
  }

  updateAvion(id: number, avion: Avion): Observable<Avion> {
    return this.http.put<Avion>(`${this.apiUrl}/${id}`, avion)
      .pipe(
        catchError(error => {
          console.error('Error updating plane:', error);
          return throwError(() => new Error('Failed to update plane. Please try again later.'));
        })
      );
  }

  deleteAvion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting plane:', error);
          return throwError(() => new Error('Failed to delete plane. Please try again later.'));
        })
      );
  }
}
