import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {ConfigService} from '../../_shared/config.service';
import {ContratosService} from '../../contratos/contratos.service';
import {SaldoIndividual} from './saldo-individual';
import {SaldoService} from '../saldo.service';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';

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
  printDiv() {
    const divContents = document.getElementById('tabSalInd').innerHTML;
    const a = window.open('', '', 'height=500, width=500');
    a.document.write('<html><head></head>');
    a.document.write('<body ><table class="striped centered responsive-table hoverable highlight bordered" style="box-shadow: none!important;"> ');
    a.document.write(divContents);
    a.document.write('</table></body></html>');
    a.document.close();
    a.print();
  }

  captureScreen(nomeEmpresa) {
    const data = document.getElementById(nomeEmpresa);
    html2canvas(data, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
      // Few necessary setting options
      const imgWidth = 205;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 40;

      const dataAtual = new Date();
      const mes = dataAtual.getMonth() + 1;
      const ano = dataAtual.getFullYear();

      pdf.text('Saldo Individual', 105, 15, {align: 'center'});
      pdf.text(nomeEmpresa, 105, 25, {align: 'center'});
      pdf.text(mes + '/' + ano, 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'PNG', 2.5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + position;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 2.5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.viewerPreferences({
        FitWindow: true
      });
      pdf.save('Saldo ind ' + nomeEmpresa + '.pdf'); // Generated PDF
    });
  }

  mostrar(event: any) {
    console.log(event);
  }
}
