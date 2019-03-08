import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ContratosService} from '../../contratos/contratos.service';
import {ConvencaoService} from '../convencao.service';

@Component({
  selector: 'app-cadastrar-convencao',
  templateUrl: 'cadastrar-convencao.component.html',
  styleUrls: ['cadastrar-convencao.component.scss']
})

export class CadastrarConvencaoComponent {
  router: Router;
  route: ActivatedRoute;
  convencaoService: ConvencaoService;
  convencaoForm: FormGroup;
  
  constructor(fb: FormBuilder, convencaoService: ConvencaoService, route: ActivatedRoute, router: Router) {
    this.router = router;
    this.route = route;
    this.convencaoService = convencaoService;
    this.convencaoForm = fb.group({
      nome: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.minLength(0)]),
      sigla: new FormControl('', [Validators.required]),
      dataBase: new FormControl('', [Validators.required, this.myDateValidator]),
      descricao: new FormControl('', []),
    });
  }

  validateForm() {
    if (this.convencaoForm.status === 'VALID') {
      this.convencaoService.nome = this.convencaoForm.controls.nome.value;
      this.convencaoService.sigla = this.convencaoForm.controls.sigla.value;
      this.convencaoService.dataBase = this.convencaoForm.controls.dataBase.value;
      this.convencaoService.descricao = this.convencaoForm.controls.descricao.value;
      this.convencaoService.setValdity(false);
    }else {
      this.convencaoService.setValdity(true);
    }
  }

  public myDateValidator(control: AbstractControl): { [key: string]: any } {
    const val = control.value;
    const mensagem = [];
    const otherRegex = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/);
    if (val.length > 0) {
      const dia = Number(val.split('/')[0]);
      const mes = Number(val.split('/')[1]);
      const ano = Number(val.split('/')[2]);
      if (dia <= 0 || dia > 31) {
        mensagem.push('O dia da data é inválido.');
      }
      if (mes <= 0 || mes > 12) {
        mensagem.push('O Mês digitado é inválido');
      }
      if (ano < 2000 || ano > (new Date().getFullYear() + 5)) {
        mensagem.push('O Ano digitado é inválido');
      }
      if (val.length === 10) {
        if (!otherRegex.test(val)) {
          mensagem.push('A data digitada é inválida');
        }
      }
    }
    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }
}
