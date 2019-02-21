import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PercentualDinamicoService} from '../percentual-dinamico.service';

@Component({
  selector: 'app-cadastrar-percentual-dinamico',
  templateUrl: './cadastrar-percentual-dinamico.component.html',
  styleUrls: ['./cadastrar-percentual-dinamico.component.scss']
})
export class CadastrarPercentualDinamicoComponent {
  percentualDinamicoForm: FormGroup;
  router: Router;
  route: ActivatedRoute;
  percentualDinamicoService: PercentualDinamicoService;
  id: number;
  notValidEdit = true;
  constructor(private fb: FormBuilder, percentualDinamicoService: PercentualDinamicoService, route: ActivatedRoute, router: Router) {
    this.router = router;
    this.route = route;
    this.percentualDinamicoService = percentualDinamicoService;

    this.percentualDinamicoForm = this.fb.group({
      percentual: new FormControl('', [Validators.required]),
    });
  }

  validateForm() {
    if (this.percentualDinamicoForm.status === 'VALID') {
      this.percentualDinamicoService.percentual = this.percentualDinamicoForm.controls.percentual.value;
      this.percentualDinamicoService.setValdity(false);
    }else {
      this.percentualDinamicoService.setValdity(true);
    }
  }
}
