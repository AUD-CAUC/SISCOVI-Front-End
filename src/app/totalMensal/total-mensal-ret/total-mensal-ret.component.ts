import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {TotalMensalService} from '../total-mensal.service';
import {Contrato} from '../../contratos/contrato';
import {ContratosService} from '../../contratos/contratos.service';
import {ConfigService} from '../../_shared/config.service';
import {ListaTotalMensalData} from '../lista-total-mensal-data';
import * as JsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-total-mensal-ret',
    templateUrl: './total-mensal-ret.component.html',
    styleUrls: ['../total-mensal.component.scss']
})
export class TotalMensalRetComponent implements OnInit {
    calculos: ListaTotalMensalData[];
    somaFerias: number;
    somaTerco: number;
    somaDecimo: number;
    somaIncidencia: number;
    somaMultaFGTS: number;
    somaSaldo: number;
    contratos: Contrato[];
    tmService: TotalMensalService;
    contratoService: ContratosService;
    private config: ConfigService;
    codContrato: number;
    @Input() contratoSelecionado: number;
    constructor(tmService: TotalMensalService, contratoService: ContratosService, config: ConfigService, private changeDetector: ChangeDetectorRef) {
        this.contratoService = contratoService;
        this.config = config;
        this.contratoService.getContratosDoUsuario().subscribe(res => {
            this.contratos = res;
        });
        this.tmService = tmService;

        if (this.contratoSelecionado) {
            this.tmService.getValoresRetidos(this.contratoSelecionado, this.config.user.id).subscribe(res => {
                if (this.calculos) {
                   this.calculos =  this.calculos.splice(0);
                }
                this.calculos = res;
                this.changeDetector.detectChanges();
            });
        }
    }
    onChange(value: number) {
       this.codContrato = value;
       if (value) {
         this.tmService.getValoresRetidos(this.codContrato, this.config.user.id).subscribe(res => {
           if (this.calculos) {
             this.calculos = this.calculos.splice(0);
           }
           this.calculos = res;
           this.changeDetector.detectChanges();
         });
       }
    }
    // onLoad() {
    //      {
    //         this.tmService.getValoresRetidos(this.codContrato, this.config.user.id).subscribe(res => {
    //             if (this.calculos) {
    //                this.calculos = this.calculos.splice(0);
    //             }
    //             this.calculos = res;
    //             this.changeDetector.detectChanges();
    //         });
    //     }
    // }
    ngOnInit () {
        if (this.contratoSelecionado) {
            this.codContrato = this.contratoSelecionado;
            this.tmService.getValoresRetidos(this.contratoSelecionado, this.config.user.id).subscribe(res => {
               this.calculos = res;
            });
        }
    }

    calculaTotais(calculo: ListaTotalMensalData) {
        this.somaFerias = 0;
        this.somaTerco = 0;
        this.somaDecimo = 0;
        this.somaIncidencia = 0;
        this.somaMultaFGTS = 0;
        this.somaSaldo = 0;

        for (let i = 0; i < calculo.totais.length; i++) {
            this.somaFerias = this.somaFerias + calculo.totais[i].ferias;
            this.somaTerco = this.somaTerco + calculo.totais[i].tercoConstitucional;
            this.somaDecimo = this.somaDecimo + calculo.totais[i].decimoTerceiro;
            this.somaIncidencia = this.somaIncidencia + calculo.totais[i].incidencia;
            this.somaMultaFGTS = this.somaMultaFGTS + calculo.totais[i].multaFGTS;
            this.somaSaldo = this.somaSaldo + calculo.totais[i].total;
        }
    }

