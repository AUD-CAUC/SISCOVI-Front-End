import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {FeriasService} from '../ferias.service';
import {ContratosService} from '../../contratos/contratos.service';
import {FeriasCalculosPendentes} from './ferias-calculos-pendentes';
import {ConfigService} from '../../_shared/config.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-ferias-calculos-pendentes-execucao',
  templateUrl: './ferias-calculos-pendentes-execucao.component.html',
  styleUrls: ['./ferias-calculos-pendentes.component.scss']
})
export class FeriasCalculosPendentesExecucaoComponent implements OnInit {
  contratos: Contrato[];
  @Input() codigoContrato = 0;
  isSelected: boolean[] = [];
  @Input() calculosPendentesExecucao: ListaCalculosPendentes[];
  calculosAvaliados: ListaCalculosPendentes[];
  calculosNegados: ListaCalculosPendentes[];
  config: ConfigService;
  feriasForm: FormGroup;
  feriasFormAfter: FormGroup;
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  modalActions5 = new EventEmitter<string | MaterializeAction>();
  @Output() nav = new EventEmitter();
  notifications: number;
  somaFerias: number[];
  somaTerco: number[];
  somaDecimo: number[];
  somaIncidenciaFerias: number[];
  somaIncidenciaTerco: number[];
  somaSaldo: number[];
  isLoading = false;

  constructor(private feriasService: FeriasService, private contratoService: ContratosService, config: ConfigService,
              private fb: FormBuilder, private ref: ChangeDetectorRef) {
    this.config = config;

    this.feriasService.getCalculosPendentesExecucao().subscribe(res => {
      this.calculosPendentesExecucao = res;

      if (this.calculosPendentesExecucao.length === 0) {
        this.calculosPendentesExecucao = null;
      }

      this.ref.markForCheck();
    });

    this.feriasService.getCalculosNaoPendentesNegados().subscribe(res3 => {
      this.calculosNegados = res3;
      if (this.calculosNegados.length === 0) {
        this.calculosNegados = null;
      }else {
        this.notifications = this.calculosNegados.length;
      }
      this.ref.markForCheck();
    }, error1 => {
      this.calculosNegados = null;
    });

  }

  ngOnInit() {
    if (this.calculosPendentesExecucao.length === 0) {
      this.calculosPendentesExecucao = null;
    } else {
      this.isSelected = new Array(this.calculosPendentesExecucao.length).fill(false);
      this.somaFerias = new Array(this.calculosPendentesExecucao.length).fill(0);
      this.somaTerco = new Array(this.calculosPendentesExecucao.length).fill(0);
      this.somaDecimo = new Array(this.calculosPendentesExecucao.length).fill(0);
      this.somaIncidenciaFerias = new Array(this.calculosPendentesExecucao.length).fill(0);
      this.somaIncidenciaTerco = new Array(this.calculosPendentesExecucao.length).fill(0);
      this.somaSaldo = new Array(this.calculosPendentesExecucao.length).fill(0);
      for (let i = 0; i < this.calculosPendentesExecucao.length; i++) {
        if (this.calculosPendentesExecucao[i].calculos.length > 0) {
          for (let j = 0; j < this.calculosPendentesExecucao[i].calculos.length; j++) {
            this.somaFerias[i] = this.somaFerias[i] +
              this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalFerias;
            this.somaTerco[i] = this.somaTerco[i] +
              this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalTercoConstitucional;
            this.somaIncidenciaFerias[i] = this.somaIncidenciaFerias[i] +
              this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalIncidenciaFerias;
            this.somaIncidenciaTerco[i] = this.somaIncidenciaTerco[i] +
              this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalIncidenciaTerco;
            this.somaSaldo[i] = this.somaSaldo[i] + this.calculosPendentesExecucao[i].calculos[j].total;
          }
        }
      }
      this.formInit();
      this.ref.markForCheck();
    }
  }

