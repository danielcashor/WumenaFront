import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: [''],
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      confirmClave: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('clave')?.value === group.get('confirmClave')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        ...this.registerForm.value,
        valoracion: 5.0,
        rol: 'usuario'
      };
      delete formData.confirmClave;

      this.userService.register(formData).subscribe({
        next: res => {
          console.log('Usuario registrado:', res);
          alert('Registro exitoso');
        },
        error: err => {
          console.error('Error al registrar usuario:', err);
          alert('Error en el registro');
        }
      });
    }
  }
}
