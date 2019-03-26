import {Component, EventEmitter} from '@angular/core';
import {PercentualEstaticoService} from './percentual-estatico.service';
import {PercentualEstatico} from './percentual-estatico';
import {MaterializeAction} from 'angular2-materialize';
import {Router} from '@angular/router';

@Component({
  selector: 'app-percent-static',
  templateUrl: './percentuais-estaticos.component.html',
  styleUrls: ['./percentuais-estaticos.component.scss']
})
export class PercentuaisEstaticosComponent {
  id: number;
  staticPercent: PercentualEstatico[] = [];
  render = false;
  percentualEstaticoService: PercentualEstaticoService;
  modalActions = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();
  router: Router;
  constructor(percentualEstaticoService: PercentualEstaticoService, router: Router) {
    this.router = router;
    this.percentualEstaticoService = percentualEstaticoService;
    percentualEstaticoService.getAllPercentuaisEstaticos().subscribe(res => {
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
    this.percentualEstaticoService.setValdity(true);
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
  openModal2(id: number) {
    this.id = id;
    this.modalActions2.emit({action: 'modal', params: ['open']});
  }
  closeModal2() {
    this.percentualEstaticoService.setValdity(true);
    this.modalActions2.emit({action: 'modal', params: ['close']});
  }
  cadastraPercentualEstatico() {
    this.percentualEstaticoService.cadastrarPercentualEstatico().subscribe(res => {
      if (res === 'Percentual Estático cadastrado com sucesso!') {
        this.percentualEstaticoService.getAllPercentuaisEstaticos().subscribe(res2 => {
          this.staticPercent.slice();
          this.staticPercent = res2;
          this.closeModal();
        });
      }
    });
  }
  editarPercentualEstatico(id: number) {
    this.router.navigate(['/percentEst', id]);
  }
  deletarPercentualEstatico() {
    this.percentualEstaticoService.apagarPercentualEstatico(this.id).subscribe(res => {
      if (res === ' Percentual Estatico Apagado Com sucesso !') {
        this.closeModal();
        this.router.navigate(['/percentEst']);
      }
    });
  }
}
