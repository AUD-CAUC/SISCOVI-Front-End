import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {RescisaoService} from '../rescisao.service';
import {ContratosService} from '../../contratos/contratos.service';
import {RescisaoCalculosPendentes} from './rescisao-calculos-pendentes';
import {ConfigService} from '../../_shared/config.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-rescisao-calculos-pendentes',
  templateUrl: './rescisao-calculos-pendentes.component.html',
  styleUrls: ['./rescisao-calculos-pendentes.component.scss']
})
export class RescisaoCalculosPendentesComponent implements OnInit {
  contratos: Contrato[];
  @Input() codigoContrato = 0;
  isSelected: boolean[] = [];
  @Input() calculosPendentes: ListaCalculosPendentes[];
  calculosAvaliados: ListaCalculosPendentes[];
  calculosNegados: ListaCalculosPendentes[];
  config: ConfigService;
  rescisaoForm: FormGroup;
  rescisaoFormAfter: FormGroup;
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  modalActions5 = new EventEmitter<string | MaterializeAction>();
  notifications: number;
  somaFeriasVencidas: number[] = [];
  somaTercoVencido: number[] = [];
  somaIncidenciaFeriasVencidas: number[] = [];
  somaIncidenciaTercoVencido: number[] = [];
  somaFgtsFeriasVencidas: number[] = [];
  somaFgtsTercoVencido: number[] = [];
  somaFeriasProporcionais: number[] = [];
  somaTercoProporcional: number[] = [];
  somaIncidenciaFeriasProporcionais: number[] = [];
  somaIncidenciaTercoProporcional: number[] = [];
  somaFgtsFeriasProporcionais: number[] = [];
  somaFgtsTercoProporcional: number[] = [];
  somaDecimoTerceiro: number[] = [];
  somaIncidenciaDecimoTerceiro: number[] = [];
  somaMultaFgtsDecimoTerceiro: number[] = [];
  somaMultaFgtsSalario: number[] = [];
  somaMultaFgtsRestante: number[] = [];
  somaSaldo: number[] = [];
  isLoading = false;
  @Output() nav = new EventEmitter();

  constructor(private rescisaoService: RescisaoService, private contratoService: ContratosService, config: ConfigService, private fb: FormBuilder, private ref: ChangeDetectorRef) {
    this.config = config;
    this.rescisaoService.getCalculosPendentes().subscribe(res => {
      this.calculosPendentes = res;
      if (this.calculosPendentes.length === 0) {
        this.calculosPendentes = null;
      }
      this.ref.markForCheck();
    });
    this.rescisaoService.getCalculosPendentesNegados().subscribe(res3 => {
      const historico: ListaCalculosPendentes[] = res3;
      this.calculosNegados = historico;
      this.notifications = this.calculosNegados.length;
      this.ref.markForCheck();
    }, error2 => {
      this.calculosNegados = null;
    });
  }

