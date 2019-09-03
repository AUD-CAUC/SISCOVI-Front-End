import {Component, AfterViewInit, ChangeDetectorRef, Input, OnInit} from '@angular/core';
import * as Chart from 'chart.js';
import {ConfigService} from '../_shared/config.service';
import {SaldoService} from '../saldo/saldo.service';
import {ContratosService} from '../contratos/contratos.service';
import {Contrato} from '../contratos/contrato';
import {SaldoIndividual} from '../saldo/individual/saldo-individual';
import {TotalMensalService} from '../totalMensal/total-mensal.service';
import {RubricasService} from '../rubricas/rubricas.service';
import {Rubrica} from '../rubricas/rubrica';
import {DecimoTerceiroService} from '../decimo_terceiro/decimo-terceiro.service';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})


export class InicioComponent implements OnInit {
  @Input() codigoContrato: number;
  contratos: Contrato[];
  saldos: SaldoIndividual[][] = [];
  config: ConfigService;
  somaSaldo = [];
  somaFerias = [];
  somaTerco = [];
  somaDecimo = [];
  somaIncidencia = [];
  somaMultaFGTS = [];
  nTerceirizados = [];
  nomeEmpresas = [];
  rubricas = [];
  id = 1;
  canvas: any;
  ctx: any;

  constructor(config: ConfigService, private saldoService: SaldoService, private contratoService: ContratosService, private tmService: TotalMensalService, private rubricaService: RubricasService,
              private decimoTerceiroService: DecimoTerceiroService, private ref: ChangeDetectorRef) {
    this.config = config;

  }

  async carregaInformacoes() {

  }

  async ngOnInit() {
    this.contratos = await this.contratoService.getContratosDoUsuario().toPromise();
    this.contratos.map(cont => {
      this.nomeEmpresas.push(cont.nomeDaEmpresa);
    });

    await Promise.all(this.contratos.map(async (contrato, key) => {
      this.saldos.push(await this.saldoService.getSaldoIndividual(contrato.codigo).toPromise());
      console.log(this.saldos[key]);

      if (this.saldos.length === 0) {
        this.saldos = null;
        this.ref.markForCheck();
      } else {
        let tempSaldo = 0;
        let tempFerias = 0;
        let tempTerco = 0;
        let tempDecimo = 0;
        let tempIncidencia = 0;
        let tempMultaFGTS = 0;
        for (let i = 0; i < this.saldos[key].length; i++) {
          tempSaldo = tempSaldo + this.saldos[key][i].saldo;
          tempFerias = tempFerias + this.saldos[key][i].feriasRetido - this.saldos[key][i].feriasRestituido;
          tempTerco = tempTerco + this.saldos[key][i].tercoRetido - this.saldos[key][i].tercoRestituido;
          tempDecimo = tempDecimo + this.saldos[key][i].decimoTerceiroRetido - this.saldos[key][i].decimoTerceiroRestituido;
          tempIncidencia = tempIncidencia + (this.saldos[key][i].incidenciaRetido - this.saldos[key][i].incidenciaFeriasRestituido -
            this.saldos[key][i].incidenciaTercoRestituido - this.saldos[key][i].incidenciaDecimoTerceiroRestituido);
          tempMultaFGTS = tempMultaFGTS + this.saldos[key][i].multaFgtsRetido;
        }
        this.somaSaldo.push(tempSaldo);
        this.somaFerias.push(tempFerias);
        this.somaTerco.push(tempTerco);
        this.somaDecimo.push(tempDecimo);
        this.somaIncidencia.push(tempIncidencia);
        this.somaMultaFGTS.push(tempMultaFGTS);
      }
    }));
    this.montaGraficoBarra();
  }

