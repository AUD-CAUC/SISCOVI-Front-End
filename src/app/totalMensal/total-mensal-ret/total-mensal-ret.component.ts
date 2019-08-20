import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {TotalMensalService} from '../total-mensal.service';
import {Contrato} from '../../contratos/contrato';
import {ContratosService} from '../../contratos/contratos.service';
import {ConfigService} from '../../_shared/config.service';
import {ListaTotalMensalData} from '../lista-total-mensal-data';

@Component({
    selector: 'app-total-mensal-ret',
    templateUrl: './total-mensal-ret.component.html',
    styleUrls: ['../total-mensal.component.scss']
})
export class TotalMensalRetComponent implements OnInit {
    calculos: ListaTotalMensalData[];
    somaFerias: number;
    somaTerco: number;
    somaDecimo: number;
    somaIncidencia: number;
    somaMultaFGTS: number;
    somaSaldo: number;
    contratos: Contrato[];
    tmService: TotalMensalService;
    contratoService: ContratosService;
    private config: ConfigService;
    codContrato: number;
    @Input() contratoSelecionado: number;
    constructor(tmService: TotalMensalService, contratoService: ContratosService, config: ConfigService, private changeDetector: ChangeDetectorRef) {
        this.contratoService = contratoService;
        this.config = config;
        this.contratoService.getContratosDoUsuario().subscribe(res => {
            this.contratos = res;
        });
        this.tmService = tmService;

        if (this.contratoSelecionado) {
          console.log(this.contratoSelecionado);
            this.tmService.getValoresRetidos(this.contratoSelecionado, this.config.user.id).subscribe(res => {
                if (this.calculos) {
                   this.calculos =  this.calculos.splice(0);
                }
                this.calculos = res;
                this.changeDetector.detectChanges();
            });
        }
    }
    onChange(value: number) {
       this.codContrato = value;
       console.log(value);
       if (value) {
         this.tmService.getValoresRetidos(this.codContrato, this.config.user.id).subscribe(res => {
           if (this.calculos) {
             this.calculos = this.calculos.splice(0);
           }
           this.calculos = res;
           this.changeDetector.detectChanges();
         });
       }
    }
    // onLoad() {
    //      {
    //         this.tmService.getValoresRetidos(this.codContrato, this.config.user.id).subscribe(res => {
    //             if (this.calculos) {
    //                this.calculos = this.calculos.splice(0);
    //             }
    //             this.calculos = res;
    //             this.changeDetector.detectChanges();
    //         });
    //     }
    // }
    ngOnInit () {
        if (this.contratoSelecionado) {
            this.codContrato = this.contratoSelecionado;
            this.tmService.getValoresRetidos(this.contratoSelecionado, this.config.user.id).subscribe(res => {
               this.calculos = res;
            });
        }
    }

    calculaTotais(calculo: ListaTotalMensalData) {
        this.somaFerias = 0;
        this.somaTerco = 0;
        this.somaDecimo = 0;
        this.somaIncidencia = 0;
        this.somaMultaFGTS = 0;
        this.somaSaldo = 0;

        for (let i = 0; i < calculo.totais.length; i++) {
            this.somaFerias = this.somaFerias + calculo.totais[i].ferias;
            this.somaTerco = this.somaTerco + calculo.totais[i].tercoConstitucional;
            this.somaDecimo = this.somaDecimo + calculo.totais[i].decimoTerceiro;
            this.somaIncidencia = this.somaIncidencia + calculo.totais[i].incidencia;
            this.somaMultaFGTS = this.somaMultaFGTS + calculo.totais[i].multaFGTS;
            this.somaSaldo = this.somaSaldo + calculo.totais[i].total;
        }
    }
}
