import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://wumena-1.onrender.com/api/usuarios';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post('https://wumena-1.onrender.com/api/login', credentials);
  }

  getProductosDeUsuario(idUsuario: string): Observable<any[]> {
    return this.http.get<any[]>(`https://wumena-1.onrender.com/api/productos/filtrarUser/${idUsuario}`);
  }

  actualizarUsuario(idUsuario: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idUsuario}`, datos);
  }
  getDirecciones(userId: number) {
    return this.http.get<any[]>(`https://wumena-1.onrender.com/api/direcciones/filtrar/${userId}`);
  }

  addDireccion(data: any) {
    return this.http.post<any>(`https://wumena-1.onrender.com/api/direcciones/crear`, data);
  }

}
