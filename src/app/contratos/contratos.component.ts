import {Component, EventEmitter} from '@angular/core';
import {ContratosService} from './contratos.service';
import {Contrato} from './contrato';
import {MaterializeAction} from 'angular2-materialize';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {EventoContratual} from './ajustes-contratuais/evento-contratual';

@Component({
  selector: 'app-contrato',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contrato.component.scss']
})
export class ContratosComponent {
  contratos: Contrato[];
  modalActions = new EventEmitter<string | MaterializeAction>();
  private loadComponent = false;
  render = false;
  contServ: ContratosService;
  constructor(contServ: ContratosService, private router: Router, private route: ActivatedRoute) {
      this.contServ = contServ;
      contServ.getContratosDoUsuario().subscribe( res => {
        contServ.contratos = res;
        this.contratos = res;

        this.contratos.forEach(contrato => {
          this.contServ.getEventosContratuais(contrato.codigo).subscribe((res2: EventoContratual[]) => {
            contrato.eventosContratuais = res2;
          });
        });
      });
  }
  loadMyChildComponent() {
    this.loadComponent = true;
  }
  openModal() {
    this.render = true;
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  closeModal() {
    this.render = false;
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
  cadastrarContrato() {
      this.router.navigate(['./cadastro-contrato'], {relativeTo: this.route});
  }
  cadastrarAjuste(codigoContrato) {
    this.router.navigate(['./cadastrar-ajuste', codigoContrato], {relativeTo: this.route});
  }
}
