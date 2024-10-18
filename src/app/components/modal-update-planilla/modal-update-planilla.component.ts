import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanillasService } from '../../services/planillas/planillas.service';
import { ArmasService } from '../../services/armas/armas.service';
import { VehiculosService } from '../../services/vehiculos/vehiculos.service';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-modal-update-planilla',
  standalone: true,
  imports: [ MatInputModule,MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatOptionModule,
    MatChipsModule,
    CommonModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,MatGridListModule, MatCheckboxModule,
  ],
  templateUrl: './modal-update-planilla.component.html',
  styleUrl: './modal-update-planilla.component.scss'
})
export class ModalUpdatePlanillaComponent {
  selectedClasses = 0;
  filteredArmas: any[];
  filteredVehiculosClaseI: any[] = [];
  filteredVehiculosClaseV: any[] = [];
  filteredVehiculosAgua: any[] = [];
  vehiculosList: any[] = [];
  armasList: any[] = [];
  situacionCombateList: any[] = [];
  selectedArmas: any[] = [];
  filteredVehiculosClaseIii: any[] = [];
  selectedVehiculos: any[] = []
  public planillaForm: FormGroup;
  public selectedClass: string | null = null;
  originalData: any;

  constructor(
    private formBuilder: FormBuilder,
    private planillaService: PlanillasService,
    private vehiculoService: VehiculosService,
    private armaService: ArmasService,
    private dialogRef: MatDialogRef<ModalUpdatePlanillaComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalData = data;
    this.buildUpdatePlanillaForm();
  }
  getGridColumns(): number {
    // Devuelve el número de columnas basado en las clases seleccionadas
    this.selectedClasses=0
    if (this.planillaForm.get('claseI').value) this.selectedClasses++;
    if (this.planillaForm.get('agua').value) this.selectedClasses++;
    if (this.planillaForm.get('claseIII').value) this.selectedClasses++;
    if (this.planillaForm.get('claseV').value) this.selectedClasses++;
    return this.selectedClasses || 1; // Mínimo 1 columna si no hay clases seleccionadas
  }
  

  public getVehiculos() {
    this.vehiculoService.getVehiculos().subscribe((response: any) => {
      console.log(response)
      this.vehiculosList = response;
    });

  }
  public onSubmit() {
    if (this.planillaForm.invalid) {
      this.snackBar.open('Por favor complete los campos obligatorios.', 'OK', { duration: 3000 });
      return;
    }

    const updatedPlanilla: any = this.planillaForm.value;

    this.planillaService.updatePlanilla(this.originalData.id, updatedPlanilla).subscribe({
      next: () => {
        this.snackBar.open('Planilla actualizada con éxito', 'OK', { duration: 3000 });
        this.dialogRef.close('saved');
      },
      error: (err) => {
        this.snackBar.open('Error actualizando la planilla: ' + err.message, 'OK', { duration: 3000 });
      }
    });
  }

  public getArmas() {
    this.armaService.getArmas().subscribe((response: any) => {
      console.log(response)
      this.armasList = response;
    });

  }

  public getSituacionCombate() {
    this.armaService.getSituacionCombate().subscribe((response: any) => {
      console.log(response)
      this.situacionCombateList = response;
    });

  }

  removeArma(arma: any): void {
    const armasSeleccionadas = this.planillaForm.get('arma').value as any[];
    const index = armasSeleccionadas.indexOf(arma);

    if (index >= 0) {
      armasSeleccionadas.splice(index, 1);
      this.planillaForm.get('arma').setValue(armasSeleccionadas);
    }
  }

  removeVehiculo(arma: any): void {
    const armasSeleccionadas = this.planillaForm.get('vehiculos').value as any[];
    const index = armasSeleccionadas.indexOf(arma);

    if (index >= 0) {
      armasSeleccionadas.splice(index, 1);
      this.planillaForm.get('vehiculos').setValue(armasSeleccionadas);
    }
  }

