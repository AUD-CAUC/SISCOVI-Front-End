import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Contrato} from '../../contrato';
import {ContratosService} from '../../contratos.service';
import {UserService} from '../../../users/user.service';
import {ConfigService} from '../../../_shared/config.service';
import {Usuario} from '../../../usuarios/usuario';
import {Cargo} from '../../../cargos/cargo';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PercentualService} from '../../../percentuais/percentual.service';
import {Percentual} from '../../../percentuais/percentual';
import {Convencao} from '../../../convencoes-coletivas/convencao';
import {ConvencaoService} from '../../../convencoes-coletivas/convencao.service';
import {CargoService} from "../../../cargos/cargo.service";

@Component({
    selector: 'app-cadastrar-ajustes',
    templateUrl: './cadastrar-ajustes.component.html',
    styleUrls: ['./cadastrar-ajustes.component.scss']
})
export class CadastrarAjustesComponent {
    @Input() contratos: Contrato[];
    field = false;
    usuarios: Usuario[];
    cargosCadastrados: Cargo[];
    myForm: FormGroup;
    nomeGestorContrato: string;
    percentualDecimoTerceiro: number;
    percentualFerias: number;
    percentualIncidencia: number;
    percentuaisFerias: Percentual[] = [];
    percentuaisDecimoTerceiro: Percentual[] = [];
    convencoesColetivas: Convencao[] = [];
    contrato: Contrato;
    cod: number;
    constructor(private contratoService: ContratosService, private userService: UserService, private config: ConfigService, private  fb: FormBuilder, private percentService: PercentualService,
                private convService: ConvencaoService, private ref: ChangeDetectorRef, private cargoService: CargoService) {
        this.percentService.getPercentuaisFerias().subscribe(res => {
            if (!res.error) {
               this.percentuaisFerias = res;
            }
        });
        this.percentService.getPercentuaisDecimoTerceiro().subscribe( res => {
           if (!res.error) {
               this.percentuaisDecimoTerceiro = res;
           }
        });
        this.convService.getAll().subscribe(res => {
            if (!res.error) {
               this.convencoesColetivas = res;
            }
        });
        if (userService.user.perfil.sigla === 'ADMINISTRADOR') {
            userService.getUsuarios().subscribe(res2 => {
                this.usuarios = res2;
            });
        }else {
            userService.getGestores().subscribe(res3 => {
                this.usuarios = res3;
            });
        }

        this.cargoService.getAllCargos().subscribe(res => {
            this.cargosCadastrados = res;
        }, error2 => {
            console.log(error2);
        });
    }
    enableField(codigo: number) {
        this.field = false;
        this.cod = codigo;
        this.contratoService.getNomeDoGestor(codigo).subscribe(res => {
            if ( res === 'Este contrato não existe !') {
            } else {
                this.nomeGestorContrato = res;
                this.field = true;
            }
        });
    }
}
