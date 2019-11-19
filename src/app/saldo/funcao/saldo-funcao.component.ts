import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {ConfigService} from '../../_shared/config.service';
import {ContratosService} from '../../contratos/contratos.service';
import {SaldoFuncao} from './saldo-funcao';
import {SaldoService} from '../saldo.service';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-saldo-component',
    templateUrl: './saldo-funcao.component.html',
    styleUrls: ['../saldo.component.scss']
})

export class SaldoFuncaoComponent {
    @Input() codigoContrato: number;
    contratos: Contrato[];
    isSelected = false;
    saldos: SaldoFuncao[];
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
                this.saldoService.getSaldoFuncao(this.codigoContrato).subscribe(res2 => {
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
                        this.somaFerias = this.somaFerias + this.saldos[i].valorFeriasRetido - this.saldos[i].valorFeriasRestituido;
                        this.somaTerco = this.somaTerco + this.saldos[i].valorTercoRetido - this.saldos[i].valorTercoRestituido;
                        this.somaDecimo = this.somaDecimo + this.saldos[i].valorDecimoTerceiroRetido - this.saldos[i].valorDecimoTerceiroRestituido;
                        this.somaIncidencia = this.somaIncidencia + (this.saldos[i].valorIncidenciaRetido - this.saldos[i].valorIncidenciaFeriasRestituido -
                          this.saldos[i].valorIncidenciaTercoRestituido - this.saldos[i].valorIncidenciaDecimoTerceiroRestituido);
                        this.somaMultaFGTS = this.somaMultaFGTS + this.saldos[i].valorMultaFGTSRetido - this.saldos[i].valorMultaFGTSRestituido;
                        this.somaSaldo = this.somaSaldo + this.saldos[i].valorSaldo;

                      }
                    }
                });
            }
        });
    }

    defineCodigoContrato(codigoContrato: number): void {
        this.codigoContrato = codigoContrato;
        if (this.codigoContrato) {
            this.saldoService.getSaldoFuncao(this.codigoContrato).subscribe(res2 => {
                this.saldos = res2;
                console.log(res2);
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
                    this.somaFerias = this.somaFerias + this.saldos[i].valorFeriasRetido - this.saldos[i].valorFeriasRestituido;
                    this.somaTerco = this.somaTerco + this.saldos[i].valorTercoRetido - this.saldos[i].valorTercoRestituido;
                    this.somaDecimo = this.somaDecimo + this.saldos[i].valorDecimoTerceiroRetido - this.saldos[i].valorDecimoTerceiroRestituido;
                    this.somaIncidencia = this.somaIncidencia + (this.saldos[i].valorIncidenciaRetido - this.saldos[i].valorIncidenciaFeriasRestituido -
                      this.saldos[i].valorIncidenciaTercoRestituido - this.saldos[i].valorIncidenciaDecimoTerceiroRestituido);
                    this.somaMultaFGTS = this.somaMultaFGTS + this.saldos[i].valorMultaFGTSRetido - this.saldos[i].valorMultaFGTSRestituido;
                    this.somaSaldo = this.somaSaldo + this.saldos[i].valorSaldo;

                  }
                }
            });
        }
    }

  gerarRelatorioExcel(nomeEmpresa, cod) {
    const workbookSaldoFun = new Workbook();
    const worksheetSaldoFun = workbookSaldoFun.addWorksheet('Relatório-Saldo-Individual', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 2,
        fitToWidth: 1,
        paperSize: 9
      }
    });

    worksheetSaldoFun.mergeCells('A1:G1');
    const rowEmpresa = worksheetSaldoFun.getCell('A1').value = nomeEmpresa;
    worksheetSaldoFun.getCell('A1').font = {name: 'Arial', size: 18};
    worksheetSaldoFun.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetSaldoFun.addRow(rowEmpresa);
    worksheetSaldoFun.getRow(1).height = 30;

    const nomeRelatorio = 'Relatório de Saldos por Funções do Contrato';
    worksheetSaldoFun.mergeCells('A2:G2');
    const rowRel = worksheetSaldoFun.getCell('A2').value = nomeRelatorio;
    worksheetSaldoFun.getCell('A2').font = {name: 'Arial', size: 18};
    worksheetSaldoFun.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetSaldoFun.addRow(rowRel);
    worksheetSaldoFun.getRow(2).height = 30;

    const rowHeaders = [
      ['Função', 'Saldo Férias', 'Saldo Terço Constitucional', 'Saldo Décimo Terceiro', 'Saldo Incidência', 'Saldo Multa do FGTS', 'Saldo Total']
    ];

    worksheetSaldoFun.addRows(rowHeaders);

    worksheetSaldoFun.columns = [
      {header: rowHeaders[1], key: 'funcao', width: 60},
      {header: rowHeaders[2], key: 'ferias', width: 20},
      {header: rowHeaders[3], key: 'terco', width: 25},
      {header: rowHeaders[4], key: 'decterc', width: 25},
      {header: rowHeaders[5], key: 'incidencia', width: 20},
      {header: rowHeaders[6], key: 'fgts', width: 20},
      {header: rowHeaders[7], key: 'total', width: 20},
    ];

    worksheetSaldoFun.getRow(4).font = {name: 'Arial', size: 18};
    worksheetSaldoFun.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetSaldoFun.getRow(4).height = 70;

    worksheetSaldoFun.getColumn('ferias').numFmt = 'R$ #,##0.00';
    worksheetSaldoFun.getColumn('terco').numFmt = 'R$ #,##0.00';
    worksheetSaldoFun.getColumn('decterc').numFmt = 'R$ #,##0.00';
    worksheetSaldoFun.getColumn('incidencia').numFmt = 'R$ #,##0.00';
    worksheetSaldoFun.getColumn('fgts').numFmt = 'R$ #,##0.00';
    worksheetSaldoFun.getColumn('total').numFmt = 'R$ #,##0.00';

    let row;
    let i;
    if (cod) {
      for (i = 0; i < this.saldos.length; i++) {
        row = worksheetSaldoFun.getRow(i + 5);
        row.getCell(1).value = this.saldos[i].funcao;
        row.getCell(2).value = this.saldos[i].valorFeriasRetido - this.saldos[i].valorFeriasRestituido;
        row.getCell(3).value = this.saldos[i].valorTercoRetido - this.saldos[i].valorTercoRestituido;
        row.getCell(4).value = this.saldos[i].valorDecimoTerceiroRetido - this.saldos[i].valorDecimoTerceiroRestituido;
        row.getCell(5).value = this.saldos[i].valorIncidenciaRetido - this.saldos[i].valorIncidenciaFeriasRestituido -
          this.saldos[i].valorIncidenciaTercoRestituido - this.saldos[i].valorIncidenciaDecimoTerceiroRestituido;
        row.getCell(6).value = this.saldos[i].valorMultaFGTSRetido - this.saldos[i].valorMultaFGTSRestituido;
        row.getCell(7).value = this.saldos[i].valorSaldo;
      }
    }

    for (let x = 5; x <= 200; x++) {
      worksheetSaldoFun.getRow(x).height = 20;
      worksheetSaldoFun.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    let k = 8;
    while (k <= 16384) {
      const dobCol = worksheetSaldoFun.getColumn(k);
      dobCol.hidden = true;
      k++;
    }

    workbookSaldoFun.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Saldo-Por-Função.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
