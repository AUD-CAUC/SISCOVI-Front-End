import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contrato} from '../../contratos/contrato';
import {FeriasService} from '../ferias.service';
import {ContratosService} from '../../contratos/contratos.service';
import {FeriasCalculosPendentes} from './ferias-calculos-pendentes';
import {ConfigService} from '../../_shared/config.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {ListaCalculosPendentes} from './lista-calculos-pendentes';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';
import {fontSize} from "html2canvas/dist/types/css/property-descriptors/font-size";

@Component({
  selector: 'app-ferias-calculos-pendentes',
  templateUrl: './ferias-calculos-pendentes.component.html',
  styleUrls: ['./ferias-calculos-pendentes.component.scss']
})
export class FeriasCalculosPendentesComponent implements OnInit {
  contratos: Contrato[];
  isSelected: boolean[] = [];
  isRated: string[] = [];
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

  constructor(private feriasService: FeriasService, private contratoService: ContratosService, config: ConfigService,
              private fb: FormBuilder, private ref: ChangeDetectorRef) {
    this.config = config;

    this.feriasService.getCalculosPendentes().subscribe(res => {
      this.calculosPendentes = res;

      if (this.calculosPendentes.length === 0) {
        this.calculosPendentes = null;
      }

      this.ref.markForCheck();
    });

    this.feriasService.getCalculosPendentesNegados().subscribe(res3 => {
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
        this.isRated = new Array(this.calculosPendentes.length).fill('N');
        for (let i = 0; i < this.calculosPendentes.length; i++) {
          for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
            this.somaFerias[i] = this.somaFerias[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalFerias;
            this.somaTerco[i] = this.somaTerco[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalTercoConstitucional;
            this.somaIncidenciaFerias[i] = this.somaIncidenciaFerias[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalIncidenciaFerias;
            this.somaIncidenciaTerco[i] = this.somaIncidenciaTerco[i] +
              this.calculosPendentes[i].calculos[j].calcularFeriasModel.pTotalIncidenciaTerco;
            this.somaSaldo[i] = this.somaSaldo[i] + this.calculosPendentes[i].calculos[j].total;
          }
        }
        this.ref.markForCheck();
      }
      this.formInit();
      console.log(this.isRated);
      console.log(this.isSelected);
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
            avaliacaoCalculoFerias: this.fb.array([])
          });
          calculoPendente.calculos.forEach(() => {
            const newControl2 = <FormArray>newControl.controls.avaliacaoCalculoFerias;
            const addControl = this.fb.group({
              selected: new FormControl(),
              avaliacao: new FormControl('S')
            });
            newControl2.push(addControl);
            console.log(this.isRated);
            console.log(this.isSelected);
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
      lista.calculos = [];
      for (let j = 0; j < this.calculosPendentes[i].calculos.length; j++) {
        if (this.feriasForm.get('contratos').get('' + i).get('avaliacaoCalculoFerias').get('' + j).get('selected').value) {
          aux++;
          const temp: FeriasCalculosPendentes = this.calculosPendentes[i].calculos[j];
          temp.status = this.feriasForm.get('contratos').get('' + i).get('avaliacaoCalculoFerias').get('' + j).get('avaliacao').value;
          lista.titulo = this.feriasForm.get('contratos').get('' + i).get('titulo').value;
          lista.codigo = this.feriasForm.get('contratos').get('' + i).get('codigo').value;
          lista.calculos.push(temp);
        }
      }
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
        item.calculos.forEach((calc) => {
          const newControl2 = <FormArray>newControl.controls.calculos;
          const addControl = this.fb.group((calc.status === 'N') ? {
              observacoes: new FormControl('', [Validators.required])
            } : {
              observacoes: new FormControl('')
            }
          );
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
        this.calculosAvaliados[i].calculos[j].observacoes = this.feriasFormAfter
          .get('calculosAvaliados')
          .get('' + i)
          .get('calculos').get('' + j)
          .get('observacoes').value;
      }
    }
    this.feriasService.salvarFeriasAvaliadasLista(this.calculosAvaliados).subscribe(() => {
      this.closeModal2();
      this.openModal3();
    },
      () => {
        this.closeModal2();
        this.openModal5();
      });
  }

  navegaViewExec() {
    this.closeModal3();
    this.nav.emit();
  }
  captureScreen(nomeEmpresa, existeNegados) {
    console.log(nomeEmpresa);
    console.log(existeNegados);
    if (this.calculosNegados && existeNegados === 1) {
          const data1 = document.getElementById(nomeEmpresa);
          console.log(data1);
          html2canvas(data1, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
            // Few necessary setting options
            const imgWidth = 205;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/jpg');
            const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
            let position = 35;
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
              position = heightLeft - imgHeight + position;
              pdf.addPage();
              pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
              // pdf.text('Saldo Individual', 105, 15, {align: 'center'});
              heightLeft -= pageHeight;
            }

            pdf.viewerPreferences({
              FitWindow: true
            });

            // dataReferencia = dataReferencia.split('-');
            pdf.setFontSize(12);
            pdf.text('Relatório de Cáculos Negados', 102.5, 15, {align: 'center'});
            pdf.text(nomeEmpresa, 102.5, 25, {align: 'center'});
            // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
            pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);


            pdf.save('Relatório_Férias_' + nomeEmpresa + '_Negadas.pdf'); // Generated PDF
          });
    } else {
      console.log('entrou no else')
      const data2 = document.getElementById(nomeEmpresa);
      console.log(data2);
      html2canvas(data2, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
        // Few necessary setting options
        const imgWidth = 205;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/jpg');
        const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        let position = 35;



        // dataReferencia = dataReferencia.split('-');
        pdf.setFontSize(12);
        pdf.text('Restituição Pendente de Aprovação', 102.5, 15, {align: 'center'});
        pdf.text(nomeEmpresa, 102.5, 25, {align: 'center'});
        // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
        pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + position;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
          // pdf.text('Saldo Individual', 105, 15, {align: 'center'});
          heightLeft -= pageHeight;
        }

        pdf.viewerPreferences({
          FitWindow: true
        });

        pdf.save('Relatório_Férias_' + nomeEmpresa + '_Aprovação.pdf'); // Generated PDF
      });
    }
  }
  rejeitaTodos() {

  }
}
