import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {MaterializeAction} from 'angular2-materialize';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ConfigService} from '../../_shared/config.service';
import {DecimoTerceiroService} from '../decimo-terceiro.service';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';
import {DecimoTerceiroPendente} from './decimo-terceiro-pendente';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-decimo-terceiro-pendente-component',
  templateUrl: './decimo-terceiro-pendente.component.html',
  styleUrls: ['../decimo-terceiro.component.scss']
})
export class DecimoTerceiroPendenteComponent implements OnInit {
  contratos: Contrato[];
  isSelected: boolean[] = [];
  calculosPendentes: ListaCalculosPendentes[];
  calculosAvaliados: ListaCalculosPendentes[];
  calculosNegados: ListaCalculosPendentes[];
  config: ConfigService;
  decimoTerceiroForm: FormGroup;
  decimoTerceiroFormAfter: FormGroup;
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  modalActions5 = new EventEmitter<string | MaterializeAction>();
  notifications: number;
  somaDecimo: number[] = [];
  somaIncidencia: number[] = [];
  somaSaldo: number[] = [];
  @Output() nav = new EventEmitter();
  view = false;
  isLoading = false;
  private coluna;

  constructor(config: ConfigService, private  fb: FormBuilder, private  ref: ChangeDetectorRef,
              private decimoTerceiroService: DecimoTerceiroService) {
    this.config = config;
    this.decimoTerceiroService.getCalculosPendentesNegados().subscribe(res3 => {
      const historico: ListaCalculosPendentes[] = res3;
      this.calculosNegados = historico;
      this.notifications = this.calculosNegados.length;
      this.ref.markForCheck();
    });
  }

