import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TerceirizadoDecimoTerceiro} from '../terceirizado-decimo-terceiro';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterializeAction} from 'angular2-materialize';
import {DecimoTerceiroService} from '../decimo-terceiro.service';
import {SaldoIndividual} from '../../saldo/individual/saldo-individual';
import {SaldoService} from '../../saldo/saldo.service';
import {ContratosService} from '../../contratos/contratos.service';
import {Contrato} from '../../contratos/contrato';

@Component({
  selector: 'app-resgate-decimo-terceiro-component',
  templateUrl: './resgate-decimo-terceiro.component.html',
  styleUrls: ['./resgate-decimo-terceiro.component.scss']
})
export class ResgateDecimoTerceiroComponent implements OnInit {
  @Input() protected terceirizados: TerceirizadoDecimoTerceiro[];
  @Input() codigoContrato: number;
  @Input() tipoRestituicao: string;
  contratos: Contrato[];
  saldos: SaldoIndividual[];
  decimoTerceiroForm: FormGroup;
  isSelected = false;
  selected = false;
  calculosDecimoTerceiro: TerceirizadoDecimoTerceiro[] = [];
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();
  modalActions3 = new EventEmitter<string | MaterializeAction>();
  modalActions4 = new EventEmitter<string | MaterializeAction>();
  modalActions5 = new EventEmitter<string | MaterializeAction>();
  vmsm = false;
  protected diasConcedidos: number[] = [];
  @Output() navegaParaViewDeCalculos = new EventEmitter();
  somaDecimo = 0;
  somaIncidencia = 0;
  saldoDecTer = 0;

