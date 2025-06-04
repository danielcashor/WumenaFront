import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ChatComponent } from "../chat/chat.component";

@Component({
  selector: 'app-my-chats',
  templateUrl: './mis-chats.component.html',
  styleUrl: './mis-chats.component.css',
  imports: [ChatComponent]
})
export class MisChatsComponent implements OnInit {
  chats: any[] = [];
  usuarioId: number = 0;
  receptorId: number = 0;
  productoId: number = 0;
  mostrarChat: boolean = false;

  constructor(private chatService: ChatService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.usuarioId = user.id;

      this.chatService.getChatsUsuario(this.usuarioId).subscribe({
        next: (res) => {
          this.chats = res;
        },
        error: (err) => {
          console.error('Error al cargar los chats del usuario:', err);
        }
      });
    }
  }

  abrirChat(chat: any) {
    this.productoId = chat.producto_id;
    this.receptorId = this.usuarioId === chat.usuario_1_id ? chat.usuario_2_id : chat.usuario_1_id;

    localStorage.setItem("productoId", this.productoId.toString());
    localStorage.setItem("receptor", this.receptorId.toString());

    // Reinicia el componente <app-chat> forzando ngIf
    this.mostrarChat = false;
    setTimeout(() => {
      this.mostrarChat = true;
    }, 0);
  }
}
