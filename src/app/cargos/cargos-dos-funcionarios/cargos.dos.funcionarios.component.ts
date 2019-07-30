import {Component, EventEmitter} from '@angular/core';
import {ConfigService} from '../../_shared/config.service';
import {FuncionariosService} from '../../funcionarios/funcionarios.service';
import {CargoService} from '../cargo.service';
import {Contrato} from '../../contratos/contrato';
import {ContratosService} from '../../contratos/contratos.service';
import {ListaCargosFuncionarios} from './lista.cargos.funcionarios';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-cargos-funcionarios',
  templateUrl: './cargos.dos.funcionarios.html',
  styleUrls: ['./cargos.dos.funcionarios.scss']
})
export class CargosDosFuncionariosComponent {
    contratos: Contrato[] = [];
    nomeContrato: string;
    cargServ: CargoService;
    listaCargosFuncionarios: ListaCargosFuncionarios[] = [];
    valid = false;
    codContrato: number;
    modalActions = new EventEmitter<string | MaterializeAction>();
    constructor(config: ConfigService, funcServ: FuncionariosService, cargServ: CargoService, private contServ: ContratosService, private router: Router, private route: ActivatedRoute) {
        this.cargServ = cargServ;
        contServ.getContratosDoUsuario().subscribe(res => {
          this.contratos = res;
        });
      route.params.subscribe(params => {
        this.codContrato = params['codContrato'];
      });
      this.onChange(this.codContrato);
      this.contServ.getContratoCompletoUsuario(this.codContrato).subscribe(res => {
        this.nomeContrato = res.nomeDaEmpresa;
      });
    }
    onChange (value: number) {
        this.valid = true;
        this.cargServ.getCargosFuncionarios(value).subscribe(res => {
            this.listaCargosFuncionarios = res;
        }, error => {
            this.listaCargosFuncionarios = [];
        });
    }
    goToGerenciarCargos() {
        this.router.navigate(['./gerenciar-funcoes-terceirizados'], {relativeTo: this.route});
    }
    openModal() {
        this.modalActions.emit({action: 'modal', params: ['open']});
    }
    closeModal() {
        this.modalActions.emit({action: 'close', params: ['close']});
    }
}
