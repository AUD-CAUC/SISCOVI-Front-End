import {Component, EventEmitter} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {PercentualDinamicoService} from './percentual-dinamico.service';
import {PercentualDinamico} from './percentual-dinamico';
import {Router} from "@angular/router";

@Component({
  selector: 'app-percentual-dinamico',
  templateUrl: './percentual-dinamico.component.html',
  styleUrls: ['./percentual-dinamico.component.scss']
})
export class PercentualDinamicoComponent {
  modalActions = new EventEmitter<string|MaterializeAction>();
  render = false;
  dinamicPercent: PercentualDinamico[] = [];
  percentualDinamicoService: PercentualDinamicoService;
  router: Router;
  constructor(percentualDinamicoService: PercentualDinamicoService, router: Router) {
    this.router = router
    this.percentualDinamicoService = percentualDinamicoService;
    this.percentualDinamicoService.getAllPercentuaisDinamicos().subscribe( res => {
      this.dinamicPercent = res;
    });
  }

  openModal() {
    this.render = true;
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.render = false;
    this.percentualDinamicoService.setValdity(true);
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  cadastraDinamicoEstatico() {
    this.percentualDinamicoService.cadastrarPercentualDinamico().subscribe(res => {
      if (res === 'Percentual Dinâmico cadastrado com sucesso!') {
        this.percentualDinamicoService.getAllPercentuaisDinamicos().subscribe(res2 => {
          this.dinamicPercent.slice();
          this.dinamicPercent = res2;
          this.closeModal();
        });
      }
    });
  }
  editarPercentualDinamico(id: number): void {
    this.router.navigate(['/PercentDin', id]);
  }
}
