import {Injectable} from '@angular/core';
import {ConfigService} from '../_shared/config.service';
import {Headers, Http, RequestOptions} from '@angular/http';
import {PercentualEstatico} from './percentual-estatico';
import {CadastroPercentualEstatico} from './cadastrar-percentual-estatico/cadastro-percentual-estatico';

@Injectable()
export class PercentualEstaticoService {
  private headers: Headers;
  disabled = true;
  validity = true;
  nome: string;
  codigo: number;
  percentual: number;
  dataInicio: any;
  dataAditamento: any;
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
  getAllPercentuaisEstaticos() {
    const url = this.config.myApi + '/rubricas/getAllStaticPercent';
    return this.http.get(url).map(res => res.json());
  }
  buscarPercentualEstatico(codigo: number)/*: Observable<Rubrica>*/ {
    const url = this.config.myApi + '/rubricas/getStaticPercent/' + codigo;
    return this.http.get(url).map(res => res.json());
  }
  apagarPercentualEstatico(codigo: number) {
    const url = this.config.myApi + '/rubricas/deleteStaticPercent/' + codigo;
    return this.http.delete(url).map(res => res.json());
  }
  salvarAlteracao(percentualestatico: PercentualEstatico) {
    const url = this.config.myApi + '/rubricas/alterarPercentualEstatico';
    const cadastroPercentualEstatico = new CadastroPercentualEstatico();
    cadastroPercentualEstatico.percentualEstatico = new PercentualEstatico();
    cadastroPercentualEstatico.percentualEstatico = percentualestatico;
    cadastroPercentualEstatico.percentualEstatico.dataInicio = this.encapsulaDatas(this.dataInicio).toISOString().split('T')[0];
    cadastroPercentualEstatico.percentualEstatico.dataAditamento = this.encapsulaDatas(this.dataAditamento).toISOString().split('T')[0];
    cadastroPercentualEstatico.currentUser = this.config.user.username;
    return this.http.put(url, cadastroPercentualEstatico).map(res => res.json());
  }
  cadastrarPercentualEstatico() {
    const cadastroPercentualEstatico = new CadastroPercentualEstatico();
    cadastroPercentualEstatico.percentualEstatico = new PercentualEstatico();
    cadastroPercentualEstatico.percentualEstatico.nome = this.nome;
    cadastroPercentualEstatico.percentualEstatico.codigoRubrica = this.codigo;
    cadastroPercentualEstatico.percentualEstatico.percentual = this.percentual;
    cadastroPercentualEstatico.percentualEstatico.dataInicio = this.encapsulaDatas(this.dataInicio).toISOString().split('T')[0];
    cadastroPercentualEstatico.percentualEstatico.dataFim = null;
    cadastroPercentualEstatico.percentualEstatico.dataAditamento = this.encapsulaDatas(this.dataAditamento).toISOString().split('T')[0];
    cadastroPercentualEstatico.currentUser = this.config.user.username;
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
