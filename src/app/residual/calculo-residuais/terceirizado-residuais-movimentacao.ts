export class TerceirizadoResiduaisMovimentacao {
  private _codigoTerceirizadoContrato: number;
  private _terceirizado: string;
  private _cpf: string;
  private _valorFeriasResidual: number;
  private _valorTercoResidual: number;
  // private _valorRestituicaoFerias: ValorRestituicaoFerias;
  private _valorIncidenciaFeriasResidual: number;
  private _valorIncidenciaTercoResidual: number;
  private _valorTotalResidual: number;
  private _restituidoFlag: string;
  // private _emAnalise: boolean;

  // get emAnalise(): boolean {
  //   return this._emAnalise;
  // }

  get valorTercoResidual(): number {
    return this._valorTercoResidual;
  }

  get codigoTerceirizadoContrato(): number {
    return this._codigoTerceirizadoContrato;
  }

  get terceirizado(): string {
    return this._terceirizado;
  }

  get cpf(): string {
    return this._cpf;
  }

  get valorFeriasResidual(): number {
    return this._valorFeriasResidual;
  }

  get valorIncidenciaFeriasResidual(): number {
    return this._valorIncidenciaFeriasResidual;
  }

  get valorIncidenciaTercoResidual(): number {
    return this._valorIncidenciaTercoResidual;
  }

  get valorTotalResidual(): number {
    return this._valorTotalResidual;
  }

  get restituidoFlag(): string {
    return this._restituidoFlag;
  }
}
