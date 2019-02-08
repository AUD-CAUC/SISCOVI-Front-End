export class RescisaoCalcular {
  codTerceirizadoContrato: number;
  nomeTerceirizado: string;
  tipoRestituicao: string;
  tipoRescisao: string;
  dataDesligamento: Date;
  inicioFeriasIntegrais: Date;
  fimFeriasIntegrais: Date;
  inicioFeriasProporcionais: Date;
  fimFeriasProporcionais: Date;
  valorFeriasVencidasMovimentado: number;
  valorFeriasProporcionaisMovimentado: number;
  valorDecimoTerceiroMovimentado: number;
  totalDecimoTerceiro: number;
  totalIncidenciaDecimoTerceiro: number;
  totalMultaFgtsDecimoTerceiro: number;
  totalFeriasVencidas: number;
  totalTercoConstitucionalvencido: number;
  totalIncidenciaFeriasVencidas: number;
  totalIncidenciaTercoVencido: number;
  totalMultaFgtsFeriasVencidas: number;
  totalMultaFgtsTercoVencido: number;
  totalFeriasProporcionais: number;
  totalTercoProporcional: number;
  totalIncidenciaFeriasProporcionais: number;
  totalIncidenciaTercoProporcional: number;
  totalMultaFgtsFeriasProporcionais: number;
  totalMultaFgtsTercoProporcional: number;
  totalMultaFgtsSalario: number;

  constructor(codTerceirizadoContrato: number,
              tipoRestituicao: string,
              tipoRescisao: string,
              dataDesligamento: Date,
              inicioFeriasIntegrais: Date,
              fimFeriasIntegrais: Date,
              inicioFeriasProporcionais: Date,
              fimFeriasProporcionais: Date,
              valorFeriasVencidasMovimentado: number,
              valorFeriasProporcionaisMovimentado: number,
              valorDecimoTerceiroMovimentado: number,
              totalDecimoTerceiro: number,
              totalIncidenciaDecimoTerceiro: number,
              totalMultaFgtsDecimoTerceiro: number,
              totalFeriasVencidas: number,
              totalTercoConstitucionalvencido: number,
              totalIncidenciaFeriasVencidas: number,
              totalIncidenciaTercoVencido: number,
              totalMultaFgtsFeriasVencidas: number,
              totalMultaFgtsTercoVencido: number,
              totalFeriasProporcionais: number,
              totalTercoProporcional: number,
              totalIncidenciaFeriasProporcionais: number,
              totalIncidenciaTercoProporcional: number,
              totalMultaFgtsFeriasProporcionais: number,
              totalMultaFgtsTercoProporcional: number,
              totalMultaFgtsSalario: number) {

      this.codTerceirizadoContrato = codTerceirizadoContrato;
      this.tipoRestituicao = tipoRestituicao;
      this.tipoRescisao = tipoRescisao;
      this.dataDesligamento = dataDesligamento;
      this.inicioFeriasIntegrais = inicioFeriasIntegrais;
      this.fimFeriasIntegrais = fimFeriasIntegrais;
      this.inicioFeriasProporcionais = inicioFeriasProporcionais;
      this.fimFeriasProporcionais = fimFeriasProporcionais;
      this.valorFeriasVencidasMovimentado = valorFeriasVencidasMovimentado;
      this.valorFeriasProporcionaisMovimentado = valorFeriasProporcionaisMovimentado;
      this.valorDecimoTerceiroMovimentado = valorDecimoTerceiroMovimentado;
      this.totalDecimoTerceiro = totalDecimoTerceiro;
      this.totalIncidenciaDecimoTerceiro = totalIncidenciaDecimoTerceiro;
      this.totalMultaFgtsDecimoTerceiro = totalMultaFgtsDecimoTerceiro;
      this.totalFeriasVencidas = totalFeriasVencidas;
      this.totalTercoConstitucionalvencido = totalTercoConstitucionalvencido;
      this.totalIncidenciaFeriasVencidas = totalIncidenciaFeriasVencidas;
      this.totalIncidenciaTercoVencido = totalIncidenciaTercoVencido;
      this.totalMultaFgtsFeriasVencidas = totalMultaFgtsFeriasVencidas;
      this.totalMultaFgtsTercoVencido = totalMultaFgtsTercoVencido;
      this.totalFeriasProporcionais = totalFeriasProporcionais;
      this.totalTercoProporcional = totalTercoProporcional;
      this.totalIncidenciaFeriasProporcionais = totalIncidenciaFeriasProporcionais;
      this.totalIncidenciaTercoProporcional = totalIncidenciaTercoProporcional;
      this.totalMultaFgtsFeriasProporcionais = totalMultaFgtsFeriasProporcionais;
      this.totalMultaFgtsTercoProporcional = totalMultaFgtsTercoProporcional;
      this.totalMultaFgtsSalario = totalMultaFgtsSalario;

  }


  public getCodTerceirizadoContrato(): number { return this.codTerceirizadoContrato; }

  public getTipoRestituicao(): string { return this.tipoRestituicao; }

  public getTipoRescisao(): string { return this.tipoRescisao; }

  public getDataDesligamento(): Date { return this.dataDesligamento; }

  public getInicioFeriasIntegrais(): Date { return this.inicioFeriasIntegrais; }

  public getFimFeriasIntegrais(): Date { return this.fimFeriasIntegrais; }

  public getInicioFeriasProporcionais(): Date { return this.inicioFeriasProporcionais; }

  public getFimFeriasProporcionais(): Date { return this.fimFeriasProporcionais; }

  public getValorFeriasVencidasMovimentado(): number { return this.valorFeriasVencidasMovimentado; }

  public getValorFeriasProporcionaisMovimentado(): number { return this.valorFeriasProporcionaisMovimentado; }

  public getValorDecimoTerceiroMovimentado(): number { return this.valorDecimoTerceiroMovimentado; }

  public getTotalDecimoTerceiro(): number { return this.totalDecimoTerceiro; }

  public getTotalIncidenciaDecimoTerceiro(): number { return this.totalIncidenciaDecimoTerceiro; }

  public getTotalMultaFgtsDecimoTerceiro(): number { return this.totalMultaFgtsDecimoTerceiro; }

  public getTotalFeriasVencidas(): number { return this.totalFeriasVencidas; }

  public getTotalTercoConstitucionalVencido(): number { return this.totalTercoConstitucionalvencido; }

  public getTotalIncidenciaFeriasVencidas(): number { return this.totalIncidenciaFeriasVencidas; }

  public getTotalIncidenciaTercoVencido(): number { return this.totalTercoConstitucionalvencido; }

  public getTotalMultaFgtsFeriasVencidas(): number { return this.totalMultaFgtsFeriasVencidas; }

  public getTotalMultaFgtsTercoVencido(): number { return this.totalMultaFgtsTercoVencido; }

  public getTotalFeriasProporcionais(): number { return this.totalFeriasProporcionais; }

  public getTotalTercoProporcional(): number { return this.totalTercoProporcional; }

  public getTotalIncidenciaFeriasProporcionais(): number { return this.totalIncidenciaFeriasProporcionais; }

  public getTotalIncidenciaTercoProporcional(): number { return this.totalIncidenciaTercoProporcional; }

  public getTotalMultaFgtsFeriasProporcionais(): number { return this.totalMultaFgtsFeriasProporcionais; }

  public getTotalMultaFgtsTercoProporcional(): number { return this.totalMultaFgtsTercoProporcional; }

  public getTotalMultaFgtsSalario(): number { return this.totalMultaFgtsSalario; }

  public setNomeTerceirizado(nomeTerceirizado: string): void { this.nomeTerceirizado = nomeTerceirizado; }

}
