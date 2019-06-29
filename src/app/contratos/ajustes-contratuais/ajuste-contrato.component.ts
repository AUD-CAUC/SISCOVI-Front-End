import {Component, EventEmitter, OnInit} from '@angular/core';
import {ContratosService} from '../contratos.service';
import {Contrato} from '../contrato';
import {MaterializeAction} from 'angular2-materialize';
import {EventoContratual} from './evento-contratual';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-ajuste-contrato-component',
    templateUrl: './ajuste-contrato.component.html',
    styleUrls: ['./ajuste-contrato.component.scss']
})
export class AjusteContratoComponent implements OnInit {
    contratos: Contrato[];
    modalActions = new EventEmitter<string | MaterializeAction>();
    eventos: EventoContratual[] = [];
    valid = false;
    id: number;
    codigoContrato: number;
    constructor(private contratosService: ContratosService, private router: Router, private route: ActivatedRoute) {
      this.contratosService.getContratosDoUsuario().subscribe(res => {
        this.contratos = res;
      });
    }

    ngOnInit() {
      this.route.params.subscribe(params => {
        if (!isNaN(params['id'])) {
          this.id = params['id'];
        }
        if (this.id) {
          this.codigoContrato = this.id;
          if (this.contratos) {
            this.contratosService.getEventosContratuais(this.codigoContrato).subscribe(res => {
              this.eventos = res;
            });
          }
        }
      });
    }
    onChange(value: number) {
        this.contratosService.getEventosContratuais(value).subscribe(res => {
            this.eventos = res;
            this.valid = true;
        });
    }
    cadastrarAjuste() {
      this.router.navigate(['./cadastrar-ajuste'], {relativeTo: this.route});
    }
}
