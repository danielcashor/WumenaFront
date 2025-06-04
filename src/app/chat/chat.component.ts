import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true, // Asegúrate de tener 'standalone: true' si es un componente standalone
  imports: [
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  receptorId: number = 0;
  productoId: number = 0;
  usuarioId: number = 0;
  mensaje: string = '';
  mensajes: any[] = [];
  chatId: number = 0;

  echo: Echo<any> | undefined;
  private chatChannel: any; // Para mantener la referencia al canal

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUser();
    if (usuario) {
      this.usuarioId = usuario.id;
    }
    this.receptorId = Number(localStorage.getItem("receptor"));
    this.productoId = Number(localStorage.getItem("productoId"));

    this.initEcho(); // Inicializa Echo
    console.log('DEBUG: ngOnInit completado. Iniciando chat...'); // <-- Nuevo log
    this.iniciarChat(); // Inicia el proceso de chat para obtener el chatId
  }

  ngOnDestroy(): void {
    if (this.chatChannel) {
      this.echo?.leaveChannel(this.chatChannel.name);
      console.log(`Dejando el canal: ${this.chatChannel.name}`);
    }
  }

  iniciarChat() {
    this.chatService.enviarMensaje({
      mensaje: '__iniciado__', // mensaje invisible solo para crear el chat
      de: this.usuarioId,
      para: this.receptorId,
      producto_id: this.productoId
    }).subscribe({
      next: (res) => {
        this.chatId = res.chat_id;
        this.cargarMensajes();
        // UNA VEZ QUE TENEMOS EL CHAT_ID, NOS UNIMOS AL CANAL PÚBLICO
        this.subscribeToChatChannel(); // <--- Llamada para suscribirse al canal
      },
      error: (err) => {
        console.error('Error iniciando el chat', err);
      }
    });
  }

  cargarMensajes() {
    if (!this.chatId) return;
    this.chatService.obtenerMensajes(this.chatId).subscribe({
      next: (mensajes) => {
        this.mensajes = mensajes.filter((m: any) => m.mensaje !== '__iniciado__');
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error cargando mensajes:', err);
      }
    });
  }

  enviarMensaje() {
    if (!this.mensaje.trim()) return;

    this.chatService.enviarMensaje({
      mensaje: this.mensaje,
      de: this.usuarioId,
      para: this.receptorId,
      producto_id: this.productoId
    }).subscribe({
      next: (res) => {
        this.mensajes.push(res.mensaje);
        this.mensaje = '';
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error al enviar mensaje:', err);
      }
    });
  }

  private initEcho() {
    (window as any).Pusher = Pusher;

    Pusher.logToConsole = true;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusher.key,
      cluster: environment.pusher.cluster,
      forceTLS: environment.pusher.forceTLS, // true en producción
      disableStats: true,
      // --- YA NO NECESITAS authEndpoint NI auth.headers PARA CANALES PÚBLICOS ---
    });
    console.log(this.echo);
    console.log('Echo inicializado con configuración de environment para canal público.');
    // --- NUEVO LOG: Estado de la conexión de Pusher ---
    this.echo.connector.pusher.connection.bind('state_change', (states: any) => {
      console.log('DEBUG: Pusher connection state:', states.current);
    });
  }

  private subscribeToChatChannel() {
    if (!this.echo || !this.chatId) {
        console.warn('WARN: Echo o chatId no disponibles para suscribirse al canal.');
        return;
    }

    const channelName = `chat.${this.chatId}`;
    console.log(`DEBUG: Intentando unirse al canal público: ${channelName}`);

    // --- ¡¡¡IMPORTANTE!!! ESTO ES SOLO PARA PRUEBAS Y REEMPLAZA EL .listen() DE ECHO TEMPORALMENTE ---
    // Asegúrate de que Pusher esté disponible globalmente, lo cual ya lo tienes con (window as any).Pusher = Pusher;
    // Accede a la instancia de Pusher que Echo ha inicializado (suele ser la primera)
    const pusherRawInstance = (window as any).Pusher.instances[0];

    if (!pusherRawInstance) {
        console.error('ERROR: No se encontró una instancia de Pusher.js. ¿Echo se inicializó correctamente?');
        return;
    }

    // Suscripción directa al canal usando la instancia de Pusher.js
    const directChannel = pusherRawInstance.subscribe(channelName);

    // Bindea el evento directamente
    directChannel.bind('test-event', (data: any) => { // Asegúrate de que 'test-event' coincide con tu backend
        console.log('--- EVENTO PUSHER.JS DIRECTO RECIBIDO ---');
        console.log('DEBUG: Datos crudos del mensaje con Pusher.js directo:', data);
        if (data.mensaje && data.mensaje.emisor_id !== this.usuarioId) {
            this.mensajes.push(data.mensaje);
            this.scrollToBottom();
        }
    });

    // Opcional: Log para confirmar la suscripción directa (debería coincidir con 'subscription_succeeded')
    directChannel.bind('pusher:subscription_succeeded', () => {
        console.log(`DEBUG: Pusher.js directo: Suscrito exitosamente al canal: ${channelName}`);
    });

    // Opcional: Log para errores de suscripción directa
    directChannel.bind('pusher:subscription_error', (status: any) => {
        console.error(`ERROR: Pusher.js directo: Error al suscribirse al canal ${channelName}:`, status);
    });

    // Deja el this.chatChannel de Echo para que sus logs de conexión sigan funcionando si quieres
    // Pero el listener ya no estará en esta instancia
    this.chatChannel = this.echo.channel(channelName); // Puedes comentarlo si solo quieres el test puro
}

  scrollToBottom() {
    setTimeout(() => {
      const messagesDiv = document.querySelector('.messages');
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }, 100);
  }
}