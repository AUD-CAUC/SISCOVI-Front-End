import {Component, EventEmitter} from '@angular/core';
import {Contrato} from '../contratos/contrato';
import {ContratosService} from '../contratos/contratos.service';
import {FuncionariosService} from './funcionarios.service';
import {Funcionario} from './funcionario';
import {PagerService} from '../_shared/pager.service';
import {MaterializeAction} from 'angular2-materialize';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.components.scss']
})
export class FuncionariosComponent {
  codigo: number;
  contratos: Contrato[] = [];
  funcionarios: Funcionario[];
  funcServ: FuncionariosService;
  contrSer: ContratosService;
  modalActions2 = new EventEmitter<string|MaterializeAction>();
  valid = false;
  index2: number;
  gestor: string;
  pager: any;
  pagedItems: Funcionario[];
  indice = 1;
  // modalActions = new EventEmitter<string | MaterializeAction>();
  constructor(contrSer: ContratosService, funcServ: FuncionariosService, private pagerService: PagerService, private  route: ActivatedRoute, private router: Router) {
    this.contrSer = contrSer;
    this.funcServ = funcServ;
    this.contrSer.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
    });
    this.funcServ.getAllTerceirizados().subscribe(res => {
        this.funcionarios = res;
        this.setPage(1);
    });
  }

  onChange(value: string) {
    this.index2 = Number(value.split(',')[1]) - 1 ;
    this.valid = false;
    this.funcServ.getFuncionariosDeUmContrato(Number(value.split(',')[1])).subscribe(res => {
      this.funcionarios = res.funcionarios;
      this.gestor = res.gestor;
      this.indice = Number(value.split(',')[0]);
      this.valid = true;
      this.setPage(1);
    });
  }

  setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.funcionarios.length, page, 50);
        // get current page of items
        this.pagedItems = this.funcionarios.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

  cadastroTerceirzado() {
        this.router.navigate(['./cadastro-terceirizado'], {relativeTo: this.route});
  }

  editarTerceirizado(cod: number) {
        this.router.navigate(['terceirizados', cod], {skipLocationChange: true});
  }
  deletarTerceirizado() {
    this.funcServ.apagarTerceirizado(this.codigo).subscribe(res => {
      if (res === 'Terceirizado Apagado Com sucesso !') {
        this.funcServ.getAllTerceirizados().subscribe(res2 => {
          this.funcionarios.slice();
          this.funcionarios = res2;
        });
      }
      this.closeModal2();
    });
  }
  openModal2(codigo: number) {
    this.codigo = codigo;
    this.modalActions2.emit({action: 'modal', params: ['open']});
  }
  closeModal2() {
    this.funcServ.setValdity(true);
    this.modalActions2.emit({action: 'modal', params: ['close']});
    window.location.reload();
  }
}
