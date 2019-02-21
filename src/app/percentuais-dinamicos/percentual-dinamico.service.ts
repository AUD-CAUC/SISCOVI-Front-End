import {Injectable} from '@angular/core';
import {ConfigService} from '../_shared/config.service';
import {Headers, Http, RequestOptions} from '@angular/http';
import {CadastroPercentualEstatico} from '../percentuais-estaticos/cadastrar-percentual-estatico/cadastro-percentual-estatico';
import {PercentualEstatico} from '../percentuais-estaticos/percentual-estatico';
import {PercentualDinamico} from './percentual-dinamico';
import {CadastroPercentualDinamico} from './cadastrar-percentual-dinamico/cadastro-percentual-dinamico';

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

  cadastrarPercentualEstatico() {
    const cadastroPercentualDinamico = new CadastroPercentualDinamico();
    cadastroPercentualDinamico.percentual = this.percentual;
    cadastroPercentualDinamico.currentUser = this.config.user.username;
    const url = this.config.myApi + '/rubricas/cadastrarPercentualDinamico';
    console.log(cadastroPercentualDinamico)
    const data = cadastroPercentualDinamico;
    const headers = new Headers({'Content-type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(url, data, options).map(res => res.json());
  }
}
