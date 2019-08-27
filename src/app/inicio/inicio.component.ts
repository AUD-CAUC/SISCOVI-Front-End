import {Component, AfterViewInit, ChangeDetectorRef, Input, OnInit} from '@angular/core';
import * as Chart from 'chart.js';
import {ConfigService} from "../_shared/config.service";
import {SaldoService} from "../saldo/saldo.service";
import {ContratosService} from "../contratos/contratos.service";
import {Contrato} from "../contratos/contrato";
import {SaldoIndividual} from "../saldo/individual/saldo-individual";

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.component.html'
})


export class InicioComponent implements OnInit {
  @Input() codigoContrato: number;
  contratos: Contrato[];
  saldos: SaldoIndividual[];
  config: ConfigService;
  somaSaldo = [];
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
    this.montaGrafico(this.somaSaldo);
  }

  random_rgba() {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  }

  montaGrafico(saldo) {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [{
          label: '# of Votes',
          data: saldo,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
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

}
