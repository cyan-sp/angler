import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AerolineaService, Aerolinea } from '../../services/aerolineas.service';

@Component({
  selector: 'app-aerolineas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './aerolineas.component.html',
  styleUrls: ['./aerolineas.component.css']
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
