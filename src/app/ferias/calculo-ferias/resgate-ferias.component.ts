import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FeriasService} from '../ferias.service';
import {Contrato} from '../../contratos/contrato';
import {TerceirizadoFeriasMovimentacao} from '../terceirizado-ferias-movimentacao';
import {FeriasCalcular} from '../ferias-calcular';
import {MaterializeAction} from 'angular2-materialize';
import {SaldoIndividual} from '../../saldo/individual/saldo-individual';
import {SaldoService} from '../../saldo/saldo.service';
import {ContratosService} from '../../contratos/contratos.service';

@Component({
  selector: 'app-resgate-ferias-component',
  templateUrl: './resgate-ferias.component.html',
  styleUrls: ['./calculo-ferias.component.scss']
})
export class ResgateFeriasComponent implements OnInit {
  protected contratos: Contrato[];
  @Input() protected terceirizados: TerceirizadoFeriasMovimentacao[];
  @Input() codigoContrato: number;
  @Input() tipoRestituicao: string;
  feriasResgate: FormGroup;
  isSelected = false;
  selected = false;
  protected diasConcedidos: number[] = [];
  saldos: SaldoIndividual[];
  somaFerias = 0;
  somaIncidenciaFerias = 0;
  somaIncidenciaTerco = 0;
  somaTerco = 0;
  saldoFerias = 0;
  feriasCalcular: FeriasCalcular[] = [];
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  modalActions5 = new EventEmitter<string | MaterializeAction>();
  @Output() navegaParaViewDeCalculos = new EventEmitter();

  constructor(private feriasService: FeriasService, private fb2: FormBuilder, private saldoService: SaldoService,
              private contratoService: ContratosService, private ref: ChangeDetectorRef) {
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
      console.log(res);
      if (this.codigoContrato) {
        this.saldoService.getSaldoIndividual(this.codigoContrato).subscribe(res2 => {
          this.saldos = res2;
          console.log(res2);
          this.saldoFerias = 0;
          for (let i = 0; i < this.saldos.length; i++) {
            this.saldoFerias = this.saldos[i].decimoTerceiroRetido;
            console.log(this.saldoFerias);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.formInitResgate();
  }

  formInitResgate(): void {
    this.feriasResgate = this.fb2.group({
      calcularTerceirizados: this.fb2.array([])
    });
    const control2 = <FormArray>this.feriasResgate.controls.calcularTerceirizados;
    this.terceirizados.forEach(item => {
      const addCtrl = this.fb2.group({
        codTerceirizadoContrato: new FormControl(item.codigoTerceirizadoContrato, [Validators.required]),
        inicioPeriodoAquisitivo: new FormControl(item.inicioPeriodoAquisitivo, [Validators.required]),
        fimPeriodoAquisitivo: new FormControl(item.fimPeriodoAquisitivo, [Validators.required]),
        parcelas: new FormControl('0', [Validators.required]),
        selected: new FormControl(this.isSelected),
        existeCalculoAnterior: new FormControl(item.existeCalculoAnterior),
        tipoRestituicao: new FormControl(this.tipoRestituicao, [Validators.required]),
        diasVendidos: new FormControl(0, [this.diasVendidosValidator, Validators.required]),
        inicioFerias: new FormControl('', [this.inicioUsufrutoValidator, Validators.required, this.myDateValidator]),
        fimFerias: new FormControl('', [this.fimUsufrutoValidator, Validators.required, this.myDateValidator]),
        parcela14dias: new FormControl(item.parcela14Dias),
        somaDiasVendidos: new FormControl(item.somaDiasVendidos),
        diasUsufruidos: new FormControl(item.diasUsufruidos),
        parcelaAnterior: new FormControl(item.parcelaAnterior),
        ultimoFimUsufruto: new FormControl(item.ultimoFimUsufruto),
        emAnalise: new FormControl(item.emAnalise),
        dataDesligamento: new FormControl(item.dataDesligamento),
      });
      control2.push(addCtrl);
    });
    for (let i = 0; i < this.terceirizados.length; i++) {
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').setValidators(Validators.required);
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioPeriodoAquisitivo').setValidators(Validators.required);
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimPeriodoAquisitivo').setValidators(Validators.required);
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('parcelas').setValidators([Validators.required, this.parcelaValidator]);
      const emAnalise = this.feriasResgate.get('calcularTerceirizados').get('' + i).get('emAnalise').value;
      let ultimaParcela = this.feriasResgate.get('calcularTerceirizados').get('' + i).get('parcelaAnterior').value;

      if (ultimaParcela === null) {
        ultimaParcela = '0';
      } else if (ultimaParcela === '3') {
        // faz nada;
      } else if (!emAnalise) {
        ultimaParcela++;
        ultimaParcela.toString();
      }

      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('parcelas').setValue(ultimaParcela);
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('tipoRestituicao').setValidators(Validators.required);
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('diasVendidos').setValidators([this.diasVendidosValidator, Validators.required]);
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioFerias').setValidators([Validators.required,
        this.myDateValidator,
        this.inicioUsufrutoValidator,
        Validators.minLength(10),
        Validators.maxLength(10),
        this.operacaoValidator]);
      this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimFerias').setValidators([Validators.required,
        this.myDateValidator,
        this.fimUsufrutoValidator,
        Validators.minLength(10),
        Validators.maxLength(10),
        this.operacaoValidator]);

      if (emAnalise) {
        this.feriasResgate.get('calcularTerceirizados').get('' + i).disable();
      }
    }
  }

