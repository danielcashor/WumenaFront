import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://wumena-1.onrender.com/api/productos';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<any[]>(this.apiUrl);
  }
  getProductById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  createProduct(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  updateProduct(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getProductosPorCategoria(categoria: string) {
    return this.http.get<any[]>(`${this.apiUrl}/filtrar/${categoria}`);
  }
  searchProducts(term: string): Observable<any[]> {
    // Asume que en el back tienes: Route::get('/productos/buscar', ...)
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, {
      params: { q: term }
    });
  }

}
