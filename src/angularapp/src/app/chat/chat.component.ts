import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AppChatService } from "./chat.service";
import { ClientModel } from "./../model/client.model";
import { ConnectedModel } from "./../model/connected.model";
import { DisconnectedModel } from "./../model/disconnected.model";
import { LoadedModel } from "./../model/loaded.model";
import { SendModel } from "./../model/send.model";
import { SentModel } from "./../model/sent.model";
import { LoginModel } from "./../model/login.model";
import { LoginedModel } from "./../model/logined.model";

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatCardModule,
      MatDividerModule
    ]
})
export class AppChatComponent implements OnDestroy {
    form = inject(FormBuilder).group({ connectionId: undefined, message: undefined, private: false });
    clients = new Array<ClientModel>();
    logineds = new Array<LoginedModel>();
    logined = new LoginedModel();
    username!: string;
    name!: string;
    lgin = new LoginModel();
    constructor(private readonly appChatService: AppChatService) {
      this.appChatService.start(this.name);
      this.appChatService.$connected?.subscribe((connected) => this.connected(connected));
      this.appChatService.$disconnected?.subscribe((disconnected) => this.disconnected(disconnected));
      this.appChatService.$loaded?.subscribe((loaded) => this.loaded(loaded));
      this.appChatService.$sent?.subscribe((sent) => this.sent(sent));
      this.appChatService.$logined?.subscribe((logined) => this.Logined(logined));
    }

    ngOnDestroy(): void {
        this.appChatService.$connected?.unsubscribe();
        this.appChatService.$disconnected?.unsubscribe();
        this.appChatService.$loaded?.unsubscribe();
        this.appChatService.$sent?.unsubscribe();
        this.appChatService.$logined?.unsubscribe();
    }
    start() {
      this.appChatService.start(this.name);
      this.appChatService.$connected?.subscribe((connected) => this.connected(connected));
      this.appChatService.$disconnected?.subscribe((disconnected) => this.disconnected(disconnected));
      this.appChatService.$loaded?.subscribe((loaded) => this.loaded(loaded));
      this.appChatService.$sent?.subscribe((sent) => this.sent(sent));
    }
    joinChat() {
    
    }
    send = () => this.appChatService.send(this.form.value as SendModel).then(() => this.form.controls.message.reset());

    private message(message: string, css: string) {
        const messages = document.getElementById("messages") as HTMLElement;
        messages.innerHTML += `<li class="${css}">${message}</li>`;
        messages.scrollTop = messages.scrollHeight;
    }

    private htmlName = (name: string) => `<span class="name">${name}</span>`;

    private connected(connected: ConnectedModel) {
        this.clients.push(connected.client);
        this.message(`${this.htmlName(connected.client.name)} connected.`, "alert-success");
    }

    private disconnected(disconnected: DisconnectedModel) {
        this.logineds = this.logineds.filter(l => l.connectionId !== disconnected.logined.connectionId);
        //this.message(`${this.htmlName(disconnected.client.name)} disconnected.`, "alert-danger");
    }

    private loaded = (loaded: LoadedModel) => this.clients = loaded.clients;

    private sent(sent: SentModel) {
        const targetName = sent.target ? `to ${this.htmlName(sent.target.name)}` : "";
        const css = sent.target?.name === this.name ? "alert-primary" : "alert-default";
        const message = `${this.htmlName(sent.source.name)} ${targetName}: ${sent.message}`;
        this.message(message, css);
    }
    private Logined(log: LoginedModel) {
      this.logineds.push(log);
      this.logined = log;
    }
    login() {
      this.lgin.name = this.name;
      this.lgin.username = this.username;
      if (this.lgin.name.length >= 0 && this.lgin.username.length >= 0) {
        this.appChatService.login(this.lgin);
        this.lgin.name = '';
        this.lgin.username = '';
      }      
    }
}