  captureScreen(dataReferencia, nome, id) {
    const data = document.getElementById(nome + id);
    html2canvas(data, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
      // Few necessary setting options
      const imgWidth = 205;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 45;

      dataReferencia = dataReferencia.split('-');

      pdf.text('Cálculo de Retenções', 105, 15, {align: 'center'});
      pdf.text(nome, 105, 25, {align: 'center'});
      pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('Retenção' + nome + '.pdf'); // Generated PDF
    });
  }

  mostrar(event: any) {
    console.log(event);
  }

  formatDate(str) {
      return str.split('-').reverse().join('/');
  }

  gerarRelatorioExcel(dataRef, nomeEmpresa, n) {
    const workbookRet = new Workbook();
    const worksheetRet = workbookRet.addWorksheet('Relatório-Saldo-Individual', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 2,
        fitToWidth: 1,
        paperSize: 9
      }
    });

    worksheetRet.mergeCells('A1:H1');
    const rowEmpresa = worksheetRet.getCell('A1').value = nomeEmpresa;
    worksheetRet.getCell('A1').font = {name: 'Arial', size: 18};
    worksheetRet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetRet.addRow(rowEmpresa);
    worksheetRet.getRow(1).height = 30;

    // const nomeRelatorio = dataRef;
    worksheetRet.mergeCells('A2:H2');
    const rowRel = worksheetRet.getCell('A2').value = 'Relatório de Retenções Mensais - Data de Referência - ' + this.formatDate(dataRef);
    worksheetRet.getCell('A2').font = {name: 'Arial', size: 18};
    worksheetRet.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetRet.addRow(rowRel);
    worksheetRet.getRow(2).height = 30;

    const rowHeaders = [
      ['Função', 'Número de Terceirizados na Função', 'Férias', 'Terço Constitucional', 'Décimo Terceiro', 'Incidência', 'Multa do FGTS', 'Total Retido para a Função']
    ];

    worksheetRet.addRows(rowHeaders);

    worksheetRet.columns = [
      {header: rowHeaders[1], key: 'funcao', width: 40},
      {header: rowHeaders[2], key: 'numFunc', width: 30},
      {header: rowHeaders[3], key: 'ferias', width: 20},
      {header: rowHeaders[4], key: 'terco', width: 25},
      {header: rowHeaders[5], key: 'decterc', width: 25},
      {header: rowHeaders[6], key: 'incidencia', width: 20},
      {header: rowHeaders[7], key: 'fgts', width: 20},
      {header: rowHeaders[8], key: 'total', width: 20},
    ];

    worksheetRet.getRow(4).font = {name: 'Arial', size: 18};
    worksheetRet.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetRet.getRow(4).height = 70;

    worksheetRet.getColumn('ferias').numFmt = 'R$ #,##0.00';
    worksheetRet.getColumn('terco').numFmt = 'R$ #,##0.00';
    worksheetRet.getColumn('decterc').numFmt = 'R$ #,##0.00';
    worksheetRet.getColumn('incidencia').numFmt = 'R$ #,##0.00';
    worksheetRet.getColumn('fgts').numFmt = 'R$ #,##0.00';
    worksheetRet.getColumn('total').numFmt = 'R$ #,##0.00';

    let row;
    let i;
    let j;
    for (i = 0; i < this.calculos.length; i++) {
      if (dataRef === this.calculos[i].dataReferencia) {
        for (j = 0; j < this.calculos[i].totais.length; j++) {
          row = worksheetRet.getRow(j + 5);
          row.getCell(1).value = this.calculos[i].totais[j].funcao;
          row.getCell(2).value = this.calculos[i].totais[j].numeroTerceirizados;
          row.getCell(3).value = this.calculos[i].totais[j].ferias;
          row.getCell(4).value = this.calculos[i].totais[j].tercoConstitucional;
          row.getCell(5).value = this.calculos[i].totais[j].decimoTerceiro;
          row.getCell(6).value = this.calculos[i].totais[j].incidencia;
          row.getCell(7).value = this.calculos[i].totais[j].multaFGTS;
          row.getCell(8).value = this.calculos[i].totais[j].total;
        }
        break;
      }
    }

    worksheetRet.getRow(j + 6).getCell(2).value = 'Subtotais';
    worksheetRet.getRow(j + 6).font = {name: 'Arial', bold: true};
    worksheetRet.getRow(j + 6).getCell(3).value = this.somaFerias;
    worksheetRet.getRow(j + 6).getCell(4).value = this.somaTerco;
    worksheetRet.getRow(j + 6).getCell(5).value = this.somaDecimo;
    worksheetRet.getRow(j + 6).getCell(6).value = this.somaIncidencia;
    worksheetRet.getRow(j + 6).getCell(7).value = this.somaMultaFGTS;

    worksheetRet.getRow(j + 7).getCell(2).value = 'Total';
    worksheetRet.getRow(j + 7).font = {name: 'Arial', bold: true};
    worksheetRet.getRow(j + 7).getCell(8).value = this.somaSaldo;

    for (let x = 5; x <= 200; x++) {
      worksheetRet.getRow(x).height = 30;
      worksheetRet.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    let k = 9;
    while (k <= 16384) {
      const dobCol = worksheetRet.getColumn(k);
      dobCol.hidden = true;
      k++;
    }

    workbookRet.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Retenções-' + dataRef + '.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
