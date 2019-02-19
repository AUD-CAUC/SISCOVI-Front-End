import {Injectable} from '@angular/core';
import {ConfigService} from '../_shared/config.service';
import {Headers, Http} from '@angular/http';

@Injectable()
export class PercentualDinamicoService {
  private headers: Headers;
  disabled = true;
  validity = true;
  percentual: number;
  constructor(private config: ConfigService, private http: Http) {
    this.headers = new Headers(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    );
  }

  getValidity() {
    return this.validity;
  }

  setValdity(value: boolean) {
    this.validity = value;
  }

  getPercentuaisDinamicos() {
    const url = this.config.myApi + '/rubricas/getDinamicPercent';
    return this.http.get(url).map(res => res.json());
  }
}
