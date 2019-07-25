import {Component} from '@angular/core';
import {HistoricoService} from './historico.service';
import {Contrato} from '../contratos/contrato';
import {ContratosService} from '../contratos/contratos.service';
import {HistoricoGestor} from './historico-gestor';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-historico-gestores-component',
    templateUrl: './historico-gestores.component.html',
    styleUrls: ['./historico-gestores.component.scss']
})
export class HistoricoGestoresComponent {
    contratos: Contrato[];
    historicoGestor: HistoricoGestor[];
    codigoContrato: number;
    constructor(private histoService: HistoricoService, private contratoService: ContratosService, private router: Router, private route: ActivatedRoute) {
        this.contratoService.getContratosDoUsuario().subscribe(res => {
            this.contratos = res;
        });
      route.params.subscribe(params => {
        this.codigoContrato = params['codContrato'];
        // if (this.id) {
        //   rubricaService.buscarRubrica(this.id).subscribe(res => {
        //     this.rubrica = res;
        //     this.rubricaForm.controls.nome.setValue(this.rubrica.nome);
        //     this.rubricaForm.controls.sigla.setValue(this.rubrica.sigla);
        //     this.rubricaForm.controls.descricao.setValue(this.rubrica.descricao);
        //   });
        // }
      });
      this.selecionarContrato(this.codigoContrato);
    }
    selecionarContrato(value: number) {
        this.histoService.getHistoricoGestores(value).subscribe(res => {
           this.historicoGestor = res;
        });
    }
    cadastroGestorContrato() {
        this.router.navigate(['./cadastro-gestor-contrato'], {relativeTo: this.route});
    }

    editarHistoricoGestaoContrato(id: number) {
        this.router.navigate(['historico-gestores', id], {skipLocationChange: true});
    }
}