  ngOnInit() {
    if (this.calculosPendentes) {
      if (this.calculosPendentes.length === 0) {
        this.calculosPendentes = null;
      } else {
        this.isSelected = new Array(this.calculosPendentes.length).fill(false);
        this.somaFeriasVencidas = new Array(this.calculosPendentes.length).fill(0);
        this.somaTercoVencido = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaFeriasVencidas = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaTercoVencido = new Array(this.calculosPendentes.length).fill(0);
        this.somaFgtsFeriasVencidas = new Array(this.calculosPendentes.length).fill(0);
        this.somaFgtsTercoVencido = new Array(this.calculosPendentes.length).fill(0);
        this.somaFeriasProporcionais = new Array(this.calculosPendentes.length).fill(0);
        this.somaTercoProporcional = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaFeriasProporcionais = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaTercoProporcional = new Array(this.calculosPendentes.length).fill(0);
        this.somaFgtsFeriasProporcionais = new Array(this.calculosPendentes.length).fill(0);
        this.somaFgtsTercoProporcional = new Array(this.calculosPendentes.length).fill(0);
        this.somaDecimoTerceiro = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaDecimoTerceiro = new Array(this.calculosPendentes.length).fill(0);
        this.somaMultaFgtsDecimoTerceiro = new Array(this.calculosPendentes.length).fill(0);
        this.somaMultaFgtsSalario = new Array(this.calculosPendentes.length).fill(0);
        this.somaMultaFgtsRestante = new Array(this.calculosPendentes.length).fill(0);
        this.somaSaldo = new Array(this.calculosPendentes.length).fill(0);
        for (let i = 0; i < this.calculosPendentes.length; i++) {
          for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
            this.somaFeriasVencidas[i] = this.somaFeriasVencidas[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalFeriasVencidas;
            this.somaTercoVencido[i] = this.somaTercoVencido[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalTercoConstitucionalvencido;
            this.somaIncidenciaFeriasVencidas[i] = this.somaIncidenciaFeriasVencidas[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaFeriasVencidas;
            this.somaIncidenciaTercoVencido[i] = this.somaIncidenciaTercoVencido[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaTercoVencido;
            this.somaFgtsFeriasVencidas[i] = this.somaFgtsFeriasVencidas[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsFeriasVencidas;
            this.somaFgtsTercoVencido[i] = this.somaFgtsTercoVencido[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsTercoVencido;
            this.somaFeriasProporcionais[i] = this.somaFeriasProporcionais[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalFeriasProporcionais;
            this.somaTercoProporcional[i] = this.somaTercoProporcional[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalTercoProporcional;
            this.somaIncidenciaFeriasProporcionais[i] = this.somaIncidenciaFeriasProporcionais[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaFeriasProporcionais;
            this.somaIncidenciaTercoProporcional[i] = this.somaIncidenciaTercoProporcional[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaTercoProporcional;
            this.somaFgtsFeriasProporcionais[i] = this.somaFgtsFeriasProporcionais[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsFeriasProporcionais;
            this.somaFgtsTercoProporcional[i] = this.somaFgtsTercoProporcional[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsTercoProporcional;
            this.somaDecimoTerceiro[i] = this.somaDecimoTerceiro[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalDecimoTerceiro;
            this.somaIncidenciaDecimoTerceiro[i] = this.somaIncidenciaDecimoTerceiro[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaDecimoTerceiro;
            this.somaMultaFgtsDecimoTerceiro[i] = this.somaMultaFgtsDecimoTerceiro[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsDecimoTerceiro;
            this.somaMultaFgtsSalario[i] = this.somaMultaFgtsSalario[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsSalario;
            this.somaMultaFgtsRestante[i] = this.somaMultaFgtsRestante[i] +
              this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsRestante;
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
      this.rescisaoForm = this.fb.group({
        contratos: this.fb.array([])
      });
      if (this.calculosPendentes) {
        this.calculosPendentes.forEach(calculoPendente => {
          const control = <FormArray>this.rescisaoForm.controls.contratos;
          const newControl = this.fb.group({
            titulo: new FormControl(calculoPendente.titulo),
            codigo: new FormControl(calculoPendente.codigo),
            avaliacaoCalculoRescisao: this.fb.array([])
          });
          calculoPendente.calculos.forEach(() => {
            const newControl2 = <FormArray>newControl.controls.avaliacaoCalculoRescisao;
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
    this.rescisaoFormAfter = this.fb.group({
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
    this.rescisaoFormAfter = this.fb.group({
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
/*
  defineCodigoContrato(codigoContrato: number): void {
    this.codigoContrato = codigoContrato;
    if (this.codigoContrato) {
      this.rescisaoService.getCalculosPendentes().subscribe(res2 => {
        this.calculosPendentes = res2;
        if (this.calculosPendentes.length === 0) {
          this.calculosPendentes = null;
        } else {
          this.formInit();
        }
      });
      this.rescisaoService.getCalculosPendentesNegados().subscribe(res3 => {
        const historico: ListaCalculosPendentes[] = res3;
        this.calculosNegados = historico;
        this.notifications = this.calculosNegados.length;
        this.ref.markForCheck();
      });
    }
  }
  */
  verificaFormulario() {
    let aux = 0;
    this.calculosAvaliados = [];
    for (let i = 0; i < this.calculosPendentes.length; i++) {
      const lista = new ListaCalculosPendentes();
      lista.calculos = [];
      for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
        if (this.rescisaoForm.get('contratos').get('' + i).get('avaliacaoCalculoRescisao').get('' + j).get('selected').value) {
          aux++;
          const temp: RescisaoCalculosPendentes = this.calculosPendentes[i].calculos[j];
          temp.status = this.rescisaoForm.get('contratos').get('' + i).get('avaliacaoCalculoRescisao').get('' + j).get('avaliacao').value;
          lista.titulo = this.rescisaoForm.get('contratos').get('' + i).get('titulo').value;
          lista.codigo = this.rescisaoForm.get('contratos').get('' + i).get('codigo').value;
          lista.calculos.push(temp);
        }
      }
      this.calculosAvaliados.push(lista);
    }
    if (aux === 0) {
      this.openModal();
    } else {
      const control = <FormArray>this.rescisaoFormAfter.controls.calculosAvaliados;
      this.calculosAvaliados.forEach(() => {
        const addControl = this.fb.group({
          observacoes: new FormControl(),
        });
        control.push(addControl);
      });
      this.openModal2();
    }
  }
  salvarAlteracoes() {
    this.isLoading = true;
    for (let i = 0; i < this.calculosAvaliados.length; i++) {
      for (let j = 0; j < this.calculosAvaliados[i].calculos.length; j++) {
        this.calculosAvaliados[i].calculos[j].observacoes = this.rescisaoFormAfter.get('calculosAvaliados').get('' + i).get('observacoes').value;
      }
    }
    this.rescisaoService.salvarRescisoesAvaliadasLista(this.calculosAvaliados).subscribe(res => {
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
    this.nav.emit(this.codigoContrato);
  }
  captureScreen(nomeEmpresa) {
    const data = document.getElementById(nomeEmpresa);
    html2canvas(data, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
      // Few necessary setting options
      const imgWidth = 295;
      const pageHeight = 205;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpg');
      const pdf = new JsPDF('l', 'mm', 'a4'); // A4 size page of PDF
      const position = 45;

      // dataReferencia = dataReferencia.split('-');

      pdf.text('Restituição Pendente de Aprovação', 147.5, 15, {align: 'center'});
      pdf.text(nomeEmpresa, 147.5, 25, {align: 'center'});
      // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'jpg', 0, position, imgWidth, imgHeight);


      pdf.save('Relatório_Rescisão_' + nomeEmpresa + '_Aprovação.pdf'); // Generated PDF
    });
  }

  formatDate(str) {
    const mensagem = [];
    if (str === null || str === undefined) {
      str = 'Não pedido/Não possui';
      console.log(str)
      return str;
    } else {
      console.log(str)
      return str.split('-').reverse().join('/');
    }
  }

  // formatParcela(num) {
  //   console.log(num);
  //   let parcela: string;
  //   if (num === 0) {
  //     parcela = 'Única';
  //   } else if (num === 1) {
  //     parcela = 'Primeira';
  //   } else if (num === 2) {
  //     parcela = 'Segunda';
  //   } else if (num === 3) {
  //     parcela = 'Terceira';
  //   }
  //   return parcela;
  // }

  gerarRelatorioExcel(nomeEmpresa) {
    const workbookRescisAprov = new Workbook();
    const worksheetRescisAprov = workbookRescisAprov.addWorksheet('Relatório 13º Restituição Aprov', {
      pageSetup: {
        fitToPage: true,
        fitToHeight: 2,
        fitToWidth: 1,
        paperSize: 9
      }
    });

    worksheetRescisAprov.eachRow({includeEmpty: true}, function (rowW) {
      rowW.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    });

    worksheetRescisAprov.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.5, bottom: 0.5,
      header: 0.3, footer: 0.3
    };
    // Insere e Formata o título da planilha:
    worksheetRescisAprov.mergeCells('A1:AA1');
    const rowEmpresa = worksheetRescisAprov.getCell('A1').value = nomeEmpresa;
    worksheetRescisAprov.getCell('A1').font = {name: 'Arial', size: 18};
    worksheetRescisAprov.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetRescisAprov.addRow(rowEmpresa);
    worksheetRescisAprov.getRow(1).height = 30;
    // Insere e Formata o subtítulo da planilha
    const nomeRelatorio = 'Relatório de Pendências de Aprovação - Rescisão';
    worksheetRescisAprov.mergeCells('A2:AA2');
    const rowRelAprov = worksheetRescisAprov.getCell('A2').value = nomeRelatorio;
    worksheetRescisAprov.getCell('A2').font = {name: 'Arial', size: 18};
    worksheetRescisAprov.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheetRescisAprov.addRow(rowRelAprov);
    worksheetRescisAprov.getRow(2).height = 30;

    const rowHeaders = [
      ['Terceirizado', 'Função', 'Tipo' + '\n' + 'de' + '\n' + 'Restituição', 'Tipo' + '\n' + 'de' + '\n' + 'Rescisão', 'Data\ndo\nDesligamento', 'Início da\nContagem do 13º',
        'Valor\ndo 13º', 'Incidência\nSobre\no 13º', 'Multa do\nFGTS Sobre\no 13º', 'Início de\nFérias Vencidas', 'Fim de\nFérias Vencidas',
        'Valor de\nFérias Vencidas', 'Valor do\nTerço de\nFérias Vencido', 'Incidência Sobre\nFérias Vencidas', 'Incidência Sobre\nTerço de\nFérias Vencido',
        'Multa do FGTS\nSobre\nFérias Vencidas', 'Multa do FGTS\nSobre o Terço\nde Férias Vencido', 'Início de\nFérias Proporcionais', 'Fim de Férias\nProporcionais',
      'Valor de Férias\nProporcionais', 'Terço de Férias\nProporcional', 'Incidência Sobre\nFérias Proporcionais', 'Incidência Sobre\no Terço de Férias\nProporcional',
      'Multa do FGTS\nSobre Férias\nProporcionais', 'Multa do FGTS\nSobre o Terço de\nFérias Proporcional', 'Multa do FGTS\nSobre o Salário', 'Total']
    ];
    // Bloco que adiciona os headers das colunas:
    worksheetRescisAprov.addRows(rowHeaders);
    worksheetRescisAprov.columns = [
      {header: rowHeaders[1], key: 'terceirizado', width: 40},
      {header: rowHeaders[2], key: 'funcao', width: 65},
      {header: rowHeaders[3], key: 'tipoRestituicao', width: 20},
      {header: rowHeaders[4], key: 'tipoRescisao', width: 20},
      {header: rowHeaders[5], key: 'desligamento', width: 25},
      {header: rowHeaders[6], key: 'inicioContagem13', width: 27},
      {header: rowHeaders[7], key: 'valor13', width: 20},
      {header: rowHeaders[8], key: 'incidencia13', width: 20},
      {header: rowHeaders[9], key: 'multaFgts13', width: 25},
      {header: rowHeaders[10], key: 'inicioFeriasVencidas', width: 25},
      {header: rowHeaders[11], key: 'fimFeriasVencidas', width: 25},
      {header: rowHeaders[12], key: 'valorFeriasVencidas', width: 25},
      {header: rowHeaders[13], key: 'valorTercoVencido', width: 25},
      {header: rowHeaders[14], key: 'incidFeriasVencidas', width: 27},
      {header: rowHeaders[15], key: 'incidTercoVencido', width: 27},
      {header: rowHeaders[16], key: 'MultaFgtsFeriasVenc', width: 27},
      {header: rowHeaders[17], key: 'MultaFgtsTercoVenc', width: 27},
      {header: rowHeaders[18], key: 'inicioFeriasProp', width: 30},
      {header: rowHeaders[19], key: 'fimFeriasProp', width: 25},
      {header: rowHeaders[20], key: 'valorFeriasProp', width: 25},
      {header: rowHeaders[21], key: 'valorTercoProp', width: 25},
      {header: rowHeaders[22], key: 'incidFeriasProp', width: 30},
      {header: rowHeaders[23], key: 'incidTercoProp', width: 30},
      {header: rowHeaders[24], key: 'multaFgtsFeriasProp', width: 25},
      {header: rowHeaders[25], key: 'multaFgtsTercoProp', width: 27},
      {header: rowHeaders[26], key: 'multaFgtsSalario', width: 25},
      {header: rowHeaders[27], key: 'Total', width: 20},
    ];
    worksheetRescisAprov.getRow(4).font = {name: 'Arial', size: 18};
    worksheetRescisAprov.getRow(4).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    worksheetRescisAprov.getRow(4).height = 70;
    // Bloco que formata os dados das colunas abaixo em modo moeda
    worksheetRescisAprov.getColumn('valor13').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('incidencia13').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('multaFgts13').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('valorFeriasVencidas').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('valorTercoVencido').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('incidFeriasVencidas').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('incidTercoVencido').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('MultaFgtsFeriasVenc').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('MultaFgtsTercoVenc').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('valorFeriasProp').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('valorTercoProp').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('incidFeriasProp').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('incidTercoProp').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('multaFgtsFeriasProp').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('multaFgtsTercoProp').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('multaFgtsSalario').numFmt = 'R$ #,##0.00';
    worksheetRescisAprov.getColumn('Total').numFmt = 'R$ #,##0.00';

    let row;
    let i, j;
    for (i = 0; i < this.calculosPendentes.length; i++) {
      if (this.calculosPendentes[i].titulo === nomeEmpresa) {
        for (j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
          row = worksheetRescisAprov.getRow(j + 5);
          row.getCell(1).value = this.calculosPendentes[i].calculos[j].nomeTerceirizado;
          row.getCell(2).value = this.calculosPendentes[i].calculos[j].nomeCargo;
          row.getCell(3).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.tipoRestituicao;
          row.getCell(4).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.tipoRescisao;
          row.getCell(5).value = this.formatDate(this.calculosPendentes[i].calculos[j].calcularRescisaoModel.dataDesligamento);
          row.getCell(6).value = this.formatDate(this.calculosPendentes[i].calculos[j].calcularRescisaoModel.inicioContagemDecimoTerceiro);
          row.getCell(7).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalDecimoTerceiro;
          row.getCell(8).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaDecimoTerceiro;
          row.getCell(9).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsDecimoTerceiro;
          row.getCell(10).value = this.formatDate(this.calculosPendentes[i].calculos[j].calcularRescisaoModel.inicioFeriasIntegrais);
          row.getCell(11).value = this.formatDate(this.calculosPendentes[i].calculos[j].calcularRescisaoModel.fimFeriasIntegrais);
          row.getCell(12).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalFeriasVencidas;
          row.getCell(13).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalTercoConstitucionalvencido;
          row.getCell(14).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaFeriasVencidas;
          row.getCell(15).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaTercoVencido;
          row.getCell(16).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsFeriasVencidas;
          row.getCell(17).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsTercoVencido;
          row.getCell(18).value = this.formatDate(this.calculosPendentes[i].calculos[j].calcularRescisaoModel.inicioFeriasProporcionais);
          row.getCell(19).value = this.formatDate(this.calculosPendentes[i].calculos[j].calcularRescisaoModel.fimFeriasProporcionais);
          row.getCell(20).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalFeriasProporcionais;
          row.getCell(21).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalTercoProporcional;
          row.getCell(22).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaFeriasProporcionais;
          row.getCell(23).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalIncidenciaTercoProporcional;
          row.getCell(24).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsFeriasProporcionais;
          row.getCell(25).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsTercoProporcional;
          row.getCell(26).value = this.calculosPendentes[i].calculos[j].calcularRescisaoModel.totalMultaFgtsSalario;
          row.getCell(27).value = this.calculosPendentes[i].calculos[j].total;
        }
        break;
      }
    }
    // Subtotais e Totais em negrito
    worksheetRescisAprov.getRow(j + 6).getCell(6).value = 'Subtotais';
    worksheetRescisAprov.getRow(j + 6).font = {name: 'Arial', bold: true};
    // Subtotais 13º
    worksheetRescisAprov.getRow(j + 6).getCell(7).value = this.somaDecimoTerceiro[i];
    worksheetRescisAprov.getRow(j + 6).getCell(8).value = this.somaIncidenciaDecimoTerceiro[i];
    worksheetRescisAprov.getRow(j + 6).getCell(9).value = this.somaMultaFgtsDecimoTerceiro[i];
    // Subtotais Férias e 1/3
    worksheetRescisAprov.getRow(j + 6).getCell(12).value = this.somaFeriasVencidas[i];
    worksheetRescisAprov.getRow(j + 6).getCell(13).value = this.somaTercoVencido[i];
    worksheetRescisAprov.getRow(j + 6).getCell(14).value = this.somaIncidenciaFeriasVencidas[i];
    worksheetRescisAprov.getRow(j + 6).getCell(15).value = this.somaIncidenciaTercoVencido[i];
    worksheetRescisAprov.getRow(j + 6).getCell(16).value = this.somaFgtsFeriasVencidas[i];
    worksheetRescisAprov.getRow(j + 6).getCell(17).value = this.somaFgtsTercoVencido[i];
    // Subtotais proporcionais
    worksheetRescisAprov.getRow(j + 6).getCell(20).value = this.somaFeriasProporcionais[i];
    worksheetRescisAprov.getRow(j + 6).getCell(21).value = this.somaTercoProporcional[i];
    worksheetRescisAprov.getRow(j + 6).getCell(22).value = this.somaIncidenciaFeriasProporcionais[i];
    worksheetRescisAprov.getRow(j + 6).getCell(23).value = this.somaIncidenciaTercoProporcional[i];
    worksheetRescisAprov.getRow(j + 6).getCell(24).value = this.somaFgtsFeriasProporcionais[i];
    worksheetRescisAprov.getRow(j + 6).getCell(25).value = this.somaFgtsTercoProporcional[i];
    worksheetRescisAprov.getRow(j + 6).getCell(26).value = this.somaMultaFgtsSalario[i];
    // Totais
    worksheetRescisAprov.getRow(j + 7).getCell(6).value = 'Total';
    worksheetRescisAprov.getRow(j + 7).font = {name: 'Arial', bold: true};
    worksheetRescisAprov.getRow(j + 7).getCell(27).value = this.somaSaldo[i];
    // bloco para formatação dos dados da tabela
    for (let x = 5; x <= 200; x++) {
      worksheetRescisAprov.getRow(x).height = 30;
      worksheetRescisAprov.getRow(x).alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
    }

    let k = 28;
    while (k <= 16384) {
      const dobCol = worksheetRescisAprov.getColumn(k);
      dobCol.hidden = true;
      k++;
    }

    workbookRescisAprov.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Relatório-Calculos-Pendentes-Rescisão-Aprovação.xlsx'))
      .catch(err => console.log('Error writing excel export', err));
  }
}
