import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recentProducts: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.recentProducts = data;
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }
}
