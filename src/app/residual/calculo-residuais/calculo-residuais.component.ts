import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ContratosService} from '../../contratos/contratos.service';
import {Contrato} from '../../contratos/contrato';
import {ResidualService} from '../residual.service';
import {TerceirizadoResiduaisMovimentacao} from './terceirizado-residuais-movimentacao';

@Component({
  selector: 'app-calculo-residuais-component',
  templateUrl: './calculo-residuais.component.html',
  styleUrls: ['./calculo-residuais.component.scss']
})
export class CalculoResiduaisComponent {
  protected contratos: Contrato[];
  protected terceirizados: TerceirizadoResiduaisMovimentacao[];
  codigo: number;
  tipoRestituicao: string;
  @Output() navegaParaViewDeCalculos = new EventEmitter();

  constructor(private contratoService: ContratosService, private residualService: ResidualService) {
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
    });
  }

  defineCodigoContrato(codigoContrato: number): void {
    this.terceirizados = null;
    this.codigo = codigoContrato;
    if (this.codigo && this.tipoRestituicao === 'ferias') {
      this.residualService.getFuncionariosResidualFerias(this.codigo).subscribe(res => {
        this.terceirizados = res;
      });
    }
  }

  defineTipoRestituicao(tipoMovimentacao: string): void {
    this.tipoRestituicao = tipoMovimentacao;
    if (this.codigo && this.tipoRestituicao === 'ferias') {
      this.residualService.getFuncionariosResidualFerias(this.codigo).subscribe(res => {
        this.terceirizados = res;
      });
    }
  }

  eventNav(codigo: number): void {
    this.navegaParaViewDeCalculos.emit(codigo);
  }
}
