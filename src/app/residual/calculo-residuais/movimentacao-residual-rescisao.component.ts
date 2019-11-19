import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import 'rxjs/add/observable/of';
import {ResidualCalcular} from '../residual-calcular';
import {ResidualService} from '../residual.service';
import {TerceirizadoResiduaisMovimentacaoRescisao} from './terceirizado-residuais-movimentacao';


@Component({
  selector: 'app-movimentacao-residual-rescisao-component',
  templateUrl: './movimentacao-residual-rescisao.component.html',
  styleUrls: ['./calculo-residuais.component.scss']
})
export class MovimentacaoResidualRescisaoComponent implements OnInit {
  @Input() protected terceirizados: TerceirizadoResiduaisMovimentacaoRescisao[];
  @Input() codigoContrato: number;
  @Input() tipoRestituicao: string;
  rescisaoForm: FormGroup;
  isSelected = false;
  selected = false;
  feriasCalcular: ResidualCalcular[] = [];
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  vmsm = false;
  protected diasConcedidos: number[] = [];
  @Output() navegaParaViewDeCalculos = new EventEmitter();

  constructor(private fb: FormBuilder, private residualService: ResidualService) {
  }

  ngOnInit() {
    this.formInit();
  }

  formInit(): void {
    this.rescisaoForm = this.fb.group({
      calcularTerceirizados: this.fb.array([])
    });
    const control = <FormArray>this.rescisaoForm.controls.calcularTerceirizados;
    this.terceirizados.forEach(item => {
      const addCtrl = this.fb.group({
        codTerceirizadoContrato: new FormControl(item.codigoTerceirizadoContrato),
        valorIncidenciaDecimoTerceiroResidual: new FormControl(item.valorIncidenciaDecimoTerceiroResidual),
        valorSubmodulo: new FormControl(item.valorIncidenciaDecimoTerceiroResidual),
        selected: new FormControl(this.isSelected),
        // emAnalise: new FormControl(item.emAnalise),
      });
      control.push(addCtrl);
    });
    for (let i = 0; i < this.terceirizados.length; i++) {
      this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').setValidators(Validators.required);
      // const emAnalise = this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('emAnalise').value;
      //
      // if (emAnalise) {
      //   this.rescisaoForm.get('calcularTerceirizados').get('' + i).disable();
      // }
    }
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

  protected encapsulaDatas(value: any, operacao: boolean): Date {
    if (operacao) {
      const a = value.split['/'];
      const dia = Number(a[0]);
      const mes = Number(a[1]) - 1;
      const ano = Number(a[2]);
      return new Date(ano, mes, dia);
    } else {
      return value as Date;
    }
  }

  efetuarCalculo(): void {
    // this.feriasService.calculaFeriasTerceirizados(this.feriasCalcular).subscribe(res => {
    //   if (res.success) {
    //     this.closeModal3();
    //     this.openModal4();
    //   }
    // });
  }

  // verificaDadosFormulario() {
  //   this.feriasCalcular = [];
  //   let aux = 0;
  //   for (let i = 0; i < this.terceirizados.length; i++) {
  //     if (this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('selected').value) {
  //       aux++;
  //       this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').updateValueAndValidity();
  //       if (this.rescisaoForm.get('calcularTerceirizados').get('' + i).status === 'VALID' && this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').valid) {
  //         const objeto = new FeriasCalcular(this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('tipoRestituicao').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('diasVendidos').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('inicioFerias').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('fimFerias').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('inicioPeriodoAquisitivo').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('fimPeriodoAquisitivo').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('parcelas').value,
  //           0,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorFerias').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorTercoConstitucional').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorIncidenciaFerias').value,
  //           this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorIncidenciaTercoConstitucional').value);
  //         if (this.terceirizados[i].valorRestituicaoFerias) {
  //           objeto.setInicioPeriodoAquisitivo(this.terceirizados[i].valorRestituicaoFerias.inicioPeriodoAquisitivo);
  //           objeto.setFimPeriodoAquisitivo(this.terceirizados[i].valorRestituicaoFerias.fimPeriodoAquisitivo);
  //         }
  //         let index = -1;
  //         for (let j = 0; j < this.feriasCalcular.length; j++) {
  //           if (this.feriasCalcular[j].codTerceirizadoContrato === this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value) {
  //             index = j;
  //           }
  //         }
  //         objeto.setNomeTerceirizado(this.terceirizados[i].nomeTerceirizado);
  //         if (index === -1) {
  //           this.feriasCalcular.push(objeto);
  //         } else {
  //           this.feriasCalcular.splice(index, 1);
  //           this.feriasCalcular.push(objeto);
  //         }
  //       } else {
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('inicioFerias').markAsTouched();
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('inicioFerias').markAsDirty();
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('fimFerias').markAsTouched();
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('fimFerias').markAsDirty();
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('diasVendidos').markAsTouched();
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('diasVendidos').markAsDirty();
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').markAsTouched();
  //         this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('valorMovimentado').markAsDirty();
  //         aux = undefined;
  //         this.openModal2();
  //       }
  //     }
  //   }
  //   if (aux === 0) {
  //     this.openModal1();
  //   }
  //   if ((this.feriasCalcular.length > 0) && aux) {
  //     this.diasConcedidos = [];
  //     for (let i = 0; i < this.feriasCalcular.length; i++) {
  //       this.getDiasConcedidos(this.feriasCalcular[i].inicioFerias, this.feriasCalcular[i].fimFerias, this.feriasCalcular[i].diasVendidos, i);
  //       this.terceirizados.forEach(terceirizado => {
  //         if (this.feriasCalcular[i].codTerceirizadoContrato === terceirizado.codigoTerceirizadoContrato) {
  //           this.feriasCalcular[i].inicioPeriodoAquisitivo = terceirizado.valorRestituicaoFerias.inicioPeriodoAquisitivo;
  //           this.feriasCalcular[i].fimPeriodoAquisitivo = terceirizado.valorRestituicaoFerias.fimPeriodoAquisitivo;
  //         }
  //       });
  //     }
  //     this.openModal3();
  //   }
  // }

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
    console.log(this.diasConcedidos);
  }
}
