import {Component, EventEmitter, Input} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from '../../_shared/config.service';
import {CadastroUsuarioService} from './cadastro-usuario.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Usuario} from '../usuario';
import {MaterializeAction} from 'angular2-materialize';

@Component({
    selector: 'app-cadastro-usuario',
    templateUrl: './cadastro-usuario.component.html',
    styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent {
    perfil: string[] = [];
    @Input() cadUs: CadastroUsuarioService;
    route: ActivatedRoute;
    usuarioForm: FormGroup;
    usuario: Usuario;
    id: number;
    notValidEdit = true;
    modalActions = new EventEmitter<string|MaterializeAction>();
    nome = '';
    login = '';
    sigla = '';
    password = '';
    router: Router;
    constructor(http: Http, config: ConfigService, fb: FormBuilder, cadUs: CadastroUsuarioService, route: ActivatedRoute, router: Router) {
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
              this.usuarioForm.controls.nome.setValue(this.nome);
              this.usuarioForm.controls.login.setValue(this.login);
              this.usuarioForm.controls.sigla.setValue(this.sigla);
            });
          }
        });
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
    activateButton(): void {
      if (this.id) {
        if ((this.cadUs.nome !== this.nome) ||
          (this.cadUs.login !== this.login) ||
          (this.cadUs.sigla !== this.sigla) ||
          (this.cadUs.password !== this.password)) {
          this.notValidEdit = false;
        }else if ((this.cadUs.nome === this.usuario.nome) ||
          (this.cadUs.login === this.usuario.login) ||
          (this.cadUs.sigla === this.usuario.perfil) ||
          (this.cadUs.password === this.password)) {
          this.notValidEdit = true;
        }
      }
    }
    disableButton() {
      this.notValidEdit = true;
    }
    openModal() {
      this.modalActions.emit({action: 'modal', params: ['open']});
    }
    closeModal() {
      this.modalActions.emit({action: 'modal', params: ['close']});
    }
    salvarAlteracao() {
      this.usuario.codigo = this.id;
      this.nome = this.usuarioForm.controls.nome.value;
      this.login = this.usuarioForm.controls.login.value;
      this.sigla = this.usuarioForm.controls.sigla.value;
      this.password = this.usuarioForm.controls.password.value;
      this.cadUs.salvarAlteracao(this.usuario).subscribe(res => {
        if (res === 'Alteração feita com sucesso !') {
          this.closeModal();
          this.router.navigate(['/usuario']);
        }
      });
    }
}
