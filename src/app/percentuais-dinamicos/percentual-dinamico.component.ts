import {Component, EventEmitter} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {PercentualDinamicoService} from './percentual-dinamico.service';
import {PercentualDinamico} from './percentual-dinamico';

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
  constructor(percentualDinamicoService: PercentualDinamicoService) {
    this.percentualDinamicoService = percentualDinamicoService;
    this.percentualDinamicoService.getPercentuaisDinamicos().subscribe( res => {
      this.dinamicPercent = res;
      console.log(res);
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
    this.percentualDinamicoService.cadastrarPercentualEstatico().subscribe(res => {
      if (res === 'Percentual Dinâmico cadastrado com sucesso!') {
        this.percentualDinamicoService.getPercentuaisDinamicos().subscribe(res2 => {
          this.dinamicPercent.slice();
          this.dinamicPercent = res2;
          this.closeModal();
        });
      }
    });
  }
}
