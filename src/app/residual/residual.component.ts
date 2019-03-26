import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResidualService} from './residual.service';
import {ListaCalculosPendentes} from './residuais-pendentes/lista-calculos-pendentes';


@Component({
  selector: 'app-residual-component',
  templateUrl: './residual.component.html',
  styleUrls: ['./residual.component.scss']
})
export class ResidualComponent implements OnInit {
  contentAvailable: Content = Content.Calculos;
  tabSelectionParams = ['select_tab', 'test2'];
  codigoContrato: number;
  cp: ListaCalculosPendentes[];
  cpe: ListaCalculosPendentes[];
  constructor(private route: ActivatedRoute, private feriasService: ResidualService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cp = this.route.snapshot.data.calculosPendentes;
    this.cpe = this.route.snapshot.data.calculosPendentesExecucao;
  }

  calculosPendentes() {
    this.feriasService.getCalculosPendentes().subscribe(res => {
      this.cp = res;
      this.ref.markForCheck();
      this.tabSelectionParams = ['select_tab', 'test3'];
      this.setPendentesActive();
    }, () => {
      this.cp = this.route.snapshot.data.calculosPendentes;
      this.ref.markForCheck();
      this.tabSelectionParams = ['select_tab', 'test3'];
      this.setPendentesActive();
    });
    window.scroll(0, 0);
  }

  calculosExecutados() {
    this.feriasService.getCalculosPendentesExecucao().subscribe(res => {
      this.cpe = res;
      this.ref.markForCheck();
      this.tabSelectionParams = ['select_tab', 'test4'];
      this.setExecutadosActive();
    }, () => {
      this.cpe = this.route.snapshot.data.calculosPendentesExecucao;
      this.ref.markForCheck();
      this.tabSelectionParams = ['select_tab', 'test4'];
      this.setExecutadosActive();
    });
    window.scroll(0, 0);
  }

  retencoes(codigoContrato: number) {
    this.codigoContrato = codigoContrato;
    this.tabSelectionParams = ['select_tab', 'test1'];
    this.setRetencoesActive();
  }

  testeCalculo(): boolean {
    return this.contentAvailable === Content.Calculos;
  }

  testePendentes(): boolean {
    return this.contentAvailable === Content.Pendentes;
  }

  testeRetencoes() {
    return this.contentAvailable === Content.Retencoes;
  }

  testeExecutados() {
    return this.contentAvailable === Content.Executados;
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
