import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListaCalculosPendentes} from './ferias-pendentes/lista-calculos-pendentes';
import {FeriasService} from './ferias.service';

@Component({
  selector: 'app-ferias-component',
  templateUrl: './ferias.component.html',
  styleUrls: ['./ferias.component.scss']
})
export class FeriasComponent implements OnInit {
  contentAvailable: Content = Content.Calculos;
  tabSelectionParams = ['select_tab', 'test2'];
  codigoContrato: number;
  cp: ListaCalculosPendentes[];
  cpe: ListaCalculosPendentes[];
  constructor(private route: ActivatedRoute, private feriasService: FeriasService) {
  }

  ngOnInit() {
    this.cp = this.route.snapshot.data.calculosPendentes;
    this.cpe = this.route.snapshot.data.calculosPendentesExecucao;
  }

  calculosPendentes() {
    this.feriasService.getCalculosPendentes().subscribe(res => {
      this.cp = res;
    }, error2 => {
      this.cp = this.route.snapshot.data.calculosPendentes;
    });
    this.tabSelectionParams = ['select_tab', 'test3'];
    this.setPendentesActive();
  }

  calculosExecutados() {
    this.feriasService.getCalculosPendentesExecucao().subscribe(res => {
      this.cpe = res;
    }, error2 => {
      this.cpe = this.route.snapshot.data.calculosPendentesExecucao;
    });
    this.tabSelectionParams = ['select_tab', 'test4'];
    this.setExecutadosActive();
  }

  retencoes(codigoContrato: number) {
    this.codigoContrato = codigoContrato;
    this.tabSelectionParams = ['select_tab', 'test1'];
    this.setRetencoesActive();
  }

  testeCalculo(): boolean {
    if (this.contentAvailable === Content.Calculos) {
      return true;
    }
    return false;
  }

  testePendentes(): boolean {
    if (this.contentAvailable === Content.Pendentes) {
      return true;
    }
    return false;
  }

  testeRetencoes() {
    if (this.contentAvailable === Content.Retencoes) {
      return true;
    }
    return false;
  }

  testeExecutados() {
    if (this.contentAvailable === Content.Executados) {
      return true;
    }
    return false;
  }

  setRetencoesActive(): void {
    this.contentAvailable = Content.Retencoes;
    this.tabSelectionParams = ['select_tab', 'test1'];
  }

  setCalcularActive(): void {
    this.contentAvailable = Content.Calculos;
    this.tabSelectionParams = ['select_tab', 'test2'];
  }

  setPendentesActive(): void {
    this.contentAvailable = Content.Pendentes;
    this.tabSelectionParams = ['select_tab', 'test3'];
  }

  setExecutadosActive(): void {
    this.contentAvailable = Content.Executados;
    this.tabSelectionParams = ['select_tab', 'test4'];
  }
}

enum Content {Calculos, Retencoes, Pendentes, Executados}
