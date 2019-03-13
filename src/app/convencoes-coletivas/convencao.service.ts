import {Injectable} from '@angular/core';
import {ConfigService} from '../_shared/config.service';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Convencao} from './convencao';
import {CadastroConvencao} from './cadastrar-convecao/cadastro-convencao';

@Injectable()
export class ConvencaoService {
  private config: ConfigService;
  validity = true;
  nome: string;
  sigla: string;
  dataBase: Date;
  descricao: string;
  private http: Http;

  constructor(config: ConfigService, http: Http) {
    this.config = config;
    this.http = http;
  }

  getValidity() {
    return this.validity;
  }

  setValdity(value: boolean) {
    this.validity = value;
  }

  getConvencoes(codigo: number) {
    const url = this.config.myApi + '/convencao/getConvencoesDoContrato=' + codigo;
    return this.http.get(url).map(res => res.json());
  }

  getAll() {
    const url = this.config.myApi + '/convencao/getAll';
    return this.http.get(url).map(res => res.json());
  }

  cadastrarConvencao() {
    const cadastroConvencao = new CadastroConvencao();
    cadastroConvencao.convencao = new Convencao();
    cadastroConvencao.convencao.nome = this.nome;
    cadastroConvencao.convencao.sigla = this.sigla;
    cadastroConvencao.convencao.dataBase = this.encapsulaDatas(this.dataBase).toISOString().split('T')[0];
    cadastroConvencao.convencao.descricao = this.descricao;
    cadastroConvencao.currentUser = this.config.user.username;
    const url = this.config.myApi + '/convencao/criarConvencao';
    const data = cadastroConvencao;
    const headers = new Headers({'Content-type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(url, data, options).map(res => res.json());
  }

  buscarConvencao(id: number) {
    const url = this.config.myApi + '/convencao/getConvencao=' + id;
    return this.http.get(url).map(res => res.json());
  }

  protected encapsulaDatas(value: any): Date {
    const a = value.split('/');
    const dia = Number(a[0]);
    const mes = Number(a[1]) - 1;
    const ano = Number(a[2]);
    return new Date(ano, mes, dia);
  }
}