  random_rgba() {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  }
  // Gráfico pizza
  async montaGraficoPizza() {
    if (this.nTerceirizados.length === 0) {
      await Promise.all(this.contratos.map(async cont => {
        const dataFim = new Date(cont.dataFim);
        this.nTerceirizados.push(await this.tmService.getNumFuncionariosAtivos(dataFim.getMonth() + 1, dataFim.getFullYear(), cont.codigo).toPromise());
      }));
    }
    await this.wait();
    this.canvas = document.getElementById('myChart2');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: this.nomeEmpresas,
        datasets: [{
          label: 'Número de Funcionários',
          data: this.nTerceirizados,
          backgroundColor: [
            'rgb(40,147,85)',
            'rgb(255,95,70)',
            'rgb(255,187,70)',
            'rgb(116,70,255)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Número de Funcionários por Contrato',
          position: 'left',
          fontSize: 14,
          fontFamily: 'roboto'
        },
          legend: {
            position: 'right',
        },
      }
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async wait() {
    await this.sleep(2);
  }
  // Gráfico Barra
  async montaGraficoBarra() {
    // console.log(1)
    // await this.wait()
    // console.log(2)
    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.wait();
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: empresas,
        datasets: [{
          data: this.somaSaldo,
          backgroundColor: [
            'rgb(70,255,163)',
            'rgb(255,95,70)',
            'rgb(255,187,70)',
            'rgb(116,70,255)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          position: 'top',
          fontFamily: 'roboto',
          fontSize: 14,
          fontcolor: '#000000',
          text: 'Saldo Acumulado por Contrato'
        },
        legend: {
          display: false,
          fontFamily: 'roboto'
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return 'Saldo: R$ ' + data.datasets[0].data[tooltipItem.index].toFixed(2);
            }
          }
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              maxTicksLimit: 10,
              min: 0.0,
              stepSize: 1000.0,
            }
          }]
        }
      }
    });
  }
  // Gráfico Radar
  async montaGraficoRadar() {
    // this.contratos.map((cont) => {
    //
    //
    // });
    // this.rubricas = await this.rubricaService.getAllrubricas().toPromise().then(rubricas => {
    //   const nomes = [];
    //   rubricas.map(rubrica => {
    //     nomes.push(rubrica.nome);
    //   });
    //   return nomes;
    // });

    await this.wait();
    this.canvas = document.getElementById('myChart5');
    this.ctx = this.canvas.getContext('2d');
    const color = Chart.helpers.color;

    const myChart = new Chart(this.ctx, {
      type: 'radar',
      data: {
        labels: ['Férias', 'Terço constitucional', 'Décimo Terceiro', 'Incidência', 'Multa do FGTS'],
        datasets: this.nomeEmpresas.map((nomeEmpresa, key) => {
          const randomColor = this.getRandomColor();
          return {
              label: nomeEmpresa,
              data: [this.somaFerias[key], this.somaTerco[key], this.somaDecimo[key], this.somaIncidencia[key], this.somaMultaFGTS[key]],
              backgroundColor: color(randomColor).alpha(0.2).rgbString(),
              borderColor: randomColor,
              pointBackgroundColor: randomColor,
              borderWidth: 1
            };
        })
      },
      options: {
        legend: {
          position: 'right',
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return 'Saldo: R$ ' + tooltipItem.yLabel.toFixed(2);
            }
          }
        },
      }
    });
  }
  // Gráfico Linha
  async montaGraficoLinha() {
    // console.log(1)
    // await this.wait()
    // console.log(2)
    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.wait();
    this.canvas = document.getElementById('myChart4');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: empresas,
        datasets: [{
          label: '# of Votes',
          data: this.somaSaldo,
          backgroundColor: [
            'rgb(228,82,27,1)',
            'rgb(255,234,106,1)',
            'rgb(255,124,16, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          position: 'right',
        },
      }
    });
  }

  async montaGraficoPolar() {
    const empresas = [];
    let temp;
    const contratos = [];

    await Promise.all(this.contratos.map(async (cont, key1) => {
      empresas.push(cont.nomeDaEmpresa);
      temp = await this.decimoTerceiroService.getRestituicoesDecimoTerceiro(cont.codigo).toPromise();
      console.log(temp)
      contratos[key1] = {};
      await Promise.all(temp.map((valorDec, key) => {
        const ano = temp[key].inicioContagem.split('-')[0];
        if (!contratos[key1][ano]) {
          contratos[key1][ano] = 0;
        }
        contratos[key1][ano] = contratos[key1][ano] + temp[key].valoresDecimoTerceiro.valorDecimoTerceiro + temp[key].valoresDecimoTerceiro.valorIncidenciaDecimoTerceiro;
      }));
    }));
    contratos[1][2016] = NaN;
    console.log(contratos);
    await this.wait();
    this.canvas = document.getElementById('myChart3');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ['2016', '2017', '2018'],
        datasets: this.nomeEmpresas.map((nomeEmpresa, key) => {
          const randomColor = this.getRandomColor();
          return {
            label: nomeEmpresa,
            fill: false,
            data: Object.values(contratos[key]),
            backgroundColor: randomColor,
            borderColor: randomColor,
            borderWidth: 1
          };
        })
      },
      options: {
        legend: {
          position: 'right',
        },
      }
    });
  }
  selecionaGrafico(value: string) {
    this.id = Number(value);
    if (this.id === 1) {
      this.montaGraficoBarra();
    } else if (this.id === 2) {
      this.montaGraficoPizza();
    } else if (this.id === 3) {
      this.montaGraficoPolar();
    } else if (this.id === 4) {
      this.montaGraficoLinha();
    } else if (this.id === 5) {
      this.montaGraficoRadar();

    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
