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
//import { SendModel } from "./../model/send.model";
import { LoginModel } from "./../model/login.model";
import { LoginedModel } from "./../model/logined.model";
import { PostModel } from "../model/post.model";
import { MessageModel } from "../model/message.model";
import { PulsarModel } from "../model/pulsar.model";
import { PostedModel } from "../model/posted.model";
import { MessagedModel } from "../model/messaged.model";

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
    form = inject(FormBuilder).group({ name: undefined, username: undefined });
    post_form = inject(FormBuilder).group({ username: undefined, message: undefined });
    message_form = inject(FormBuilder).group({ username: undefined, message: undefined });
    posts = new Array<PostModel>();
    messages = new Array<MessageModel>();
    pulsar = new Array<string>();
    clients = new Array<ClientModel>();
    logineds = new Array<LoginedModel>();
    logined = new LoginedModel();
  constructor(private readonly appChatService: AppChatService) {
      this.appChatService.start();
      this.appChatService.$connected?.subscribe((connected) => this.connected(connected));
      this.appChatService.$disconnected?.subscribe((disconnected) => this.disconnected(disconnected));
      this.appChatService.$loaded?.subscribe((loaded) => this.loaded(loaded));
      this.appChatService.$logined?.subscribe((logined) => this.Logined(logined));
      this.appChatService.$pulsar?.subscribe((pulsar) => this.Pulsar(pulsar));
      this.appChatService.$posted?.subscribe((posted) => this.Posted(posted));
      this.appChatService.$messaged?.subscribe((messaged) => this.Messaged(messaged));
    }

    ngOnDestroy(): void {
        this.appChatService.$connected?.unsubscribe();
        this.appChatService.$disconnected?.unsubscribe();
        this.appChatService.$loaded?.unsubscribe();
        this.appChatService.$sent?.unsubscribe();
        this.appChatService.$logined?.unsubscribe();
        this.appChatService.$pulsar?.unsubscribe();
        this.appChatService.$posted?.unsubscribe();
        this.appChatService.$messaged?.unsubscribe();
    }
    start() {
      this.appChatService.start();
      this.appChatService.$connected?.subscribe((connected) => this.connected(connected));
      this.appChatService.$disconnected?.subscribe((disconnected) => this.disconnected(disconnected));
      this.appChatService.$loaded?.subscribe((loaded) => this.loaded(loaded));
    }
    
    login = () => this.appChatService.login(this.form.value as LoginModel);
    //message = () => this.appChatService.message(this.message_form.value as MessageModel);
    ///send = () => this.appChatService.send(this.form.value as SendModel).then(() => this.form.controls.message.reset());
    onPostSubmit() {
      const post = this.post_form.value as PostModel;
      post.timestamp = new Date().toString();
      this.appChatService.post(post).then(() => this.post_form.controls.message.reset());
    }
    onMessageSubmit() {
      const msg = this.message_form.value as MessageModel;
      msg.timestamp = new Date().toString();
      this.appChatService.message(msg).then(() => this.message_form.controls.message.reset());
    }
    private htmlName = (name: string) => `<span class="name">${name}</span>`;

    private connected(connected: ConnectedModel) {
        this.logineds.push(connected.logined);
        //this.message(`${this.htmlName(connected.client.name)} connected.`, "alert-success");
    }

    private disconnected(disconnected: DisconnectedModel) {
        this.logineds = this.logineds.filter(l => l.connectionId !== disconnected.logined.connectionId);
        //this.message(`${this.htmlName(disconnected.client.name)} disconnected.`, "alert-danger");
    }

    private loaded = (loaded: LoadedModel) => this.clients = loaded.clients;

    private Logined(log: LoginedModel) {
      this.logineds.push(log);
      this.logined = log;
    }
    private Posted(post: PostedModel) {
      this.posts.push(post.message);
    }
    private Messaged(msg: MessagedModel) {
      this.messages.push(msg.message);
    }
    private Pulsar(pulsar: PulsarModel) {
      this.pulsar.push(pulsar.message);
    }
}
