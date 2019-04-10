import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import 'rxjs/add/observable/of';
import {ResidualCalcular} from '../residual-calcular';
import {ResidualService} from '../residual.service';
import {TerceirizadoResiduaisMovimentacaoFerias} from './terceirizado-residuais-movimentacao';


@Component({
  selector: 'app-movimentacao-residual-ferias-component',
  templateUrl: './movimentacao-residual-ferias.component.html',
  styleUrls: ['./calculo-residuais.component.scss']
})
export class MovimentacaoResidualFeriasComponent implements OnInit {
  @Input() protected terceirizados: TerceirizadoResiduaisMovimentacaoFerias[];
  @Input() codigoContrato: number;
  @Input() tipoRestituicao: string;
  feriasForm: FormGroup;
  isSelected = false;
  selected = false;
  residuaisFeriasConfirmar: TerceirizadoResiduaisMovimentacaoFerias[] = [];
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
    this.feriasForm = this.fb.group({
      calcularTerceirizados: this.fb.array([])
    });
    const control = <FormArray>this.feriasForm.controls.calcularTerceirizados;
    this.terceirizados.forEach(item => {
      const addCtrl = this.fb.group({
        codTerceirizadoContrato: new FormControl(item.codigoTerceirizadoContrato),
        terceirizado: new FormControl(item.terceirizado),
        cpf: new FormControl(item.cpf),
        valorFerias: new FormControl(item.valorFeriasResidual),
        valorTerco: new FormControl(item.valorTercoResidual),
        valorIncidenciaFerias: new FormControl(item.valorIncidenciaFeriasResidual),
        valorIncidenciaTerco: new FormControl(item.valorIncidenciaTercoResidual),
        valorTotal: new FormControl(item.valorTotalResidual),
        selected: new FormControl(this.isSelected),
        // emAnalise: new FormControl(item.emAnalise),
      });
      control.push(addCtrl);
    });
    for (let i = 0; i < this.terceirizados.length; i++) {
      this.feriasForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').setValidators(Validators.required);
      // const emAnalise = this.feriasForm.get('calcularTerceirizados').get('' + i).get('emAnalise').value;
      //
      // if (emAnalise) {
      //   this.feriasForm.get('calcularTerceirizados').get('' + i).disable();
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


  verificaDadosFormulario() {
    this.residuaisFeriasConfirmar = [];
    let aux = 0;
    for (let i = 0; i < this.terceirizados.length; i++) {
      if (this.feriasForm.get('calcularTerceirizados').get('' + i).get('selected').value) {
        aux++;
        if (this.feriasForm.get('calcularTerceirizados').get('' + i).status === 'VALID') {
          const objeto = new TerceirizadoResiduaisMovimentacaoFerias(
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('terceirizado').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('cpf').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('valorFerias').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('valorTerco').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('valorIncidenciaFerias').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('valorIncidenciaTerco').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('valorTotal').value,
            this.feriasForm.get('calcularTerceirizados').get('' + i).get('restituidoFlag').value);
          let index = -1;
          for (let j = 0; j < this.residuaisFeriasConfirmar.length; j++) {
            if (this.residuaisFeriasConfirmar[j].codigoTerceirizadoContrato === this.feriasForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value) {
              index = j;
            }
          }
          if (index === -1) {
            this.residuaisFeriasConfirmar.push(objeto);
          } else {
            this.residuaisFeriasConfirmar.splice(index, 1);
            this.residuaisFeriasConfirmar.push(objeto);
          }
        }
      }
    }
    if (aux === 0) {
      this.openModal1();
    } else {
      this.openModal3();
    }
  }

  efetuarCalculo(): void {
    this.residualService.confirmarFeriasResiduais(this.residuaisFeriasConfirmar).subscribe(res => {
      if (res.success) {
        this.closeModal3();
        this.openModal4();
      }
    });
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
    console.log(this.diasConcedidos);
  }
}
