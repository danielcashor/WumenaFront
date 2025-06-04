import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  productos: any[] = [];
  direccionForm: FormGroup;
  direcciones: any[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, public authService: AuthService) {
    const user = this.authService.getUser();

    this.profileForm = this.fb.group({
      nombre: [user?.nombre, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]]
    });
    this.direccionForm = this.fb.group({
      nombreCalle: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      codPostal: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userService.getProductosDeUsuario(user.id).subscribe({
        next: (res) => {
          this.productos = res;
          console.log(this.productos);
        },
        error: () => {
          alert('Error al cargar productos');
        }
      });
    }
    this.userService.getDirecciones(user.id).subscribe({
      next: (res) => {
        this.direcciones = res;
      },
      error: () => {
        console.error('Error al cargar direcciones');
      }
    });
  }

  onSave(): void {
    const updatedData = this.profileForm.value;
    const user = this.authService.getUser();

    this.userService.actualizarUsuario(user.id, updatedData).subscribe({
      next: (res) => {
        alert('Perfil actualizado correctamente');
        localStorage.setItem('user', JSON.stringify(res));
      },
      error: () => {
        alert('Error al actualizar perfil');
      }
    });
  }
  onAddDireccion(): void {
    const user = this.authService.getUser();

    if (user) {
      const nuevaDireccion = {
        ...this.direccionForm.value,
        id_usuario: user.id
      };

      this.userService.addDireccion(nuevaDireccion).subscribe({
        next: (res) => {
          this.direcciones.push(res);
          this.direccionForm.reset();
          alert('Dirección guardada correctamente');
        },
        error: (err) => {
          console.error(err);
          alert('Error al guardar dirección');
        }
      });
    }
  }
}
