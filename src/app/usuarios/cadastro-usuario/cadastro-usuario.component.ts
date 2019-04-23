import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from '../../_shared/config.service';
import {CadastroUsuarioService} from './cadastro-usuario.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Usuario} from '../usuario';
import {MaterializeAction} from 'angular2-materialize';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-cadastro-usuario',
    templateUrl: './cadastro-usuario.component.html',
    styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent implements OnInit {
    perfil: string[] = [];
    @Input() cadUs: CadastroUsuarioService;
    route: ActivatedRoute;
    usuarioForm: FormGroup;
    editaUsuarioForm: FormGroup;
    usuario: Usuario;
    id: number;
    notValidEdit = true;
    modalActions = new EventEmitter<string|MaterializeAction>();
    modalActions6 = new EventEmitter<string | MaterializeAction>();
    modalActions4 = new EventEmitter<string | MaterializeAction>();
    modalActions5 = new EventEmitter<string | MaterializeAction>();
    nome = '';
    login = '';
    sigla = '';
    password = '';
    router: Router;
    newPassword: '';
    confirmNewPassword: '';
    salvarButtonDisabled = true;
    constructor(http: Http, config: ConfigService, private fb: FormBuilder, cadUs: CadastroUsuarioService, route: ActivatedRoute, router: Router) {
      this.router = router;
      this.route = route;
      this.cadUs = cadUs;
        this.usuarioForm = fb.group({
            nome: new FormControl('', [Validators.required, Validators.minLength(4)]),
            login: new FormControl('', [ Validators.required, Validators.minLength(4)]),
            sigla: new FormControl('', [Validators.required, Validators.minLength(4)]),
            password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(64)])
        });
        const url = config.myApi + '/usuario/getPerfis/' + config.user.username;
        http.get(url).map(res => res.json()).subscribe(res => {
            this.perfil = res;
        });
        this.route.params.subscribe(params => {
          this.id = params['id'];
          if (this.id) {
            cadUs.getUsuario(this.id).subscribe(res => {
              this.usuario = res;
              // this.usuarioForm.controls.nome.setValue(this.usuario.nome);
              // this.usuarioForm.controls.login.setValue(this.usuario.login);
              this.editaUsuarioForm.controls.nome.setValue(this.usuario.nome);
              this.editaUsuarioForm.controls.login.setValue(this.usuario.login);
              this.editaUsuarioForm.controls.sigla.setValue(this.usuario.perfil);
              this.editaUsuarioForm.controls.password.setValue(this.password);
              this.editaUsuarioForm.controls.newPassword.setValue(this.newPassword);
              // this.editaUsuarioForm.controls.confirmNewPassord.setValue(this.confirmNewPassword);
              if (this.usuario.perfil === '1') {
                this.usuarioForm.controls.sigla.setValue('ADMINISTRADOR');
              } else if (this.usuario.perfil === '2') {
                this.usuarioForm.controls.sigla.setValue('USUÁRIO');
              }
            });
          }
        });
    }
    ngOnInit() {
      if (this.id) {
        this.editaUsuarioForm = this.fb.group({
          nome: new FormControl('', [Validators.required, Validators.minLength(4)]),
          login: new FormControl('', [ Validators.required, Validators.minLength(4)]),
          sigla: new FormControl('', [Validators.required, Validators.minLength(4)]),
          password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]),
          newPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]),
          confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(64)])
        });
      }
    }

  verifyForm() {
    if (this.usuarioForm.valid) {
      this.cadUs.nome = this.usuarioForm.controls.nome.value;
      this.cadUs.login = this.usuarioForm.controls.login.value;
      this.cadUs.sigla = this.usuarioForm.controls.sigla.value;
      this.cadUs.password = this.usuarioForm.controls.password.value;
      this.cadUs.validity = false;
    }else {
      this.cadUs.validity = true;
    }
  }
  verifyEditForm() {
    if (this.editaUsuarioForm.valid) {
      this.cadUs.nome = this.editaUsuarioForm.controls.nome.value;
      this.cadUs.login = this.editaUsuarioForm.controls.login.value;
      this.cadUs.sigla = this.editaUsuarioForm.controls.sigla.value;
      this.cadUs.newPassword = this.editaUsuarioForm.controls.newPassword.value;
      this.cadUs.password = this.editaUsuarioForm.controls.password.value;
      this.cadUs.validity = false;
    }else {
      this.cadUs.validity = true;
    }
  }
  activateButton() {
    this.editaUsuarioForm.get('nome').updateValueAndValidity();
    this.editaUsuarioForm.get('login').updateValueAndValidity();
    this.editaUsuarioForm.get('password').updateValueAndValidity();
    this.editaUsuarioForm.get('sigla').updateValueAndValidity();
    this.editaUsuarioForm.get('confirmNewPassword').updateValueAndValidity();
    if (this.id) {
      if ((this.editaUsuarioForm.get('nome').value !== this.nome ||
        this.editaUsuarioForm.get('login').value !== this.login ||
        this.editaUsuarioForm.get('newPassword').value !== this.newPassword ||
        this.editaUsuarioForm.get('sigla').value !== this.sigla)) {
        this.salvarButtonDisabled = false;
        console.log('entrou');
      }else {
        this.salvarButtonDisabled = true;
      }
    }
  }
  disableButton() {
    this.salvarButtonDisabled = true;
  }
    openModal() {
      this.modalActions.emit({action: 'modal', params: ['open']});
    }
    closeModal() {
      this.modalActions.emit({action: 'modal', params: ['close']});
    }
    openModal6() {
      this.modalActions6.emit({action: 'modal', params: ['open']});
    }
    closeModal6() {
      this.modalActions6.emit({action: 'modal', params: ['close']});
    }
    openModal4() {
      this.modalActions4.emit({action: 'modal', params: ['open']});
    }
    closeModal4() {
      this.modalActions4.emit({action: 'modal', params: ['close']});
    }
    openModal5() {
      this.modalActions5.emit({action: 'modal', params: ['open']});
    }
    closeModal5() {
      this.modalActions5.emit({action: 'modal', params: ['close']});
    }
    navTer() {
      this.closeModal4();
      this.closeModal5();
      this.closeModal6();
      this.modalActions.emit({action: 'modal', params: ['close']});
      this.router.navigate(['usuarios']);
    }
  salvarAlteracao() {
    if (this.editaUsuarioForm.valid) {
      this.nome = this.editaUsuarioForm.get('nome').value;
      this.login = this.editaUsuarioForm.get('login').value;
      this.sigla = this.editaUsuarioForm.get('sigla').value;
      this.password = this.editaUsuarioForm.get('newPassword').value;
      this.cadUs.salvarAlteracao(this.usuario).subscribe(res => {
        if (res === 'Alteração feita com sucesso !') {
          this.openModal4();
        }else if (res === 'Houve falha na tentativa de Salvar as Alterações') {
          this.openModal5();
        }else if (res === 'Senha antiga não confere com a senha digitada') {
          this.openModal6();
        }else {
        }
      });
    }
  }
}
