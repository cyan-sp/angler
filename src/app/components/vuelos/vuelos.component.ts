// src/app/components/vuelos/vuelos.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { VuelosService } from '../../services/vuelos.service';
import { AvionesService } from '../../services/aviones.service';
import { AeropuertosService } from '../../services/aeropuerto.service';
import { Vuelo } from '../../models/Vuelo.model';
import { Avion } from '../../models/Avion.model';
import { Aeropuerto } from '../../models/Aeropuerto.model';

@Component({
  selector: 'app-vuelos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css']
})
export class VuelosComponent implements OnInit {
  vuelos: Vuelo[] = [];
  aviones: Avion[] = [];
  aeropuertos: Aeropuerto[] = [];
  loading = true;
  error: string | null = null;
  selectedVuelo: Vuelo | null = null;
  vueloForm: FormGroup;
  isEditMode = false;
  formErrors: any = {};

  // For debugging
  JSON = JSON;
  Object = Object;

  @ViewChild('viewModal') viewModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('newVueloModal') newVueloModal!: ElementRef;

  constructor(
    private vuelosService: VuelosService,
    private avionesService: AvionesService,
    private aeropuertosService: AeropuertosService,
    private fb: FormBuilder
  ) {
    // Initialize form with validators
    this.vueloForm = this.fb.group({
      id: [null],
      numeroVuelo: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
      fechaLlegada: ['', [Validators.required]],
      aeropuerto_origen_id: [null, [Validators.required]],
      aeropuerto_destino_id: [null, [Validators.required]],
      avion_id: [null, [Validators.required]],
      estatus: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.loadVuelos();
    this.loadAviones();
    this.loadAeropuertos();
  }

  // Debug method to check form state
  logFormState() {
    console.log('Form value:', this.vueloForm.value);
    console.log('Form valid:', this.vueloForm.valid);
    console.log('Form errors:', this.getFormValidationErrors());
    console.log('Aviones loaded:', this.aviones);
    console.log('Aeropuertos loaded:', this.aeropuertos);
  }

  // Helper to extract validation errors
  getFormValidationErrors() {
    this.formErrors = {};
    Object.keys(this.vueloForm.controls).forEach(key => {
      const control = this.vueloForm.get(key);
      if (control && control.errors) {
        this.formErrors[key] = control.errors;
      }
    });
    return this.formErrors;
  }

  loadVuelos(): void {
    this.loading = true;
    this.error = null;

    this.vuelosService.getVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
        this.loading = false;
        console.log('Loaded flights:', data);
      },
      error: (err) => {
        this.error = 'Error loading flights: ' + err.message;
        this.loading = false;
        console.error('Error fetching flights', err);
      }
    });
  }

  loadAviones(): void {
    this.avionesService.getAviones().subscribe({
      next: (data) => {
        this.aviones = data;
        console.log('Loaded planes:', data);
      },
      error: (err) => {
        console.error('Error fetching planes', err);
        this.error = 'Error loading planes: ' + err.message;
      }
    });
  }

  loadAeropuertos(): void {
    this.aeropuertosService.getAeropuertos().subscribe({
      next: (data) => {
        this.aeropuertos = data;
        console.log('Loaded airports:', data);
      },
      error: (err) => {
        console.error('Error fetching airports', err);
        this.error = 'Error loading airports: ' + err.message;
      }
    });
  }

  // View Modal
  openViewModal(vuelo: Vuelo): void {
    this.selectedVuelo = vuelo;
    (this.viewModal.nativeElement as HTMLDialogElement).showModal();
  }

  // Edit Modal
  openEditModal(vuelo: Vuelo): void {
    this.isEditMode = true;
    this.selectedVuelo = vuelo;
    this.error = null;

    // Format the dates for the form
    const formatDate = (dateStr: string) =>
      dateStr ? new Date(dateStr).toISOString().substring(0, 16) : '';  // Format for datetime-local input

    this.vueloForm.setValue({
      id: vuelo.id,
      numeroVuelo: vuelo.numeroVuelo,
      fechaSalida: formatDate(vuelo.fechaSalida),
      fechaLlegada: formatDate(vuelo.fechaLlegada),
      aeropuerto_origen_id: vuelo.aeropuertoOrigen.id,
      aeropuerto_destino_id: vuelo.aeropuertoDestino.id,
      avion_id: vuelo.avion.id,
      estatus: vuelo.estatus
    });

    console.log('Form values after setting edit data:', this.vueloForm.value);
    (this.editModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeEditModal(): void {
    (this.editModal.nativeElement as HTMLDialogElement).close();
  }

  saveVuelo(): void {
    this.logFormState(); // Debug current form state

    if (this.vueloForm.valid && this.selectedVuelo) {
      const formData = this.formatFormData(this.vueloForm.value);

      console.log('Sending to API for update:', formData);

      this.vuelosService.updateVuelo(this.selectedVuelo.id!, formData).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.loadVuelos();
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Update error details:', err);
          let errorMsg = 'Error updating flight: ';
          if (err.error && typeof err.error === 'object') {
            const errorDetails = Object.values(err.error).join(', ');
            errorMsg += errorDetails || err.message;
          } else {
            errorMsg += err.message;
          }
          this.error = errorMsg;
        }
      });
    } else {
      this.markFormGroupTouched(this.vueloForm);
      this.getFormValidationErrors();
      console.error('Form validation failed:', this.formErrors);
    }
  }

  // New Vuelo Modal
  openNewVueloModal(): void {
    this.isEditMode = false;
    this.error = null;

    // Set default values
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.vueloForm.reset({
      id: null,
      numeroVuelo: '',
      fechaSalida: today.toISOString().substring(0, 16),
      fechaLlegada: tomorrow.toISOString().substring(0, 16),
      aeropuerto_origen_id: null,
      aeropuerto_destino_id: null,
      avion_id: null,
      estatus: 1
    });

    console.log('Form reset for new flight, initial values:', this.vueloForm.value);
    (this.newVueloModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeNewVueloModal(): void {
    (this.newVueloModal.nativeElement as HTMLDialogElement).close();
  }

  saveNewVuelo(): void {
    this.logFormState(); // Debug current form state

    if (this.vueloForm.valid) {
      const formData = this.formatFormData(this.vueloForm.value);

      console.log('Sending to API for create:', formData);

      this.vuelosService.createVuelo(formData).subscribe({
        next: (response) => {
          console.log('Create response:', response);
          this.loadVuelos();
          this.closeNewVueloModal();
        },
        error: (err) => {
          console.error('Error response from API:', err);
          let errorMsg = 'Error creating flight: ';
          if (err.error && typeof err.error === 'object') {
            const errorDetails = Object.values(err.error).join(', ');
            errorMsg += errorDetails || err.message;
          } else {
            errorMsg += err.message;
          }
          this.error = errorMsg;
        }
      });
    } else {
      this.markFormGroupTouched(this.vueloForm);
      this.getFormValidationErrors();
      console.error('Form validation failed:', this.formErrors);
    }
  }

  // Delete Modal
  openDeleteModal(vuelo: Vuelo): void {
    this.selectedVuelo = vuelo;
    this.error = null;
    (this.deleteModal.nativeElement as HTMLDialogElement).showModal();
  }

  confirmDelete(): void {
    if (this.selectedVuelo) {
      this.vuelosService.deleteVuelo(this.selectedVuelo.id!).subscribe({
        next: () => {
          this.loadVuelos();
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        },
        error: (err) => {
          this.error = 'Error deleting flight: ' + err.message;
          console.error('Error deleting flight', err);
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        }
      });
    }
  }

  // Helper method to format data before sending to API
  private formatFormData(formValue: any): any {
    // Find objects for relationships
    const avion = this.aviones.find(a => a.id === formValue.avion_id);
    const aeropuertoOrigen = this.aeropuertos.find(a => a.id === formValue.aeropuerto_origen_id);
    const aeropuertoDestino = this.aeropuertos.find(a => a.id === formValue.aeropuerto_destino_id);

    // Create the proper structure for API
    return {
      id: formValue.id,
      numeroVuelo: formValue.numeroVuelo,
      fechaSalida: formValue.fechaSalida,
      fechaLlegada: formValue.fechaLlegada,
      aeropuertoOrigen: aeropuertoOrigen || { id: formValue.aeropuerto_origen_id },
      aeropuertoDestino: aeropuertoDestino || { id: formValue.aeropuerto_destino_id },
      avion: avion || { id: formValue.avion_id },
      estatus: formValue.estatus
    };
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to get status labels
  getEstatusLabel(estatus: number): string {
    switch(estatus) {
      case 1: return 'Scheduled';
      case 2: return 'In Flight';
      case 3: return 'Delayed';
      case 4: return 'Cancelled';
      case 5: return 'Completed';
      default: return 'Unknown';
    }
  }
}