  constructor(private fb: FormBuilder, private decimoTerceiroService: DecimoTerceiroService, private saldoService: SaldoService,
              private contratoService: ContratosService, private ref: ChangeDetectorRef) {
    this.contratoService.getContratosDoUsuario().subscribe(res => {
      this.contratos = res;
      // console.log(res);
      if (this.codigoContrato) {
        this.saldoService.getSaldoIndividual(this.codigoContrato).subscribe(res2 => {
          this.saldos = res2;
          // console.log(res2);
          this.saldoDecTer = 0;
          for (let i = 0; i < this.saldos.length; i++) {
            this.saldoDecTer = this.saldos[i].decimoTerceiroRetido;
            console.log(this.saldoDecTer);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.formInit();
  }

  formInit(): void {
    this.decimoTerceiroForm = this.fb.group({
      calcularTerceirizados: this.fb.array([])
    });
    this.ref.markForCheck();
    const control = <FormArray>this.decimoTerceiroForm.controls.calcularTerceirizados;
    this.terceirizados.forEach(item => {
      const addCtrl = this.fb.group({
        codTerceirizadoContrato: new FormControl(item.codigoTerceirizadoContrato),
        parcelas: new FormControl(0),
        selected: new FormControl(this.isSelected),
        disponivel: new FormControl(item.valorDisponivel),
        tipoRestituicao: new FormControl(this.tipoRestituicao),
        inicioContagem: new FormControl(item.inicioContagem),
        emAnalise: new FormControl(item.emAnalise),
        restituidoAnoPassado: new FormControl(item.restituidoAnoPassado),
        parcelaAnterior: new FormControl(item.parcelaAnterior),
      });
      control.push(addCtrl);
    });
    for (let i = 0; i < this.terceirizados.length; i++) {
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').setValidators(Validators.required);
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelas').setValidators([Validators.required, this.parcelaValidator]);
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('tipoRestituicao').setValidators(Validators.required);
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('inicioContagem');
      const emAnalise = this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('emAnalise').value;
      const restituidoAnoPassado = this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('restituidoAnoPassado').value;
      let ultimaParcela = this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelaAnterior').value;

      if (ultimaParcela === null) {
          ultimaParcela = '0';
      } else if (!emAnalise) {
          ultimaParcela++;
          ultimaParcela.toString();
      }
      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelas').setValue(ultimaParcela);

      if (emAnalise || !restituidoAnoPassado) {
        this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).disable();
      }
    }
    this.ref.markForCheck();
  }

  public parcelaValidator(control: AbstractControl): { [key: string]: any } {
      const mensagem = [];
      let error = false;
      const parcelaSelecionada: string = control.value;
      const parcelaAnt: string = control.parent.get('parcelaAnterior').value;
      if (parcelaAnt === null) {
          if (parcelaSelecionada === '2') {
              mensagem.push('Deve realizar a Primeira parcela');
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
          }
      }

      if (error) {
          control.parent.get('parcelas').markAsUntouched();
      } else if (control.dirty) {
          control.parent.get('parcelas').markAsUntouched();
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
    this.vmsm = false;
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

  efetuarCalculo(): void {
    this.decimoTerceiroService.registrarCalculoDecimoTerceiro(this.calculosDecimoTerceiro).subscribe(res => {
      if (res.success) {
        this.closeModal3();
        this.openModal4();
      }
    });
  }

  verificaDadosFormulario() {
      this.calculosDecimoTerceiro = [];
      let aux = 0;
      this.vmsm = false;
      for (let i = 0; i < this.terceirizados.length; i++) { /**/
          if (this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('selected').value) {
              aux++; /*incrementa a variavel aux para cada funcionario selecionado*/
              if (this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).status === 'VALID') {
                /*registra o cálculo se ele e o valor a ser restituído forem válidos*/
                  const objeto = new TerceirizadoDecimoTerceiro(this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value,
                  this.terceirizados[i].nomeTerceirizado,
                  this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('inicioContagem').value,
                  0, this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('parcelas').value);
                  objeto.tipoRestituicao = this.tipoRestituicao;
                  let index = -1;
                  for (let j = 0; j < this.calculosDecimoTerceiro.length; j++) {/*percorre o array de cálculos*/
                      if (this.calculosDecimoTerceiro[j].codigoTerceirizadoContrato ===
                      this.decimoTerceiroForm.get('calcularTerceirizados').get('' + i).get('codTerceirizadoContrato').value) {
                        /* atribuindo a index o valor de j caso o código do contrato em cálculo bata com com o código do
                        * do contrato do funcionário */
                          index = j;
                      }
                  }
                  objeto.setNomeTerceirizado(this.terceirizados[i].nomeTerceirizado); /*traz o nome de um terceirizado de acordo com seu código*/
                  if (index === -1) {
                      this.calculosDecimoTerceiro.push(objeto);
                      console.log(objeto);
                  } else {
                      this.calculosDecimoTerceiro.splice(index, 1);
                      this.calculosDecimoTerceiro.push(objeto);
                  }
              } else { /*se algum dos dados não for válido, abre o modal de erro para campos preenchidos incorretamente*/
                  aux = undefined;
                  this.openModal2();
              }
          }
      }
      if (aux === 0) { /*se nenhum funcionário for selecionado e o usuário tentar fazer o cálculo, acusa erro*/
          this.openModal1();
      }
      if ((this.calculosDecimoTerceiro.length > 0) && aux) { /*se a lista de cálculos não estiver vazia e se houver terceirizados selecionados*/
          this.diasConcedidos = [];
          this.decimoTerceiroService.calculaDecimoTerceiroTerceirizados(this.calculosDecimoTerceiro).subscribe(res => {
              this.calculosDecimoTerceiro = res;
              for (let j = 0; j < this.calculosDecimoTerceiro.length; j++) { /*percorre os cálculos verificando se existe saldo
                suficiente na conta para poder fazer a restituição*/
                  console.log('entrou no for');
                  if ((this.saldos[j].decimoTerceiroRetido - (this.calculosDecimoTerceiro[j].valoresDecimoTerceiro.valorDecimoTerceiro +
                      this.calculosDecimoTerceiro[j].valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro)) < 0) { /*se não possuir
                      saldo suficiente abre o modal de erro 5 acusando falta de saldo para realizar a operação*/
                      // console.log('entrou no if');
                      // console.log(this.calculosDecimoTerceiro[j].valoresDecimoTerceiro.valorDecimoTerceiro);
                      // console.log(this.calculosDecimoTerceiro[j].valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro);
                      // console.log(this.saldos[j].decimoTerceiroRetido);
                      // console.log((this.saldos[j].decimoTerceiroRetido - (this.calculosDecimoTerceiro[j].valoresDecimoTerceiro.valorDecimoTerceiro +
                      //   this.calculosDecimoTerceiro[j].valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro)));
                      this.openModal5();
                  } else { /*se tiver saldo para fazer a operação, verifica se não há erro na requisição*/
                      if (!res.error) { /*se não tiver erros define os valores de 13º e incidência para serem mostrados no modal 3*/
                          this.calculosDecimoTerceiro = res;
                          this.somaDecimo = 0;
                          this.somaIncidencia = 0;
                          for (let i = 0; i < this.calculosDecimoTerceiro.length; i++) { /**/
                              this.somaDecimo = this.somaDecimo + this.calculosDecimoTerceiro[i].valoresDecimoTerceiro.valorDecimoTerceiro;
                              this.somaIncidencia = this.somaIncidencia + this.calculosDecimoTerceiro[i].valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro;
                          }
                          this.openModal3();
                          this.vmsm = true;
                      }
                  }
              }
          });
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
