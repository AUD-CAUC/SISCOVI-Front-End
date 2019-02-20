import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {MaterializeAction} from 'angular2-materialize';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ConfigService} from '../../_shared/config.service';
import {DecimoTerceiroService} from '../decimo-terceiro.service';
import {ContratosService} from '../../contratos/contratos.service';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';
import {DecimoTerceiroPendente} from './decimo-terceiro-pendente';

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
    constructor(config: ConfigService, private  fb: FormBuilder, private  ref: ChangeDetectorRef,
                private decimoTerceiroService: DecimoTerceiroService, private contratoService: ContratosService) {
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
        if (this.calculosPendentes) {
          if (this.calculosPendentes.length === 0) {
            this.calculosPendentes = null;
          }else {
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
              }
            }
            this.ref.markForCheck();
            this.formInit();
          }
        }
      }, error2 => {
        this.calculosPendentes = null;
      });
    }
    formInit() {
        if (this.calculosPendentes ) {
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
          this.calculosAvaliados[i].calculos[j].observacoes = this.decimoTerceiroFormAfter.get('calculosAvaliados').get('' + i).get('observacoes').value;
        }
      }
      this.decimoTerceiroService.salvarDecimoTerceiroAvaliados(this.calculosAvaliados).subscribe(res => {
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
        this.nav.emit();
    }
}
