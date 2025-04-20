import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AvionesService } from '../../services/aviones.service';
import { AerolineaService } from '../../services/aerolineas.service';
import { Avion } from '../../models/Avion.model';
import { Aerolinea } from '../../models/Aerolinea.model';

@Component({
  selector: 'app-aviones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './aviones.component.html',
  styleUrls: ['./aviones.component.css']
})
export class AvionesComponent implements OnInit {
  aviones: Avion[] = [];
  aerolineas: Aerolinea[] = [];
  loading = true;
  error: string | null = null;
  selectedAvion: Avion | null = null;
  avionForm: FormGroup;
  isEditMode = false;
  formErrors: any = {};

  // Add these two lines here
  JSON = JSON;
  Object = Object;

  @ViewChild('viewModal') viewModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('newAvionModal') newAvionModal!: ElementRef;

  constructor(
    private avionesService: AvionesService,
    private aerolineaService: AerolineaService,
    private fb: FormBuilder
  ) {
    // Modified form structure with flat aerolineaId
    this.avionForm = this.fb.group({
      id: [null],
      num_registro: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', [Validators.required]],
      codigo_modelo: ['', [Validators.required]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      fecha_salida: ['', [Validators.required]],
      estatus: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
      aerolineaId: [null, Validators.required] // Changed to simple field
    });
  }

  ngOnInit(): void {
    this.loadAviones();
    this.loadAerolineas();
  }

  // Debug method to check form state
  logFormState() {
    console.log('Form value:', this.avionForm.value);
    console.log('Form valid:', this.avionForm.valid);
    console.log('Form errors:', this.getFormValidationErrors());
    console.log('Aerolineas loaded:', this.aerolineas);
    console.log('Selected airline ID:', this.avionForm.get('aerolineaId')?.value);
  }

  // Helper to extract validation errors
  getFormValidationErrors() {
    this.formErrors = {};
    Object.keys(this.avionForm.controls).forEach(key => {
      const control = this.avionForm.get(key);
      if (control && control.errors) {
        this.formErrors[key] = control.errors;
      }
    });
    return this.formErrors;
  }

  loadAviones(): void {
    this.loading = true;
    this.error = null;

    this.avionesService.getAviones().subscribe({
      next: (data) => {
        this.aviones = data;
        this.loading = false;
        console.log('Loaded planes:', data);
      },
      error: (err) => {
        this.error = 'Error loading planes: ' + err.message;
        this.loading = false;
        console.error('Error fetching planes', err);
      }
    });
  }

  loadAerolineas(): void {
    this.aerolineaService.getAerolineas().subscribe({
      next: (data) => {
        this.aerolineas = data;
        console.log('Loaded airlines:', data);
      },
      error: (err) => {
        console.error('Error fetching airlines', err);
        this.error = 'Error loading airlines: ' + err.message;
      }
    });
  }

  // View Modal
  openViewModal(avion: Avion): void {
    this.selectedAvion = avion;
    (this.viewModal.nativeElement as HTMLDialogElement).showModal();
  }

  // Edit Modal
  openEditModal(avion: Avion): void {
    this.isEditMode = true;
    this.selectedAvion = avion;
    this.error = null;

    // Format the date for the form
    const formattedDate = avion.fecha_salida ?
      new Date(avion.fecha_salida).toISOString().split('T')[0] : '';

    // Modified to use flat aerolineaId
    this.avionForm.setValue({
      id: avion.id,
      num_registro: avion.num_registro,
      tipo: avion.tipo,
      codigo_modelo: avion.codigo_modelo,
      capacidad: avion.capacidad,
      fecha_salida: formattedDate,
      estatus: avion.estatus,
      aerolineaId: avion.aerolinea.id
    });

    console.log('Form values after setting edit data:', this.avionForm.value);
    (this.editModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeEditModal(): void {
    (this.editModal.nativeElement as HTMLDialogElement).close();
  }

  saveAvion(): void {
    this.logFormState(); // Debug current form state

    if (this.avionForm.valid && this.selectedAvion) {
      const formData = this.formatFormData(this.avionForm.value);

      console.log('Sending to API for update:', formData);

      this.avionesService.updateAvion(this.selectedAvion.id!, formData).subscribe({
        next: () => {
          this.loadAviones();
          this.closeEditModal();
        },
        error: (err) => {
          let errorMsg = 'Error updating plane: ';
          if (err.error && typeof err.error === 'object') {
            const errorDetails = Object.values(err.error).join(', ');
            errorMsg += errorDetails || err.message;
          } else {
            errorMsg += err.message;
          }
          this.error = errorMsg;
          console.error('Error updating plane', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.avionForm);
      this.getFormValidationErrors(); // Get validation errors for debugging
      console.error('Form validation failed:', this.formErrors);
    }
  }

  // New Avion Modal
  openNewAvionModal(): void {
    this.isEditMode = false;
    this.error = null;

    // Set default values
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.avionForm.reset({
      id: null,
      num_registro: '',
      tipo: '',
      codigo_modelo: '',
      capacidad: '',
      fecha_salida: tomorrow.toISOString().split('T')[0],
      estatus: 1,
      aerolineaId: null // Changed from nested form to flat field
    });

    console.log('Form reset for new plane, initial values:', this.avionForm.value);
    (this.newAvionModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeNewAvionModal(): void {
    (this.newAvionModal.nativeElement as HTMLDialogElement).close();
  }

  saveNewAvion(): void {
    this.logFormState(); // Debug current form state

    if (this.avionForm.valid) {
      const formValues = this.formatFormData(this.avionForm.value);

      // Transform the data for API - convert from flat aerolineaId to nested object
      const apiData = {
        ...formValues,
        aerolinea: {
          id: formValues.aerolineaId
        }
      };

      // Remove the flat field before sending
      delete apiData.aerolineaId;

      console.log('Sending to API for create:', apiData);

      this.avionesService.createAvion(apiData).subscribe({
        next: (response) => {
          console.log('Create response:', response);
          this.loadAviones();
          this.closeNewAvionModal();
        },
        error: (err) => {
          console.error('Error response from API:', err);
          let errorMsg = 'Error creating plane: ';
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
      this.markFormGroupTouched(this.avionForm);
      this.getFormValidationErrors(); // Get validation errors for debugging
      console.error('Form validation failed:', this.formErrors);
    }
  }

  // Delete Modal
  openDeleteModal(avion: Avion): void {
    this.selectedAvion = avion;
    this.error = null;
    (this.deleteModal.nativeElement as HTMLDialogElement).showModal();
  }

  confirmDelete(): void {
    if (this.selectedAvion) {
      this.avionesService.deleteAvion(this.selectedAvion.id!).subscribe({
        next: () => {
          this.loadAviones();
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        },
        error: (err) => {
          this.error = 'Error deleting plane: ' + err.message;
          console.error('Error deleting plane', err);
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        }
      });
    }
  }

  // Helper method to format data before sending to API
  private formatFormData(formValue: any): any {
    // Convert numeric values
    const num_registro = typeof formValue.num_registro === 'string'
      ? parseInt(formValue.num_registro, 10)
      : formValue.num_registro;

    const capacidad = typeof formValue.capacidad === 'string'
      ? parseInt(formValue.capacidad, 10)
      : formValue.capacidad;

    const estatus = typeof formValue.estatus === 'string'
      ? parseInt(formValue.estatus, 10)
      : formValue.estatus;

    return {
      ...formValue,
      num_registro,
      capacidad,
      estatus
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

  // Helper to find airline name
  getAerolineaName(id: number): string {
    const aerolinea = this.aerolineas.find(a => a.id === id);
    return aerolinea ? aerolinea.nombre : 'Unknown';
  }
}
