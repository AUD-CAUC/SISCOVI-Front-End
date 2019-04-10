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
    nome = '';
    login = '';
    sigla = '';
    password = '';
    router: Router;
    newPassword: '';
    confirmNewPassword: '';
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
              console.log(res);
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
  verifyEditForm() { /*TODO: colocar essa função em cada input do formulário [formGroup]="editaUsuarioForm" (FEITO!)*/
    if (this.editaUsuarioForm.valid) { /*TODO: Passar nome, login, sigla, newPassword e confirmNewPassord(?)*/
      this.cadUs.nome = this.editaUsuarioForm.controls.nome.value;
      this.cadUs.login = this.editaUsuarioForm.controls.login.value;
      this.cadUs.sigla = this.editaUsuarioForm.controls.sigla.value;
      this.cadUs.newPassword = this.editaUsuarioForm.controls.nome.value; /*TODO: criar newPassord no Service (FEITO!)*/
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
    if (this.id) {
      if ((this.editaUsuarioForm.get('nome').value !== this.usuario.nome ||
        this.editaUsuarioForm.get('login').value !== this.usuario.login ||
        this.editaUsuarioForm.get('password').value !== this.newPassword ||
        this.editaUsuarioForm.get('sigla').value !== this.usuario.perfil)) {
        this.salvarButtonDisabled = false;
      }else {
        this.salvarButtonDisabled = true;
      }
    }
  }
    openModal() {
      this.modalActions.emit({action: 'modal', params: ['open']});
    }
    closeModal() {
      this.modalActions.emit({action: 'modal', params: ['close']});
    }
    salvarAlteracao() {
      if (this.editaUsuarioForm.valid) {
        this.usuario.codigo = this.id;
        this.nome = this.editaUsuarioForm.controls.nome.value;
        this.login = this.editaUsuarioForm.controls.login.value;
        this.sigla = this.editaUsuarioForm.controls.sigla.value;
        this.password = this.editaUsuarioForm.controls.newPassword.value;
        this.cadUs.salvarAlteracao(this.usuario).subscribe(res => {
          if (res === 'Alteração feita com sucesso !') {
            this.closeModal();
            this.router.navigate(['/usuario']);
          }
        });
      }
    }
}
