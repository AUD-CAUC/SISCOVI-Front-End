import {Component, AfterViewInit, ChangeDetectorRef, Input, OnInit} from '@angular/core';
import * as Chart from 'chart.js';
import {ConfigService} from "../_shared/config.service";
import {SaldoService} from "../saldo/saldo.service";
import {ContratosService} from "../contratos/contratos.service";
import {Contrato} from "../contratos/contrato";
import {SaldoIndividual} from "../saldo/individual/saldo-individual";

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})


export class InicioComponent implements OnInit {
  @Input() codigoContrato: number;
  contratos: Contrato[];
  saldos: SaldoIndividual[];
  config: ConfigService;
  somaSaldo = [];
  id = 1;
  canvas: any;
  ctx: any;

  constructor(config: ConfigService, private saldoService: SaldoService, private contratoService: ContratosService, private ref: ChangeDetectorRef) {
    this.config = config;

  }

  async carregaInformacoes() {

  }

  async ngOnInit() {
    this.contratos = await this.contratoService.getContratosDoUsuario().toPromise();

    await Promise.all(this.contratos.map(async contrato => {
      this.saldos = await this.saldoService.getSaldoIndividual(contrato.codigo).toPromise();

      if (this.saldos.length === 0) {
        this.saldos = null;
        this.ref.markForCheck();
      } else {
        let temp = 0;
        for (let i = 0; i < this.saldos.length; i++) {
          temp = temp + this.saldos[i].saldo;
        }
        this.somaSaldo.push(temp);
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
    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.demo();
    this.canvas = document.getElementById('myChart2');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: empresas,
        datasets: [{
          label: 'Número de Funcionários',
          data: this.somaSaldo,
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
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return data.labels[tooltipItem.index] + ': R$ ' + data.datasets[0].data[tooltipItem.index].toFixed(2);
            }
          }
        },
      }
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async demo() {
    await this.sleep(2);
  }
  // Gráfico Barra
  async montaGraficoBarra() {
    // console.log(1)
    // await this.demo()
    // console.log(2)
    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.demo();
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
    // console.log(1)
    // await this.demo()
    // console.log(2)
    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.demo();
    this.canvas = document.getElementById('myChart3');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: empresas,
        datasets: [{
          label: '# of Votes',
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
        legend: {
          position: 'right',
        },
      }
    });
  }
  // Gráfico Linha
  async montaGraficoLinha() {
    // console.log(1)
    // await this.demo()
    // console.log(2)
    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.demo();
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
    // console.log(1)
    // await this.demo()
    // console.log(2)
    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.demo();
    this.canvas = document.getElementById('myChart5');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'polarArea',
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
  selecionaGrafico(value: string) {
    this.id = Number(value);
    if (this.id === 1) {
      this.montaGraficoBarra();
    } else if (this.id === 2) {
      this.montaGraficoPizza();
    } else if (this.id === 3) {
      this.montaGraficoRadar();
    } else if (this.id === 4) {
      this.montaGraficoLinha();
    } else if (this.id === 5) {
      this.montaGraficoPolar();
    }
  }
}
