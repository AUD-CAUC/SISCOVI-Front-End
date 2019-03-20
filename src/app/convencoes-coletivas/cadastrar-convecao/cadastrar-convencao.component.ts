import {Component, EventEmitter} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ContratosService} from '../../contratos/contratos.service';
import {ConvencaoService} from '../convencao.service';
import {MaterializeAction} from 'angular2-materialize';
import {Convencao} from '../convencao';

@Component({
  selector: 'app-cadastrar-convencao',
  templateUrl: 'cadastrar-convencao.component.html',
  styleUrls: ['cadastrar-convencao.component.scss']
})

export class CadastrarConvencaoComponent {
  id: number;
  router: Router;
  route: ActivatedRoute;
  convencaoService: ConvencaoService;
  convencaoForm: FormGroup;
  convencao: Convencao;
  notValidEdit = true;
  modalActions = new EventEmitter<string|MaterializeAction>();

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

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        convencaoService.buscarConvencao(this.id).subscribe(res => {
          this.convencao = res;
          this.convencaoForm.controls.nome.setValue(this.convencao.nome);
          this.convencaoForm.controls.sigla.setValue(this.convencao.sigla);
          this.convencaoForm.controls.dataBase.setValue(this.ajusteData(this.convencao.dataBase));
          this.convencaoForm.controls.descricao.setValue(this.convencao.descricao);
        });
      }
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

  activateButton(): void {
    if (this.id) {
      if ((this.convencaoService.nome !== this.convencao.nome) ||
        (this.convencaoService.sigla !== this.convencao.sigla) ||
        (this.convencaoService.dataBase !== this.convencao.dataBase) ||
        (this.convencaoService.descricao !== this.convencao.descricao)
      ) {
        this.notValidEdit = false;
      }else if ((this.convencaoService.nome === this.convencao.nome) ||
        (this.convencaoService.sigla === this.convencao.sigla) ||
        (this.convencaoService.dataBase === this.convencao.dataBase) ||
        (this.convencaoService.descricao === this.convencao.descricao)) {
        this.notValidEdit = true;
      }
    }
  }
  disableButton() {
    this.notValidEdit = true;
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

  openModal() {

  }

  deletarConvencao() {

  }

  closeModal() {

  }

  ajusteData(data: String) {
    const ano = Number(data.split('-')[0]);
    const mes = Number(data.split('-')[1]);
    const dia = Number(data.split('-')[2]);
    let string: String;
    if (dia < 10) {
      string = '0' + dia + '/';
    } else {
      string = dia.toString() + '/';
    }
    if (mes < 10) {
      string = string + '0' + mes + '/';
    } else {
      string = string + mes.toString() + '/';
    }
    string = string + ano.toString();
    return  string;
  }

  salvarAlteracao() {
    this.convencao.codigo = this.id;
    this.convencao.nome = this.convencaoForm.controls.nome.value;
    this.convencao.sigla = this.convencaoForm.controls.sigla.value;
    this.convencao.dataBase = this.convencaoForm.controls.dataBase.value;
    this.convencao.descricao = this.convencaoForm.controls.descricao.value;
    this.convencaoService.salvarAlteracao(this.convencao).subscribe(res => {
      if (res === 'Alteração feita com sucesso !') {
        this.closeModal();
        this.router.navigate(['/rubricas']);
      }
    });
  }
}
