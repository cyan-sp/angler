import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AeropuertosService } from '../../services/aeropuerto.service';
import { Aeropuerto } from '../../models/Aeropuerto.model';

@Component({
  selector: 'app-aeropuertos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './aeropuertos.component.html',
  styleUrls: ['./aeropuertos.component.css']
})
export class AeropuertosComponent implements OnInit {
  aeropuertos: Aeropuerto[] = [];
  loading = true;
  error: string | null = null;
  selectedAeropuerto: Aeropuerto | null = null;
  airportForm: FormGroup;
  isEditMode = false;

  @ViewChild('viewModal') viewModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('newAirportModal') newAirportModal!: ElementRef;

  constructor(
    private aeropuertosService: AeropuertosService,
    private fb: FormBuilder
  ) {
    // Initialize form with validators that match backend requirements
    this.airportForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      codigo: ['', [Validators.required, Validators.minLength(1)]],
      latitud: [0, [Validators.required]],
      longitud: [0, [Validators.required]],
      pais: ['', [Validators.required, Validators.minLength(1)]],
      estatus: [1, [Validators.required, Validators.min(1), Validators.max(2)]]
    });
  }

  ngOnInit(): void {
    this.loadAeropuertos();
  }

  loadAeropuertos(): void {
    this.loading = true;
    this.error = null; // Clear previous errors

    this.aeropuertosService.getAeropuertos().subscribe({
      next: (data) => {
        this.aeropuertos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading airports: ' + err.message;
        this.loading = false;
        console.error('Error fetching airports', err);
      }
    });
  }

  // View Modal
  openViewModal(aeropuerto: Aeropuerto): void {
    this.selectedAeropuerto = aeropuerto;
    (this.viewModal.nativeElement as HTMLDialogElement).showModal();
  }

  // Edit Modal
  openEditModal(aeropuerto: Aeropuerto): void {
    this.isEditMode = true;
    this.selectedAeropuerto = aeropuerto;
    this.error = null; // Clear previous errors

    this.airportForm.setValue({
      id: aeropuerto.id,
      nombre: aeropuerto.nombre,
      codigo: aeropuerto.codigo,
      latitud: aeropuerto.latitud,
      longitud: aeropuerto.longitud,
      pais: aeropuerto.pais,
      estatus: aeropuerto.estatus
    });

    (this.editModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeEditModal(): void {
    (this.editModal.nativeElement as HTMLDialogElement).close();
  }

  saveAirport(): void {
    if (this.airportForm.valid && this.selectedAeropuerto) {
      const formData = this.formatFormData(this.airportForm.value);

      this.aeropuertosService.updateAeropuerto(this.selectedAeropuerto.id!, formData).subscribe({
        next: () => {
          this.loadAeropuertos();
          this.closeEditModal();
        },
        error: (err) => {
          // Extract and show detailed error if available
          let errorMsg = 'Error updating airport: ';
          if (err.error && typeof err.error === 'object') {
            const errorDetails = Object.values(err.error).join(', ');
            errorMsg += errorDetails || err.message;
          } else {
            errorMsg += err.message;
          }
          this.error = errorMsg;
          console.error('Error updating airport', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.airportForm);
    }
  }

  // New Airport Modal
  openNewAirportModal(): void {
    this.isEditMode = false;
    this.error = null; // Clear previous errors

    // Set default values
    this.airportForm.reset({
      id: null,
      nombre: '',
      codigo: '',
      latitud: 0,
      longitud: 0,
      pais: '',
      estatus: 1
    });

    (this.newAirportModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeNewAirportModal(): void {
    (this.newAirportModal.nativeElement as HTMLDialogElement).close();
  }

  saveNewAirport(): void {
    if (this.airportForm.valid) {
      const formData = this.formatFormData(this.airportForm.value);

      // Remove id property for new airport creation
      if (formData.id === null) {
        delete (formData as any).id;
      }

      console.log('Sending data to backend:', formData);

      this.aeropuertosService.createAeropuerto(formData).subscribe({
        next: () => {
          this.loadAeropuertos();
          this.closeNewAirportModal();
        },
        error: (err) => {
          // Extract and show detailed error if available
          let errorMsg = 'Error creating airport: ';
          if (err.error && typeof err.error === 'object') {
            const errorDetails = Object.values(err.error).join(', ');
            errorMsg += errorDetails || err.message;
          } else {
            errorMsg += err.message;
          }
          this.error = errorMsg;
          console.error('Error creating airport:', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.airportForm);
    }
  }

  // Delete Modal
  openDeleteModal(aeropuerto: Aeropuerto): void {
    this.selectedAeropuerto = aeropuerto;
    this.error = null; // Clear previous errors
    (this.deleteModal.nativeElement as HTMLDialogElement).showModal();
  }

  confirmDelete(): void {
    if (this.selectedAeropuerto) {
      this.aeropuertosService.deleteAeropuerto(this.selectedAeropuerto.id!).subscribe({
        next: () => {
          this.loadAeropuertos();
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        },
        error: (err) => {
          this.error = 'Error deleting airport: ' + err.message;
          console.error('Error deleting airport', err);
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        }
      });
    }
  }

  // Helper method to format data before sending to API
  private formatFormData(formValue: any): Aeropuerto {
    // Convert the estatus to a number if it's a string
    const estatus = typeof formValue.estatus === 'string'
      ? parseInt(formValue.estatus, 10)
      : formValue.estatus;

    const latitud = typeof formValue.latitud === 'string'
      ? parseFloat(formValue.latitud)
      : formValue.latitud;

    const longitud = typeof formValue.longitud === 'string'
      ? parseFloat(formValue.longitud)
      : formValue.longitud;

    return {
      ...formValue,
      estatus: estatus,
      latitud: latitud,
      longitud: longitud
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
}
