import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-by-category',
  templateUrl: './categoria.component.html',
  imports: [
    RouterLink,
  ],
  styleUrls: ['./categoria.component.css']
})
export class ProductsByCategoryComponent implements OnInit {
  categoria: string = '';
  productos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoria = params.get('categoria');
      if (categoria) {
        this.categoria = categoria;
        this.cargarProductosPorCategoria(categoria);
      }
    });
  }

  cargarProductosPorCategoria(categoria: string): void {
    this.productService.getProductosPorCategoria(categoria).subscribe({
      next: (data) => this.productos = data,
      error: (err) => {
        console.error(err);
        this.productos = []; // Limpia si hay error
      }
    });
  }
}
