import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ConnectedModel } from "./../model/connected.model";
import { DisconnectedModel } from "./../model/disconnected.model";
import { LoadedModel } from "./../model/loaded.model";
import { SendModel } from "./../model/send.model";
import { LoginModel } from "./../model/login.model";
import { LoginedModel } from "./../model/logined.model";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { SentModel } from "./../model/sent.model";

@Injectable({ providedIn: "root" })
export class AppChatService {
    $connected = new Subject<ConnectedModel>();
    $disconnected = new Subject<DisconnectedModel>();
    $loaded = new Subject<LoadedModel>();
    $sent = new Subject<SentModel>();
    $logined = new Subject<LoginedModel>();

    private connection!: HubConnection;

    start(name: string) {
      this.connection = new HubConnectionBuilder().withUrl(`https://localhost:32776/chathub?name=${name}`, {
        headers: { 'Access-Control-Allow-Origin': '*' }}).withAutomaticReconnect().build();
        this.connection.on("Connected", (connected: ConnectedModel) => this.$connected.next(connected));
        this.connection.on("Disconnected", (disconnected: DisconnectedModel) => this.$disconnected.next(disconnected));
        this.connection.on("Loaded", (loaded: LoadedModel) => this.$loaded.next(loaded));
        this.connection.on("Sent", (sent: SentModel) => this.$sent.next(sent));
        this.connection.on("Logined", (logined: LoginedModel) => this.$logined.next(logined));
        this.connection.start();
    }

    send = (send: SendModel) => this.connection.invoke("Send", send);
    login = (login: LoginModel) => this.connection.invoke("Login", login);
}