  formInit() {
    if (this.calculosPendentesExecucao) {
      this.feriasForm = this.fb.group({
        contratos: this.fb.array([])
      });
      if (this.calculosPendentesExecucao) {
        this.calculosPendentesExecucao.forEach(calculoPendente => {
          const control = <FormArray>this.feriasForm.controls.contratos;
          const newControl = this.fb.group({
            titulo: new FormControl(calculoPendente.titulo),
            codigo: new FormControl(calculoPendente.codigo),
            avaliacaoCalculoFerias: this.fb.array([])
          });
          calculoPendente.calculos.forEach(() => {
            const newControl2 = <FormArray>newControl.controls.avaliacaoCalculoFerias;
            const addControl = this.fb.group({
              selected: new FormControl(),
              avaliacao: new FormControl('S')
            });
            newControl2.push(addControl);
          });
          control.push(newControl);
        });
      }
    }
    this.feriasFormAfter = this.fb.group({
      calculosAvaliados: this.fb.array([])
    });
    this.ref.detectChanges();
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  openModal2() {
    this.modalActions2.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.modalActions2.emit({action: 'modal', params: ['close']});
    this.calculosAvaliados = [];
    this.feriasFormAfter = this.fb.group({
      calculosAvaliados: this.fb.array([])
    });
  }

  openModal3() {
    this.modalActions3.emit({action: 'modal', params: ['open']});
  }

  closeModal3() {
    this.modalActions3.emit({action: 'modal', params: ['close']});
    this.nav.emit(this.codigoContrato);
  }

  openModal4() {
    this.modalActions4.emit({action: 'modal', params: ['open']});
  }

  closeModal4() {
    this.modalActions4.emit({action: 'modal', params: ['close']});
  }

  openModal5() {
    this.modalActions5.emit({action: 'modal', params: ['open']});
  }

  closeModal5() {
    this.modalActions5.emit({action: 'modal', params: ['close']});
  }

  verificaFormulario() {
    let aux = 0;
    this.calculosAvaliados = [];
    for (let i = 0; i < this.calculosPendentesExecucao.length; i++) {
      const lista = new ListaCalculosPendentes();
      lista.calculos = [];
      for (let j = 0; j < this.calculosPendentesExecucao[i].calculos.length; j++) {
        if (this.feriasForm.get('contratos').get('' + i).get('avaliacaoCalculoFerias').get('' + j).get('selected').value) {
          aux++;
          const temp: FeriasCalculosPendentes = this.calculosPendentesExecucao[i].calculos[j];
          temp.status = this.feriasForm.get('contratos').get('' + i).get('avaliacaoCalculoFerias').get('' + j).get('avaliacao').value;
          lista.titulo = this.feriasForm.get('contratos').get('' + i).get('titulo').value;
          lista.codigo = this.feriasForm.get('contratos').get('' + i).get('codigo').value;
          lista.calculos.push(temp);
        }
      }
      this.calculosAvaliados.push(lista);
    }
    if (aux === 0) {
      this.openModal();
    } else {
      const control = <FormArray>this.feriasFormAfter.controls.calculosAvaliados;
      this.calculosAvaliados.forEach(item => {
        const newControl = this.fb.group({
          calculos: this.fb.array([])
        });
        item.calculos.forEach((calc) => {
          const newControl2 = <FormArray>newControl.controls.calculos;
          const addControl = this.fb.group((calc.status === 'NEGADO') ? {
            observacoes: new FormControl('', [Validators.required])
          } : {
              observacoes: new FormControl('')
            }
          );
          newControl2.push(addControl);
        });
        control.push(newControl);
      });
      this.openModal2();
    }
  }

  salvarAlteracoes() {
    this.isLoading = true;
    for (let i = 0; i < this.calculosAvaliados.length; i++) {
      for (let j = 0; j < this.calculosAvaliados[i].calculos.length; j++) {
        this.calculosAvaliados[i].calculos[j].observacoes = this.feriasFormAfter
          .get('calculosAvaliados')
          .get('' + i)
          .get('calculos').get('' + j)
          .get('observacoes').value;
      }
    }
    this.feriasService.salvarExecucaoFerias(this.calculosAvaliados).subscribe(res => {
        this.isLoading = false;
        this.closeModal2();
        this.openModal3();
      },
      error1 => {
        this.isLoading = false;
        this.closeModal2();
        this.openModal5();
      });
  }
  captureScreen(nomeEmpresa, existeNegados) {

    if (this.calculosNegados && existeNegados === 1) {
      const data1 = document.getElementById(nomeEmpresa);
      html2canvas(data1, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
        // Few necessary setting options
        const imgWidth = 295;
        const pageHeight = 205;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/jpg');
        const pdf = new JsPDF('l', 'mm', 'a4'); // A4 size page of PDF
        let position = 40;

        pdf.setFontSize(12);
        pdf.text('Relatório de Cálculos de Execução Negados', 147.5, 15, {align: 'center'});
        pdf.text(nomeEmpresa, 147.5, 25, {align: 'center'});
        // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
        pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + position;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
          // pdf.text('Saldo Individual', 105, 15, {align: 'center'});
          heightLeft -= pageHeight;
        }

        pdf.viewerPreferences({
          FitWindow: true
        });

        // dataReferencia = dataReferencia.split('-');


        pdf.save('Relatório_Férias_' + nomeEmpresa + ' Negadas_Execução.pdf'); // Generated PDF
      });
    } else {
      const data2 = document.getElementById(nomeEmpresa);
      html2canvas(data2, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
        // Few necessary setting options
        const imgWidth = 205;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/jpg');
        const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        let position = 35;

        // dataReferencia = dataReferencia.split('-');

        pdf.setFontSize(12);
        pdf.text('Restituição Pendente de Execução', 102.5, 15, {align: 'center'});
        pdf.text(nomeEmpresa, 102.5, 25, {align: 'center'});
        // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
        pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + position;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
          // pdf.text('Saldo Individual', 105, 15, {align: 'center'});
          heightLeft -= pageHeight;
        }

        pdf.viewerPreferences({
          FitWindow: true
        });


        pdf.save('Relatório_Férias_' + nomeEmpresa + '_Execução.pdf'); // Generated PDF
      });
    }
  }

  formatDate(str) {
    return str.split('-').reverse().join('/');
  }

  formatParcela(num) {
    let parcela: string;
    if (num === 0) {
      parcela = 'Única';
    } else if (num === 1) {
      parcela = 'Primeira';
    } else if (num === 2) {
      parcela = 'Segunda';
    } else if (num === 3) {
      parcela = 'Terceira';
    }
    return parcela;
  }

  gerarRelatorioExcel(nomeEmpresa) {
    const workbookFeriasExec = new Workbook();
    const worksheetFeriasExec = workbookFeriasExec.addWorksheet('Relatório 13º Restituição Aprov', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 2,
        fitToWidth: 1,
        paperSize: 9
      }
    });
    worksheetFeriasExec.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.5, bottom: 0.5,
      header: 0.3, footer: 0.3
    };

    worksheetFeriasExec.mergeCells('A1:N1');
    const rowEmpresa = worksheetFeriasExec.getCell('A1').value = nomeEmpresa;
    worksheetFeriasExec.getCell('A1').font = {name: 'Arial', size: 18};
    worksheetFeriasExec.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetFeriasExec.addRow(rowEmpresa);
    worksheetFeriasExec.getRow(1).height = 30;

    const nomeRelatorio = 'Relatório de Pendências de Execução - Férias';
    worksheetFeriasExec.mergeCells('A2:N2');
    const rowRelAprov = worksheetFeriasExec.getCell('A2').value = nomeRelatorio;
    worksheetFeriasExec.getCell('A2').font = {name: 'Arial', size: 18};
    worksheetFeriasExec.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetFeriasExec.addRow(rowRelAprov);
    worksheetFeriasExec.getRow(2).height = 30;

    const rowHeaders = [
      ['Terceirizado', 'Função', 'Tipo de\nRestituição', 'Parcela', 'Início do\nPeríodo Aquisitivo', 'Fim do\nPeríodo Aquisitivo',
        'Início do\nUsufruto', 'Fim do\nUsufruto', 'Dias\nVendidos', 'Valor de\nFérias', 'Valor do\nTerço', 'Incidência\nSobre Férias',
        'Incidência\nSobre o Terço', 'Total']
    ];

    worksheetFeriasExec.addRows(rowHeaders);

    worksheetFeriasExec.columns = [
      {header: rowHeaders[1], key: 'terceirizado', width: 40},
      {header: rowHeaders[2], key: 'funcao', width: 65},
      {header: rowHeaders[3], key: 'tipo', width: 20},
      {header: rowHeaders[4], key: 'parcela', width: 15},
      {header: rowHeaders[5], key: 'inicioPA', width: 35},
      {header: rowHeaders[6], key: 'Fim PA', width: 35},
      {header: rowHeaders[7], key: 'inicioUsufruto', width: 20},
      {header: rowHeaders[8], key: 'fimUsufruto', width: 20},
      {header: rowHeaders[9], key: 'diasVendidos', width: 17},
      {header: rowHeaders[10], key: 'valorFerias', width: 20},
      {header: rowHeaders[11], key: 'valorTerco', width: 20},
      {header: rowHeaders[12], key: 'incidFerias', width: 25},
      {header: rowHeaders[13], key: 'incidTerco', width: 25},
      {header: rowHeaders[14], key: 'Total', width: 20},
    ];

    worksheetFeriasExec.getRow(4).font = {name: 'Arial', size: 18};
    worksheetFeriasExec.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetFeriasExec.getRow(4).height = 70;

    worksheetFeriasExec.getColumn('valorFerias').numFmt = 'R$ #,##0.00';
    worksheetFeriasExec.getColumn('valorTerco').numFmt = 'R$ #,##0.00';
    worksheetFeriasExec.getColumn('incidFerias').numFmt = 'R$ #,##0.00';
    worksheetFeriasExec.getColumn('incidTerco').numFmt = 'R$ #,##0.00';
    worksheetFeriasExec.getColumn('Total').numFmt = 'R$ #,##0.00';

    let row;
    let i, j;
    for (i = 0; i < this.calculosPendentesExecucao.length; i++) {
      if (this.calculosPendentesExecucao[i].titulo === nomeEmpresa) {
        for (j = 0; j < this.calculosPendentesExecucao[i].calculos.length; j++) {
          row = worksheetFeriasExec.getRow(j + 5);
          row.getCell(1).value = this.calculosPendentesExecucao[i].calculos[j].nomeTerceirizado;
          row.getCell(2).value = this.calculosPendentesExecucao[i].calculos[j].nomeCargo;
          row.getCell(3).value = this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.tipoRestituicao;
          row.getCell(4).value = this.formatParcela(this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.parcelas);
          row.getCell(5).value = this.formatDate(this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.inicioPeriodoAquisitivo);
          row.getCell(6).value = this.formatDate(this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.fimPeriodoAquisitivo);
          row.getCell(7).value = this.formatDate(this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.inicioFerias);
          row.getCell(8).value = this.formatDate(this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.fimFerias);
          row.getCell(9).value = this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.diasVendidos;
          row.getCell(10).value = this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalFerias;
          row.getCell(11).value = this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalTercoConstitucional;
          row.getCell(12).value = this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalIncidenciaFerias;
          row.getCell(13).value = this.calculosPendentesExecucao[i].calculos[j].calcularFeriasModel.pTotalIncidenciaTerco;
          row.getCell(14).value = this.calculosPendentesExecucao[i].calculos[j].total;
        }
        break;
      }
    }

    worksheetFeriasExec.getRow(j + 6).getCell(9).value = 'Subtotais';
    worksheetFeriasExec.getRow(j + 6).font = {name: 'Arial', bold: true};
    worksheetFeriasExec.getRow(j + 6).getCell(10).value = this.somaFerias[i];
    worksheetFeriasExec.getRow(j + 6).getCell(11).value = this.somaTerco[i];
    worksheetFeriasExec.getRow(j + 6).getCell(12).value = this.somaIncidenciaFerias[i];
    worksheetFeriasExec.getRow(j + 6).getCell(13).value = this.somaIncidenciaTerco[i];

    worksheetFeriasExec.getRow(j + 7).getCell(9).value = 'Total';
    worksheetFeriasExec.getRow(j + 7).font = {name: 'Arial', bold: true};
    worksheetFeriasExec.getRow(j + 7).getCell(14).value = this.somaSaldo[i];

    for (let x = 5; x <= 200; x++) {
      worksheetFeriasExec.getRow(x).height = 30;
      worksheetFeriasExec.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    let k = 15;
    while (k <= 16384) {
      const dobCol = worksheetFeriasExec.getColumn(k);
      dobCol.hidden = true;
      k++;
    }

    workbookFeriasExec.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Calculos-Pendentes-Execução.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
