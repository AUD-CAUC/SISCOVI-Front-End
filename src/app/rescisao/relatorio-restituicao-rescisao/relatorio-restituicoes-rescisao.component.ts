import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {RescisaoService} from '../rescisao.service';
import {ContratosService} from '../../contratos/contratos.service';
import {ConfigService} from '../../_shared/config.service';
import {Contrato} from '../../contratos/contrato';
import {RescisaoCalculosPendentes} from '../rescisoes-pendentes/rescisao-calculos-pendentes';

@Component({
  selector: 'app-relatorio-restituicoes-rescisao-component',
  templateUrl: './relatorio-restituicoes-rescisao.component.html',
  styleUrls: ['../rescisao.component.scss']
})
export class RelatorioRestituicoesRescisaoComponent {
  contratos: Contrato[];
  @Input() codigoContrato = 0;
  isSelected = false;
  calculosRescisao: RescisaoCalculosPendentes[];
  config: ConfigService;
  constructor(private rescisaoService: RescisaoService, private contratoService: ContratosService, config: ConfigService, private ref: ChangeDetectorRef) {
    this.config = config;
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
      if (this.codigoContrato) {
        this.rescisaoService.getRestituicoesRescisao(this.codigoContrato).subscribe(res2 => {
          this.calculosRescisao = res2;
          if (this.calculosRescisao.length === 0) {
            this.calculosRescisao = null;
            this.ref.markForCheck();
          }
        });
      }
    });
  }
  defineCodigoContrato(codigoContrato: number): void {
    this.codigoContrato = codigoContrato;
    if (this.codigoContrato) {
      this.rescisaoService.getRestituicoesRescisao(this.codigoContrato).subscribe(res2 => {
        this.calculosRescisao = res2;
        if (this.calculosRescisao.length === 0) {
          this.calculosRescisao = null;
          this.ref.markForCheck();
        }
      });
    }
  }
}
