import {Component, EventEmitter} from '@angular/core';
import {PercentualEstaticoService} from './percentual-estatico.service';
import {PercentualEstatico} from './percentual-estatico';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-percent-static',
  templateUrl: './percentuais-estaticos.component.html',
  styleUrls: ['./percentuais-estaticos.component.scss']
})
export class PercentuaisEstaticosComponent {
  staticPercent: PercentualEstatico[] = [];
  render = false;
  percentualEstaticoService: PercentualEstaticoService;
  modalActions = new EventEmitter<string|MaterializeAction>();
  constructor(percentualEstaticoService: PercentualEstaticoService) {
    percentualEstaticoService.getPercentuaisEstaticos().subscribe(res => {
      this.staticPercent = res;
      this.staticPercent.forEach( (percentual) => {
        if (percentual.dataFim === null) {
          percentual.dataFim = '-';
        }
        if (percentual.dataInicio === null) {
          percentual.dataInicio = '-';
        }
        if (percentual.dataAditamento === null) {
          percentual.dataAditamento = '-';
        }
      });
    });
  }

  openModal() {
    this.render = true;
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  closeModal() {
    this.render = false;
    // ???this.rubricaService.setValdity(true);
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  cadastraPercentualEstatico() {
    this.percentualEstaticoService.cadastrarPercentualEstatico().subscribe(res => {
      if (res === 'Rubrica Cadastrada Com sucesso !') {
        this.percentualEstaticoService.getPercentuaisEstaticos().subscribe(res2 => {
          this.staticPercent.slice();
          this.staticPercent = res2;
          this.closeModal();
        });
      }
    });
  }
}