  onArmaChange(event: any): void {
    console.log(event)
    const selectArmas = event.value;

    // Agregar propiedad cantidad a cada arma seleccionada
    this.selectedArmas = selectArmas.map(arma => {
      return {
        ...arma,
        cantidad: arma.cantidad || 0 // Si la cantidad ya está definida, la mantiene, de lo contrario la inicializa a 0
      };
    });
    console.log(this.selectedArmas)
  }
  onVehiculoChange(event: any): void {
    console.log(event)
    const selectVehiculos = event.value;

    // Agregar propiedad cantidad a cada arma seleccionada
    this.selectedVehiculos = selectVehiculos.map(vehiculo => {
      return {
        ...vehiculo,
        cantidad: vehiculo.cantidad || 0 // Si la cantidad ya está definida, la mantiene, de lo contrario la inicializa a 0
      };
    });
    console.log(this.selectedVehiculos)
  }


  // Método para actualizar la cantidad de cada arma seleccionada con el evento input
  onCantidadChange(index: number, cantidad: any): void {
    console.log(cantidad)
    const armasSeleccionadas = this.planillaForm.get('arma').value as any[];

    // Actualizamos la cantidad en el array de armas seleccionadas
    armasSeleccionadas[index].cantidad = +cantidad.target.value; // Convertimos el valor a número
    this.planillaForm.get('arma').setValue(armasSeleccionadas);
  }

  onCantidadChangeIii(index: number, cantidad: any): void {
    console.log(cantidad)
    const vehiculosSeleccionados = this.planillaForm.get('vehiculos').value as any[];

    // Actualizamos la cantidad en el array de armas seleccionadas
    vehiculosSeleccionados[index].cantidad = +cantidad.target.value; // Convertimos el valor a número
    this.planillaForm.get('vehiculos').setValue(vehiculosSeleccionados);
  }
  showEfectivosClaseI(): boolean {
    return !this.planillaForm.get('numEfectivoAgua').value;
  }

  // Mostrar el input de Agua solo si no se ha ingresado en Clase I
  showEfectivosAgua(): boolean {
    return !this.planillaForm.get('numEfectivoClaseI').value;
  }

  syncNumeroEfectivos(): void {
    // Sincronizar el número de efectivos entre Clase I y Agua
    this.planillaForm.get('numEfectivoClaseI').valueChanges.subscribe(value => {
      if (value && !this.planillaForm.get('numEfectivoAgua').value) {
        this.planillaForm.get('numEfectivoAgua').setValue(value);
      }
    });

    this.planillaForm.get('numEfectivoAgua').valueChanges.subscribe(value => {
      if (value && !this.planillaForm.get('numEfectivoClaseI').value) {
        this.planillaForm.get('numEfectivoClaseI').setValue(value);
      }
    });
  }

  toggleFieldsBasedOnSelection(): void {
    // Activa/desactiva los campos según la selección de clases
    this.planillaForm.get('claseI').valueChanges.subscribe(value => {
      this.toggleClaseFields(value, 'numEfectivoClaseI', 'cantidadDiasClaseI');
    });
    this.planillaForm.get('agua').valueChanges.subscribe(value => {
      this.toggleClaseFields(value, 'numEfectivoAgua', 'diasConDucha', 'diasSinDucha');
    });
    this.planillaForm.get('claseIII').valueChanges.subscribe(value => {
      this.toggleClaseFields(value, 'kopTotal', 'distCarretera');
    });
    this.planillaForm.get('claseV').valueChanges.subscribe(value => {
      this.toggleClaseFields(value,'situacionCombate', 'cantidadDiasClaseV');
    });
  }

  toggleClaseFields(enable: boolean, ...fields: string[]): void {
    fields.forEach(field => {
      if (enable) {
        this.planillaForm.get(field).enable();
      } else {
        this.planillaForm.get(field).disable();
      }
    });
  }
  getModalClass(): string {
    return `dynamic-width-${this.selectedClasses || 1}`;
  }


