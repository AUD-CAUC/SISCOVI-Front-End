import {Component, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PercentualEstaticoService} from '../percentual-estatico.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PercentualEstatico} from '../percentual-estatico';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-cadastrar-percentual-estatico',
  templateUrl: './cadastrar-percentual-estatico.component.html',
  styleUrls: ['./cadastrar-percentual-estatico.component.scss']
})
export class CadastrarPercentualEstaticoComponent {
  percentualEstaticoForm: FormGroup;
  router: Router;
  route: ActivatedRoute;
  percentualEstatico: PercentualEstatico;
  percentualEstaticoService: PercentualEstaticoService;
  id: number;
  notValidEdit = true;
  constructor(fb: FormBuilder, percentualEstaticoService: PercentualEstaticoService, route: ActivatedRoute, router: Router) {
    this.router = router;
    this.route = route;
    this.percentualEstaticoService = percentualEstaticoService;
    this.percentualEstaticoForm = fb.group({
      rubrica: new FormControl('', [Validators.required]),
      percentual: new FormControl('', [Validators.required]),
      dataInicio: new FormControl('', Validators.required),
      dataFim: new FormControl('', Validators.required),
      dataAditamento: new FormControl('', Validators.required),
    });
  }

  validateForm() {
    if (this.percentualEstaticoForm.status === 'VALID') {
      this.percentualEstaticoService.rubrica = this.percentualEstaticoForm.controls.rubrica.value;
      this.percentualEstaticoService.percentual = this.percentualEstaticoForm.controls.percentual.value;
      this.percentualEstaticoService.dataInicio = this.percentualEstaticoForm.controls.dataInicio.value;
      this.percentualEstaticoService.dataFim = this.percentualEstaticoForm.controls.dataFim.value;
      this.percentualEstaticoService.dataAditamento = this.percentualEstaticoForm.controls.dataAditamento.value;
      this.percentualEstaticoService.setValdity(false);
    }else {
      this.percentualEstaticoService.setValdity(true);
    }
  }
  activateButton(): void {
    if (this.id) {
      if ((this.percentualEstaticoService.rubrica !== this.percentualEstatico.nome) ||
        (this.percentualEstaticoService.percentual !== this.percentualEstatico.percentual) ||
        (this.percentualEstaticoService.dataInicio !== this.percentualEstatico.dataInicio) ||
        (this.percentualEstaticoService.dataFim !== this.percentualEstatico.dataInicio) ||
        (this.percentualEstaticoService.dataAditamento !== this.percentualEstatico.dataAditamento)
      ) {
        this.notValidEdit = false;
      }else if ((this.percentualEstaticoService.rubrica === this.percentualEstatico.nome) ||
        (this.percentualEstaticoService.percentual === this.percentualEstatico.percentual) ||
        (this.percentualEstaticoService.dataInicio === this.percentualEstatico.dataInicio) ||
        (this.percentualEstaticoService.dataFim === this.percentualEstatico.dataInicio) ||
        (this.percentualEstaticoService.dataAditamento === this.percentualEstatico.dataAditamento)) {
        this.notValidEdit = true;
      }
    }
  }
  disableButton() {
    this.notValidEdit = true;
  }

  salvarAlteracao() {

  }
}
