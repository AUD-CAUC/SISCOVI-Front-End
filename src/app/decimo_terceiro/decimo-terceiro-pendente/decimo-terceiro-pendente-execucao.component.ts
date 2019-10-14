import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DecimoTerceiroPendente} from './decimo-terceiro-pendente';
import {ConfigService} from '../../_shared/config.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {DecimoTerceiroService} from '../decimo-terceiro.service';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-decimo-terceiro-execucao-component',
  templateUrl: './decimo-terceiro-pendente-execucao.component.html',
  styleUrls: ['../decimo-terceiro.component.scss']
})
export class DecimoTerceiroPendenteExecucaoComponent implements OnInit {
  isSelected: boolean[] = [];
  calculosPendentesExecucao: ListaCalculosPendentes[];
  calculosAvaliados: ListaCalculosPendentes[];
  calculosNegados: ListaCalculosPendentes[];
  decimoTerceiroForm: FormGroup;
  decimoTerceiroFormAfter: FormGroup;
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  modalActions5 = new EventEmitter<string | MaterializeAction>();
  notifications: number;
  @Output() nav = new EventEmitter();
  somaDecimo: number[] = [];
  somaIncidencia: number[] = [];
  somaSaldo: number[] = [];
  config: ConfigService;
  view = false;

  constructor(config: ConfigService, private  fb: FormBuilder, private  ref: ChangeDetectorRef, private decimoTerceiroService: DecimoTerceiroService) {
    this.config = config;
    this.decimoTerceiroService.getCalculosNaoPendentesNegados().subscribe(res3 => {
      const historico: ListaCalculosPendentes[] = res3;
      this.calculosNegados = historico;
      this.notifications = this.calculosNegados.length;
      this.ref.markForCheck();
    });
  }

  ngOnInit() {
    this.decimoTerceiroService.getCalculosPendentesExecucao().subscribe(res => {
      this.calculosPendentesExecucao = res;
      if (this.calculosPendentesExecucao) {
        if (this.calculosPendentesExecucao.length === 0) {
          this.calculosPendentesExecucao = null;
          this.view = true;
        } else {
          this.isSelected = new Array(this.calculosPendentesExecucao.length).fill(false);
          this.somaDecimo = new Array(this.calculosPendentesExecucao.length).fill(0);
          this.somaIncidencia = new Array(this.calculosPendentesExecucao.length).fill(0);
          this.somaSaldo = new Array(this.calculosPendentesExecucao.length).fill(0);
          for (let i = 0; i < this.calculosPendentesExecucao.length; i++) {
            for (let j = 0; j < this.calculosPendentesExecucao[i].calculos.length; j++) {
              this.somaSaldo[i] = this.somaSaldo[i] +
                this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorDecimoTerceiro +
                this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro;
              this.somaDecimo[i] = this.somaDecimo[i] + this.calculosPendentesExecucao[i].calculos[j]
                .terceirizadoDecTer.valoresDecimoTerceiro.valorDecimoTerceiro;
              this.somaIncidencia[i] = this.somaIncidencia[i] + this.calculosPendentesExecucao[i].calculos[j]
                .terceirizadoDecTer.valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro;
            }
          }
          this.ref.markForCheck();
          this.formInit();
        }
      }
    }, error2 => {
      this.calculosPendentesExecucao = null;
      this.view = true;
    });
  }

