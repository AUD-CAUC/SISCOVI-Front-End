import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PercentualEstaticoService} from '../percentual-estatico.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PercentualEstatico} from '../percentual-estatico';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-cadastrar-percentual-estatico',
  templateUrl: './cadastrar-percentual-estatico.component.html',
  styleUrls: ['./cadastrar-percentual-estatico.component.scss']
})
export class CadastrarPercentualEstaticoComponent implements OnInit {
  percentualEstaticoForm: FormGroup;
  percentualEstaticoService: PercentualEstaticoService;
  route: ActivatedRoute;
  id: number;
  percentualEstatico: PercentualEstatico;
  ultimaData: String[] = [];
  notValidEdit = true;
  modalActions = new EventEmitter<string|MaterializeAction>();
  router: Router;
  percentList: PercentualEstatico[] = [];
  @Input() percent: PercentualEstatico[];
  private codigoRubrica: any;

  constructor(router: Router, private fb: FormBuilder, percentualEstaticoService: PercentualEstaticoService, route: ActivatedRoute, ) {
    this.router = router;
    this.route = route;
    this.percentualEstaticoService = percentualEstaticoService;
    this.percentualEstaticoForm = fb.group({
      codigo: new FormControl('', [Validators.required]),
      nome: new FormControl('', [Validators.required]),
      percentual: new FormControl('', [Validators.required]),
      dataInicio: new FormControl('', [Validators.required]),
      dataAditamento: new FormControl('', [Validators.required]),
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        percentualEstaticoService.buscarPercentualEstatico(this.id).subscribe(res => {
          this.percentualEstatico = res;
          this.percentualEstaticoForm.controls.codigo.setValue(this.percentualEstatico.codigo);
          this.percentualEstaticoForm.controls.percentual.setValue(this.percentualEstatico.percentual);
          this.percentualEstaticoForm.controls.dataInicio.setValue(this.percentualEstatico.dataInicio);
          this.percentualEstaticoForm.controls.dataAditamento.setValue(this.percentualEstatico.dataAditamento);
        });
      }
    });
  }

  ngOnInit(): void {
    let i = 0;
    if (this.percent) {
      this.percent.forEach((percentual) => {
        if (percentual.dataFim === '-' || percentual.dataFim === null) {
          this.ultimaData[percentual.codigo] = percentual.dataInicio;
          this.percentList[i++] = percentual;
        }
      });
    }
    this.percentualEstaticoForm = this.fb.group({
      codigo: new FormControl('', [Validators.required]),
      percentual: new FormControl('', [Validators.required]),
      dataInicio: new FormControl('', [Validators.required, this.dataInicioValidator.bind(this)]),
      dataAditamento: new FormControl('', Validators.required),
    });

  }

  dataInicioValidator(control: AbstractControl): { [key: string]: any } | null {
    const mensagem = [];
    const otherRegex = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/);

    if (control.parent) {
      if (this.ultimaData) {
        if (control.value.toString().length === 10) {
          let dia = 0;
          let mes = 0;
          let ano = 0;
          dia = Number(this.ultimaData[control.parent.get('codigo').value].split('/')[0]);
          mes = Number(this.ultimaData[control.parent.get('codigo').value].split('/')[1]) - 1;
          ano = Number(this.ultimaData[control.parent.get('codigo').value].split('/')[2]);
          const ultimaData: Date = new Date(ano, mes, dia);
          dia = Number(control.value.split('/')[0]);
          mes = Number(control.value.split('/')[1]) - 1;
          ano = Number(control.value.split('/')[2]);
          const dataInicio: Date = new Date(ano, mes, dia);
          const diff = dataInicio.getTime() - ultimaData.getTime();
          const diffDay: number = Math.round(diff / (1000 * 3600 * 24)) + 1;

          if (diffDay <= 0) {
            mensagem.push('A data de Início do novo Percentual deve ser maior que a data de Início do antigo Percentual');
          }
          if (!otherRegex.test(control.value)) {
            mensagem.push('A data digitada é inválida');
          }
        }
      }

      // if (control.value <= this.ultimaData[control.parent.get('codigo').value]) {
      //   mensagem.push('A data de início do novo percentual deve ser maior do que a do último');
      // }
    }

    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  validateForm() {
    if (this.percentualEstaticoForm.status === 'VALID') {
      this.percentualEstaticoService.codigo = this.percentualEstaticoForm.controls.codigo.value;
      this.percentualEstaticoService.percentual = this.percentualEstaticoForm.controls.percentual.value;
      this.percentualEstaticoService.dataInicio = this.percentualEstaticoForm.controls.dataInicio.value;
      this.percentualEstaticoService.dataAditamento = this.percentualEstaticoForm.controls.dataAditamento.value;
      this.percentualEstaticoService.setValdity(false);
    } else {
      this.percentualEstaticoService.setValdity(true);
    }
  }

  activateButton(): void {
    if (this.id) {
      if ((this.percentualEstaticoService.codigo !== this.percentualEstatico.codigo) ||
        (this.percentualEstaticoService.percentual !== this.percentualEstatico.percentual) ||
        (this.percentualEstaticoService.dataInicio !== this.percentualEstatico.dataInicio) ||
        (this.percentualEstaticoService.dataAditamento !== this.percentualEstatico.dataAditamento)
      ) {
        this.notValidEdit = false;
      } else if ((this.percentualEstaticoService.codigo === this.percentualEstatico.codigo) ||
        (this.percentualEstaticoService.percentual === this.percentualEstatico.percentual) ||
        (this.percentualEstaticoService.dataInicio === this.percentualEstatico.dataInicio) ||
        (this.percentualEstaticoService.dataAditamento === this.percentualEstatico.dataAditamento)) {
        this.notValidEdit = true;
      }
    }
  }

  disableButton() {
    this.notValidEdit = true;
  }

  salvarAlteracao() {
    // this.percentualEstatico.codigo = this.id;
    // this.percentualEstatico.nome = this.percentualEstaticoForm.controls.nome.value;
    this.percentualEstatico.percentual = this.percentualEstaticoForm.controls.percentual.value;
    this.percentualEstatico.dataInicio = this.percentualEstaticoForm.controls.dataInicio.value;
    // this.percentualEstatico.dataFim = this.percentualEstaticoForm.controls.dataFim.value;
    this.percentualEstatico.dataAditamento = this.percentualEstaticoForm.controls.dataAditamento.value;
    this.percentualEstaticoService.salvarAlteracao(this.percentualEstatico).subscribe(res => {
      if (res === 'Alteração feita com sucesso !') {
        this.closeModal();
        this.router.navigate(['/percentEst']);
      }
    });
  }

  deletarPercentualEstatico() {
    this.percentualEstaticoService.apagarPercentualEstatico(this.id).subscribe(res => {
      if (res === 'Rubrica Apagada Com sucesso !') {
        this.closeModal();
        this.router.navigate(['/percentEst']);
      }
    });
  }
  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
}
