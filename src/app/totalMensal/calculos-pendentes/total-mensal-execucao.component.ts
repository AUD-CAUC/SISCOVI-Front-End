import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Contrato} from '../../contratos/contrato';
import {TotalMensalPendente} from '../total-mensal-pendente';
import {ConfigService} from '../../_shared/config.service';
import {ContratosService} from '../../contratos/contratos.service';
import {TotalMensalService} from '../total-mensal.service';
import {ListaTotalMensalData} from '../lista-total-mensal-data';
import {MaterializeAction} from 'angular2-materialize';
import {Router} from '@angular/router';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-total-mensal-execucao-component',
  templateUrl: './total-mensal-execucao.component.html',
  styleUrls: ['./total-mensal-pendente.component.scss']
})
export class TotalMensalExecucaoComponent implements OnInit {
  @Input() codigoContrato: number;
  totalMensalFormAfter: FormGroup;
  contratos: Contrato[];
  totais: TotalMensalPendente[] = [];
  totalMensalForm: FormGroup;
  config: ConfigService;
  isSelected = false;
  totaisAvaliados: TotalMensalPendente[] = [];
  somaFerias: number[] = [];
  somaTerco: number[] = [];
  somaDecimo: number[] = [];
  somaIncidencia: number[] = [];
  somaMultaFGTS: number[] = [];
  somaSaldo: number[] = [];
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  @Output() nav = new EventEmitter();

