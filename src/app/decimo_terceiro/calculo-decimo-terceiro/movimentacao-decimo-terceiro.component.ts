import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TerceirizadoDecimoTerceiro} from '../terceirizado-decimo-terceiro';
import {MaterializeAction} from 'angular2-materialize';
import {DecimoTerceiroService} from '../decimo-terceiro.service';
import 'rxjs/add/observable/of';
import {ValorDecimoTerceiro} from '../valor-decimo-terceiro';
import * as XLSX from 'xlsx';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';
import {split} from "ts-node/dist";

@Component({
  selector: 'app-movimentacao-decimo-terceiro-component',
  templateUrl: './movimentacao-decimo-terceiro.component.html',
  styleUrls: ['./resgate-decimo-terceiro.component.scss']
})
export class MovimentacaoDecimoTerceiroComponent implements OnInit {
  @Input() protected terceirizados: TerceirizadoDecimoTerceiro[];
  @Input() codigoContrato: number;
  @Input() tipoRestituicao: string;
  decimoTerceiroForm: FormGroup;
  isSelected = false;
  selected = false;
  calculosDecimoTerceiro: TerceirizadoDecimoTerceiro[] = [];
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  vmsm = false;
  protected diasConcedidos: number[] = [];
  @Output() navegaParaViewDeCalculos = new EventEmitter();
  primeiroItemErrado: number;
  somaDecimo = 0;
  somaIncidencia = 0;
  isLoading = false;

  constructor(private fb: FormBuilder, private decimoTerceiroService: DecimoTerceiroService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.formInit();
    console.log(this.terceirizados);
  }

