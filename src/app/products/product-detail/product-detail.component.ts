import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgForOf,
    FormsModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  usuarioId: number = 0;
  rol: string = '';
  puedeEditar: boolean = false;
  mostrarFormulario: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.usuarioId = user?.id;
    this.rol = user?.rol;

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
          this.puedeEditar =
            this.usuarioId === data.id_usuario || this.rol === 'admin';
        },
        error: (err) => {
          console.error('Error al cargar el producto:', err);
        },
      });
    }
  }

  iniciarChat(): void {
    const de = this.usuarioId;
    const para = this.product?.id_usuario;
    const productoId = this.product?.id;

    if (!de || !para || !productoId) {
      alert('No se pudo identificar a los usuarios o al producto.');
      return;
    }

    if (de === para) {
      alert('No puedes chatear contigo mismo');
      return;
    }

    localStorage.setItem("receptor", para);
    localStorage.setItem("productoId", productoId);

    this.chatService.enviarMensaje({
      mensaje: '¡Hola! Estoy interesado en tu producto.',
      de,
      para,
      producto_id: productoId
    }).subscribe({
      next: (response) => {
        const chatId = response.chat_id;
        this.router.navigate(['/chat', chatId]);
      },
      error: (err) => {
        console.error('Error iniciando el chat', err);
      }
    });
  }

  confirmarEliminar() {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.router.navigate(['/']); // o a donde quieras redirigir
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
        }
      });
    }
  }

  guardarCambios() {
    this.productService.updateProduct(this.product.id, {
      nombre: this.product.nombre,
      precio: this.product.precio,
      categoria: this.product.categoria,
      descripcion: this.product.descripcion,
    }).subscribe({
      next: (res) => {
        alert('Producto actualizado correctamente');
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error('Error al actualizar el producto:', err);
      }
    });
  }
}