  constructor(private contratoService: ContratosService, private totalMensalService: TotalMensalService, private fb: FormBuilder, config: ConfigService, private router: Router) {
    this.config = config;
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
      for (let i = 0; i < this.contratos.length; i++) {
        this.defineCodigoContrato(this.contratos[i]);
      }
      // if (this.totais) {
      //     this.formInit();
      // }else {
      //     if (this.codigoContrato) {
      //         this.totalMensalService.getTotaisPendentesExecucao(this.codigoContrato).subscribe(res2 => {
      //             this.totais = res2;
      //             if (this.totais) {
      //                 this.formInit();
      //             }
      //         });
      //     }
      // }
    });
  }

  ngOnInit() {
    // this.formInit();
  }

  formInit() {
    this.totalMensalForm = this.fb.group({
      avaliacaoDeCalculo: this.fb.array([])
    });
    if (this.totais) {
      if (this.totais.length > 0) {
        const control = <FormArray>this.totalMensalForm.controls.avaliacaoDeCalculo;
        this.totais.forEach(item => {
          const addCtrl = this.fb.group({
            avaliacao: new FormControl('S'),
            selected: new FormControl(false),
            dataReferencia: new FormControl(item.totaisMensais.dataReferencia),
            codigoContrato: new FormControl(item.codigoContrato),
            nomeEmpresa: new FormControl(item.nomeEmpresa),
            numeroContrato: new FormControl(item.numeroContrato),
          });
          control.push(addCtrl);
        });

        this.somaFerias = new Array(this.totais.length).fill(0);
        this.somaTerco = new Array(this.totais.length).fill(0);
        this.somaDecimo = new Array(this.totais.length).fill(0);
        this.somaIncidencia = new Array(this.totais.length).fill(0);
        this.somaMultaFGTS = new Array(this.totais.length).fill(0);
        this.somaSaldo = new Array(this.totais.length).fill(0);

        for (let i = 0; i < this.totais.length; i++) {
          for (let j = 0; j < this.totais[i].totaisMensais.totais.length; j++) {
            this.somaFerias[i] = this.somaFerias[i] + this.totais[i].totaisMensais.totais[j].ferias;
            this.somaTerco[i] = this.somaTerco[i] + this.totais[i].totaisMensais.totais[j].tercoConstitucional;
            this.somaDecimo[i] = this.somaDecimo[i] + this.totais[i].totaisMensais.totais[j].decimoTerceiro;
            this.somaIncidencia[i] = this.somaIncidencia[i] + this.totais[i].totaisMensais.totais[j].incidencia;
            this.somaMultaFGTS[i] = this.somaMultaFGTS[i] + this.totais[i].totaisMensais.totais[j].multaFGTS;
            this.somaSaldo[i] = this.somaSaldo[i] + this.totais[i].totaisMensais.totais[j].total;
          }
        }
      }
    }
    this.totalMensalFormAfter = this.fb.group({
      calculosAvaliados: this.fb.array([])
    });
  }

  defineCodigoContrato(contrato: Contrato) {
    this.codigoContrato = contrato.codigo;
    if (this.totais.length > 0) {
      this.totais = [];
    }
    this.totalMensalService.getTotaisPendentesExecucao(contrato.codigo).subscribe(res => {
      if (res !== null) {
        for (let i = 0; i < res.length; i++) {
          res[i].codigoContrato = contrato.codigo;
          res[i].nomeEmpresa = contrato.nomeDaEmpresa;
          res[i].numeroContrato = contrato.numeroDoContrato;
          this.totais[this.totais.length] = res[i];
        }
      }
      this.formInit();
    });
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  openModal3() {
    this.modalActions3.emit({action: 'modal', params: ['open']});
  }

  closeModal3() {
    this.modalActions3.emit({action: 'modal', params: ['close']});
  }

  openModal2() {
    this.modalActions2.emit({action: 'modal', params: ['open']});
    if (this.totaisAvaliados) {
      const control = <FormArray>this.totalMensalFormAfter.controls.calculosAvaliados;
      this.totaisAvaliados.forEach(item => {
        const addCtrl = this.fb.group({
          status: new FormControl(item.status),
          dataReferencia: new FormControl(item.totaisMensais.dataReferencia),
          observacoes: new FormControl()
        });
        control.push(addCtrl);
      });
    }
  }

  closeModal2() {
    this.modalActions2.emit({action: 'modal', params: ['close']});
  }

  verificaFormulario(): void {
    let aux = 0;
    if (this.totaisAvaliados) {
      if (this.totaisAvaliados.length > 0) {
        this.totaisAvaliados = [];
      }
    }
    for (let i = 0; i < this.totais.length; i++) {
      if (this.totalMensalForm.get('avaliacaoDeCalculo').get('' + i).get('selected').value) {
        aux++;
        const listaTotalMensalData = new ListaTotalMensalData(this.totalMensalForm.get('avaliacaoDeCalculo').get('' + i).get('dataReferencia').value, this.totais[i].totaisMensais.totais);
        const objeto = new TotalMensalPendente(listaTotalMensalData, this.totalMensalForm.get('avaliacaoDeCalculo').get('' + i).get('avaliacao').value);
        objeto.codigoContrato = this.totalMensalForm.get('avaliacaoDeCalculo').get('' + i).get('codigoContrato').value;
        this.totaisAvaliados.push(objeto);
      }
    }
    if (aux !== 0) {
      this.openModal2();
    } else {
      this.openModal();
    }
  }

  enviarAvaliacao() {
    for (let i = 0; i < this.totaisAvaliados.length; i++) {
      this.totaisAvaliados[i].observacoes = this.totalMensalFormAfter.get('calculosAvaliados').get('' + i).get('observacoes').value;
    }
    for (let i = 0; i < this.totaisAvaliados.length; i++) {
      this.totalMensalService.enviarExecucaoCalculosTotalMensal(this.totaisAvaliados[i].codigoContrato, this.totaisAvaliados[i]).subscribe(res => {
        if (!res.error) {
          if (res.success) {
            this.openModal3();
            this.closeModal2();
          }
        } else {
          this.closeModal2();
        }
      });
    }
  }

  navegaViewExec() {
    this.closeModal3();
    this.nav.emit(this.codigoContrato);
  }

  corrigeCalculo(dataReferencia: Date) {
    this.router.navigate(['/totalMensal', this.codigoContrato, dataReferencia], {
      queryParams: [this.codigoContrato],
      skipLocationChange: true
    });
  }

  captureScreen(nomeEmpresa, dataReferencia) {
    const data = document.getElementById(nomeEmpresa);
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

      pdf.text('Retenção Pendente de Execução', 105, 15, {align: 'center'});
      pdf.text('Mês de referência ' + nomeEmpresa, 105, 25, {align: 'center'});
      pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save('Relatório_Retenção' + dataReferencia[1] + '/' + dataReferencia[0] + '_Execução.pdf'); // Generated PDF
    });
  }

  gerarRelatorioExcel(nomeEmpresa, dataRef) {
    dataRef = dataRef.split('-');
    const workbookRetExec = new Workbook();
    const worksheetRetExec = workbookRetExec.addWorksheet('Relatório Retenções Execução', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 2,
        fitToWidth: 1,
        paperSize: 9
      }
    });

    // Laço que aplica bordas na tabela gerada (não funciona corretamente)
    // worksheetRetExec.eachRow({includeEmpty: true}, function (row) {
    //   row.border = {
    //     top: {style: 'thin'},
    //     left: {style: 'thin'},
    //     bottom: {style: 'thin'},
    //     right: {style: 'thin'}
    //   };
    // });

    worksheetRetExec.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.5, bottom: 0.5,
      header: 0.3, footer: 0.3
    };

    worksheetRetExec.pageSetup.printArea = 'A:H';

    // Título
    worksheetRetExec.mergeCells('A1:H1');
    const rowEmpresa = worksheetRetExec.getCell('A1').value = nomeEmpresa;
    worksheetRetExec.getCell('A1').font = {name: 'Arial', size: 18};
    worksheetRetExec.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetRetExec.addRow(rowEmpresa);
    worksheetRetExec.getRow(1).height = 30;

    // Subtítulo
    worksheetRetExec.mergeCells('A2:H2');
    const rowRelAprov = worksheetRetExec.getCell('A2').value = 'Cálculos Pendentes de Execução - Mês de Referência: ' + dataRef[1] + '/' + dataRef[0];
    worksheetRetExec.getCell('A2').font = {name: 'Arial', size: 18};
    worksheetRetExec.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetRetExec.addRow(rowRelAprov);
    worksheetRetExec.getRow(2).height = 30;

    const rowHeaders = [
      ['Função', 'Número de\nTerceirizados por\nFunção', 'Férias', 'Terço\nConstitucional', 'Décimo\nTerceiro', 'Incidência\nRetido',
        'Multa do\nFGTS', 'Total']
    ];
    worksheetRetExec.addRows(rowHeaders);
    worksheetRetExec.columns = [
      {header: rowHeaders[1], key: 'funcao', width: 40},
      {header: rowHeaders[2], key: 'numTerceirizados', width: 30},
      {header: rowHeaders[3], key: 'ferias', width: 20},
      {header: rowHeaders[4], key: 'terco', width: 25},
      {header: rowHeaders[5], key: 'decimoTerc', width: 25},
      {header: rowHeaders[6], key: 'incidencia', width: 20},
      {header: rowHeaders[7], key: 'multaFgts', width: 20},
      {header: rowHeaders[8], key: 'total', width: 20},
    ];

    // Padrões de formatação das colunas
    worksheetRetExec.getRow(4).font = {name: 'Arial', size: 18};
    worksheetRetExec.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetRetExec.getRow(4).height = 70;
    // Padrões de valores das colunas
    worksheetRetExec.getColumn('ferias').numFmt = 'R$ #,##0.00';
    worksheetRetExec.getColumn('terco').numFmt = 'R$ #,##0.00';
    worksheetRetExec.getColumn('decimoTerc').numFmt = 'R$ #,##0.00';
    worksheetRetExec.getColumn('incidencia').numFmt = 'R$ #,##0.00';
    worksheetRetExec.getColumn('multaFgts').numFmt = 'R$ #,##0.00';
    worksheetRetExec.getColumn('total').numFmt = 'R$ #,##0.00';

    // Laço que popula a tabela
    let row;
    let i;
    let j;
    for (i = 0; i < this.totais.length; i++) {
      if (this.totais[i].nomeEmpresa === nomeEmpresa) {
        for (j = 0; j < this.totais[i].totaisMensais.totais.length; j++) {
          row = worksheetRetExec.getRow(j + 5);
          row.getCell(1).value = this.totais[i].totaisMensais.totais[j].funcao;
          row.getCell(2).value = this.totais[i].totaisMensais.totais[j].numeroTerceirizados;
          row.getCell(3).value = this.totais[i].totaisMensais.totais[j].ferias;
          row.getCell(4).value = this.totais[i].totaisMensais.totais[j].tercoConstitucional;
          row.getCell(5).value = this.totais[i].totaisMensais.totais[j].decimoTerceiro;
          row.getCell(6).value = this.totais[i].totaisMensais.totais[j].incidencia;
          row.getCell(7).value = this.totais[i].totaisMensais.totais[j].multaFGTS;
          row.getCell(8).value = this.totais[i].totaisMensais.totais[j].total;
        }
      }
    }
    // Laço que popula os somatórios de cada rubrica
    for (let m = 0; m < this.totais.length; m++) {
      if (this.totais[m].nomeEmpresa === nomeEmpresa) {
        for (let k = 0; k < this.totais[m].totaisMensais.totais.length; k++) {
          row = worksheetRetExec.getRow(j + 6);
          row.getCell(1).value = '';
          row.getCell(2).value = 'Somatórios';
          row.getCell(3).value = this.somaFerias[m];
          row.getCell(4).value = this.somaTerco[m];
          row.getCell(5).value = this.somaDecimo[m];
          row.getCell(6).value = this.somaIncidencia[m];
          row.getCell(7).value = this.somaMultaFGTS[m];
          row.getCell(8).value = this.somaSaldo[m];
        }
      }
    }
    // Função que formata a fonte da linha contendo os somatórios
    worksheetRetExec.getRow(j + 6).font = {name: 'Arial', bold: true};

    // Laço que padroniza as células da planilha em geral
    for (let x = 5; x <= 200; x++) {
      worksheetRetExec.getRow(x).height = 30;
      worksheetRetExec.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    // Laço que insere bordas na tabela gerada (incompleto)
    // for (let y = 1; y <= worksheetRetExec.rowCount; y++) {
    //   worksheetRetExec.getRow(y).border = {
    //     top: {style: 'thin'},
    //     left: {style: 'thin'},
    //     bottom: {style: 'thin'},
    //     right: {style: 'thin'},
    //   };
    // }

    // Laço que esconde colunas não utilizadas da tabela
    let c = 10;
    while (c <= 16384) {
      const dobCol = worksheetRetExec.getColumn(c);
      dobCol.hidden = true;
      c++;
    }
    // Função que salva a planilha e a disponibiliza para download
    workbookRetExec.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Calculos-Retençôes-Pendentes-Aprovação.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
