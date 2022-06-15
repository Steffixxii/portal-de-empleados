import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-empleados',
  templateUrl: './create-empleados.component.html',
  styleUrls: ['./create-empleados.component.scss']
})
export class CreateEmpleadosComponent implements OnInit {
createEmpleado: FormGroup;
submitted = false;
loading = false;
id: string | null;
titulo = 'Agregar Empleado';

  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr:ToastrService,
              private aRoute: ActivatedRoute) { 
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      documento: ['', Validators.required],
      departamento: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEditarEmpleado(){
    this.submitted = true;

    if (this.createEmpleado.invalid){
      return;
    }

    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }
  }

  agregarEmpleado(){
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellidos: this.createEmpleado.value.apellidos,
      documento: this.createEmpleado.value.documento,
      departamento: this.createEmpleado.value.departamento,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.agregarEmpleado(empleado).then(() =>{
      this.toastr.success('El empleado ha sido registrado con éxito!', 'Empleado Registrado'), {
        positionClass: 'toast-bottom-right'
      };
      this.loading = false;
      this.router.navigate(['/list-empleados'])
    }).catch(error =>{
      console.log(error);
      this.loading = false;
    })
  }

  editarEmpleado(id: string) {
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellidos: this.createEmpleado.value.apellidos,
      documento: this.createEmpleado.value.documento,
      departamento: this.createEmpleado.value.departamento,
      fechaActualizacion: new Date()
    }

    this.loading = true;

    this._empleadoService.actualizarEmpleado(id, empleado).then(() => {
      this.loading = false;
      this.toastr.info('El empleado ha sido modificado con éxito', 'Empleado modificado', {
        positionClass: 'toast-botom-right'
      });
      this.router.navigate(['/list-empleados']);
    })
  }

  esEditar() {
    if(this.id !== null) {
      this.loading = true;
      this.titulo = 'Editar Empleado';
      this._empleadoService.getEmpleado(this.id).subscribe(data => {
        this.loading = false;
        console.log(data.payload.data()['nombre']);
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellidos: data.payload.data()['apellidos'],
          documento: data.payload.data()['documento'],
          departamento: data.payload.data()['departamento'],
        })
      })
    }
  }
}
