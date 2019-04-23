import {Usuario} from '../usuario';
import {AbstractControl} from '@angular/forms';

export class CadastroUsuario {
    usuario: Usuario;
    password: string;
    newPassword: string;
    currentUser: string;
}
