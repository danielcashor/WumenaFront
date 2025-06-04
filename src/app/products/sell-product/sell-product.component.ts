import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sell-product.component.html',
  styleUrls: ['./sell-product.component.css']
})
export class SellProductComponent {
  sellForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {
    this.sellForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [null] // solo para previsualización
    });
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.sellForm.patchValue({ image: file });
      this.sellForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    // Validaciones
    if (this.sellForm.invalid) {
      const errors: string[] = [];
      const c = this.sellForm.controls;
      if (c['name'].invalid)        errors.push('• Nombre del producto');
      if (c['description'].invalid) errors.push('• Descripción');
      if (c['category'].invalid)    errors.push('• Categoría');
      if (c['price'].invalid)       errors.push('• Precio');
      alert(`Por favor completa:\n\n${errors.join('\n')}`);
      return;
    }

    const user = this.authService.getUser();
    if (!user) {
      alert('Debes iniciar sesión para publicar un producto.');
      return;
    }

    // Preparamos el FormData
    const formData = new FormData();
    formData.append('id_usuario',    user.id.toString());
    formData.append('nombre',        this.sellForm.value.name);
    formData.append('descripcion',   this.sellForm.value.description);
    formData.append('categoria',     this.sellForm.value.category);
    formData.append('precio',        this.sellForm.value.price.toString());
    const file = this.sellForm.get('image')!.value;
    if (file) {
      formData.append('imagen', file, file.name);
    }

    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('✅ Producto publicado con éxito');
        this.sellForm.reset();
        this.imagePreview = null;
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Error al publicar producto:', err);
        alert('❌ Ha ocurrido un error al publicar el producto.');
      }
    });
  }
}
