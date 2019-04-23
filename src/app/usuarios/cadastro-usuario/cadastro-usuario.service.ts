import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ConfigService} from '../../_shared/config.service';
import {CadastroUsuario} from './cadastro-usuario';
import {Usuario} from '../usuario';


@Injectable()
export class CadastroUsuarioService {
    validity = true;
    nome: string;
    login: string;
    sigla: string;
    password: string;
    http: Http;
    config: ConfigService;
    cadastroUsuario: CadastroUsuario;
    newPassword: string;
    confirmNewPassord: string;
    constructor(http: Http, config: ConfigService) {
        this.http = http;
        this.config = config;

    }
    changeValidity() {
        this.validity = ((!this.validity && false) || (this.validity && true));
    }
    getValidity() {
        return this.validity;
    }
    setValidity(value: boolean) {
        this.validity = value;
    }
  getUsuario(codigo: number) {
      const url = this.config.myApi + '/usuario/getUsuario/' + codigo;
      return this.http.get(url).map(res => res.json());
    }
    // getAllUsuarios() {
    //   const url = this.config.myApi + '/usuario/getUsuarios';
    //   return this.http.get(url).map(res => res.json());
    // }
    cadastrarUsuario() {
        this.cadastroUsuario = new CadastroUsuario();
        this.cadastroUsuario.usuario = new Usuario();
        this.cadastroUsuario.usuario.login = this.login;
        this.cadastroUsuario.usuario.nome = this.nome;
        this.cadastroUsuario.usuario.perfil = this.sigla;
        this.cadastroUsuario.usuario.password = this.password;
        this.cadastroUsuario.currentUser = this.config.user.username;
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const url = this.config.myApi + '/usuario/cadastrarUsuario';
        return this.http.post(url, this.cadastroUsuario, options).map(res => res.json());
    }
    apagarUsuario(codigo: number) {
      const url = this.config.myApi + '/usuario/deleteUsuario/' + codigo;
      return this.http.delete(url).map(res => res.json());
    }
    salvarAlteracao(usuario: Usuario) {
      const url = this.config.myApi + '/usuario/alterarUsuario';
      this.cadastroUsuario = new CadastroUsuario();
      this.cadastroUsuario.usuario = new Usuario();
      this.cadastroUsuario.usuario = usuario;
      this.cadastroUsuario.usuario.perfil = this.sigla;
      this.cadastroUsuario.password = this.password;
      this.cadastroUsuario.newPassword = this.newPassword;
      this.cadastroUsuario.currentUser = this.config.user.username;
      console.log(this.cadastroUsuario);
      return this.http.put(url, this.cadastroUsuario).map(res => res.json());
  }
}