  formInit(): void {
    this.decimoTerceiroForm = this.fb.group({
      calcularTerceirizados: this.fb.array([])
    });
    this.ref.markForCheck();
    const control = <FormArray>this.decimoTerceiroForm.controls.calcularTerceirizados;
    this.terceirizados.forEach(item => {
      const addCtrl = this.fb.group({
        codTerceirizadoContrato: new FormControl(item.codigoTerceirizadoContrato),
        valorMovimentado: new FormControl(''),
        parcelas: new FormControl(0),
        selected: new FormControl(this.isSelected),
        tipoRestituicao: new FormControl(this.tipoRestituicao),
        valorDisponivel: new FormControl(item.valorDisponivel - item.valorMovimentado),
        inicioContagem: new FormControl(item.inicioContagem),
        emAnalise: new FormControl(item.emAnalise),
        restituidoAnoPassado: new FormControl(item.restituidoAnoPassado),
        parcelaAnterior: new FormControl(item.parcelaAnterior),
      });
      control.push(addCtrl);
    });
    for (let i = 0; i < this.terceirizados.length; i++) {
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').setValidators(Validators.required);
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').setValidators([Validators.required, this.valorMovimentadoValidator]);
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelas').setValidators([Validators.required, this.parcelaValidator]);
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('tipoRestituicao').setValidators(Validators.required);
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorDisponivel');
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('inicioContagem');
      const emAnalise = this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('emAnalise').value;
      const restituidoAnoPassado = this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('restituidoAnoPassado').value;
      let ultimaParcela = this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelaAnterior').value;

      if (ultimaParcela === null) {
        ultimaParcela = '0';
      } else if (!emAnalise) {
        ultimaParcela++;
        ultimaParcela.toString();
      }
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelas').setValue(ultimaParcela);
      if (emAnalise || !restituidoAnoPassado) {
        this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).disable();
      }
    }
  }

  public parcelaValidator(control: AbstractControl): { [key: string]: any } {
    const mensagem = [];
    let error = false;
    const parcelaSelecionada: string = control.value;
    const parcelaAnt: string = control.parent.get('parcelaAnterior').value;
    if (parcelaAnt === null) {
      if (parcelaSelecionada === '2') {
        mensagem.push('Deve realizar a Primeira parcela');
        error = true;
      }
    } else if (parcelaAnt === '1' && !error) {
      if (parcelaSelecionada === '0') {
        // Não pode realizar parcela única.
        mensagem.push('Não é possível realizar a parcela única');
        error = true;
      } else if (parcelaSelecionada === '1') {
        // Já realizou essa parcela.
        mensagem.push('Primeira parcela já realizada');
        error = true;
      }
    }

    if (error) {
      control.parent.get('parcelas').markAsUntouched();
    } else if (control.dirty) {
      control.parent.get('parcelas').markAsUntouched();
    }

    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  public valorMovimentadoValidator(control: AbstractControl): { [key: string]: any } {
    const mensagem = [];
    if (control.value === 0) {
      mensagem.push('Digite um valor a ser movimentado !');
    }
    if (control.parent) {
      if (control.parent.get('valorDisponivel').value < control.value) {
        mensagem.push('O valor a ser movimentado não pode ser maior que o valor disponível !');
      }
    }
    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  closeModal1() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  openModal1() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  openModal2() {
    this.modalActions2.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {

    this.modalActions2.emit({action: 'modal', params: ['close']});
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
    this.navegaParaViewDeCalculos.emit(this.codigoContrato);
  }

  efetuarCalculo(): void {
    this.isLoading = true;
    this.decimoTerceiroService.registrarCalculoDecimoTerceiro(this.calculosDecimoTerceiro).subscribe(res => {
      this.isLoading = false;
      if (res.success) {
        this.closeModal3();
        this.openModal4();
      }
    });
  }

  verificaDadosFormulario() {
    this.isLoading = true;
    this.calculosDecimoTerceiro = [];
    let aux = 0;
    this.primeiroItemErrado = null;
    for (let i = 0; i < this.terceirizados.length; i++) {
      if (this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('selected').value) {
        aux++;
        this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').updateValueAndValidity();
        if (this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).status === 'VALID' && this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').valid) {
          const objeto = new TerceirizadoDecimoTerceiro(this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value,
            this.terceirizados[i].nomeTerceirizado,
            this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('inicioContagem').value,
            this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorDisponivel').value,
            this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').value,
            this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelas').value);
          objeto.tipoRestituicao = 'MOVIMENTAÇÃO';
          if (this.terceirizados[i].valorMovimentado) {

          }
          let index = -1;
          for (let j = 0; j < this.calculosDecimoTerceiro.length; j++) {
            if (this.calculosDecimoTerceiro[j].codigoTerceirizadoContrato === this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value) {
              index = j;
            }
            console.log(this.calculosDecimoTerceiro);
          }
          objeto.setNomeTerceirizado(this.terceirizados[i].nomeTerceirizado);
          const valor = new ValorDecimoTerceiro();
          valor.valorDecimoTerceiro = this.terceirizados[i].valorDisponivel;
          objeto.setValoresDecimoTerceiro(valor);
          if (index === -1) {
            this.calculosDecimoTerceiro.push(objeto);
          } else {
            this.calculosDecimoTerceiro.splice(index, 1);
            this.calculosDecimoTerceiro.push(objeto);
          }
        } else {
          if (!this.primeiroItemErrado) {
            this.primeiroItemErrado = i;
          }
          this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').markAsTouched();
          this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').markAsDirty();
          aux = undefined;
          this.isLoading = false;
          this.openModal2();
        }
        console.log(typeof this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('inicioContagem').value);
        console.log(this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('inicioContagem').value);
      }
    }
    if (aux === 0) {
      this.isLoading = false;
      this.openModal1();
    }
    if ((this.calculosDecimoTerceiro.length > 0) && aux) {
      this.diasConcedidos = [];
      this.somaDecimo = 0;
      this.decimoTerceiroService.calculaDecimoTerceiroTerceirizados(this.calculosDecimoTerceiro).subscribe(res => {
        if (!res.error) {
          this.calculosDecimoTerceiro = res;
          for (let i = 0; i < this.calculosDecimoTerceiro.length; i++) {
            this.somaDecimo = this.somaDecimo + this.calculosDecimoTerceiro[i].valorMovimentado;
          }
          this.isLoading = false;
          this.openModal3();
          this.vmsm = true;
        }
      });
    }
  }

  getDiasConcedidos(inicioFerias, fimFerias, diasVendidos, indice) {
    let dia = inicioFerias.split('/')[0];
    let mes = inicioFerias.split('/')[1] - 1;
    let ano = inicioFerias.split('/')[2];
    const initDate = new Date(ano, mes, dia);
    dia = fimFerias.split('/')[0];
    mes = fimFerias.split('/')[1] - 1;
    ano = fimFerias.split('/')[2];
    const finalDate = new Date(ano, mes, dia);
    const diffTime = Math.abs(finalDate.getTime() - initDate.getTime());
    const diffDay = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
    this.diasConcedidos[indice] = diffDay + diasVendidos;
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

  // getMoney(str) {
  //   return parseInt( str.replace(/[\D]+/g, '') );
  // }
  formatReal(int) {
    let tmp = int + '';
    tmp = tmp.replace(/([0-9]{2})$/g, ',$1');
    if ( tmp.length > 6 ) {
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
    }
    return tmp;
  }
  gerarRelatorioExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Relatório 13º', {pageSetup:{fitToPage: true, fitToHeight: 5, fitToWidth: 7}});

    worksheet.pageSetup.margins = {
      left: 0.7, right: 0.7,
      top: 0.5, bottom: 0.5,
      header: 0.3, footer: 0.3
    };

    worksheet.pageSetup.paperSize = 9;

    worksheet.columns = [
      {header: 'Terceirizado', key: 'terceirizado', width: 57},
      {header: 'Parcela', key: 'parcela', width: 20},
      {header: 'Início da Contagem', key: 'inicio', width: 35},
      {header: 'Valor Disponível para Movimentação', key: 'disponivel', width: 60},
      {header: 'Valor a Ser Movimentado', key: 'movimentado', width: 57}
    ];
    worksheet.getRow(1).font = {name: 'Arial', size: 18};
    worksheet.getRow(1).alignment = {vertical: 'middle', horizontal: 'center'};



    for (let i = 0; i < this.calculosDecimoTerceiro.length; i++) { // i=0-i=1-i=2-i=3
      let row;
      row = worksheet.getRow(i + 2); // linha 2-3-4
      row.getCell(1).value = this.calculosDecimoTerceiro[i].nomeTerceirizado; // nome 0-1-2
      row.getCell(2).value = this.formatParcela(this.calculosDecimoTerceiro[i].parcelas);
      row.getCell(3).value = this.formatDate(this.calculosDecimoTerceiro[i].inicioContagem);
      row.getCell(4).value = this.calculosDecimoTerceiro[i].valorDisponivel.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
      row.getCell(5).value = this.calculosDecimoTerceiro[i].valorMovimentado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }

    worksheet.eachRow({includeEmpty: true}, function (row) {
      row.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
    });

    let j = 6;
    while (j <= 16384) {
      const dobCol = worksheet.getColumn(j);
      dobCol.hidden = true;
      j++;
    }

    workbook.xlsx.writeBuffer()
      .then(buffer => saveAs(new Blob([buffer]), 'Confirmar-Calculo.xlsx'))
      .catch(err => console.log('Error writing excel export', err));

  }
}
