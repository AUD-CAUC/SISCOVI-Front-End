import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {ConfigService} from '../../_shared/config.service';
import {ContratosService} from '../../contratos/contratos.service';
import {SaldoIndividual} from './saldo-individual';
import {SaldoService} from '../saldo.service';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

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
              this.somaMultaFGTS = this.somaMultaFGTS + this.saldos[i].multaFgtsRetido - this.saldos[i].multaFgtsRestituido;
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
            this.somaMultaFGTS = this.somaMultaFGTS + this.saldos[i].multaFgtsRetido - this.saldos[i].multaFgtsRestituido;
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

      // pdf.text('Cálculo de Retenções', 105, 15, {align: 'center'});
      // pdf.text(nome, 105, 25, {align: 'center'});
      // pdf.text(dataReferencia[2] + '/' + dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'PNG', 2.5, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + position;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 2.5, position, imgWidth, imgHeight);
        // pdf.text('Saldo Individual', 105, 15, {align: 'center'});
        heightLeft -= pageHeight;
      }

      // pdf.addImage(contentDataURL, 'PNG', 0, imgHeight + 10, imgWidth, imgHeight);
      pdf.viewerPreferences({
        FitWindow: true
      });
      pdf.save('Saldo ind' + '.pdf'); // Generated PDF
    });
  }

  mostrar(event: any) {
    console.log(event);
  }

  gerarRelatorioExcel(nomeEmpresa, cod) {
    const workbookSaldoInd = new Workbook();
    const worksheetSaldoInd = workbookSaldoInd.addWorksheet('Relatório-Saldo-Individual', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 2,
        fitToWidth: 1,
        paperSize: 9
      }
    });
    worksheetSaldoInd.mergeCells('A1:H1');
    const rowEmpresa = worksheetSaldoInd.getCell('A1').value = nomeEmpresa;
    worksheetSaldoInd.getCell('A1').font = {name: 'Arial', size: 18};
    worksheetSaldoInd.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetSaldoInd.addRow(rowEmpresa);
    worksheetSaldoInd.getRow(1).height = 30;

    const nomeRelatorio = 'Relatório de Saldos por Terceirizado';
    worksheetSaldoInd.mergeCells('A2:H2');
    const rowRel = worksheetSaldoInd.getCell('A2').value = nomeRelatorio;
    worksheetSaldoInd.getCell('A2').font = {name: 'Arial', size: 18};
    worksheetSaldoInd.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetSaldoInd.addRow(rowRel);
    worksheetSaldoInd.getRow(2).height = 30;

    const rowHeaders = [
      ['Terceirizado', 'CPF', 'Saldo Férias', 'Saldo Terço Constitucional', 'Saldo Décimo Terceiro', 'Saldo Incidência', 'Saldo Multa do FGTS', 'Saldo Total']
    ];

    worksheetSaldoInd.addRows(rowHeaders);

    worksheetSaldoInd.columns = [
      {header: rowHeaders[1], key: 'terceirizado', width: 40},
      {header: rowHeaders[2], key: 'cpf', width: 20},
      {header: rowHeaders[3], key: 'ferias', width: 20},
      {header: rowHeaders[4], key: 'terco', width: 25},
      {header: rowHeaders[5], key: 'decterc', width: 25},
      {header: rowHeaders[6], key: 'incidencia', width: 20},
      {header: rowHeaders[7], key: 'fgts', width: 20},
      {header: rowHeaders[8], key: 'total', width: 20},
    ];

    worksheetSaldoInd.getRow(4).font = {name: 'Arial', size: 18};
    worksheetSaldoInd.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetSaldoInd.getRow(4).height = 70;

    worksheetSaldoInd.getColumn('ferias').numFmt = 'R$ #,##0.00';
    worksheetSaldoInd.getColumn('terco').numFmt = 'R$ #,##0.00';
    worksheetSaldoInd.getColumn('decterc').numFmt = 'R$ #,##0.00';
    worksheetSaldoInd.getColumn('incidencia').numFmt = 'R$ #,##0.00';
    worksheetSaldoInd.getColumn('fgts').numFmt = 'R$ #,##0.00';
    worksheetSaldoInd.getColumn('total').numFmt = 'R$ #,##0.00';

    let row;
    let i;

    if (cod) {
      for (i = 0; i < this.saldos.length; i++) {
        row = worksheetSaldoInd.getRow(i + 5);
        row.getCell(1).value = this.saldos[i].nomeFuncionario;
        row.getCell(2).value = this.saldos[i].Cpf;
        row.getCell(3).value = this.saldos[i].feriasRetido - this.saldos[i].feriasRestituido;
        row.getCell(4).value = this.saldos[i].tercoRetido - this.saldos[i].tercoRestituido;
        row.getCell(5).value = this.saldos[i].decimoTerceiroRetido - this.saldos[i].decimoTerceiroRestituido;
        row.getCell(6).value = this.saldos[i].incidenciaRetido - this.saldos[i].incidenciaFeriasRestituido -
          this.saldos[i].incidenciaTercoRestituido - this.saldos[i].incidenciaDecimoTerceiroRestituido;
        row.getCell(7).value = this.saldos[i].multaFgtsRetido - this.saldos[i].multaFgtsRestituido;
        row.getCell(8).value = this.saldos[i].saldo;
      }
    }

    for (let x = 5; x <= 200; x++) {
      worksheetSaldoInd.getRow(x).height = 20;
      worksheetSaldoInd.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    let k = 9;
    while (k <= 16384) {
      const dobCol = worksheetSaldoInd.getColumn(k);
      dobCol.hidden = true;
      k++;
    }

    workbookSaldoInd.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Saldo-Por-Terceirizado.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
