import { Component, OnInit } from '@angular/core';
import { AerolineaService, Aerolinea } from '../../services/aerolineas.service';

@Component({
  selector: 'app-aerolineas',
  standalone: true,
  templateUrl: './aerolineas.component.html',
  styleUrl: './aerolineas.component.css'
})
export class AerolineasComponent implements OnInit {
  aerolineas: Aerolinea[] = [];
  loading = true;
  error: string | null = null;

  constructor(private aerolineaService: AerolineaService) {}

  ngOnInit(): void {
    this.loadAerolineas();
  }

  loadAerolineas(): void {
    this.loading = true;
    this.aerolineaService.getAerolineas().subscribe({
      next: (data) => {
        this.aerolineas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading airlines: ' + err.message;
        this.loading = false;
        console.error('Error fetching airlines', err);
      }
    });
  }
}