  public parcelaValidator(control: AbstractControl): { [key: string]: any } {
    const mensagem = [];
    let error = false;
    const parcelaSelecionada: string = control.value;
    const parcelaAnt: string = control.parent.get('parcelaAnterior').value;
    if (parcelaAnt === null) {
      if (parcelaSelecionada === '2' || parcelaSelecionada === '3') {
        mensagem.push('Deve realizar a Primeira parcela');
        error = true;
      }
    } else if (parcelaAnt === '0' && !error) {
      // Não pode realizar mais nenhuma parcela.
      if (parcelaSelecionada === '0' || parcelaSelecionada === '1' || parcelaSelecionada === '2' || parcelaSelecionada === '3') {
        mensagem.push('Parcela Única já foi realizada');
        error = true;
      }
    } else if (parcelaAnt === '1' && !error) {
      if (parcelaSelecionada === '0') {
        // Não pode realizar parcela única.
        mensagem.push('Não é possível realizar a parcela única');
        error = true;
      } else if (parcelaSelecionada === '1') {
        // Já realizou essa parcela.
        mensagem.push('Primeira parcela já realizada');
        error = true;
      } else if (parcelaSelecionada === '3') {
        // Deve realizar a Segunda antes da Terceira.
        mensagem.push('Deve realizar a Segunda parcela antes da Terceira');
        error = true;
      }
    } else if (parcelaAnt === '2' && !error) {
      if (parcelaSelecionada === '0') {
        // Não pode realizar parcela única.
        mensagem.push('Não é possível realizar a parcela única');
        error = true;
      } else if (parcelaSelecionada === '1') {
        mensagem.push('Primeira parcela já realizada');
        // Já realizou essa parcela.
        error = true;
      } else if (parcelaSelecionada === '2') {
        mensagem.push('Segunda parcela já realizada');
        // Já realizou essa parcela.
        error = true;
      }
    } else if (parcelaAnt === '3' && !error) {
      if (parcelaSelecionada === '0') {
        // Não pode realizar parcela única.
        mensagem.push('Não é possível realizar a parcela única');
        error = true;
      } else if (parcelaSelecionada === '1') {
        // Já realizou essa parcela.
        mensagem.push('Primeira parcela já realizada');
        error = true;
      } else if (parcelaSelecionada === '2') {
        // Já realizou essa parcela.
        mensagem.push('Segunda parcela já realizada');
        error = true;
      } else if (parcelaSelecionada === '3') {
        // Já realizou essa parcela.
        mensagem.push('Terceira parcela já realizada');
        error = true;
      }
    }

    if (error) {
      control.parent.get('inicioFerias').setValue('');
      control.parent.get('inicioFerias').disable();
      control.parent.get('inicioFerias').markAsUntouched();
      control.parent.get('fimFerias').setValue('');
      control.parent.get('fimFerias').disable();
      control.parent.get('fimFerias').markAsUntouched();
      control.parent.get('diasVendidos').setValue(0);
      control.parent.get('diasVendidos').disable();
      control.parent.get('diasVendidos').markAsUntouched();
    } else if (control.dirty) {
      control.parent.get('inicioFerias').setValue('');
      control.parent.get('inicioFerias').enable();
      control.parent.get('inicioFerias').markAsUntouched();
      control.parent.get('fimFerias').setValue('');
      control.parent.get('fimFerias').enable();
      control.parent.get('fimFerias').markAsUntouched();
      control.parent.get('diasVendidos').enable();
      control.parent.get('diasVendidos').setValue(0);
      control.parent.get('diasVendidos').markAsUntouched();
    }

    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  public myDateValidator(control: AbstractControl): { [key: string]: any } {
    const val = control.value;
    const mensagem = [];
    const otherRegex = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/);
    if (val.length === 10) {
      const dia = Number(val.split('/')[0]);
      const mes = Number(val.split('/')[1]);
      const ano = Number(val.split('/')[2]);
      if (dia <= 0 || dia > 31) {
        mensagem.push('O dia da data é inválido.');
      } else if (mes <= 0 || mes > 12) {
        mensagem.push('O Mês digitado é inválido');
      } else if (ano < 2000 || ano > (new Date().getFullYear() + 5)) {
        mensagem.push('O Ano digitado é inválido');
      } else if (val.length === 10) {
        if (!otherRegex.test(val)) {
          mensagem.push('A data digitada é inválida');
        }
      }
    }
    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  public diasVendidosValidator(control: AbstractControl): { [key: string]: any } | null {
    const mensagem = [];
    if (control.value) {
      if (control.value < 0) {
        mensagem.push('O valor de dias vendidos não pode ser menor que zero !');
      } else if (control.value > 10) {
        mensagem.push('O máximo de dias a serem vendidos são 10');
      }
    }
    if (control.parent) {
      const somaDiasVendidos = control.parent.get('somaDiasVendidos').value;
      if (control.parent.get('fimFerias').value === 10 && control.parent.get('inicioFerias').value === 10) {
        let dia: number;
        let mes: number;
        let ano: number;
        dia = Number(control.parent.get('fimFerias').value.split('/')[0]);
        mes = Number(control.parent.get('fimFerias').value.split('/')[1]) - 1;
        ano = Number(control.parent.get('fimFerias').value.split('/')[2]);
        const fimUsufruto: Date = new Date(ano, mes, dia);
        dia = Number(control.parent.get('inicioFerias').value.split('/')[0]);
        mes = Number(control.parent.get('inicioFerias').value.split('/')[1]) - 1;
        ano = Number(control.parent.get('inicioFerias').value.split('/')[2]);
        const inicioUsufruto: Date = new Date(ano, mes, dia);
        const diff = Math.abs(fimUsufruto.getTime() - inicioUsufruto.getTime());
        const diffDay: number = Math.round(diff / (1000 * 3600 * 24)) + 1;
        if ((diffDay + Number(control.value)) > 30) {
          mensagem.push('A quantidade de dias vendidos mais o período de usufruto de férias não pode ser maior que trinta dias !');
        }
        if (somaDiasVendidos + control.value > 10) {
          mensagem.push('A soma dos dias vendidios neste período não deve ultrapassar 10 dias' + '\n' + 'Dias vendidos utilizados: ' + somaDiasVendidos);
        }
      }
      if (control.touched || control.dirty) {
        control.parent.get('inicioFerias').updateValueAndValidity();
        control.parent.get('fimFerias').updateValueAndValidity();
      }
    }
    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  public operacaoValidator(control: AbstractControl): { [key: string]: any } | null {
    const mensagem = [];
    let saldo: number;
    let diasDeFerias: number;
    const diasVendidos: number = control.parent.get('diasVendidos').value;
    const parcelaSelecionada: string = control.parent.get('parcelas').value.toString();
    const jaTirou14Dias: Boolean = control.parent.get('parcela14dias').value;
    let error: Boolean = false;
    let dia: number;
    let mes: number;
    let ano: number;

    if (control.parent) {
      if (control.parent.get('inicioFerias').value.toString().length === 10 && control.parent.get('fimFerias').value.toString().length === 10) {
        dia = Number(control.parent.get('fimFerias').value.split('/')[0]);
        mes = Number(control.parent.get('fimFerias').value.split('/')[1]) - 1;
        ano = Number(control.parent.get('fimFerias').value.split('/')[2]);
        const fimUsufruto: Date = new Date(ano, mes, dia);
        dia = Number(control.parent.get('inicioFerias').value.split('/')[0]);
        mes = Number(control.parent.get('inicioFerias').value.split('/')[1]) - 1;
        ano = Number(control.parent.get('inicioFerias').value.split('/')[2]);
        const inicioUsufruto: Date = new Date(ano, mes, dia);
        const diff = fimUsufruto.getTime() - inicioUsufruto.getTime();
        diasDeFerias = Math.round(diff / (1000 * 3600 * 24)) + 1;

        saldo = 30 - control.parent.get('diasUsufruidos').value;

        if (diasDeFerias + diasVendidos > saldo) {
          mensagem.push('A quantidade de dias de férias mais os dias vendido não pode ser superior ao saldo total.' + '\n' + 'Saldo: ' + saldo + ' dias');
          error = true;
        }
        if (diasDeFerias <= 0 && !error) {
          mensagem.push('A data de início do usufruto deve ser maior que a data final do usufruto.');
          error = true;
        }
        if (parcelaSelecionada !== '0' && diasDeFerias < 5 && !error) {
          mensagem.push('A quantidade mínima de dias deve ser 5');
          error = true;
        }
        if (parcelaSelecionada === '0' && !error) {
          if (saldo !== (diasDeFerias + diasVendidos)) {
            mensagem.push('Em parcelas únicas deve utilizar todo o saldo' + '\n' + 'Saldo: ' + saldo + ' dias');
          }
        } else if (parcelaSelecionada === '1' && !error) {
          if (saldo < 19) { // Deve ter mais de 19 dias de saldo para poder parcelar.
            mensagem.push('Saldo total insuficiente para o parcelamento' + '\n' + 'Saldo: ' + saldo + ' dias');
          } else { // Caso tenha saldo.
            if (diasDeFerias < 14) { // Caso for tirar menos de 14 dias
              if (saldo - (diasDeFerias + diasVendidos) < 14) {
                // Deve ter mais de 14 dias para tirar na próxima parcela.
                mensagem.push('Só é possível tirar no mínimo 5 dias e no máximo ' + (saldo - diasVendidos - 14) + ' dias de férias vendendo ' + diasVendidos + ' dias');
              }
            } else { // Caso for tirar mais de 14 dias.
              if (saldo - (diasDeFerias + diasVendidos) < 5) {
                // Deve ter pelo menos 5 dias para tirar na próxima parcela.
                mensagem.push('Só é possível tirar no máximo ' + (saldo - diasVendidos - 5) + ' dias de férias vendendo ' + diasVendidos + ' dias');
              }
            }
          }
        } else if (parcelaSelecionada === '2' && !error) {
          if ((jaTirou14Dias === false) && (diasDeFerias < 14) && (saldo - (diasDeFerias + diasVendidos) < 14)) {
            if ((saldo - diasVendidos - 14) < 5) {
              mensagem.push('Deve tirar no mínimo 14 dias');
            } else {
              // Caso não tenha tirado os 14 dias.
              // E não for tirar nesta parcela.
              // DEVE ter saldo maior que 14 para tirar na próxima.
              mensagem.push('Para período menor que 14 dias: máximo de ' + (saldo - diasVendidos - 14) + ' dias de férias');
            }
          } else if (saldo - (diasDeFerias + diasVendidos) < 5 && saldo - (diasDeFerias + diasVendidos) > 0) {
            // caso for tirar mais do que 14 dias
            // deve ter saldo para a próxima parcela se não for tirar tudo
            mensagem.push('Para período maior que 14 dias: máximo de ' + (saldo - diasVendidos - 5) + ' dias de férias');
          }
        } else if (parcelaSelecionada === '3' && !error) {
          if (saldo < 5) {
            // Deve ter mais de 5 dias de saldo disponível.
            mensagem.push('Para realizar esta parcela é preciso ter um saldo de no mínimo 5 dias');
          } else {
            if (jaTirou14Dias === false && diasDeFerias < 14) { // Caso não tenha tirado os 14 dias
              // Deve tirar os 14 dias nesta parcela.
              mensagem.push('Só é possível tirar no mínimo 14 dias de férias');
            }
          }
        }
      }
    }
    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  public fimUsufrutoValidator(control: AbstractControl): { [key: string]: any } | null {
    const mensagem = [];
    if (control.parent) {
      if ((control.value.length === 10)) {
        let dia: number;
        let mes: number;
        let ano: number;
        dia = Number(control.value.split('/')[0]);
        mes = Number(control.value.split('/')[1]) - 1;
        ano = Number(control.value.split('/')[2]);
        const fimUsufruto: Date = new Date(ano, mes, dia);
        dia = Number(control.parent.get('inicioFerias').value.split('/')[0]);
        mes = Number(control.parent.get('inicioFerias').value.split('/')[1]) - 1;
        ano = Number(control.parent.get('inicioFerias').value.split('/')[2]);
        const inicioUsufruto: Date = new Date(ano, mes, dia);
        if (fimUsufruto <= inicioUsufruto) {
          mensagem.push('A Data Fim do Usufruto deve ser maior que a Data de Início do Usufruto !');
        } else if (control.parent.get('dataDesligamento').value) {
          const aux: Number[] = control.parent.get('dataDesligamento').value.split('-');
          const dataDesligamento: Date = new Date(Number(aux[0]), Number(aux[1]) - 1, Number(aux[2]));
          if (fimUsufruto > dataDesligamento) {
            mensagem.push('A data fim do usufruto deve ser menor que a data de desligamento do terceirizado que é ' + dataDesligamento.getDate() + '/' +
              (dataDesligamento.getMonth() + 1) + '/' + dataDesligamento.getFullYear() + ' !');
          }
        } else {
          const diff = Math.abs(fimUsufruto.getTime() - inicioUsufruto.getTime());
          const diffDay = Math.round(diff / (1000 * 3600 * 24)) + 1;
          if (diffDay > 30) {
            mensagem.push('O período de férias não pode ser maior que 30 dias !');
          }
        }
      }
      if ((control.touched || control.dirty) && !control.pristine) {
        if ((control.parent.get('inicioFerias').touched || control.parent.get('inicioFerias').dirty) && control.parent.get('inicioFerias').valid) {
          // control.parent.get('diasVendidos').updateValueAndValidity();
        }
        if (control.valid && control.parent.get('inicioFerias')) {
          control.markAsPristine();
          control.parent.get('diasVendidos').updateValueAndValidity();
          control.parent.get('inicioFerias').updateValueAndValidity();
        }
      }
    }
    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  public inicioUsufrutoValidator(control: AbstractControl): { [key: string]: any } | null {
    const mensagem = [];
    if (control.parent) {
      if ((control.value.length === 10)) {
        let dia = Number(control.value.split('/')[0]);
        let mes = Number(control.value.split('/')[1]) - 1;
        let ano = Number(control.value.split('/')[2]);
        const inicioUsufruto: Date = new Date(ano, mes, dia); /*início do ajuste*/
        const val: Number[] = control.parent.get('fimPeriodoAquisitivo').value.split('-');
        const fimPeriodoAquisitivo: Date = new Date(Number(val[0]), Number(val[1]) - 1, Number(val[2]));
        const val2: Number[] = control.parent.get('inicioPeriodoAquisitivo').value.split('-');
        const inicioPeriodoAquisitivo: Date = new Date(Number(val2[0]), Number(val2[1]) - 1, Number(val2[2]));
        if (inicioUsufruto <= fimPeriodoAquisitivo && control.parent.get('existeCalculoAnterior').value === true) {
          mensagem.push('A data de início do usufruto deve ser maior que a data fim do período aquisitivo !');
        } else if (inicioUsufruto <= inicioPeriodoAquisitivo) {
            mensagem.push('A data de início do usufruto deve ser maior que a data inicio do período aquisitivo !');
        } else if (control.parent.get('dataDesligamento').value) {
          const aux: Number[] = control.parent.get('dataDesligamento').value.split('-');
          const dataDesligamento: Date = new Date(Number(aux[0]), Number(aux[1]) - 1, Number(aux[2]));
          if (inicioUsufruto > dataDesligamento) {
            mensagem.push('A data de início do usufruto deve ser menor que a data de desligamento do terceirizado que é ' + dataDesligamento.getDate() + '/' +
              (dataDesligamento.getMonth() + 1) + '/' + dataDesligamento.getFullYear() + ' !');
          }
        } else if (control.parent.get('ultimoFimUsufruto').value) {
          ano = Number(control.parent.get('ultimoFimUsufruto').value.split('-')[0]);
          mes = Number(control.parent.get('ultimoFimUsufruto').value.split('-')[1]) - 1;
          dia = Number(control.parent.get('ultimoFimUsufruto').value.split('-')[2]);
          const ultimoFimUsufruto: Date = new Date(ano, mes, dia);
          if (inicioUsufruto <= ultimoFimUsufruto) {
            mensagem.push('A data de início do usufruto deve ser maior que a última data final do usufruto que é ' + ultimoFimUsufruto.getDate() + '/' + (ultimoFimUsufruto.getMonth() + 1) + '/' +
              ultimoFimUsufruto.getFullYear() + ' !');
          }
        }
      }
      if ((control.touched || control.dirty) && !control.pristine) {
        if (control.parent.get('fimFerias').touched || control.parent.get('fimFerias').dirty) {
          // control.parent.get('diasVendidos').updateValueAndValidity();
        }
        if (control.valid && control.parent.get('fimFerias')) {
          control.markAsPristine();
          control.parent.get('diasVendidos').updateValueAndValidity();
          control.parent.get('fimFerias').updateValueAndValidity();
        }
      }
    }
    return (mensagem.length > 0) ? {'mensagem': [mensagem]} : null;
  }

  closeModal1() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  openModal1() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  openModal2() {
    this.modalActions2.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.modalActions2.emit({action: 'modal', params: ['close']});
  }

  openModal3() {
    this.modalActions3.emit({action: 'modal', params: ['open']});
  }

  closeModal3() {
    this.modalActions3.emit({action: 'modal', params: ['close']});
  }

  openModal4() {
    this.modalActions4.emit({action: 'modal', params: ['open']});
  }

  closeModal4() {
    this.modalActions4.emit({action: 'modal', params: ['close']});
    this.navegaParaViewDeCalculos.emit(this.codigoContrato);
  }

  openModal5() {
    this.modalActions5.emit({action: 'modal', params: ['open']});
  }

  closeModal5() {
    this.modalActions5.emit({action: 'modal', params: ['close']});
  }
  protected encapsulaDatas(value: any, operacao: boolean): Date {
    if (operacao) {
      const a = value.split['/'];
      const dia = Number(a[0]);
      const mes = Number(a[1]) - 1;
      const ano = Number(a[2]);
      return new Date(ano, mes, dia);
    } else {
      return value as Date;
    }
  }

  efetuarCalculo(): void {
    this.feriasService.calculaFeriasTerceirizados(this.feriasCalcular).subscribe(res => {
      if (res.success) {
        this.closeModal3();
        this.openModal4();
      }
    });
  }

  verificaDadosFormularioResgate() {
    this.feriasCalcular = [];
    let aux = 0;
    for (let i = 0; i < this.terceirizados.length; i++) {
      if (this.feriasResgate.get('calcularTerceirizados').get('' + i).get('selected').value) {
        aux++; /*incrementa a variável para cada terceirizado selecionado*/
        if (this.feriasResgate.get('calcularTerceirizados').get('' + i).status === 'VALID') {
          /*registra o cálculo se ele for válido*/
          const objeto = new FeriasCalcular(this.feriasResgate.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value,
            this.feriasResgate.get('calcularTerceirizados').get('' + i).get('tipoRestituicao').value,
            this.feriasResgate.get('calcularTerceirizados').get('' + i).get('diasVendidos').value,
            this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioFerias').value,
            this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimFerias').value,
            this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioPeriodoAquisitivo').value,
            this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimPeriodoAquisitivo').value,
            0,
            this.feriasResgate.get('calcularTerceirizados').get('' + i).get('parcelas').value, 0, 0, 0, 0, 0);
          if (this.terceirizados[i].valorRestituicaoFerias) {
            objeto.setInicioPeriodoAquisitivo(this.terceirizados[i].valorRestituicaoFerias.inicioPeriodoAquisitivo);
            objeto.setFimPeriodoAquisitivo(this.terceirizados[i].valorRestituicaoFerias.fimPeriodoAquisitivo);
          }
          let index = -1;
          for (let j = 0; j < this.feriasCalcular.length; j++) {
            if (this.feriasCalcular[j].codTerceirizadoContrato === this.feriasResgate.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value) {
              index = j;
            }
          }
          objeto.setNomeTerceirizado(this.terceirizados[i].nomeTerceirizado);
          if (index === -1) {
            this.feriasCalcular.push(objeto);
            console.log(objeto);
          } else {
            this.feriasCalcular.splice(index, 1);
            this.feriasCalcular.push(objeto);
          }
        } else {
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioFerias').markAsTouched();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioFerias').markAsDirty();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimFerias').markAsTouched();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimFerias').markAsDirty();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('diasVendidos').markAsTouched();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('diasVendidos').markAsDirty();
          aux = null;
          this.openModal2();
        }
      }
    }
    if (aux === 0) {
      this.openModal1();
      /* for (let i = 0; i < this.terceirizados.length; i++) {
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioFerias').markAsTouched();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('inicioFerias').markAsDirty();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimFerias').markAsTouched();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('fimFerias').markAsDirty();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('diasVendidos').markAsTouched();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('diasVendidos').markAsDirty();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('valorMovimentado').markAsTouched();
          this.feriasResgate.get('calcularTerceirizados').get('' + i).get('valorMovimentado').markAsDirty();
      } */
    }
    if ((this.feriasCalcular.length > 0) && aux) { /*se a lista de cálculos não está vazia e existe terceirizado selecionado*/
        this.diasConcedidos = [];
        for (let i = 0; i < this.feriasCalcular.length; i++) { /*realiza os comandos abaixo para cada cálculo*/
            this.somaFerias = 0;
            this.somaTerco = 0;
            this.somaIncidenciaFerias = 0;
            this.somaIncidenciaTerco = 0;

            this.getDiasConcedidos(this.feriasCalcular[i].inicioFerias, this.feriasCalcular[i].fimFerias, this.feriasCalcular[i].diasVendidos, i);
        /*pega os dias de férias que o terceirizado tem direito*/
            this.feriasService.getValoresFeriasTerceirizado(this.feriasCalcular[i]).subscribe(res => {
              /*pega os valores de férias a serem restituídas à empresa*/
                if (!res.error) { /*se não tiver erros na requisição*/
                    this.terceirizados.forEach(terceirizado => {
                        if (terceirizado.codigoTerceirizadoContrato === this.feriasCalcular[i].codTerceirizadoContrato) {
                            terceirizado.valorRestituicaoFerias = res;
                            this.feriasCalcular[i].pTotalFerias = terceirizado.valorRestituicaoFerias.valorFerias;
                            this.feriasCalcular[i].pTotalTercoConstitucional = terceirizado.valorRestituicaoFerias.valorTercoConstitucional;
                            this.feriasCalcular[i].pTotalIncidenciaFerias = terceirizado.valorRestituicaoFerias.valorIncidenciaFerias;
                            this.feriasCalcular[i].pTotalIncidenciaTerco = terceirizado.valorRestituicaoFerias.valorIncidenciaTercoConstitucional;
                            this.feriasCalcular[i].inicioPeriodoAquisitivo = terceirizado.valorRestituicaoFerias.inicioPeriodoAquisitivo;
                            this.feriasCalcular[i].fimPeriodoAquisitivo = terceirizado.valorRestituicaoFerias.fimPeriodoAquisitivo;
                            for (let k = 0; k < this.feriasCalcular.length; k++) {
                                console.log('entrou no for');
                                if (this.saldos[k].feriasRetido - (this.feriasCalcular[k].pTotalTercoConstitucional +
                                    this.feriasCalcular[k].pTotalFerias + this.feriasCalcular[k].pTotalIncidenciaFerias +
                                    this.feriasCalcular[k].pTotalIncidenciaTerco) < 0) {
                                    // console.log('entrou no if');
                                    // console.log(this.saldos[k].feriasRetido);
                                    // console.log(this.feriasCalcular[k].pTotalFerias);
                                    // console.log(this.feriasCalcular[k].pTotalTercoConstitucional);
                                    // console.log(this.feriasCalcular[k].pTotalIncidenciaFerias);
                                    // console.log(this.feriasCalcular[k].pTotalIncidenciaTerco);
                                    // console.log(this.saldos[k].feriasRetido - (this.feriasCalcular[k].pTotalTercoConstitucional +
                                    //   this.feriasCalcular[k].pTotalFerias + this.feriasCalcular[k].pTotalIncidenciaFerias +
                                    //   this.feriasCalcular[k].pTotalIncidenciaTerco));
                                    this.openModal5();
                                } else {
                                    this.somaFerias = this.somaFerias + terceirizado.valorRestituicaoFerias.valorFerias;
                                    this.somaTerco = this.somaTerco + terceirizado.valorRestituicaoFerias.valorTercoConstitucional;
                                    this.somaIncidenciaFerias = this.somaIncidenciaFerias + terceirizado.valorRestituicaoFerias.valorIncidenciaFerias;
                                    this.somaIncidenciaTerco = this.somaIncidenciaTerco + terceirizado.valorRestituicaoFerias.valorIncidenciaTercoConstitucional;
                                    if (i === (this.feriasCalcular.length - 1)) {
                                        this.openModal3();
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
    }
  }

  getDiasConcedidos(inicioFerias, fimFerias, diasVendidos, indice) {
    let dia = inicioFerias.split('/')[0];
    let mes = inicioFerias.split('/')[1] - 1;
    let ano = inicioFerias.split('/')[2];
    const initDate = new Date(ano, mes, dia);
    dia = fimFerias.split('/')[0];
    mes = fimFerias.split('/')[1] - 1;
    ano = fimFerias.split('/')[2];
    const finalDate = new Date(ano, mes, dia);
    const diffTime = Math.abs(finalDate.getTime() - initDate.getTime());
    const diffDay = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
    this.diasConcedidos[indice] = diffDay + diasVendidos;
  }
}
