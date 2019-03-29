import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from '../_shared/config.service';
import {ResidualCalcular} from './residual-calcular';
import {ListaCalculosPendentes} from './residuais-pendentes/lista-calculos-pendentes';



@Injectable()
export class ResidualService {

  constructor(private http: Http, private config: ConfigService) {
  }

  getFuncionariosResidualFerias(codigoContrato: number) {
    const url = this.config.myApi + '/saldo-residual/getSaldoResidualFerias/' + codigoContrato;
    return this.http.get(url).map(res => res.json());
  }

  getFuncionariosResidualDecimoTerceiro(codigoContrato: number) {
    const url = this.config.myApi + '/saldo-residual/getSaldoResidualDecimoTerceiro/' + codigoContrato;
    return this.http.get(url).map(res => res.json());
  }

  getCalculosPendentes() {
    const url = this.config.myApi + '/ferias' + '/getCalculosPendentes' + '/' + this.config.user.id;
    return this.http.get(url).map(res => res.json());
  }

  getCalculosPendentesNegados() {
    const url = this.config.myApi + '/ferias' + '/getCalculosPendentesNegados' + '/' + this.config.user.id;
    return this.http.get(url).map(res => res.json());
  }

  getCalculosPendentesExecucao() {
    const url = this.config.myApi + '/ferias' + '/getCalculosPendentesExecucao/' + this.config.user.id;
    return this.http.get(url).map(res => res.json());
  }

  getCalculosNaoPendentesNegados() {
    const url = this.config.myApi + '/ferias' + '/getCalculosNaoPendentesNegados/' + this.config.user.id;
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
