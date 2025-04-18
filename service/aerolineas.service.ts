// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
//
// export interface Aerolinea {
//   id: number;
//   nombre: string;
//   iata: string;
//   estatus: number;
//   pais: string;
//   fecha: string;
// }
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AerolineaService {
//   private apiUrl = 'http://localhost:8080/api/v1/aerolineas';
//
//   constructor(private http: HttpClient) { }
//
//   getAerolineas(): Observable<Aerolinea[]> {
//     return this.http.get<Aerolinea[]>(this.apiUrl);
//   }
//
//   getAerolinea(id: number): Observable<Aerolinea> {
//     return this.http.get<Aerolinea>(`${this.apiUrl}/${id}`);
//   }
//
//   createAerolinea(aerolinea: Aerolinea): Observable<Aerolinea> {
//     return this.http.post<Aerolinea>(this.apiUrl, aerolinea);
//   }
//
//   updateAerolinea(id: number, aerolinea: Aerolinea): Observable<Aerolinea> {
//     return this.http.put<Aerolinea>(`${this.apiUrl}/${id}`, aerolinea);
//   }
//
//   deleteAerolinea(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`);
//   }
// }
