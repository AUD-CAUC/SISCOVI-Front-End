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

  async ngOnInit() {
    this.contratos = await this.contratoService.getContratosDoUsuario().toPromise();
    console.log(this.contratos);
    this.contratos.map(cont => {
      this.nomeEmpresas.push(cont.nomeDaEmpresa);
      console.log(this.nomeEmpresas);
    });

    for (let j = 0; j < this.contratos.length; j++) {
      const res = await this.saldoService.getSaldoIndividual(this.contratos[j].codigo).toPromise();
      this.saldos.push(res);
      console.log(res);

      let tempSaldo = 0;
      let tempFerias = 0;
      let tempTerco = 0;
      let tempDecimo = 0;
      let tempIncidencia = 0;
      let tempMultaFGTS = 0;
      for (let i = 0; i < res.length; i++) {
        tempSaldo = tempSaldo + res[i].saldo;
        tempFerias = tempFerias + res[i].feriasRetido - res[i].feriasRestituido;
        tempTerco = tempTerco + res[i].tercoRetido - res[i].tercoRestituido;
        tempDecimo = tempDecimo + res[i].decimoTerceiroRetido - res[i].decimoTerceiroRestituido;
        tempIncidencia = tempIncidencia + (res[i].incidenciaRetido - res[i].incidenciaFeriasRestituido -
          res[i].incidenciaTercoRestituido - res[i].incidenciaDecimoTerceiroRestituido);
        tempMultaFGTS = tempMultaFGTS + res[i].multaFgtsRetido;
      }
      this.somaSaldo.push(tempSaldo);
      this.somaFerias.push(tempFerias);
      this.somaTerco.push(tempTerco);
      this.somaDecimo.push(tempDecimo);
      this.somaIncidencia.push(tempIncidencia);
      this.somaMultaFGTS.push(tempMultaFGTS);

    }
    this.montaGraficoSaldoAcumulado();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async wait() {
    await this.sleep(2);
  }
  
  // Gráfico Barra
  async montaGraficoSaldoAcumulado() {
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
        datasets: [
          {
          data: this.somaSaldo,
          backgroundColor: [
            'rgb(195,215,255)',
            'rgb(195,255,235)',
            'rgb(176,111,85)',
            'rgb(148,160,255)',
            'rgb(159,155,163)',
            'rgb(255,146,121)',
          ],
          borderWidth: 1
        },

        ]
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
          }],
          xAxes: [{
            barPercentage: 0.8,
            // barThickness: 16,
            // maxBarThickness: 16,
            minBarLength: 2,
            gridLines: {
              offsetGridLines: true
            }
          }]
        }
      }
    });
  }

  // Gráfico pizza
  async montaGraficoNumeroTerceirizados() {
    if (this.nTerceirizados.length === 0) {
      await Promise.all(this.contratos.map(async cont => {
        const dataFim = new Date(cont.dataFim);
        this.nTerceirizados.push(await this.tmService.getNumFuncionariosAtivos(dataFim.getMonth() + 1, dataFim.getFullYear(), cont.codigo).toPromise());
        console.log(this.nTerceirizados);
      }));
    }
    // for (let z = 0; z < this.contratos.length; z++) {
    //   const res = await this.nTerceirizados.push(await this.tmService.getNumFuncionariosAtivos(dataFim.getMonth() + 1, dataFim.getFullYear(), cont.codigo).toPromise());
    //   this.nTerceirizados.push(res);
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
            'rgb(195,215,255)',
            'rgb(195,255,235)',
            'rgb(176,111,85)',
            'rgb(148,160,255)',
            'rgb(159,155,163)',
            'rgb(255,146,121)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Número de Terceirizados por Contrato',
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
  
  // Gráfico Radar
  async montaGraficoRetencaoRubrica() {
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
              fill: true,
              borderWidth: 3,
              hoverRadius: 7,
              data: [this.somaFerias[key], this.somaTerco[key], this.somaDecimo[key], this.somaIncidencia[key], this.somaMultaFGTS[key]],
              backgroundColor: color(randomColor).alpha(0.1).rgbString(),
              borderColor: randomColor,
              pointBackgroundColor: randomColor
            };
        })
      },
      options: {
        title: {
          display: true,
          position: 'left',
          fontFamily: 'roboto',
          fontSize: 14,
          fontcolor: '#000000',
          text: 'Retenções por Rubrica'
        },
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

    const empresas = [];
    this.contratos.map((cont) => {
      empresas.push(cont.nomeDaEmpresa);

    });
    await this.wait();
    this.canvas = document.getElementById('myChart4');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'bar',
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
    await this.wait();
    this.canvas = document.getElementById('myChart3');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'bar',
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
      this.montaGraficoSaldoAcumulado();
    } else if (this.id === 2) {
      this.montaGraficoNumeroTerceirizados();
    } else if (this.id === 3) {
      this.montaGraficoPolar();
    } else if (this.id === 4) {
      this.montaGraficoLinha();
    } else if (this.id === 5) {
      this.montaGraficoRetencaoRubrica();

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
