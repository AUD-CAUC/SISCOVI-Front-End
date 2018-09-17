import {EventEmitter, Injectable, Output} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from '../_shared/config.service';
import {Observable} from 'rxjs/Observable';
import {TerceririzadoDecimoTerceiro} from './terceririzado.decimo.terceiro';

@Injectable()
export class DecimoTerceiroService {
    constructor(private http: Http, private config: ConfigService) {}
    getFuncionariosDecimoTerceiro(codigoContrato: number, tipoRestituicao: string) {
        const url = this.config.myApi + '/decimo-terceiro/getTerceirizadosDecimoTerceiro=' + codigoContrato + '/' + tipoRestituicao;
        return this.http.get(url).map(res => res.json());
    }
    /*calculaFeriasTerceirizados(decimoTerceiro: DecimoTerceiroCalcular[]) {
        const url = this.config.myApi + '/ferias/calcularFeriasTerceirizados';
        const data = [];
        feriasCalcular.forEach(ferias => {
            const inicioFerias = this.encapsulaDatas(ferias.getInicioFerias());
            const fimFerias = this.encapsulaDatas(ferias.getFimFerias());
            let tipoRestituicao = '';
            if (ferias.getTipoRestituicao() === 'MOVIMENTACAO') {
                tipoRestituicao = 'MOVIMENTAÇÃO';
            }else if (ferias.getTipoRestituicao() === 'RESGATE') {
                tipoRestituicao = ferias.getTipoRestituicao();
            }
            const val = {
                'codTerceirizadoContrato': ferias.getCodTerceirizadoContrato(),
                'tipoRestituicao': tipoRestituicao,
                'diasVendidos': ferias.getDiasVendidos(),
                'inicioFerias': inicioFerias.toISOString().split('T')[0],
                'fimFerias': fimFerias.toISOString().split('T')[0],
                'inicioPeriodoAquisitivo': ferias.getInicioPeriodoAquisitivo(),
                'fimPeriodoAquisitivo': ferias.getFimPeriodoAquisitivo(),
                'valorMovimentado': ferias.getValorMovimentado(),
                'parcelas': ferias.getParcelas(),
                'pTotalFerias': ferias.pTotalFerias,
                'pTotalTercoConstitucional': ferias.pTotalTercoConstitucional,
                'pTotalIncidenciaFerias': ferias.pTotalIncidenciaFerias,
                'pTotalIncidenciaTerco': ferias.pTotalIncidenciaTerco
            };
            data.push(val);
        });
        const headers = new Headers({'Content-type': 'application/json'});
        return this.http.post(url, data, headers).map(res => res.json());
    }*/
    calculaFeriasTerceirizados(tercerizadosDecimoTerceiro: TerceririzadoDecimoTerceiro[]) {
        const url = this.config.myApi + '/ferias/calcularFeriasTerceirizados';
        const data = [];
        tercerizadosDecimoTerceiro.forEach(decimoTerceiro => {
            let tipoRestituicao = '';
            if (decimoTerceiro.tipoRestituicao === 'MOVIMENTACAO') {
                tipoRestituicao = 'MOVIMENTAÇÃO';
            }else if (decimoTerceiro.tipoRestituicao === 'RESGATE') {
                tipoRestituicao = decimoTerceiro.tipoRestituicao;
            }
            const val = {
                'codTerceirizadoContrato': decimoTerceiro.codigoTerceirizadoContrato,
                'tipoRestituicao': tipoRestituicao,
                'inicioContagem': decimoTerceiro.inicioContagem,
                'valorMovimentado': decimoTerceiro.valorMovimentado,
                'parcelas': decimoTerceiro.parcelas,
                'nomeTerceirizado': decimoTerceiro.nomeTerceirizado,
            };
            data.push(val);
        });
        const headers = new Headers({'Content-type': 'application/json'});
        return this.http.post(url, data, headers).map(res => res.json());
    }
    protected encapsulaDatas(value: any): Date {
        const a = value.split('/');
        const dia = Number(a[0]);
        const mes = Number(a[1]) - 1;
        const ano = Number(a[2]);
        return new Date(ano, mes, dia);
    }
}
