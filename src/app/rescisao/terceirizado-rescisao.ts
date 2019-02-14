import {ValorRestituicaoRescisao} from './valor-restituicao-rescisao';

export class TerceirizadoRescisao {
    private _codTerceirizadoContrato: number;
    private _nomeTerceirizado: string;
    private _dataDesligamento: Date;
    private _pDataInicioFeriasIntegrais: Date;
    private _pDataFimFeriasIntegrais: Date;
    private _pDataInicioFeriasProporcionais: Date;
    private _pDataFimFeriasProporcionais: Date;
    private _tipoRescisao: string;
    private _tipoRestituicao: string;
    private _valorRestituicaoRescisao: ValorRestituicaoRescisao;
    /*
    constructor(codTerceirizadoContrato: number,
                nomeTerceirizado: string,
                dataDesligamento: Date,
                dataInicioFeriasIntegrais: Date,
                dataFimFeriasIntegrais: Date,
                dataInicioFeriasProporcionais: Date,
                dataFimFeriasProporcionais: Date,
                tipoRestituicao: string,
                tipoRescisao: string) {
        this._codTerceirizadoContrato = codTerceirizadoContrato;
        this._nomeTerceirizado = nomeTerceirizado;
        this._dataDesligamento = dataDesligamento;
        this._dataInicioFeriasIntegrais = dataInicioFeriasIntegrais;
        this._dataFimFeriasIntegrais = dataFimFeriasIntegrais;
        this._dataInicioFeriasProporcionais = dataInicioFeriasProporcionais;
        this._dataFimFeriasProporcionais = dataFimFeriasProporcionais;
        this._tipoRescisao = tipoRescisao;
        this._tipoRestituicao = tipoRestituicao;
    }*/
    public get nomeTerceirizado() {
        return this._nomeTerceirizado;
    }

    public get codTerceirizadoContrato() {
        return this._codTerceirizadoContrato;
    }

    get dataDesligamento(): Date {
        return this._dataDesligamento;
    }

    get pDataInicioFeriasIntegrais(): Date {
      return this._pDataInicioFeriasIntegrais;
    }

    get pDataFimFeriasIntegrais(): Date {
      return this._pDataFimFeriasIntegrais;
    }

    get pDataInicioFeriasProporcionais(): Date {
      return this._pDataInicioFeriasProporcionais;
    }

    get pDataFimFeriasProporcionais(): Date {
      return this._pDataFimFeriasProporcionais;
    }

    get tipoRescisao(): string {
        return this._tipoRescisao;
    }

    get tipoRestituicao(): string {
        return this._tipoRestituicao;
    }

    set valorRestituicaoRescisao(valorRestituicaoRescisao: ValorRestituicaoRescisao) {
      this._valorRestituicaoRescisao = valorRestituicaoRescisao;
    }

    get valorRestituicaoRescisao(): ValorRestituicaoRescisao { return this._valorRestituicaoRescisao; }
}
