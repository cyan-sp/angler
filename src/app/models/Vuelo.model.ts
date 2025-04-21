// src/app/models/Vuelo.model.ts
import { Aeropuerto } from './Aeropuerto.model';
import { Avion } from './Avion.model';

export interface Vuelo {
  id: number | null;
  numeroVuelo: string;
  fechaSalida: string;
  fechaLlegada: string;
  aeropuertoOrigen: Aeropuerto;
  aeropuertoDestino: Aeropuerto;
  avion: Avion;
  estatus: number; // 1: Scheduled, 2: In Flight, 3: Delayed, 4: Cancelled, 5: Completed
}
