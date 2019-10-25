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
import {fontSize} from "html2canvas/dist/types/css/property-descriptors/font-size";
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';
import {isLoop} from 'tslint';

@Component({
  selector: 'app-ferias-calculos-pendentes',
  templateUrl: './ferias-calculos-pendentes.component.html',
  styleUrls: ['./ferias-calculos-pendentes.component.scss']
})
export class FeriasCalculosPendentesComponent implements OnInit {
  contratos: Contrato[];
  isSelected: boolean[] = [];
  @Input() calculosPendentes: ListaCalculosPendentes[];
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
  notifications: number;
  somaFerias: number[] = [];
  somaTerco: number[] = [];
  somaDecimo: number[] = [];
  somaIncidenciaFerias: number[] = [];
  somaIncidenciaTerco: number[] = [];
  somaSaldo: number[] = [];
  isLoading = false;
  @Output() nav = new EventEmitter();

  constructor(private feriasService: FeriasService, private contratoService: ContratosService, config: ConfigService,
              private fb: FormBuilder, private ref: ChangeDetectorRef) {
    this.config = config;

    this.feriasService.getCalculosPendentes().subscribe(res => {
      this.calculosPendentes = res;

      if (this.calculosPendentes.length === 0) {
        this.calculosPendentes = null;
      }

      this.ref.markForCheck();
    });

    this.feriasService.getCalculosPendentesNegados().subscribe(res3 => {
      this.calculosNegados = res3;
      this.notifications = this.calculosNegados.length;
      this.ref.markForCheck();
    }, () => {
      this.calculosNegados = null;
    });
  }

