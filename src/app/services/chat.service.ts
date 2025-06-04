import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'https://wumena-1.onrender.com/api'; // Ajusta si tu API está en otro puerto

  constructor(private http: HttpClient) {}

  enviarMensaje(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat/enviar`, data);
  }

  obtenerMensajes(chatId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/${chatId}/mensajes`);
  }
  getChatsUsuario(usuarioId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/chat/${usuarioId}`);
  }

}
