import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {TerceirizadoRescisao} from '../terceirizado-rescisao';
import {RescisaoService} from '../rescisao.service';
import {CalculoRescisao} from '../calculo-rescisao';
import {RescisaoCalcular} from '../rescisao-calcular';
import {Contrato} from '../../contratos/contrato';

@Component({
    selector: 'app-resgate-rescisao-component',
    templateUrl: './resgate-rescisao.component.html',
    styleUrls: ['./calculo-rescisao.component.scss']
})
export class ResgateRescisaoComponent implements OnInit {
    protected contratos: Contrato[];
    @Input() protected terceirizados: TerceirizadoRescisao[];
    @Input() codigoContrato: number;
    @Input() tipoRestituicao: string;
    rescisaoForm: FormGroup;
    isSelected = false;
    selected = false;
    calculosRescisao: RescisaoCalcular[] = [];
    modalActions = new EventEmitter<string | MaterializeAction>();
    modalActions2 = new EventEmitter<string | MaterializeAction>();
    modalActions3 = new EventEmitter<string | MaterializeAction>();
    modalActions4 = new EventEmitter<string | MaterializeAction>();
    @Output() navegaParaViewDeCalculos = new EventEmitter();
    constructor(private fb: FormBuilder, private rescisaoService: RescisaoService) { }
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
                codTerceirizadoContrato: new FormControl(item.codTerceirizadoContrato),
                tipoRescisao: new FormControl(),
                selected: new FormControl(this.isSelected),
                tipoRestituicao: new FormControl(this.tipoRestituicao),
                dataDesligamento: new FormControl(),
                dataInicioFeriasIntegrais: new FormControl(),
                dataFimFeriasIntegrais: new FormControl(),
                dataInicioFeriasProporcionais: new FormControl()
            });
            control.push(addCtrl);
        });
        for (let i = 0; i < this.terceirizados.length; i++) {
            this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').setValidators(Validators.required);
            this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('tipoRescisao').setValidators(Validators.required);
            this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('tipoRestituicao').setValidators(Validators.required);
            this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataDesligamento');
            this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataInicioFeriasIntegrais');
            this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataFimFeriasIntegrais');
            this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataInicioFeriasPrpoporcionais');
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
    efetuarCalculo(): void {
        this.rescisaoService.registrarCalculoRescisao(this.terceirizados).subscribe(res => {
            if (res.success) {
                this.closeModal3();
                this.openModal4();
            }
        });
    }
    verificaDadosFormulario() {
        let aux = 0;
        for (let i = 0; i < this.terceirizados.length; i++) {
            if (this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('selected').value) {
                aux++;
                if (this.rescisaoForm.get('calcularTerceirizados').get('' + i).status === 'VALID') {
                    const objeto = new RescisaoCalcular(this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value,
                        this.tipoRestituicao,
                        this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('tipoRescisao').value,
                        this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataDesligamento').value,
                        this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataInicioFeriasIntegrais').value,
                        this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataFimFeriasIntegrais').value,
                        this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataInicioFeriasProporcionais').value,
                        this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('dataDesligamento').value,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0);
                    let index = -1;
                    for (let j = 0; j < this.calculosRescisao.length; j++) {
                        if (this.calculosRescisao[j].codTerceirizadoContrato === this.rescisaoForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value) {
                            index = j;
                        }
                    }
                    objeto.setNomeTerceirizado(this.terceirizados[i].nomeTerceirizado);
                    if (index === -1) {
                        this.calculosRescisao.push(objeto);
                    } else {
                        this.calculosRescisao.splice(index, 1);
                        this.calculosRescisao.push(objeto);
                    }
                } else {
                    aux = null;
                    this.openModal2();
                }
            }
        }
        if (aux === 0) {
            this.openModal1();
        }
        if ((this.calculosRescisao.length > 0) && aux) {
          for (let i = 0; i < this.calculosRescisao.length; i++) {
            this.rescisaoService.calculaRescisaoTerceirizados(this.calculosRescisao[i]).subscribe(res => {
              if (!res.error) {
                this.terceirizados.forEach(terceirizado => {
                  if (terceirizado.codTerceirizadoContrato === this.calculosRescisao[i].codTerceirizadoContrato) {
                    terceirizado.valorRestituicaoRescisao = res;
                    this.calculosRescisao[i].totalDecimoTerceiro = terceirizado.valorRestituicaoRescisao.valorDecimoTerceiro;
                    this.calculosRescisao[i].totalIncidenciaDecimoTerceiro = terceirizado.valorRestituicaoRescisao.valorIncidenciaDecimoTerceiro;
                    this.calculosRescisao[i].totalMultaFgtsDecimoTerceiro = terceirizado.valorRestituicaoRescisao.valorFGTSDecimoTerceiro;
                    this.calculosRescisao[i].totalFeriasVencidas = terceirizado.valorRestituicaoRescisao.valorFeriasIntegral;
                    this.calculosRescisao[i].totalTercoConstitucionalvencido = terceirizado.valorRestituicaoRescisao.valorTercoIntegral;
                    this.calculosRescisao[i].totalIncidenciaFeriasVencidas = terceirizado.valorRestituicaoRescisao.valorIncidenciaFeriasIntegral;
                    this.calculosRescisao[i].totalIncidenciaTercoVencido = terceirizado.valorRestituicaoRescisao.valorIncidenciaTercoIntegral;
                    this.calculosRescisao[i].totalMultaFgtsFeriasVencidas = terceirizado.valorRestituicaoRescisao.valorFGTSFeriasIntegral;
                    this.calculosRescisao[i].totalMultaFgtsTercoVencido = terceirizado.valorRestituicaoRescisao.valorFGTSTercoIntegral;
                    this.calculosRescisao[i].totalFeriasProporcionais = terceirizado.valorRestituicaoRescisao.valorFeriasProporcional;
                    this.calculosRescisao[i].totalTercoProporcional = terceirizado.valorRestituicaoRescisao.valorTercoProporcional;
                    this.calculosRescisao[i].totalIncidenciaFeriasProporcionais = terceirizado.valorRestituicaoRescisao.valorIncidenciaFeriasProporcional;
                    this.calculosRescisao[i].totalIncidenciaTercoProporcional = terceirizado.valorRestituicaoRescisao.valorIncidenciaTercoProporcional;
                    this.calculosRescisao[i].totalMultaFgtsFeriasProporcionais = terceirizado.valorRestituicaoRescisao.valorFGTSFeriasProporcional;
                    this.calculosRescisao[i].totalIncidenciaTercoProporcional = terceirizado.valorRestituicaoRescisao.valorFGTSTercoProporcional;
                    this.calculosRescisao[i].totalMultaFgtsSalario = terceirizado.valorRestituicaoRescisao.valorFGTSSalario;

                    if (i === (this.calculosRescisao.length - 1)) {
                      this.openModal3();
                    }
                  }
                  });
              }
            });
          }
        }
    }
}