  onCombustibleChange(): void {
    const tipoCombustible = this.planillaForm.get('tipoCombustible').value;

    // Filtrar vehículos según el tipo de combustible seleccionado}
    this.filteredVehiculosClaseI= this.vehiculosList
    this.filteredVehiculosClaseI = this.filteredVehiculosClaseI.filter((vehiculo: any) => vehiculo.capacidad !== null && vehiculo.capacidad !== undefined);
    this.filteredVehiculosClaseI = this.filteredVehiculosClaseI.filter(v => v.tipoCombustible === tipoCombustible);

    // Si hay vehículos disponibles después de filtrar, habilitar el selector de vehículos
    if (this.filteredVehiculosClaseI.length > 0) {
        this.planillaForm.get('vehiculo').enable();
    } else {
        // Si no hay vehículos, deshabilitar el campo y limpiar el valor
        this.planillaForm.get('vehiculo').disable();
        this.planillaForm.get('vehiculo').setValue(null);
    }
  }
  onCombustibleChangeAgua(): void {
    const tipoCombustible = this.planillaForm.get('tipoCombustibleAgua').value;

    // Filtrar vehículos según el tipo de combustible seleccionado}
    this.filteredVehiculosAgua= this.vehiculosList
    this.filteredVehiculosAgua = this.filteredVehiculosAgua.filter((vehiculo: any) => vehiculo.capacidad !== null && vehiculo.capacidad !== undefined);
    this.filteredVehiculosAgua = this.filteredVehiculosAgua.filter(v => v.tipoCombustible === tipoCombustible);

    // Si hay vehículos disponibles después de filtrar, habilitar el selector de vehículos
    if (this.filteredVehiculosAgua.length > 0) {
        this.planillaForm.get('vehiculoAgua').enable();
    } else {
        // Si no hay vehículos, deshabilitar el campo y limpiar el valor
        this.planillaForm.get('vehiculoAgua').disable();
        this.planillaForm.get('vehiculoAgua').setValue(null);
    }
  }


  onCombustibleChangeIii(): void {
    const tipoCombustible = this.planillaForm.get('tipoCombustibleIii').value;

    // Filtrar vehículos según el tipo de combustible seleccionado}
    this.filteredVehiculosClaseIii= this.vehiculosList
    console.log(this.filteredVehiculosClaseIii)
    this.filteredVehiculosClaseIii = this.filteredVehiculosClaseIii.filter(v => v.tipoCombustible === tipoCombustible);
    console.log(this.filteredVehiculosClaseIii)
    // Si hay vehículos disponibles después de filtrar, habilitar el selector de vehículos
    if (this.filteredVehiculosClaseIii.length > 0) {
        this.planillaForm.get('vehiculos').enable();
    } else {
        // Si no hay vehículos, deshabilitar el campo y limpiar el valor
        this.planillaForm.get('vehiculos').disable();
        this.planillaForm.get('vehiculos').setValue(null);
    }
  }

  onCombustibleChangeClaseV(): void {
    const tipoCombustible = this.planillaForm.get('tipoCombustibleClaseV').value;

    // Filtrar vehículos según el tipo de combustible seleccionado}
    this.filteredVehiculosClaseV= this.vehiculosList
    console.log(this.filteredVehiculosClaseV)
    this.filteredVehiculosClaseV = this.filteredVehiculosClaseV.filter(v => v.tipoCombustible === tipoCombustible);
    console.log(this.filteredVehiculosClaseV)
    // Si hay vehículos disponibles después de filtrar, habilitar el selector de vehículos
    if (this.filteredVehiculosClaseV.length > 0) {
        this.planillaForm.get('vehiculoClaseV').enable();
    } else {
        // Si no hay vehículos, deshabilitar el campo y limpiar el valor
        this.planillaForm.get('vehiculoClaseV').disable();
        this.planillaForm.get('vehiculoClaseV').setValue(null);
    }
  }

