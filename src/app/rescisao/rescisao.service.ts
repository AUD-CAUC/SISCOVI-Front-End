import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from '../_shared/config.service';
import {TerceirizadoRescisao} from './terceirizado-rescisao';
import {RescisaoPendente} from '../decimo_terceiro/decimo-terceiro-pendente/rescisao-pendente';
import {RescisaoCalcular} from './rescisao-calcular';

@Injectable()
export class RescisaoService {
    constructor(private http: Http, private config: ConfigService) {}
    getFuncionariosRescisao(codigoContrato: number, tipoRestituicao: string) {
        const url = this.config.myApi + '/rescisao/getTerceirizadosRescisao=' + codigoContrato + '/' + tipoRestituicao;
        return this.http.get(url).map(res => res.json());
    }
    calculaRescisaoTerceirizados(rescisaoCalcular: RescisaoCalcular) {
        const url = this.config.myApi + '/rescisao/calculaRescisaoTerceirizados';
        const inicioFeriasIntegrais = this.encapsulaDatas(rescisaoCalcular.getInicioFeriasIntegrais());
        const fimFeriasIntegrais = this.encapsulaDatas(rescisaoCalcular.getFimFeriasIntegrais());
        const inicioFeriasProporcionais = this.encapsulaDatas(rescisaoCalcular.getInicioFeriasProporcionais());
        const dataDesligamento = this.encapsulaDatas(rescisaoCalcular.getDataDesligamento());
        const data = {
          'codTerceirizadoContrato': rescisaoCalcular.getCodTerceirizadoContrato(),
          'tipoRestituicao': rescisaoCalcular.getTipoRestituicao(),
          'tipoRescisao': rescisaoCalcular.getTipoRescisao(),
          'dataDesligamento': dataDesligamento.toISOString().split('T')[0],
          'inicioFeriasIntegrais': inicioFeriasIntegrais.toISOString().split('T')[0],
          'fimFeriasIntegrais': fimFeriasIntegrais.toISOString().split('T')[0],
          'inicioFeriasProporcionais': inicioFeriasProporcionais.toISOString().split('T')[0],
          'valorFeriasVencidasMovimentado': rescisaoCalcular.getValorFeriasVencidasMovimentado(),
          'valorFeriasProporcionaisMovimentado': rescisaoCalcular.getValorFeriasProporcionaisMovimentado(),
          'valorDecimoTerceiroMovimentado': rescisaoCalcular.getValorDecimoTerceiroMovimentado()
        };
        return this.http.post(url, data).map(res => res.json());
    }
    registrarCalculoRescisao(calculos: TerceirizadoRescisao[]) {
        const url = '';
        return this.http.get(url).map(res => res.json());
    }
    getRestituicoesRescisao(codigoContrato: number) {
      const url = this.config.myApi + '/rescisao/getRestituicoesRescisao/' + codigoContrato + '/' + this.config.user.id;
      return this.http.get(url).map(res => res.json());
    }
    getCalculosPendentes(codigoContrato: number) {
        const url = '';
        return this.http.get(url).map(res => res.json());
    }
    getCalculosPendentesNegados(codigoContrato: number) {
        const url = '';
        return this.http.get(url).map(res => res.json());
    }

    salvarRescisoesAvaliadas(codigoContrato: number, calculosAvaliados: RescisaoPendente[]) {
        const url = '';
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
