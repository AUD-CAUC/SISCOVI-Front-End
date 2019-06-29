import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {ContratosService} from '../../contratos/contratos.service';
import {DecimoTerceiroService} from '../decimo-terceiro.service';
import {TerceirizadoDecimoTerceiro} from '../terceirizado-decimo-terceiro';

@Component({
  selector: 'app-calculo-decimo-terceiro-component',
  templateUrl: './calculo-decimo-terceiro.component.html',
  styleUrls: ['./resgate-decimo-terceiro.component.scss']
})
export class CalculoDecimoTerceiroComponent {
  protected contratos: Contrato[];
  protected terceirizados: TerceirizadoDecimoTerceiro[];
  codigo: number;
  tipoRestituicao: string;
  @Output() navegaParaViewDeCalculos = new EventEmitter();
  anoCalculo: number;
  listaAnos: number[] = [];

  constructor(private contratoService: ContratosService, private decimoTerceiroService: DecimoTerceiroService, private ref: ChangeDetectorRef) {
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
    });
  }

  defineCodigoContrato(codigoContrato: number): void {
    this.codigo = codigoContrato;
    if (this.tipoRestituicao && this.codigo) {
      this.decimoTerceiroService.getAnos(this.codigo).subscribe(res => {
        this.listaAnos = res;
      });
    }
    this.defineTerceirizados();
  }

  defineTipoMovimentacao(tipoMovimentacao: string): void {
    this.tipoRestituicao = tipoMovimentacao;
    if (this.tipoRestituicao && this.codigo) {
      this.decimoTerceiroService.getAnos(this.codigo).subscribe(res => {
        this.listaAnos = res;
      });
    }
    this.defineTerceirizados();
  }

  defineAnoCalculo(ano: number): void {
    this.anoCalculo = ano;
    this.defineTerceirizados();
  }

  defineTerceirizados(): void {
    this.terceirizados = null;
    if (this.codigo && this.tipoRestituicao && this.anoCalculo) {
      this.decimoTerceiroService.getFuncionariosDecimoTerceiro(this.codigo, this.tipoRestituicao, this.anoCalculo).subscribe(res => {
        this.terceirizados = res;
      });
    }
  }

  eventNav(codigo: number): void {
    this.navegaParaViewDeCalculos.emit(codigo);
  }
}