  buildUpdatePlanillaForm() {
    console.log(this.originalData)
    // Inicializamos el formulario con los valores de this.originalData
    this.planillaForm = this.formBuilder.group({
      // Valores globales de cada clase
      claseI: [this.originalData.claseI || false],
      agua: [this.originalData.agua || false],
      claseIII: [this.originalData.claseIII || false],
      claseV: [this.originalData.claseV || false],
  
      // Clase I Fields
      numEfectivoClaseI: [{ value: this.originalData.claseI?.numEfectivo|| '', disabled: false }],
      cantidadDiasClaseI: [{ value: this.originalData.claseI?.cantidadDias|| '', disabled: false }],
      calcularTraslado: [this.originalData.claseI?.vehiculo || false],
      tipoCombustible: [{ value: this.originalData.claseI?.tipoCombustible || '', disabled: false }],
      vehiculo: [{ value: this.originalData.claseI?.vehiculo || '', disabled: false }],
  
      // Agua Fields
      numEfectivoAgua: [{ value: this.originalData.agua?.numEfectivoAgua || '', disabled: false }],
      diasConDucha: [{ value: this.originalData.agua?.diasConDucha || '', disabled: false }],
      diasSinDucha: [{ value: this.originalData.agua?.diasSinDucha || '', disabled: false }],
      calcularTrasladoAgua: [this.originalData.agua?.calcularTrasladoAgua || false],
      tipoCombustibleAgua: [{ value: this.originalData.agua?.tipoCombustibleAgua || '', disabled: false }],
      vehiculoAgua: [{ value: this.originalData.agua?.vehiculoAgua || '', disabled: false }],
  
      // Clase III Fields
      calcularKopManual: [this.originalData.claseIII?.calcularKopManual || false],
      kopTotal: [{ value: this.originalData.claseIII?.kopTotal || '', disabled: false }],
      distCarreteraComun: [{ value: this.originalData.claseIII?.distCarreteraComun || '', disabled: false }],
      distCampoTraviesaComun: [{ value: this.originalData.claseIII?.distCampoTraviesaComun || '', disabled: false }],
      dividirRecorrido: [this.originalData.claseIII?.dividirRecorrido || false],
      distCarreteraGrupo1: [{ value: this.originalData.claseIII?.distCarreteraGrupo1 || '', disabled: false }],
      distCampoTraviesaGrupo1: [{ value: this.originalData.claseIII?.distCampoTraviesaGrupo1 || '', disabled: false }],
      kopGrupo1: [{ value: this.originalData.claseIII?.kopGrupo1 || '', disabled: false }],
      kopGrupo2: [{ value: this.originalData.claseIII?.kopGrupo2 || '', disabled: false }],
      distCarreteraGrupo2: [{ value: this.originalData.claseIII?.distCarreteraGrupo2 || '', disabled: false }],
      distCampoTraviesaGrupo2: [{ value: this.originalData.claseIII?.distCampoTraviesaGrupo2 || '', disabled: false }],
      distCarretera: [{ value: this.originalData.claseIII?.distCarretera || '', disabled: false }],
      distAbastecimiento: [{ value: this.originalData.claseIII?.distAbastecimiento || '', disabled: false }],
      distCampoTraviesa: [{ value: this.originalData.claseIII?.distCampoTraviesa || '', disabled: false }],
      tipoCombustibleIii: [{ value: this.originalData.claseIII?.tipoCombustibleIii || '', disabled: false }],
      vehiculos: [{ value: this.originalData.claseIII?.vehiculos || [], disabled: false }],
  
      // Clase V Fields
      situacionCombate: [{ value: this.originalData.claseV?.situacionCombate || '', disabled: false }],
      cantidadDiasClaseV: [{ value: this.originalData.claseV?.cantidadDiasClaseV || '', disabled: false }],
      calcularTrasladoClaseV: [this.originalData.claseV?.calcularTrasladoClaseV || false],
      tipoCombustibleClaseV: [{ value: this.originalData.claseV?.tipoCombustibleClaseV || '', disabled: false }],
      cantMunicionPorCaja: [{ value: this.originalData.claseV?.cantMunicionPorCaja || '', disabled: false }],
      pesoCaja: [{ value: this.originalData.claseV?.pesoCaja || '', disabled: false }],
      vehiculoClaseV: [{ value: this.originalData.claseV?.vehiculoClaseV || '', disabled: false }],
      arma: [this.originalData.claseV?.arma || []],
    });
  }

  
  private buildPlanillaPayload(): any {

    const formValue = this.planillaForm.value;

    console.log(formValue)
    const newPlanilla: any = {};
    console.log(formValue.numEfectivoClaseI )
    console.log(Math.ceil(formValue.numEfectivoClaseI + (formValue.numEfectivoClaseI*0.1)))
    if (formValue.claseI) {
        newPlanilla.claseI = {
          numEfectivo: formValue.numEfectivoClaseI,
          cantidadDias: formValue.cantidadDiasClaseI,
          cantidadRaciones: Math.ceil((formValue.numEfectivoClaseI + (formValue.numEfectivoClaseI*0.1))*formValue.cantidadDiasClaseI),
          pesoRacion: Math.ceil(((formValue.numEfectivoClaseI + (formValue.numEfectivoClaseI*0.1))*formValue.cantidadDiasClaseI)*1.4),
          cantVehiculos: formValue.numEfectivoClaseI && formValue.cantidadDiasClaseI && formValue.vehiculo?.capacidad
        ? Math.ceil((((formValue.numEfectivoClaseI + (formValue.numEfectivoClaseI * 0.1)) * formValue.cantidadDiasClaseI) * 1.4) / (formValue.vehiculo.capacidad * 1000))
        : null,
          vehiculo: formValue.vehiculo? formValue.vehiculo: null
      };
    }

    // Agregar Agua al payload si está seleccionada
    if(formValue.numEfectivoAgua){
      formValue.numEfectivoClaseI = formValue.numEfectivoAgua
    }
    else{
      formValue.numEfectivoAgua = formValue.numEfectivoClaseI
    }
    if (formValue.agua) {
      const consumoAguaConDucha =Math.round((((formValue.numEfectivoAgua*30)+((formValue.numEfectivoAgua*30)*0.1))*formValue.diasConDucha)*100)/100
      const consumoAguaSinDucha =Math.round((((formValue.numEfectivoAgua*10)+((formValue.numEfectivoAgua*10)*0.1))*formValue.diasSinDucha)*100)/100
      console.log(consumoAguaConDucha)
      let cantVehiculos
      if(formValue.vehiculoAgua?.typeCapCarga=="litros"){
        cantVehiculos=Math.ceil((consumoAguaConDucha+consumoAguaSinDucha)/(formValue.vehiculooAgua.capCarga))
      }
      else{
        cantVehiculos=Math.ceil((consumoAguaConDucha+consumoAguaSinDucha)/((formValue.vehiculooAgua.capCarga)*200))
      }
      newPlanilla.agua = {
        numEfectivo: formValue.numEfectivoAgua,
        diasConDucha: formValue.diasConDucha,
        diasSinDucha: formValue.diasSinDucha,
        consumoTotal: consumoAguaConDucha+consumoAguaSinDucha,
        cantVehiculos: cantVehiculos? cantVehiculos: null,
        vehiculo: formValue.vehiculo? formValue.vehiculo: null
      };
    }
    console.log(newPlanilla)

    // Agregar Clase III al payload si está seleccionada
    if (formValue.claseIII) {
      var fda = 0
      var dmc=0
      var dmct=0
      var md = 0
      var fs = 0
      var total=0
      var lub = 0
      if(!formValue.calcularKopManual)
      {
        var kopTotal=0
        for(const vehiculo of formValue.vehiculos){
         kopTotal = (vehiculo.kop * vehiculo.cantidad)+kopTotal
        }
        md = Math.ceil(kopTotal*10)
        dmc = Math.ceil(kopTotal * formValue.distCarreteraComun )
        dmct = Math.ceil(kopTotal * formValue.distCampoTraviesaComun * 2.5)
        fda = Math.ceil(kopTotal * formValue.distAbastecimiento * 0.2 * 2)
      }

      else{
        if(formValue.dividirRecorrido){

          dmc =  Math.ceil((formValue.kopGrupo1 * formValue.distCarreteraGrupo1 )+(formValue.kopTotal * formValue.distCarreteraComun )+(formValue.kopGrupo2 * formValue.distCarreteraGrupo2))
          dmct =  Math.ceil((formValue.kopGrupo1 * formValue.distCampoTraviesaGrupo1 * 2.5 )+(formValue.kopTotal * formValue.distCampoTraviesaComun * 2.5 )+(formValue.kopGrupo2 * formValue.distCampoTraviesaGrupo2  * 2.5 ))
          console.log("dmc:",dmc)

        }
        else{
          dmc =  Math.ceil((formValue.kopTotal * formValue.distCarreteraComun))
          dmct =  Math.ceil((formValue.kopTotal * formValue.distCampoTraviesaComun * 2.5 ))
        }
        fda = Math.ceil(formValue.kopTotal * formValue.distAbastecimiento * 0.2 * 2)
        md = Math.ceil(formValue.kopTotal*10)
      }
      fs =Math.ceil((fda+ dmc+ md)*0.1)
      total = dmc+dmct+fda+md+fs
      lub = Math.ceil(total*0.02)

      newPlanilla.claseIii = {
        kopTotal: formValue.kopTotal? formValue.kopTotal: kopTotal,
        distCarreteraComun: formValue.distCarreteraComun,
        distCampoTraviesaComun: formValue.distCampoTraviesaComun,
        distAbastecimiento: formValue.distAbastecimiento,
        vehiculos: formValue.vehiculos? formValue.vehiculos: null,
        kopGrupo1: formValue.kopGrupo1? formValue.kopGrupo1: null,
        kopGrupo2: formValue.kopGrupo2? formValue.kopGrupo2: null,
        distCampoTraviesaGrupo1: formValue.distCampoTraviesaGrupo1? formValue.distCampoTraviesaGrupo1: null,
        distCampoTraviesaGrupo2: formValue.distCampoTraviesaGrupo2? formValue.distCampoTraviesaGrupo2: null,
        distCarreteraGrupo1: formValue.distCarreteraGrupo1? formValue.distCarreteraGrupo1: null,
        distCarreteraGrupo2: formValue.distCarreteraGrupo2? formValue.distCarreteraGrupo2: null,
        factorSeguridad: fs,
        fdmTotal: dmc + dmct,
        fmdTotal: md,
        fdaTotal: fda,
        combustibleTotal: total,
        lubricantes: lub,

      };
    }

    // Agregar Clase V al payload si está seleccionada
    if (formValue.claseV) {
      let cantMunicion
      if(formValue.vehiculoClaseV){

      }
      newPlanilla.claseV = {
        armas: formValue.arma,
        situacionCombate: formValue.situacionCombate,
        cantDias: formValue.cantidadDiasClaseV,
        pesoCaja: formValue.pesoCaja,
        cantMunicionPorCaja: formValue.cantMunicionPorCaja,
        vehiculo: formValue.vehiculoClaseV? formValue.vehiculoClaseV: null
      };
    }
    console.log(newPlanilla )
    return newPlanilla
  }

}
