import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Aerolinea {
    id: number;
    nombre: string;
    iata: string;
    estatus: number;
    pais: string;
    fecha: string;
}

@Injectable({
    providedIn: 'root'
})
export class AerolineaService {
    private apiUrl = 'http://localhost:8080/api/v1/aerolineas';

    constructor(private http: HttpClient) { }

    getAerolineas(): Observable<Aerolinea[]> {
        return this.http.get<Aerolinea[]>(this.apiUrl)
            .pipe(
                catchError(error => {
                    console.error('Error fetching airlines:', error);
                    return throwError(() => new Error('Failed to load airlines. Please try again later.'));
                })
            );
    }

    getAerolinea(id: number): Observable<Aerolinea> {
        return this.http.get<Aerolinea>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(error => {
                    console.error(`Error fetching airline with ID ${id}:`, error);
                    return throwError(() => new Error('Failed to load airline details. Please try again later.'));
                })
            );
    }

    createAerolinea(aerolinea: Aerolinea): Observable<Aerolinea> {
        return this.http.post<Aerolinea>(this.apiUrl, aerolinea)
            .pipe(
                catchError(error => {
                    console.error('Error creating airline:', error);
                    return throwError(() => new Error('Failed to create airline. Please try again later.'));
                })
            );
    }

    updateAerolinea(id: number, aerolinea: Aerolinea): Observable<Aerolinea> {
        return this.http.put<Aerolinea>(`${this.apiUrl}/${id}`, aerolinea)
            .pipe(
                catchError(error => {
                    console.error('Error updating airline:', error);
                    return throwError(() => new Error('Failed to update airline. Please try again later.'));
                })
            );
    }

    deleteAerolinea(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(error => {
                    console.error('Error deleting airline:', error);
                    return throwError(() => new Error('Failed to delete airline. Please try again later.'));
                })
            );
    }
}
