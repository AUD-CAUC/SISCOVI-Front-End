import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {ConfigService} from '../_shared/config.service';
import {Observable} from 'rxjs/Observable';
import {RescisaoCalcular} from './rescisao-calcular';
import {RescisaoCalculosPendentes} from './rescisoes-pendentes/rescisao-calculos-pendentes';
import {ListaCalculosPendentes} from './rescisoes-pendentes/lista-calculos-pendentes';
import {User} from '../users/user';

@Injectable()
export class RescisaoService {
    constructor(private http: Http, private config: ConfigService) {}
    getFuncionariosRescisao(codigoContrato: number, tipoRestituicao: string) {
        const url = this.config.myApi + '/rescisao/getTerceirizadosRescisao=' + codigoContrato + '/' + tipoRestituicao;
        return this.http.get(url).map(res => res.json());
    }
    calculaRescisaoTerceirizados(rescisaoCalcular: RescisaoCalcular) {
        const url = this.config.myApi + '/rescisao/calculaRescisaoTerceirizados';
        const data = {
          'codTerceirizadoContrato': rescisaoCalcular.getCodTerceirizadoContrato(),
          'tipoRestituicao': rescisaoCalcular.getTipoRestituicao(),
          'tipoRescisao': rescisaoCalcular.getTipoRescisao(),
          'dataDesligamento': rescisaoCalcular.getDataDesligamento(),
          'inicioFeriasIntegrais': rescisaoCalcular.getInicioFeriasIntegrais(),
          'fimFeriasIntegrais': rescisaoCalcular.getFimFeriasIntegrais(),
          'inicioFeriasProporcionais': rescisaoCalcular.getInicioFeriasProporcionais(),
          'valorFeriasVencidasMovimentado': rescisaoCalcular.getValorFeriasVencidasMovimentado(),
          'valorFeriasProporcionaisMovimentado': rescisaoCalcular.getValorFeriasProporcionaisMovimentado(),
          'valorDecimoTerceiroMovimentado': rescisaoCalcular.getValorDecimoTerceiroMovimentado()
        };
        return this.http.post(url, data).map(res => res.json());
    }
    registrarCalculoRescisao(rescisaoCalcular: RescisaoCalcular[]) {
      const url = this.config.myApi + '/rescisao/registrarCalculoRescisao';
      const data = [];
      rescisaoCalcular.forEach(rescisao => {
        let tipoRestituicao = '';
        if (rescisao.getTipoRestituicao() === 'MOVIMENTACAO') {
          tipoRestituicao = 'MOVIMENTAÇÃO';
        }else if (rescisao.getTipoRestituicao() === 'RESGATE') {
          tipoRestituicao = rescisao.getTipoRestituicao();
        }
        const val = {
          'codTerceirizadoContrato': rescisao.getCodTerceirizadoContrato(),
          'tipoRestituicao': tipoRestituicao,
          'tipoRescisao': rescisao.getTipoRescisao(),
          'dataDesligamento': rescisao.getDataDesligamento(),
          'inicioFeriasIntegrais': rescisao.getInicioFeriasIntegrais(),
          'fimFeriasIntegrais': rescisao.getFimFeriasIntegrais(),
          'inicioFeriasProporcionais': rescisao.getInicioFeriasProporcionais(),
          'fimFeriasProporcionais': rescisao.getDataDesligamento(),
          'inicioContagemDecimoTerceiro': rescisao.getInicioContagemDecimoTerceiro(),
          'valorFeriasVencidasMovimentado': rescisao.getValorFeriasVencidasMovimentado(),
          'valorFeriasProporcionaisMovimentado': rescisao.getValorFeriasProporcionaisMovimentado(),
          'valorDecimoTerceiroMovimentado': rescisao.getValorDecimoTerceiroMovimentado(),
          'totalDecimoTerceiro': rescisao.getTotalDecimoTerceiro(),
          'totalIncidenciaDecimoTerceiro': rescisao.getTotalIncidenciaDecimoTerceiro(),
          'totalMultaFgtsDecimoTerceiro': rescisao.getTotalMultaFgtsDecimoTerceiro(),
          'totalFeriasVencidas': rescisao.getTotalFeriasVencidas(),
          'totalTercoConstitucionalvencido': rescisao.getTotalTercoConstitucionalVencido(),
          'totalIncidenciaFeriasVencidas': rescisao.getTotalIncidenciaFeriasVencidas(),
          'totalIncidenciaTercoVencido': rescisao.getTotalIncidenciaTercoVencido(),
          'totalMultaFgtsFeriasVencidas': rescisao.getTotalMultaFgtsFeriasVencidas(),
          'totalMultaFgtsTercoVencido': rescisao.getTotalMultaFgtsTercoVencido(),
          'totalFeriasProporcionais': rescisao.getTotalFeriasProporcionais(),
          'totalTercoProporcional': rescisao.getTotalTercoProporcional(),
          'totalIncidenciaFeriasProporcionais': rescisao.getTotalIncidenciaFeriasProporcionais(),
          'totalIncidenciaTercoProporcional': rescisao.getTotalIncidenciaTercoProporcional(),
          'totalMultaFgtsFeriasProporcionais': rescisao.getTotalMultaFgtsFeriasProporcionais(),
          'totalMultaFgtsTercoProporcional': rescisao.getTotalMultaFgtsTercoProporcional(),
          'totalMultaFgtsSalario': rescisao.getTotalMultaFgtsSalario(),
          'username': this.config.user.username
        };
        data.push(val);
      });
      const headers = new Headers({'Content-type': 'application/json'});
      const requestOptions = new RequestOptions({headers: headers});
      return this.http.post(url, data, requestOptions).map(res => res.json());
    }
    getRestituicoesRescisao(codigoContrato: number) {
      const url = this.config.myApi + '/rescisao/getRestituicoesRescisao/' + codigoContrato + '/' + this.config.user.id;
      return this.http.get(url).map(res => res.json());
    }
    getCalculosPendentes() {
      const url = this.config.myApi + '/rescisao' + '/getCalculosPendentes' + '/' + this.config.user.id;
      return this.http.get(url).map(res => res.json());
    }
    getCalculosPendentesNegados() {
      const url = this.config.myApi + '/rescisao' + '/getCalculosPendentesNegados' + '/' + this.config.user.id;
      return this.http.get(url).map(res => res.json());
    }
    getCalculosPendentesExecucao() {
      const url = this.config.myApi + '/rescisao' + '/getCalculosPendentesExecucao/' + this.config.user.id;
      return this.http.get(url).map(res => res.json());
    }
    getCalculosNaoPendentesNegados() {
      const url = this.config.myApi + '/rescisao' + '/getCalculosNaoPendentesNegados/' + this.config.user.id;
      return this.http.get(url).map(res => res.json());
    }
    salvarRescisoesAvaliadasLista(lista: ListaCalculosPendentes[]) {
      const url = this.config.myApi + '/rescisao/salvarRescisoesAvaliadas';
      const data = [];
      lista.forEach(item => {
        const object = {
          codContrato: item.codigo,
          user: this.config.user,
          calculosAvaliados: item.calculos
        };
        data.push(object);
      });
      return this.http.put(url, data).map(res => res.json());
    }
    salvarExecucaoRescisao(lista: ListaCalculosPendentes[]) {
      const url = this.config.myApi + '/rescisao/salvarExecucaoRescisao';
      const data = [];
      lista.forEach(item => {
        const object = {
          codContrato: item.codigo,
          user: this.config.user,
          calculosAvaliados: item.calculos
        };
        data.push(object);
      });
      return this.http.put(url, data).map(res => res.json());
    }
    protected encapsulaDatas(value: any): Date {
      const a = value.split('/');
      const dia = Number(a[0]);
      const mes = Number(a[1]) - 1;
      const ano = Number(a[2]);
      return new Date(ano, mes, dia);
    }
}
