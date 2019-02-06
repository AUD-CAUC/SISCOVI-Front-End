import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {ConfigService} from '../../_shared/config.service';
import {ContratosService} from '../../contratos/contratos.service';
import {SaldoIndividual} from './saldo-individual';
import {SaldoService} from '../saldo.service';

@Component({
  selector: 'app-saldo-component',
  templateUrl: './saldo-individual.component.html',
  styleUrls: ['../saldo.component.scss']
})

export class SaldoIndividualComponent {
  @Input() codigoContrato: number;
  contratos: Contrato[];
  isSelected = false;
  saldos: SaldoIndividual[];
  config: ConfigService;
  somaFerias = 0;
  somaTerco = 0;
  somaDecimo = 0;
  somaIncidencia = 0;
  somaMultaFGTS = 0;
  somaSaldo = 0;

  constructor(config: ConfigService, private saldoService: SaldoService, private contratoService: ContratosService, private ref: ChangeDetectorRef) {
    this.config = config;
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
      if (this.codigoContrato) {
        this.saldoService.getSaldoIndividual(this.codigoContrato).subscribe(res2 => {
          this.saldos = res2;
          if (this.saldos.length === 0) {
            this.saldos = null;
            this.ref.markForCheck();
          } else {
            this.somaFerias = 0;
            this.somaTerco = 0;
            this.somaDecimo = 0;
            this.somaIncidencia = 0;
            this.somaMultaFGTS = 0;
            this.somaSaldo = 0;
            for (let i = 0; i < this.saldos.length; i++) {
              this.somaFerias = this.somaFerias + this.saldos[i].feriasRetido - this.saldos[i].feriasRestituido;
              this.somaTerco = this.somaTerco + this.saldos[i].tercoRetido - this.saldos[i].tercoRestituido;
              this.somaDecimo = this.somaDecimo + this.saldos[i].decimoTerceiroRetido - this.saldos[i].decimoTerceiroRestituido;
              this.somaIncidencia = this.somaIncidencia + (this.saldos[i].incidenciaRetido - this.saldos[i].incidenciaFeriasRestituido -
                this.saldos[i].incidenciaTercoRestituido - this.saldos[i].incidenciaDecimoTerceiroRestituido);
              this.somaMultaFGTS = this.somaMultaFGTS + this.saldos[i].multaFgtsRetido;
              this.somaSaldo = this.somaSaldo + this.saldos[i].saldo;
            }
          }
        });
      }
    });
  }
  defineCodigoContrato(codigoContrato: number): void {
    this.codigoContrato = codigoContrato;
    if (this.codigoContrato) {
      this.saldoService.getSaldoIndividual(this.codigoContrato).subscribe(res2 => {
        this.saldos = res2;
        if (this.saldos.length === 0) {
          this.saldoService = null;
          this.ref.markForCheck();
        } else {
          this.somaFerias = 0;
          this.somaTerco = 0;
          this.somaDecimo = 0;
          this.somaIncidencia = 0;
          this.somaMultaFGTS = 0;
          this.somaSaldo = 0;
          for (let i = 0; i < this.saldos.length; i++) {
            this.somaFerias = this.somaFerias + this.saldos[i].feriasRetido - this.saldos[i].feriasRestituido;
            this.somaTerco = this.somaTerco + this.saldos[i].tercoRetido - this.saldos[i].tercoRestituido;
            this.somaDecimo = this.somaDecimo + this.saldos[i].decimoTerceiroRetido - this.saldos[i].decimoTerceiroRestituido;
            this.somaIncidencia = this.somaIncidencia + (this.saldos[i].incidenciaRetido - this.saldos[i].incidenciaFeriasRestituido -
              this.saldos[i].incidenciaTercoRestituido - this.saldos[i].incidenciaDecimoTerceiroRestituido);
            this.somaMultaFGTS = this.somaMultaFGTS + this.saldos[i].multaFgtsRetido;
            this.somaSaldo = this.somaSaldo + this.saldos[i].saldo;
          }
        }
      });
    }
  }
}