  formInit() {
    if (this.calculosPendentesExecucao) {
      this.decimoTerceiroForm = this.fb.group({
        contratos: this.fb.array([])
      });
      if (this.calculosPendentesExecucao) {
        this.calculosPendentesExecucao.forEach(calculoPendente => {
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

  verificaFormulario(): void {
    let aux = 0;
    this.calculosAvaliados = [];
    for (let i = 0; i < this.calculosPendentesExecucao.length; i++) {
      const lista = new ListaCalculosPendentes();
      lista.calculos = [];
      for (let j = 0; j < this.calculosPendentesExecucao[i].calculos.length; j++) {
        if (this.decimoTerceiroForm.get('contratos').get('' + i).get('avaliacaoCalculoDecimoTerceiro').get('' + j).get('selected').value) {
          aux++;
          const temp: DecimoTerceiroPendente = this.calculosPendentesExecucao[i].calculos[j];
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
    for (let i = 0; i < this.calculosAvaliados.length; i++) {
      for (let j = 0; j < this.calculosAvaliados[i].calculos.length; j++) {
        this.calculosAvaliados[i].calculos[j].observacoes = this.decimoTerceiroFormAfter
          .get('calculosAvaliados')
          .get('' + i)
          .get('calculos').get('' + j)
          .get('observacoes').value;
      }
    }
    this.decimoTerceiroService.executarDecimoTerceiroAvaliados(this.calculosAvaliados).subscribe(res => {
        this.closeModal2();
        this.openModal3();
      },
      error1 => {
        this.closeModal2();
        this.openModal5();
      });
  }

  navegaViewRestituicoes() {
    this.closeModal3();
    this.nav.emit();
  }
  captureScreen(nomeEmpresa) {
    const data = document.getElementById(nomeEmpresa);
    html2canvas(data, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
      // Few necessary setting options
      const imgWidth = 205;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpg');
      const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 45;

      // dataReferencia = dataReferencia.split('-');

      pdf.text('Restituição Pendente de Execução', 105, 15, {align: 'center'});
      pdf.text(nomeEmpresa, 105, 25, {align: 'center'});
      // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'jpg', 0, position, imgWidth, imgHeight);


      pdf.save('Relatório_Décimo_Terceiro_' + nomeEmpresa + '_Execução.pdf'); // Generated PDF
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
    const workbookDtExec = new Workbook();
    const worksheetDtExec = workbookDtExec.addWorksheet('Relatório 13º Pend Exec', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 5,
        fitToWidth: 7
      }
    });

    worksheetDtExec.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.5, bottom: 0.5,
      header: 0.3, footer: 0.3
    };

    worksheetDtExec.mergeCells('A1:H1'); /* merge de A1 até H1 */
    const rowEmpresa = worksheetDtExec.getCell('A1').value = nomeEmpresa; /*Traz o contrato do front*/
    worksheetDtExec.getCell('A1').font = {name: 'Arial', size: 18}; /*formatação da celula merjada*/
    worksheetDtExec.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'}; /*formatação da celula merjada*/
    worksheetDtExec.addRow(rowEmpresa); /*adiciona o contrato na linha merjada*/

    worksheetDtExec.mergeCells('A2:H2'); /* merge de A1 até H1 */
    const rowRelExec = worksheetDtExec.getCell('A2').value = 'Relatório de Pendências de Execução'; /*Traz o contrato do front*/
    worksheetDtExec.getCell('A2').font = {name: 'Arial', size: 18}; /*formatação da celula merjada*/
    worksheetDtExec.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'}; /*formatação da celula merjada*/
    worksheetDtExec.addRow(rowRelExec); /*adiciona o contrato na linha merjada*/

    const rowHeaders = [
      ['Terceirizado', 'Função', 'Tipo de Restituição', 'Parcela', 'Data de Início para Contagem', 'Valor de Décimo Terceiro', 'Valor de Incidência', 'Total'], // row by array
    ];
    worksheetDtExec.addRows(rowHeaders);

    worksheetDtExec.columns = [
      {header: rowHeaders[1], key: 'terceirizado', width: 57},
      {header: rowHeaders[2], key: 'funcao', width: 50},
      {header: rowHeaders[3], key: 'tipo', width: 35},
      {header: rowHeaders[4], key: 'parcela', width: 30},
      {header: rowHeaders[5], key: 'dataInicio', width: 57},
      {header: rowHeaders[6], key: 'valorDecTer', width: 57},
      {header: rowHeaders[7], key: 'valorIncid', width: 40},
      {header: rowHeaders[8], key: 'total', width: 25},
      {header: nomeEmpresa, key: 'movimentado', width: 57}
    ];
    worksheetDtExec.getRow(3).font = {name: 'Arial', size: 18};
    worksheetDtExec.getRow(3).alignment = {vertical: 'middle', horizontal: 'center'};


    for (let i = 0; i < this.calculosPendentesExecucao.length; i++) {
      if (this.calculosPendentesExecucao[i].titulo === nomeEmpresa) {
        for (let j = 0; j < this.calculosPendentesExecucao[i].calculos.length; j++) {
          let row;
          row = worksheetDtExec.getRow(j + 4);
          row.getCell(1).value = this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.nomeTerceirizado;
          row.getCell(2).value = this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.nomeCargo;
          row.getCell(3).value = this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.tipoRestituicao;
          row.getCell(4).value = this.formatParcela(this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.parcelas);
          row.getCell(5).value = this.formatDate(this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.inicioContagem);
          row.getCell(6).value = this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.
          valorDecimoTerceiro.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
          row.getCell(7).value = this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.
          valorIncidenciaDecimoTerceiro.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
          row.getCell(8).value = (this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.
            valorDecimoTerceiro + this.calculosPendentesExecucao[i].calculos[j].terceirizadoDecTer.valoresDecimoTerceiro.
            valorIncidenciaDecimoTerceiro).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        }
      }
    }

    let j = 9;
    while (j <= 16384) {
      const dobCol = worksheetDtExec.getColumn(j);
      dobCol.hidden = true;
      j++;
    }

    workbookDtExec.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Calculos-Pendentes-Execução.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
