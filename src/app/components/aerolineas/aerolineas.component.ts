import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AerolineaService, Aerolinea } from '../../services/aerolineas.service';

@Component({
  selector: 'app-aerolineas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './aerolineas.component.html',
  styleUrls: ['./aerolineas.component.css']
})
export class AerolineasComponent implements OnInit {
  aerolineas: Aerolinea[] = [];
  loading = true;
  error: string | null = null;
  selectedAerolinea: Aerolinea | null = null;
  airlineForm: FormGroup;
  isEditMode = false;

  @ViewChild('viewModal') viewModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('newAirlineModal') newAirlineModal!: ElementRef;

  constructor(
    private aerolineaService: AerolineaService,
    private fb: FormBuilder
  ) {
    // Initialize form with validators that match backend requirements
    this.airlineForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      iata: ['', [Validators.required, Validators.minLength(1)]],
      estatus: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
      pais: ['', [Validators.required, Validators.minLength(1)]],
      fecha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadAerolineas();
  }

  loadAerolineas(): void {
    this.loading = true;
    this.error = null; // Clear previous errors

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

  // View Modal
  openViewModal(aerolinea: Aerolinea): void {
    this.selectedAerolinea = aerolinea;
    (this.viewModal.nativeElement as HTMLDialogElement).showModal();
  }

  // Edit Modal
  openEditModal(aerolinea: Aerolinea): void {
    this.isEditMode = true;
    this.selectedAerolinea = aerolinea;
    this.error = null; // Clear previous errors

    // Format the date for the form
    const formattedDate = aerolinea.fecha ?
      new Date(aerolinea.fecha).toISOString().split('T')[0] : '';

    this.airlineForm.setValue({
      id: aerolinea.id,
      nombre: aerolinea.nombre,
      iata: aerolinea.iata,
      estatus: aerolinea.estatus,
      pais: aerolinea.pais,
      fecha: formattedDate
    });

    (this.editModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeEditModal(): void {
    (this.editModal.nativeElement as HTMLDialogElement).close();
  }

  saveAirline(): void {
    if (this.airlineForm.valid && this.selectedAerolinea) {
      const formData = this.formatFormData(this.airlineForm.value);

      this.aerolineaService.updateAerolinea(this.selectedAerolinea.id, formData).subscribe({
        next: () => {
          this.loadAerolineas();
          this.closeEditModal();
        },
        error: (err) => {
          // Extract and show detailed error if available
          let errorMsg = 'Error updating airline: ';
          if (err.error && typeof err.error === 'object') {
            const errorDetails = Object.values(err.error).join(', ');
            errorMsg += errorDetails || err.message;
          } else {
            errorMsg += err.message;
          }
          this.error = errorMsg;
          console.error('Error updating airline', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.airlineForm);
    }
  }

  // New Airline Modal
  openNewAirlineModal(): void {
    this.isEditMode = false;
    this.error = null; // Clear previous errors

    // Set default values
    this.airlineForm.reset({
      id: null,
      nombre: '',
      iata: '',
      estatus: 1,
      pais: '',
      fecha: new Date().toISOString().split('T')[0] // Today as default
    });

    (this.newAirlineModal.nativeElement as HTMLDialogElement).showModal();
  }

  closeNewAirlineModal(): void {
    (this.newAirlineModal.nativeElement as HTMLDialogElement).close();
  }

  saveNewAirline(): void {
    if (this.airlineForm.valid) {
      const formData = this.formatFormData(this.airlineForm.value);

      // Remove id property for new airline creation
      // @ts-ignore
      delete formData.id;

      console.log('Sending data to backend:', formData);

      this.aerolineaService.createAerolinea(formData).subscribe({
        next: () => {
          this.loadAerolineas();
          this.closeNewAirlineModal();
        },
        error: (err) => {
          // Extract and show detailed error if available
          let errorMsg = 'Error creating airline: ';
          if (err.error && typeof err.error === 'object') {
            const errorDetails = Object.values(err.error).join(', ');
            errorMsg += errorDetails || err.message;
          } else {
            errorMsg += err.message;
          }
          this.error = errorMsg;
          console.error('Error creating airline:', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.airlineForm);
    }
  }

  // Delete Modal
  openDeleteModal(aerolinea: Aerolinea): void {
    this.selectedAerolinea = aerolinea;
    this.error = null; // Clear previous errors
    (this.deleteModal.nativeElement as HTMLDialogElement).showModal();
  }

  confirmDelete(): void {
    if (this.selectedAerolinea) {
      this.aerolineaService.deleteAerolinea(this.selectedAerolinea.id).subscribe({
        next: () => {
          this.loadAerolineas();
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        },
        error: (err) => {
          this.error = 'Error deleting airline: ' + err.message;
          console.error('Error deleting airline', err);
          (this.deleteModal.nativeElement as HTMLDialogElement).close();
        }
      });
    }
  }

  // Helper method to format data before sending to API
  private formatFormData(formValue: any): Aerolinea {
    // Convert the estatus to a number if it's a string
    const estatus = typeof formValue.estatus === 'string'
      ? parseInt(formValue.estatus, 10)
      : formValue.estatus;

    return {
      ...formValue,
      estatus: estatus
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
