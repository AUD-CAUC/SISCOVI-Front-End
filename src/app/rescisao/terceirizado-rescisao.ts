export class TerceirizadoRescisao {
    private _codTerceirizadoContrato: number;
    private _nomeTerceirizado: string;
    private _dataDesligamento: Date;
    private _dataInicioFeriasIntegrais: Date;
    private _dataFimFeriasIntegrais: Date;
    private _dataInicioFeriasProporcionais: Date;
    private _dataFimFeriasProporcionais: Date;
    private _tipoRescisao: string;
    private _tipoRestituicao: string;
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
    }
    public get nomeTerceirizado() {
        return this._nomeTerceirizado;
    }

    public get codTerceirizadoContrato() {
        return this._codTerceirizadoContrato;
    }

    get dataDesligamento(): Date {
        return this._dataDesligamento;
    }

    get dataInicioFerciasIntegrais(): Date {
      return this._dataInicioFeriasIntegrais;
    }

    get dataFimFeriasIntegrais(): Date {
      return this._dataFimFeriasIntegrais;
    }

    get dataInicioFeriasProporcionais(): Date {
      return this._dataInicioFeriasProporcionais;
    }

    get dataFimFeriasProporcionais(): Date {
      return this._dataFimFeriasProporcionais;
    }

    get tipoRescisao(): string {
        return this._tipoRescisao;
    }

    get tipoRestituicao(): string {
        return this._tipoRestituicao;
    }
}
