import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UserService} from '../users/user.service';
import {MaterializeAction} from 'angular2-materialize';
import {Usuario} from './usuario';
import {EventEmitter} from '@angular/core';
import {CadastroUsuarioService} from './cadastro-usuario/cadastro-usuario.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-usuario',
  templateUrl: 'usuarios.component.html',
  styleUrls: ['usuarios.component.scss']
})
export class UsuariosComponent {
  id: number;
  usuarios: Usuario[] = [];
  modalActions = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();
  render = false;
  cadUs: CadastroUsuarioService;
  userService: UserService;
  router: Router;
  alert: boolean;
  constructor(userService: UserService, cadUs: CadastroUsuarioService, router: Router) {
    this.router = router;
    this.cadUs = cadUs;
    this.userService = userService;
    userService.getUsuarios().subscribe(res => {
      this.usuarios = res;
    });
  }
  openModal() {
    this.render = true;
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  closeModal() {
    this.render = false;
    this.cadUs.setValidity(true);
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
  openModal2(id: number) {
    this.id = id;
    this.modalActions2.emit({action: 'modal', params: ['open']});
  }
  closeModal2() {
    this.userService.setValdity(true);
    this.modalActions2.emit({action: 'modal', params: ['close']});
  }
  sendForm(event: Event) {
    event.preventDefault();
    this.cadUs.cadastrarUsuario().subscribe(res => {
      if (res.mensagem === 'Usuário Cadastrado Com Sucesso !') {
        const newUsuarios = this.usuarios.slice(0);
        newUsuarios.push(this.cadUs.cadastroUsuario.usuario);
        this.usuarios = newUsuarios;
        this.userService.getUsuarios().subscribe(array => {
          this.usuarios = array;
        });
        this.closeModal();
      }
    });
  }
  deletarUsuario() {
    this.cadUs.apagarUsuario(this.id).subscribe(res => {
      if (res === 'Usuário excluída com sucesso!') {
        this.cadUs.getAllUsuarios().subscribe(res2 => {
          this.usuarios.slice();
          this.usuarios = res2;
          this.closeModal2();
        });
      }
    });
  }
  editarUsuario(id: number): void {
    this.router.navigate(['/usuarios', id]);
  }
}
