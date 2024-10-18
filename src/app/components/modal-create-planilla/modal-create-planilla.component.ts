import { ArmasService } from '../../services/armas/armas.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, FormControl, FormControlDirective } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VehiculosService } from '../../services/vehiculos/vehiculos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanillasService } from '../../services/planillas/planillas.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-modal-create-planilla',
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
  templateUrl: './modal-create-planilla.component.html',
  styleUrl: './modal-create-planilla.component.scss',
})
export class ModalCreatePlanillaComponent {
  planillaForm: FormGroup;
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

  constructor(private fb: FormBuilder,
    private planillaService: PlanillasService,
    private vehiculoService: VehiculosService,
    private armaService: ArmasService,
    private dialogRef: MatDialogRef<ModalCreatePlanillaComponent>,
    private snackBar: MatSnackBar,) {}

  ngOnInit(): void {
    this.planillaForm = this.fb.group({
      claseI: [false],
      agua: [false],
      claseIII: [false],
      claseV: [false],

      // Clase I Fields
      numEfectivoClaseI: [{ value: '', disabled: true }],
      cantidadDiasClaseI: [{ value: '', disabled: true }],
      calcularTraslado: [false], // Checkbox para calcular traslado
      tipoCombustible: [{ value: '', disabled: false }], // Selector de tipo de combustible
      vehiculo: [{ value: '', disabled: true }],

      // Agua Fields
      numEfectivoAgua: [{ value: '', disabled: true }],
      diasConDucha: [{ value: '', disabled: true }],
      diasSinDucha: [{ value: '', disabled: true }],
      calcularTrasladoAgua: [false], // Checkbox para calcular traslado
      tipoCombustibleAgua: [{ value: '', disabled: false }], // Selector de tipo de combustible
      vehiculoAgua: [{ value: '', disabled: true }],


      // Clase III Fields
      calcularKopManual: [false],
      kopTotal: [{ value: '', disabled: true }],
      distCarreteraComun: [{ value: '', disabled: false }],
      distCampoTraviesaComun: [{ value: '', disabled: false }],
      dividirRecorrido: [false],
      distCarreteraGrupo1: [{ value: '', disabled: false }],
      distCampoTraviesaGrupo1: [{ value: '', disabled: false }],
      kopGrupo1: [{ value: '', disabled: false }],
      kopGrupo2: [{ value: '', disabled: false }],
      distCarreteraGrupo2: [{ value: '', disabled: false }],
      distCampoTraviesaGrupo2: [{ value: '', disabled: false }],
      distCarretera: [{ value: '', disabled: false }],
      distAbastecimiento: [{ value: '', disabled: false }],
      distCampoTraviesa: [{ value: '', disabled: false }],
      tipoCombustibleIii: [{ value: '', disabled: false }],
      vehiculos: [{value:[], disabled: true}],

      // Clase V Fields
      situacionCombate: [{ value: '', disabled: true }],
      cantidadDiasClaseV: [{ value: '', disabled: true }],
      calcularTrasladoClaseV: [false], // Checkbox para calcular traslado
      tipoCombustibleClaseV: [{ value: '', disabled: false }],
      cantMunicionPorCaja: [{ value: '', disabled: false }],
      pesoCaja: [{ value: '', disabled: false }], // Selector de tipo de combustible
      vehiculoClaseV: [{ value: '', disabled: true }],
      arma: [[]],
    });
    this.toggleFieldsBasedOnSelection();
    this.getVehiculos();
    this.getArmas();
    this.getSituacionCombate();

  }

  public getVehiculos() {
    this.vehiculoService.getVehiculos().subscribe((response: any) => {
      console.log(response)
      this.vehiculosList = response;
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
        cantVehiculos: formValue.vehiculoClaseV?.capacidad
        ? Math.ceil((((formValue.numEfectivoClaseI + (formValue.numEfectivoClaseI * 0.1)) * formValue.cantidadDiasClaseI) * 1.4) / (formValue.vehiculo.capacidad * 1000))
        : null,
          vehiculo: formValue.vehiculo? formValue.vehiculo: null
      };
    }
    console.log(newPlanilla )
    return newPlanilla
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

  onSubmit(): void {
    this.planillaService.createPlanilla(this.buildPlanillaPayload())
      .subscribe({
        next: () => {
          this.snackBar.open('Planilla creada', 'OK', { duration: 5000 });
          this.planillaForm.reset();
          this.dialogRef.close('saved');
        },
        error: (message) => {
          this.snackBar.open(message, 'OK', { duration: 5000 });
        }
      });
  }
}
