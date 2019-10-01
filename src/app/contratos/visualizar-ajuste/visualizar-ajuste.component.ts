import {Component} from '@angular/core';
import {Contrato} from '../contrato';
import {HistoricoGestor} from '../../historico/historico-gestor';
import {HistoricoService} from '../../historico/historico.service';
import {ContratosService} from '../contratos.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-visualizar-ajuste.component',
    templateUrl: './visualizar-ajuste.component.html',
    styleUrls: ['./visualizar-ajuste.component.scss']
})
export class VisualizarAjusteComponent {
    contratos: Contrato[];
    contrato: Contrato;
    codContrato: number;
    codAjuste: number;
    historicoGestor: HistoricoGestor[];
    histoServ: HistoricoService;
    contServ: ContratosService;

    constructor(contServ: ContratosService, private router: Router, private route: ActivatedRoute, histoServ: HistoricoService) {
        this.contServ = contServ;
        this.histoServ = histoServ;
        route.params.subscribe(params => {
            this.codContrato = params['codContrato'];
            this.codAjuste = params['codAjuste'];
        });
        if (this.codAjuste.toString() !== '0') {
            this.contServ.getAjusteCompleto(this.codContrato, this.codAjuste).subscribe(res => {
                this.contrato = res;
            });
        } else {
            this.contServ.getContratoCompletoUsuario(this.codContrato).subscribe(res => {
                this.contrato = res;
            });
        }
    }

    voltaContratos() {
        this.router.navigate(['/contratos']);
    }
}
