import {ListaTotalMensalData} from './lista-total-mensal-data';

export class TotalMensalPendente {
    private _totaisMensais: ListaTotalMensalData;
    private _status: string;
    private _observacoes: string;
    private _codigoContrato: number;
    private _nomeEmpresa: string;
    private _numeroContrato: string;

    constructor(totaisMensais: ListaTotalMensalData, status: string) {
        this._totaisMensais = totaisMensais;
        this._status = status;
    }
    get status(): string {
        return this._status;
    }
    get totaisMensais(): ListaTotalMensalData {
        return this._totaisMensais;
    }
    get codigoContrato(): number {
        return this._codigoContrato;
    }
    get nomeEmpresa(): string {
        return this._nomeEmpresa;
    }
    get numeroContrato(): string {
        return this._numeroContrato;
    }

    set observacoes(value: string) {
        this._observacoes = value;
    }

    get observacoes(): string {
        return this._observacoes;
    }

    set codigoContrato(codigo: number) {
        this._codigoContrato = codigo;
    }
}
