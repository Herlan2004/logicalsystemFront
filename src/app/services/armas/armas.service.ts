import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArmasService {

  constructor(
    private http: HttpClient
  ) { }
public getArmas() {
  return this.http.get(environment.apiUrl.concat('/arma'));
}
public getSituacionCombate() {
  return this.http.get(environment.apiUrl.concat('/situacion-combate'));
}

}
