import { Injectable } from '@angular/core';
import { enviroment } from '../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aerolinea } from '../models/Aerolinea.model';

@Injectable({
  providedIn: 'root'
})
export class AerolineasService {

  private apiUrl: string = enviroment.apiUrl +'aerolineas/';

  constructor(private http: HttpClient) { }

  getAerolineas(): Observable<Aerolinea[]>{
    return this.http.get<Aerolinea[]>(this.apiUrl);
  }
  postAerolinea(aerolinea: Aerolinea): Observable<Aerolinea>{
    return this.http.post<Aerolinea>(this.apiUrl,aerolinea);
  }
  putAerolinea(aerolinea: Aerolinea): Observable<Aerolinea>{
    return this.http.put<Aerolinea>(`${this.apiUrl}${aerolinea.id}`,aerolinea);
  }
}
