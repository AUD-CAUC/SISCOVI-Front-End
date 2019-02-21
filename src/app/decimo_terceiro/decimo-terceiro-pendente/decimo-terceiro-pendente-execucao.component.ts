import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DecimoTerceiroPendente} from './decimo-terceiro-pendente';
import {ConfigService} from '../../_shared/config.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {DecimoTerceiroService} from '../decimo-terceiro.service';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';

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
}
