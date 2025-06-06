import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.value.email,
        clave: this.loginForm.value.password
      };

      this.userService.login(formData).subscribe({
        next: (res) => {
          console.log('Respuesta del login:', res);

          const user = res.usuario || res.user || res;

          if (user && user.nombre) {
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['/']);
          } else {
            alert('Error: usuario no válido');
          }
        },
        error: (err) => {
          console.error('Error en el login', err);
          alert('Credenciales inválidas');
        }
      });
    }
  }
}
