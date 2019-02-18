import { Injectable } from '@angular/core';
import { ConfigService } from '../_shared/config.service';
import {Http, Headers, RequestOptions} from '@angular/http';
import {PercentualEstatico} from './percentual-estatico';
import {CadastroPercentualEstatico} from './cadastrar-percentual-estatico/cadastro-percentual-estatico';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PercentualEstaticoService {
  private headers: Headers;
  disabled = true;
  validity = true;
  nome: string;
  codigo: number;
  percentual: number;
  dataInicio: String;
  dataAditamento: String;
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
  getPercentuaisEstaticos() {
    const url = this.config.myApi + '/rubricas/getStaticPercent';
    return this.http.get(url).map(res => res.json());
  }
  cadastrarPercentualEstatico() {
    const cadastroPercentualEstatico = new CadastroPercentualEstatico();
    cadastroPercentualEstatico.percentualEstatico = new PercentualEstatico();
    cadastroPercentualEstatico.percentualEstatico.nome = this.nome;
    cadastroPercentualEstatico.percentualEstatico.codigo = this.codigo;
    cadastroPercentualEstatico.percentualEstatico.percentual = this.percentual;
    cadastroPercentualEstatico.percentualEstatico.dataInicio = this.encapsulaDatas(this.dataInicio).toISOString().split('T')[0];
    cadastroPercentualEstatico.percentualEstatico.dataFim = null;
    cadastroPercentualEstatico.percentualEstatico.dataAditamento = this.encapsulaDatas(this.dataAditamento).toISOString().split('T')[0];
    cadastroPercentualEstatico.currentUser = this.config.user.username;
    console.log(cadastroPercentualEstatico);
    const url = this.config.myApi + '/rubricas/cadastrarPercentualEstatico';
    const data = cadastroPercentualEstatico;
    const headers = new Headers({'Content-type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(url, data, options).map(res => res.json());
  }
  protected encapsulaDatas(value: any): Date {
    const a = value.split('/');
    const dia = Number(a[0]);
    const mes = Number(a[1]) - 1;
    const ano = Number(a[2]);
    return new Date(ano, mes, dia);
  }
}