  ngOnInit() {
    if (this.calculosPendentes) {
      if (this.calculosPendentes.length === 0) {
        this.calculosPendentes = null;
      } else {
        this.isSelected = new Array(this.calculosPendentes.length).fill(false);
        this.somaFerias = new Array(this.calculosPendentes.length).fill(0);
        this.somaTerco = new Array(this.calculosPendentes.length).fill(0);
        this.somaDecimo = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaFerias = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaTerco = new Array(this.calculosPendentes.length).fill(0);
        this.somaSaldo = new Array(this.calculosPendentes.length).fill(0);
        for (let i = 0; i < this.calculosPendentes.length; i++) {
          for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
            this.somaFerias[i] = this.somaFerias[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalFerias;
            this.somaTerco[i] = this.somaTerco[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalTercoConstitucional;
            this.somaIncidenciaFerias[i] = this.somaIncidenciaFerias[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalIncidenciaFerias;
            this.somaIncidenciaTerco[i] = this.somaIncidenciaTerco[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalIncidenciaTerco;
            this.somaSaldo[i] = this.somaSaldo[i] + this.calculosPendentes[i].calculos[j].total;
          }
        }
        this.ref.markForCheck();
      }
      this.formInit();
    }
  }

  formInit() {

    if (this.calculosPendentes) {
      this.feriasForm = this.fb.group({
        contratos: this.fb.array([])
      });
      if (this.calculosPendentes) {
        this.calculosPendentes.forEach(calculoPendente => {
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

  /*defineCodigoContrato(codigoContrato: number): void {
    this.codigoContrato = codigoContrato;
    if (this.codigoContrato) {
      this.feriasService.getCalculosPendentes().subscribe(res2 => {
        this.calculosPendentes = res2;
        if (this.calculosPendentes.length === 0) {
          this.calculosPendentes = null;
        } else {
          this.formInit();
        }
      });
      this.feriasService.getCalculosPendentesNegados().subscribe(res3 => {
        const historico: ListaCalculosPendentes[] = res3;
        this.calculosNegados = historico;
        this.notifications = this.calculosNegados.length;
        this.ref.markForCheck();
      });
    }
  }*/

  verificaFormulario() {
    let aux = 0;
    this.calculosAvaliados = [];
    for (let i = 0; i < this.calculosPendentes.length; i++) {
      const lista = new ListaCalculosPendentes();
      lista.calculos = [];
      for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
        if (this.feriasForm.get('contratos').get('' + i).get('avaliacaoCalculoFerias').get('' + j).get('selected').value) {
          aux++;
          const temp: FeriasCalculosPendentes = this.calculosPendentes[i].calculos[j];
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
          const addControl = this.fb.group((calc.status === 'N') ? {
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
    this.feriasService.salvarFeriasAvaliadasLista(this.calculosAvaliados).subscribe(() => {
      this.isLoading = false;
      this.closeModal2();
      this.openModal3();
    },
      () => {
      this.isLoading = false;
        this.closeModal2();
        this.openModal5();
      });
  }

  navegaViewExec() {
    this.closeModal3();
    this.nav.emit();
  }
  captureScreen(nomeEmpresa, existeNegados) {
    if (this.calculosNegados && existeNegados === 1) {
          const data1 = document.getElementById(nomeEmpresa);
          html2canvas(data1, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
            // Few necessary setting options
            const imgWidth = 205;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/jpg');
            const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
            let position = 35;
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
            pdf.setFontSize(12);
            pdf.text('Relatório de Cáculos Negados', 102.5, 15, {align: 'center'});
            pdf.text(nomeEmpresa, 102.5, 25, {align: 'center'});
            // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
            pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);


            pdf.save('Relatório_Férias_' + nomeEmpresa + '_Negadas.pdf'); // Generated PDF
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
        pdf.text('Restituição Pendente de Aprovação', 102.5, 15, {align: 'center'});
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

        pdf.save('Relatório_Férias_' + nomeEmpresa + '_Aprovação.pdf'); // Generated PDF
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
    const workbookFeriasAprov = new Workbook();
    const worksheetFeriasAprov = workbookFeriasAprov.addWorksheet('Relatório 13º Restituição Aprov', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 2,
        fitToWidth: 1,
        paperSize: 9
      }
    });

    worksheetFeriasAprov.eachRow({includeEmpty: true}, function (rowW) {
      rowW.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    });

    worksheetFeriasAprov.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.5, bottom: 0.5,
      header: 0.3, footer: 0.3
    };

    worksheetFeriasAprov.mergeCells('A1:N1');
    const rowEmpresa = worksheetFeriasAprov.getCell('A1').value = nomeEmpresa;
    worksheetFeriasAprov.getCell('A1').font = {name: 'Arial', size: 18};
    worksheetFeriasAprov.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetFeriasAprov.addRow(rowEmpresa);
    worksheetFeriasAprov.getRow(1).height = 30;

    const nomeRelatorio = 'Relatório de Pendências de Aprovação - Férias';
    worksheetFeriasAprov.mergeCells('A2:N2');
    const rowRelAprov = worksheetFeriasAprov.getCell('A2').value = nomeRelatorio;
    worksheetFeriasAprov.getCell('A2').font = {name: 'Arial', size: 18};
    worksheetFeriasAprov.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetFeriasAprov.addRow(rowRelAprov);
    worksheetFeriasAprov.getRow(2).height = 30;

    const rowHeaders = [
      ['Terceirizado', 'Função', 'Tipo de\nRestituição', 'Parcela', 'Início do\nPeríodo Aquisitivo', 'Fim do\nPeríodo Aquisitivo',
        'Início do\nUsufruto', 'Fim do\nUsufruto', 'Dias\nVendidos', 'Valor de\nFérias', 'Valor do\nTerço', 'Incidência\nSobre Férias',
        'Incidência\nSobre o Terço', 'Total']
    ];

    worksheetFeriasAprov.addRows(rowHeaders);

    worksheetFeriasAprov.columns = [
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
      // {header: nomeEmpresa, key: 'contrato', width: 57}
    ];

    worksheetFeriasAprov.getRow(4).font = {name: 'Arial', size: 18};
    worksheetFeriasAprov.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetFeriasAprov.getRow(4).height = 70;

    worksheetFeriasAprov.getColumn('valorFerias').numFmt = 'R$ #,##0.00';
    worksheetFeriasAprov.getColumn('valorTerco').numFmt = 'R$ #,##0.00';
    worksheetFeriasAprov.getColumn('incidFerias').numFmt = 'R$ #,##0.00';
    worksheetFeriasAprov.getColumn('incidTerco').numFmt = 'R$ #,##0.00';
    worksheetFeriasAprov.getColumn('Total').numFmt = 'R$ #,##0.00';

    let row;
    let i, k;

    for (i = 0; i < this.calculosPendentes.length; i++) {
      if (this.calculosPendentes[i].titulo === nomeEmpresa) {
        for (k = 0; k < this.calculosPendentes[i].calculos.length; k++) {
          row = worksheetFeriasAprov.getRow(k + 5);
          row.getCell(1).value = this.calculosPendentes[i].calculos[k].nomeTerceirizado;
          row.getCell(2).value = this.calculosPendentes[i].calculos[k].nomeCargo;
          row.getCell(3).value = this.calculosPendentes[i].calculos[k].calcularFeriasModel.tipoRestituicao;
          row.getCell(4).value = this.formatParcela(this.calculosPendentes[i].calculos[k].calcularFeriasModel.parcelas);
          row.getCell(5).value = this.formatDate(this.calculosPendentes[i].calculos[k].calcularFeriasModel.inicioPeriodoAquisitivo);
          row.getCell(6).value = this.formatDate(this.calculosPendentes[i].calculos[k].calcularFeriasModel.fimPeriodoAquisitivo);
          row.getCell(7).value = this.formatDate(this.calculosPendentes[i].calculos[k].calcularFeriasModel.inicioFerias);
          row.getCell(8).value = this.formatDate(this.calculosPendentes[i].calculos[k].calcularFeriasModel.fimFerias);
          row.getCell(9).value = this.calculosPendentes[i].calculos[k].calcularFeriasModel.diasVendidos;
          row.getCell(10).value = this.calculosPendentes[i].calculos[k].calcularFeriasModel.pTotalFerias;
          row.getCell(11).value = this.calculosPendentes[i].calculos[k].calcularFeriasModel.pTotalTercoConstitucional;
          row.getCell(12).value = this.calculosPendentes[i].calculos[k].calcularFeriasModel.pTotalIncidenciaFerias;
          row.getCell(13).value = this.calculosPendentes[i].calculos[k].calcularFeriasModel.pTotalIncidenciaTerco;
          row.getCell(14).value = this.calculosPendentes[i].calculos[k].total;
        }
        break;
      }
    }

    worksheetFeriasAprov.getRow(k + 6).getCell(9).value = 'Subtotal';
    worksheetFeriasAprov.getRow(k + 6).font = {name: 'Arial', bold: true};
    worksheetFeriasAprov.getRow(k + 6).getCell(10).value = this.somaFerias[i];
    worksheetFeriasAprov.getRow(k + 6).getCell(11).value = this.somaTerco[i];
    worksheetFeriasAprov.getRow(k + 6).getCell(12).value = this.somaIncidenciaFerias[i];
    worksheetFeriasAprov.getRow(k + 6).getCell(13).value = this.somaIncidenciaTerco[i];

    worksheetFeriasAprov.getRow(k + 7).getCell(9).value = 'Total';
    worksheetFeriasAprov.getRow(k + 7).font = {name: 'Arial', bold: true};
    worksheetFeriasAprov.getRow(k + 7).getCell(14).value = this.somaSaldo[i];

    for (let x = 5; x <= 200; x++) {
      worksheetFeriasAprov.getRow(x).height = 30;
      worksheetFeriasAprov.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    let j = 15;
    while (j <= 16384) {
      const dobCol = worksheetFeriasAprov.getColumn(j);
      dobCol.hidden = true;
      j++;
    }

    workbookFeriasAprov.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Calculos-Pendentes-Aprovação.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
