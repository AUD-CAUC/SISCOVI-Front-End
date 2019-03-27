import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PercentualDinamicoService} from '../percentual-dinamico.service';
import {PercentualDinamico} from '../percentual-dinamico';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-cadastrar-percentual-dinamico',
  templateUrl: './cadastrar-percentual-dinamico.component.html',
  styleUrls: ['./cadastrar-percentual-dinamico.component.scss']
})
export class CadastrarPercentualDinamicoComponent {
  percentualDinamicoForm: FormGroup;
  percentualDinamicoService: PercentualDinamicoService;
  route: ActivatedRoute;
  id: number;
  percentualDinamico: PercentualDinamico;
  notValidEdit = true;
  modalActions = new EventEmitter<string|MaterializeAction>();
  router: Router;
  constructor(private fb: FormBuilder, percentualDinamicoService: PercentualDinamicoService, route: ActivatedRoute, router: Router) {
    this.router = router;
    this.route = route;
    this.percentualDinamicoService = percentualDinamicoService;
    this.percentualDinamicoForm = this.fb.group({
      percentual: new FormControl('', [Validators.required]),
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        percentualDinamicoService.getPercentuaisDinamicos(this.id).subscribe(res => {
          this.percentualDinamico = res;
          this.percentualDinamicoForm.controls.percentual.setValue(this.percentualDinamico.percentual);
        });
      }
    });
  }
  activateButton(): void {
    if (this.id) {
      if ((this.percentualDinamicoService.percentual !== this.percentualDinamico.percentual)) {
        this.notValidEdit = false;
      }else if ((this.percentualDinamicoService.percentual === this.percentualDinamico.percentual)) {
        this.notValidEdit = true;
      }
    }
  }
  disableButton() {
    this.notValidEdit = true;
  }
  validateForm() {
    if (this.percentualDinamicoForm.status === 'VALID') {
      this.percentualDinamicoService.percentual = this.percentualDinamicoForm.controls.percentual.value;
      this.percentualDinamicoService.setValdity(false);
    }else {
      this.percentualDinamicoService.setValdity(true);
    }
  }
  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
  salvarAlteracao() {
    this.percentualDinamico.percentual = this.percentualDinamicoForm.controls.percentual.value;
    this.percentualDinamico.dataAlteracao = this.percentualDinamicoForm.controls.dataAlteracao.value;
    this.percentualDinamicoService.salvarAlteracao(this.percentualDinamico).subscribe(res => {
      if (res === 'Alteração feita com sucesso !') {
        this.closeModal();
        this.router.navigate(['/percentDin']);
      }
    });
  }
  deletarPercentualDinamico() {
    this.percentualDinamicoService.apagarPercentuaisDinamicos(this.id).subscribe(res => {
      if (res === 'Rubrica Apagada Com sucesso !') {
        this.closeModal();
        this.router.navigate(['/percentDin']);
      }
    });
  }
}
