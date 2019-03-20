import {Injectable} from '@angular/core';
import {ConfigService} from '../_shared/config.service';
import {Headers, Http, RequestOptions} from '@angular/http';
import {CadastroPercentualDinamico} from './cadastrar-percentual-dinamico/cadastro-percentual-dinamico';
import {Observable} from 'rxjs/Observable';
import {Rubrica} from '../rubricas/rubrica';

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
  /*Funcao que traz TODOS os percentuais dinamicos do backend*/
  getPercentuaisDinamicos() {
    const url = this.config.myApi + '/rubricas/getDinamicPercent';
    return this.http.get(url).map(res => res.json());
  }
  buscarPercentuaisDinamicos(codigo: number) {
    const url = this.config.myApi + '/rubricas/getDinamicPercent/' + codigo;
    return this.http.get(url).map(res => res.json());
  }
  apagarPercentuaisDinamicos(codigo: number) {
    const url = this.config.myApi + '/rubricas/deleteDinamicPercent/' + codigo;
    return this.http.delete(url).map(res => res.json());
  }
  /*adiciona um novo percentual dinamico*/
  cadastrarPercentualDinamico() {
    const cadastroPercentualDinamico = new CadastroPercentualDinamico();
    cadastroPercentualDinamico.percentual = this.percentual;
    cadastroPercentualDinamico.currentUser = this.config.user.username;
    const url = this.config.myApi + '/rubricas/cadastrarPercentualDinamico';
    // console.log(cadastroPercentualDinamico)
    const data = cadastroPercentualDinamico;
    const headers = new Headers({'Content-type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(url, data, options).map(res => res.json());
  }
}
