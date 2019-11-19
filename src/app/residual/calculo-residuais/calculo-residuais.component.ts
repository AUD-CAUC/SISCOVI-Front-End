import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ContratosService} from '../../contratos/contratos.service';
import {Contrato} from '../../contratos/contrato';
import {ResidualService} from '../residual.service';
import {TerceirizadoResiduaisMovimentacaoDecimoTerceiro, TerceirizadoResiduaisMovimentacaoFerias, TerceirizadoResiduaisMovimentacaoRescisao} from './terceirizado-residuais-movimentacao';

@Component({
  selector: 'app-calculo-residuais-component',
  templateUrl: './calculo-residuais.component.html',
  styleUrls: ['./calculo-residuais.component.scss']
})
export class CalculoResiduaisComponent {
  protected contratos: Contrato[];
  protected terceirizadosFerias: TerceirizadoResiduaisMovimentacaoFerias[];
  protected terceirizadosDecimoTerceiro: TerceirizadoResiduaisMovimentacaoDecimoTerceiro[];
  protected terceirizadosRescisao: TerceirizadoResiduaisMovimentacaoRescisao[];
  codigo: number;
  tipoRestituicao: string;
  @Output() navegaParaViewDeCalculos = new EventEmitter();

  constructor(private contratoService: ContratosService, private residualService: ResidualService) {
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
    });
  }

  defineCodigoContrato(codigoContrato: number): void {
    this.codigo = codigoContrato;
    if (this.codigo && this.tipoRestituicao === 'ferias') {
      this.residualService.getFuncionariosResidualFerias(this.codigo).subscribe(res => {
        this.terceirizadosFerias = null;
        this.terceirizadosFerias = res;
      });
    }
    if (this.codigo && this.tipoRestituicao === 'decimo') {
      this.residualService.getFuncionariosResidualDecimoTerceiro(this.codigo).subscribe(res => {
        this.terceirizadosDecimoTerceiro = null;
        this.terceirizadosDecimoTerceiro = res;
      });
    }
    if (this.codigo && this.tipoRestituicao === 'rescisao') {
      this.residualService.getFuncionariosResidualRescisao(this.codigo).subscribe(res => {
        this.terceirizadosRescisao = null;
        this.terceirizadosRescisao = res;
      });
    }
  }

  defineTipoRestituicao(tipoMovimentacao: string): void {
    this.tipoRestituicao = tipoMovimentacao;
    if (this.codigo && this.tipoRestituicao === 'ferias') {
      this.residualService.getFuncionariosResidualFerias(this.codigo).subscribe(res => {
        this.terceirizadosFerias = null;
        this.terceirizadosFerias = res;
      });
    }
    if (this.codigo && this.tipoRestituicao === 'decimo') {
      this.residualService.getFuncionariosResidualDecimoTerceiro(this.codigo).subscribe(res => {
        this.terceirizadosDecimoTerceiro = null;
        this.terceirizadosDecimoTerceiro = res;
      });
    }
    if (this.codigo && this.tipoRestituicao === 'rescisao') {
      this.residualService.getFuncionariosResidualRescisao(this.codigo).subscribe(res => {
        this.terceirizadosRescisao = null;
        this.terceirizadosRescisao = res;
      });
    }
  }

  eventNav(codigo: number): void {
    this.navegaParaViewDeCalculos.emit(codigo);
  }
}
