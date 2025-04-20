import { Aerolinea } from './Aerolinea.model';

export interface Avion {
  id: number | null;
  num_registro: number;
  tipo: string;
  codigo_modelo: string;
  capacidad: number;
  fecha_salida: string;
  estatus: number;
  aerolinea: Aerolinea;
}
