import {Component, EventEmitter} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {PercentualDinamicoService} from './percentual-dinamico.service';
import {PercentualDinamico} from './percentual-dinamico';

@Component({
  selector: 'app-percentual-dinamico',
  templateUrl: './percentual-dinamico.component.html',
  styleUrls: ['./percentual-dinamico.component.css']
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

  }

  closeModal() {

  }

  cadastraDinamicoEstatico() {

  }
}