  ngOnInit() {
    this.decimoTerceiroService.getCalculosPendentes().subscribe(res => {
      this.calculosPendentes = res;
      console.log(res);
      if (this.calculosPendentes) {
        if (this.calculosPendentes.length === 0) {
          this.calculosPendentes = null;
          this.view = true;
        } else {
          this.isSelected = new Array(this.calculosPendentes.length).fill(false);
          this.somaDecimo = new Array(this.calculosPendentes.length).fill(0);
          this.somaIncidencia = new Array(this.calculosPendentes.length).fill(0);
          this.somaSaldo = new Array(this.calculosPendentes.length).fill(0);
          for (let i = 0; i < this.calculosPendentes.length; i++) {
            for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
              this.somaSaldo[i] = this.somaSaldo[i] +
                this.calculosPendentes[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorDecimoTerceiro +
                this.calculosPendentes[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro;
              this.somaDecimo[i] = this.somaDecimo[i] + this.calculosPendentes[i].calculos[j]
                .terceirizadoDecTer.valoresDecimoTerceiro.valorDecimoTerceiro;
              this.somaIncidencia[i] = this.somaIncidencia[i] + this.calculosPendentes[i].calculos[j]
                .terceirizadoDecTer.valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro;
              console.log(this.somaDecimo);
            }
          }
          this.ref.markForCheck();
          this.formInit();
        }
      }
    }, error2 => {
      this.calculosPendentes = null;
      this.view = true;
    });
  }

  formInit() {
    if (this.calculosPendentes) {
      this.decimoTerceiroForm = this.fb.group({
        contratos: this.fb.array([])
      });
      if (this.calculosPendentes) {
        this.calculosPendentes.forEach(calculoPendente => {
          const control = <FormArray>this.decimoTerceiroForm.controls.contratos;
          const newControl = this.fb.group({
            titulo: new FormControl(calculoPendente.titulo),
            codigo: new FormControl(calculoPendente.codigo),
            avaliacaoCalculoDecimoTerceiro: this.fb.array([])
          });
          calculoPendente.calculos.forEach(() => {
            const newControl2 = <FormArray>newControl.controls.avaliacaoCalculoDecimoTerceiro;
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
    this.view = true;
    this.ref.markForCheck();
    this.decimoTerceiroFormAfter = this.fb.group({
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
    this.decimoTerceiroFormAfter = this.fb.group({
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

  verificaFormulario() {
    let aux = 0;
    this.calculosAvaliados = [];
    for (let i = 0; i < this.calculosPendentes.length; i++) {
      const lista = new ListaCalculosPendentes();
      lista.calculos = [];
      for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
        if (this.decimoTerceiroForm.get('contratos').get('' + i).get('avaliacaoCalculoDecimoTerceiro').get('' + j).get('selected').value) {
          aux++;
          const temp: DecimoTerceiroPendente = this.calculosPendentes[i].calculos[j];
          temp.status = this.decimoTerceiroForm.get('contratos').get('' + i).get('avaliacaoCalculoDecimoTerceiro').get('' + j).get('avaliacao').value;
          lista.titulo = this.decimoTerceiroForm.get('contratos').get('' + i).get('titulo').value;
          lista.codigo = this.decimoTerceiroForm.get('contratos').get('' + i).get('codigo').value;
          lista.calculos.push(temp);
        }
      }
      this.calculosAvaliados.push(lista);
    }
    if (aux === 0) {
      this.openModal();
    } else {
      const control = <FormArray>this.decimoTerceiroFormAfter.controls.calculosAvaliados;
      this.calculosAvaliados.forEach(item => {
        const newControl = this.fb.group({
          calculos: this.fb.array([])
        });
        item.calculos.forEach(() => {
          const newControl2 = <FormArray>newControl.controls.calculos;
          const addControl = this.fb.group({
            observacoes: new FormControl(),
          });
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
        this.calculosAvaliados[i].calculos[j].observacoes = this.decimoTerceiroFormAfter
          .get('calculosAvaliados')
          .get('' + i)
          .get('calculos').get('' + j)
          .get('observacoes').value;
      }
    }
    this.decimoTerceiroService.salvarDecimoTerceiroAvaliados(this.calculosAvaliados).subscribe(res => {
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

  navegaViewExec() {
    this.closeModal3();
    this.nav.emit();
  }
  captureScreen(nomeEmpresa) {
    const data = document.getElementById(nomeEmpresa);
    html2canvas(data, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
      // Few necessary setting options
      const imgWidth = 205;
      const imgWidth1 = canvas.width;
      console.log(imgWidth1);
      const imgHeight1 = canvas.height;
      console.log(imgHeight1);
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpg');
      const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 35;

      // dataReferencia = dataReferencia.split('-');
      pdf.setFontSize(12);
      pdf.text('Restituição Pendente de Aprovação', 105, 15, {align: 'center'});
      pdf.text(nomeEmpresa, 105, 25, {align: 'center'});
      // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {

        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
        // pdf.text('Saldo Individual', 105, 15, {align: 'center'});
        heightLeft -= pageHeight;
      }

      pdf.save('Relatório_Décimo_Terceiro_' + nomeEmpresa + '_Aprovação.pdf'); // Generated PDF
    });
  }

  formatDate(str) {
    return str.split('-').reverse().join('/');
  }

  formatParcela(num) {
    console.log(num);
    let parcela: string;
    if (num === 0) {
      parcela = 'Única';
    } else if (num === 1) {
      parcela = 'Primeira';
    } else if (num === 2) {
      parcela = 'Segunda';
    }
    return parcela;
  }

  gerarRelatorioExcel(nomeEmpresa) {
    const workbookDtAprov = new Workbook();
    const worksheetDtAprov = workbookDtAprov.addWorksheet('Relatório 13º Pendências de Aprovação', {pageSetup: {fitToPage: true, fitToHeight: 5, fitToWidth: 7}});

    worksheetDtAprov.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.5, bottom: 0.5,
      header: 0.3, footer: 0.3
    };


    worksheetDtAprov.mergeCells('A1:H1'); /* merge de A1 até H1 */
    const rowEmpresa = worksheetDtAprov.getCell('A1').value = nomeEmpresa; /*Traz o contrato do front*/
    worksheetDtAprov.getCell('A1').font = {name: 'Arial', size: 18}; /*formatação da celula merjada*/
    worksheetDtAprov.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'}; /*formatação da celula merjada*/
    worksheetDtAprov.addRow(rowEmpresa); /*adiciona o contrato na linha merjada*/
    worksheetDtAprov.getRow(1).height = 30;

    worksheetDtAprov.mergeCells('A2:H2'); /* merge de A1 até H1 */
    const rowRelAprov = worksheetDtAprov.getCell('A2').value = 'Relatório de Pendências de Aprovação'; /*Traz o contrato do front*/
    worksheetDtAprov.getCell('A2').font = {name: 'Arial', size: 18}; /*formatação da celula merjada*/
    worksheetDtAprov.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'}; /*formatação da celula merjada*/
    worksheetDtAprov.addRow(rowRelAprov); /*adiciona o contrato na linha merjada*/
    worksheetDtAprov.getRow(2).height = 30;

    const rowHeaders = [
      ['Terceirizado', 'Função', 'Tipo de\nRestituição', 'Parcela', 'Data de Início\npara Contagem', 'Valor de\nDécimo Terceiro',
        'Valor de\nIncidência', 'Valor Resgatado/\nMovimentado'],
    ];
    worksheetDtAprov.addRows(rowHeaders);

    worksheetDtAprov.columns = [
      {header: rowHeaders[1], key: 'terceirizado', width: 47},
      {header: rowHeaders[2], key: 'funcao', width: 50},
      {header: rowHeaders[3], key: 'tipo', width: 20},
      {header: rowHeaders[4], key: 'parcela', width: 15},
      {header: rowHeaders[5], key: 'dataInicio', width: 30},
      {header: rowHeaders[6], key: 'valorDecTer', width: 30},
      {header: rowHeaders[7], key: 'valorIncid', width: 20},
      {header: rowHeaders[8], key: 'resMov', width: 30}
      // {header: nomeEmpresa, key: 'movimentado', width: 57}
    ];
    worksheetDtAprov.getRow(4).font = {name: 'Arial', size: 18};
    worksheetDtAprov.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetDtAprov.getRow(4).height = 70;

    worksheetDtAprov.getColumn('valorDecTer').numFmt = 'R$ #,##0.00';
    worksheetDtAprov.getColumn('valorIncid').numFmt = 'R$ #,##0.00';
    worksheetDtAprov.getColumn('resMov').numFmt = 'R$ #,##0.00';


    let row;
    let i, j;

    for (i = 0; i < this.calculosPendentes.length; i++) {
      if (this.calculosPendentes[i].titulo === nomeEmpresa) {
        for (j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
          row = worksheetDtAprov.getRow(j + 5);
          row.getCell(1).value = this.calculosPendentes[i].calculos[j].terceirizadoDecTer.nomeTerceirizado; // A4,A5
          row.getCell(2).value = this.calculosPendentes[i].calculos[j].terceirizadoDecTer.nomeCargo;
          row.getCell(3).value = this.calculosPendentes[i].calculos[j].terceirizadoDecTer.tipoRestituicao;
          row.getCell(4).value = this.formatParcela(this.calculosPendentes[i].calculos[j].terceirizadoDecTer.parcelas);
          row.getCell(5).value = this.formatDate(this.calculosPendentes[i].calculos[j].terceirizadoDecTer.inicioContagem);
          row.getCell(6).value = this.calculosPendentes[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorDecimoTerceiro;
          row.getCell(7).value = this.calculosPendentes[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro;
          row.getCell(8).value = (this.calculosPendentes[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorDecimoTerceiro +
            this.calculosPendentes[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro); // H4,H5
        }
        break;
      }
    }

    worksheetDtAprov.getRow(j + 6).getCell(5).value = 'Subtotais';
    worksheetDtAprov.getRow(j + 6).font = {name: 'Arial', bold: true};
    worksheetDtAprov.getRow(j + 6).getCell(6).value = this.somaDecimo[i];
    worksheetDtAprov.getRow(j + 6).getCell(7).value = this.somaIncidencia[i];
    worksheetDtAprov.getRow(j + 7).getCell(5).value = 'Total';
    worksheetDtAprov.getRow(j + 7).font = {name: 'Arial', bold: true};
    worksheetDtAprov.getRow(j + 7).getCell(8).value = this.somaSaldo[i];

    for (let x = 5; x <= 200; x++) {
      worksheetDtAprov.getRow(x).height = 30;
      worksheetDtAprov.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    let k = 9;
    while (k <= 16384) {
      const dobCol = worksheetDtAprov.getColumn(k);
      dobCol.hidden = true;
      k++;
    }

    workbookDtAprov.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Décimo-Terceiro-Pendentes-Aprovação.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
