import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {RescisaoService} from '../rescisao.service';
import {ContratosService} from '../../contratos/contratos.service';
import {RescisaoCalculosPendentes} from './rescisao-calculos-pendentes';
import {ConfigService} from '../../_shared/config.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';

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
  somaSaldo: number[] = [];
  @Output() nav = new EventEmitter();

  constructor(private rescisaoService: RescisaoService, private contratoService: ContratosService, config: ConfigService, private fb: FormBuilder, private ref: ChangeDetectorRef) {
    this.config = config;
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
        if (this.rescisaoForm.get('contratos').get('' + i).get('avaliacaoCalculoFerias').get('' + j).get('selected').value) {
          aux++;
          const temp: RescisaoCalculosPendentes = this.calculosPendentes[i].calculos[j];
          temp.status = this.rescisaoForm.get('contratos').get('' + i).get('avaliacaoCalculoFerias').get('' + j).get('avaliacao').value;
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
    for (let i = 0; i < this.calculosAvaliados.length; i++) {
      for (let j = 0; j < this.calculosAvaliados[i].calculos.length; j++) {
        this.calculosAvaliados[i].calculos[j].observacoes = this.rescisaoFormAfter.get('calculosAvaliados').get('' + i).get('observacoes').value;
      }
    }
    this.rescisaoService.salvarRescisoesAvaliadasLista(this.calculosAvaliados).subscribe(res => {
        this.closeModal2();
        this.openModal3();
      },
      error1 => {
        this.closeModal2();
        this.openModal5();
      });
  }

  navegaViewExec() {
    this.closeModal3();
    this.nav.emit(this.codigoContrato);
  }

}
