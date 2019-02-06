import {ValorRestituicaoFerias} from './valor-restituicao-ferias';

export class TerceirizadoFeriasMovimentacao {
    private _codigoTerceirizadoContrato: number;
    private _nomeTerceirizado: string;
    private _inicioPeriodoAquisitivo: Date;
    private _fimPeriodoAquisitivo: Date;
    private _existeCalculoAnterior: boolean;
    private _valorRestituicaoFerias: ValorRestituicaoFerias;
    private _diasUsufruidos: number;
    private _parcela14Dias: boolean;

    get existeCalculoAnterior(): boolean {
        return this._existeCalculoAnterior;
    }

    get codigoTerceirizadoContrato(): number {
        return this._codigoTerceirizadoContrato;
    }

    get nomeTerceirizado(): string {
        return this._nomeTerceirizado;
    }

    get inicioPeriodoAquisitivo(): Date {
        return this._inicioPeriodoAquisitivo;
    }

    get fimPeriodoAquisitivo(): Date {
        return this._fimPeriodoAquisitivo;
    }
    set valorRestituicaoFerias(valorRestituicaoFerias: ValorRestituicaoFerias){
        this._valorRestituicaoFerias = valorRestituicaoFerias;
    }

    get valorRestituicaoFerias(): ValorRestituicaoFerias {
        return this._valorRestituicaoFerias;
    }

    get diasUsufruidos(): number {
      return this._diasUsufruidos;
    }

    get parcela14Dias(): boolean {
      return this._parcela14Dias;
    }
}
