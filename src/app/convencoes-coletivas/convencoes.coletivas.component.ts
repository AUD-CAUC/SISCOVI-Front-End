import {Component, EventEmitter} from '@angular/core';
import {Contrato} from '../contratos/contrato';
import {ConvencaoService} from './convencao.service';
import {Convencao} from './convencao';
import {MaterializeAction} from 'angular2-materialize';
import {Router} from '@angular/router';

@Component({
  selector: 'app-convencao-coletiva',
  templateUrl: 'convencoes-coletivas.component.html',
  styleUrls: ['convencoes.coletivas.component.scss']
})
export class ConvencoesColetivasComponent {
  id: number;
  contratos: Contrato[] = [];
  render = false;
  convencaoService: ConvencaoService;
  convencoes: Convencao[] = [];
  valid = false;
  index: number;
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  router: Router;

  constructor(convencaoService: ConvencaoService, router: Router) {
    this.router = router;
    this.convencaoService = convencaoService;
    convencaoService.getAll().subscribe(res => {
      this.convencoes = res;
    });
  }

  /*onChange(value: number): void {
    this.convServ.getConvencoes(value).subscribe(res => {
      this.convencoes = res;
      this.valid = true;
      this.index = value - 1;
    });
  }*/
  openModal() {
    this.render = true;
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.render = false;
    this.convencaoService.setValdity(true);
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  openModal2(codigo: number) {
    this.id = codigo;
    this.modalActions2.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.id = null;
    this.modalActions2.emit({action: 'modal', params: ['close']});
  }

  cadastraConvencao() {
    this.convencaoService.cadastrarConvencao().subscribe(res => {
      if (res === 'Rubrica Cadastrada Com sucesso !') {
        this.convencaoService.getAll().subscribe(res2 => {
          this.convencoes.slice();
          this.convencoes = res2;
          this.closeModal();
        });
      }
    });
  }

  editarConvencao(id: number) {
    this.router.navigate(['/convencoes', id]);
  }

  deletarConvencao() {
    this.convencaoService.apagarConvencao(this.id).subscribe(res => {
      if (res === 'Convencao Apagada Com sucesso !') {
        this.convencaoService.getAll().subscribe(res2 => {
          this.convencoes.slice();
          this.convencoes = res2;
          this.closeModal2();
        });
      }
    });
  }
}
