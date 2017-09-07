import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthProvider} from "./auth-provider";


@Injectable()
export class ClientProvider {
  public $onSelected: EventEmitter<void> = new EventEmitter<void>();

  public $onDeSelected: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient,
              private auth: AuthProvider) {

  }

}
