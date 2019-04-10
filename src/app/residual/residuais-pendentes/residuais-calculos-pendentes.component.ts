import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {ContratosService} from '../../contratos/contratos.service';
import {ConfigService} from '../../_shared/config.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';
import {ResidualService} from '../residual.service';
import {ResiduaisCalculosPendentes} from './residuais-calculos-pendentes';

@Component({
  selector: 'app-residuais-calculos-pendentes',
  templateUrl: './residuais-calculos-pendentes.component.html',
  styleUrls: ['./residuais-calculos-pendentes.component.scss']
})
export class ResiduaisCalculosPendentesComponent implements OnInit {
  contratos: Contrato[];
  isSelected: boolean[] = [];
  @Input() calculosPendentes: ListaCalculosPendentes[];
  calculosAvaliados: ListaCalculosPendentes[];
  calculosNegados: ListaCalculosPendentes[];
  config: ConfigService;
  feriasForm: FormGroup;
  feriasFormAfter: FormGroup;
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  modalActions5 = new EventEmitter<string | MaterializeAction>();
  notifications: number;
  somaFerias: number[] = [];
  somaTerco: number[] = [];
  somaDecimo: number[] = [];
  somaIncidenciaFerias: number[] = [];
  somaIncidenciaTerco: number[] = [];
  somaSaldo: number[] = [];
  @Output() nav = new EventEmitter();

  constructor(private residualService: ResidualService, private contratoService: ContratosService, config: ConfigService,
              private fb: FormBuilder, private ref: ChangeDetectorRef) {
    this.config = config;

    this.residualService.getCalculosPendentes().subscribe(res => {
      this.calculosPendentes = res;

      if (this.calculosPendentes.length === 0) {
        this.calculosPendentes = null;
      }

      this.ref.markForCheck();
    });

    this.residualService.getCalculosPendentesNegados().subscribe(res3 => {
      this.calculosNegados = res3;
      this.notifications = this.calculosNegados.length;
      this.ref.markForCheck();
    }, () => {
      this.calculosNegados = null;
    });
  }

  ngOnInit() {
    if (this.calculosPendentes) {
      if (this.calculosPendentes.length === 0) {
        this.calculosPendentes = null;
      } else {
        this.isSelected = new Array(this.calculosPendentes.length).fill(false);
        this.somaFerias = new Array(this.calculosPendentes.length).fill(0);
        this.somaTerco = new Array(this.calculosPendentes.length).fill(0);
        this.somaDecimo = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaFerias = new Array(this.calculosPendentes.length).fill(0);
        this.somaIncidenciaTerco = new Array(this.calculosPendentes.length).fill(0);
        this.somaSaldo = new Array(this.calculosPendentes.length).fill(0);
        for (let i = 0; i < this.calculosPendentes.length; i++) {
          // for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
            // this.somaFerias[i] = this.somaFerias[i] +
            //   this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalFerias;
            // this.somaTerco[i] = this.somaTerco[i] +
            //   this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalTercoConstitucional;
            // this.somaIncidenciaFerias[i] = this.somaIncidenciaFerias[i] +
            //   this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalIncidenciaFerias;
            // this.somaIncidenciaTerco[i] = this.somaIncidenciaTerco[i] +
            //   this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalIncidenciaTerco;
            // this.somaSaldo[i] = this.somaSaldo[i] + this.calculosPendentes[i].calculos[j].total;
          // }
        }
        this.ref.markForCheck();
      }
      this.formInit();
    }
  }

  formInit() {
    if (this.calculosPendentes) {
      this.feriasForm = this.fb.group({
        contratos: this.fb.array([])
      });
      if (this.calculosPendentes) {
        this.calculosPendentes.forEach(calculoPendente => {
          const control = <FormArray>this.feriasForm.controls.contratos;
          const newControl = this.fb.group({
            titulo: new FormControl(calculoPendente.titulo),
            codigo: new FormControl(calculoPendente.codigo),
            calculosFerias: this.fb.array([])
          });
          calculoPendente.calculosFerias.forEach(() => {
            const newControl2 = <FormArray>newControl.controls.calculosFerias;
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
    this.feriasFormAfter = this.fb.group({
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
    this.feriasFormAfter = this.fb.group({
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

  /*defineCodigoContrato(codigoContrato: number): void {
    this.codigoContrato = codigoContrato;
    if (this.codigoContrato) {
      this.feriasService.getCalculosPendentes().subscribe(res2 => {
        this.calculosPendentes = res2;
        if (this.calculosPendentes.length === 0) {
          this.calculosPendentes = null;
        } else {
          this.formInit();
        }
      });
      this.feriasService.getCalculosPendentesNegados().subscribe(res3 => {
        const historico: ListaCalculosPendentes[] = res3;
        this.calculosNegados = historico;
        this.notifications = this.calculosNegados.length;
        this.ref.markForCheck();
      });
    }
  }*/

  verificaFormulario() {
    let aux = 0;
    this.calculosAvaliados = [];
    for (let i = 0; i < this.calculosPendentes.length; i++) {
      const lista = new ListaCalculosPendentes();
      // for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
      //   if (this.feriasForm.get('contratos').get('' + i).get('calculosFerias').get('' + j).get('selected').value) {
      //     aux++;
      //     const temp: ResiduaisCalculosPendentes = this.calculosPendentes[i].calculos[j];
      //     temp.status = this.feriasForm.get('contratos').get('' + i).get('calculosFerias').get('' + j).get('avaliacao').value;
      //     lista.titulo = this.feriasForm.get('contratos').get('' + i).get('titulo').value;
      //     lista.codigo = this.feriasForm.get('contratos').get('' + i).get('codigo').value;
      //     lista.calculos.push(temp);
      //   }
      // }
      this.calculosAvaliados.push(lista);
    }
    if (aux === 0) {
      this.openModal();
    } else {
      const control = <FormArray>this.feriasFormAfter.controls.calculosAvaliados;
      this.calculosAvaliados.forEach(item => {
        const newControl = this.fb.group({
          calculos: this.fb.array([])
        });
        // item.calculos.forEach((calc) => {
        //   const newControl2 = <FormArray>newControl.controls.calculos;
        //   const addControl = this.fb.group((calc.status === 'N') ? {
        //       observacoes: new FormControl('', [Validators.required])
        //     } : {
        //       observacoes: new FormControl('')
        //     }
        //   );
        //   newControl2.push(addControl);
        // });
        control.push(newControl);
      });
      this.openModal2();
    }
  }

  salvarAlteracoes() {
    for (let i = 0; i < this.calculosAvaliados.length; i++) {
      // for (let j = 0; j < this.calculosAvaliados[i].calculos.length; j++) {
      //   this.calculosAvaliados[i].calculos[j].observacoes = this.feriasFormAfter
      //     .get('calculosAvaliados')
      //     .get('' + i)
      //     .get('calculos').get('' + j)
      //     .get('observacoes').value;
      // }
    }
    // this.residualService.salvarFeriasAvaliadasLista(this.calculosAvaliados).subscribe(() => {
    //     this.closeModal2();
    //     this.openModal3();
    //   },
    //   () => {
    //     this.closeModal2();
    //     this.openModal5();
    //   });
  }

  navegaViewExec() {
    this.closeModal3();
    this.nav.emit();
  }
}
