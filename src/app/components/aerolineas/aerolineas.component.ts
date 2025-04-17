import { Component } from '@angular/core';
import { AerolineasService } from '../../services/aerolineas.service';
import { Aerolinea } from '../../models/Aerolinea.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { reportUnhandledError } from 'rxjs/internal/util/reportUnhandledError';

@Component({
  selector: 'app-aerolineas',
  standalone: false,
  templateUrl: './aerolineas.component.html',
  styleUrl: './aerolineas.component.css'
})
export class AerolineasComponent {

  aerolineas: Aerolinea[]=[];
  aerolineaForm: FormGroup;
  showForm:  boolean = false;
  textoModal: string = 'Nueva Aerolinea';
  isEditMode: boolean= false;
  selectedAerolinea: Aerolinea | null= null;

  constructor(
    private aerolineaService: AerolineasService,
    private formBuilder: FormBuilder
  ){
    this.aerolineaForm = formBuilder.group({
      id: [null],
      nombre: ['',[Validators.required, Validators.maxLength(50)]],
      iata: ['',[Validators.required, Validators.maxLength(50)]],
      estatus: ['',[Validators.required]],
      pais: ['',[Validators.required, Validators.maxLength(50)]],
      fecha: ['',[Validators.required]]
    })
  }

  ngOnInit(): void{
    this.listarAerolineas();
  }

  listarAerolineas(){
    this.aerolineaService.getAerolineas().subscribe({
      next: resp =>{
        this.aerolineas = resp;
        console.log(this.aerolineas);
      }
    })
  }

  toggleForm(){
    this.showForm =!this.showForm;
    this.textoModal = 'Nueva Aerolínea';
    this.isEditMode = false;
    this.selectedAerolinea = null;
    this.aerolineaForm.reset();
  }

  onSubmnit(): void{
    if(this.aerolineaForm.invalid){
      return;
    }
    const aerolineaData: Aerolinea = this.aerolineaForm.value;
    if(this.isEditMode){
      this.aerolineaService.putAerolinea(aerolineaData).subscribe({
        next: updatedAerolinea =>{
          const index = this.aerolineas.findIndex(a=>a.id===aerolineaData.id);
          if(index!==-1){
            this.aerolineas[index]= updatedAerolinea;
          }
          Swal.fire({
            title: 'Aerolinea '+ updatedAerolinea.nombre + ' actualizada',
            text: 'La aerolinea fue actualizada exitosamente',
            icon: 'success'
          });
          this.showForm = false;
          this.aerolineaForm.reset();
        },
        error: error=>{
          this.mostrarErrores(error);
        }
      })
    }else{
      this.aerolineaService.postAerolinea(aerolineaData).subscribe({
        next: newAerolinea =>{
          this.aerolineas.push(newAerolinea)
          const index = this.aerolineas.findIndex(a=>a.id===aerolineaData.id);

          Swal.fire({
            title: 'Aerolinea '+ newAerolinea.nombre + ' creada',
            text: 'La aerolinea fue creada exitosamente',
            icon: 'success'
          });
          this.showForm = false;
          this.aerolineaForm.reset();
        },
        error: error=>{
          this.mostrarErrores(error);
        }
      })
    }
  }
  mostrarErrores(errorResponse: any):void{
    if(errorResponse && errorResponse.error){
      let errores= errorResponse.error;
      let mensajeErrores = ''
      for(let campo in errores){
        if(errores.hasOwnProperty(campo)){
          mensajeErrores += errores[campo]+"\n";
        }
      }
      Swal.fire({
        icon:'error',
        title: 'Errores encontrados',
        text: mensajeErrores.trim()
      });
    }
  }
  editAerolinea(aerolinea: Aerolinea):void{
    this.selectedAerolinea = aerolinea;
    this.textoModal= 'Editando aerolinea' + aerolinea.nombre;
    this.isEditMode= true;
    this.showForm =true;
    /*this.aerolineaForm.patchValue({
      id: aerolinea.id,
      nombre: aerolinea.nombre,
      iata: aerolinea.iata,
      estatus: aerolinea.estatus,
      pais: aerolinea.pais,
      fecha: aerolinea.fecha,
    }); Si no funciona el otro*/
    this.aerolineaForm.patchValue({
      ...aerolinea
    });
  }

}
