import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ListaCalculosPendentes} from './rescisoes-pendentes/lista-calculos-pendentes';
import {RescisaoService} from './rescisao.service';

@Component({
    selector: 'app-rescisao-component',
    templateUrl: './rescisao.component.html',
    styleUrls: ['./rescisao.component.scss']
})
export class RescisaoComponent implements OnInit {
    contentAvailable: Content = Content.Calculos;
    tabSelectionParams = ['select_tab', 'test2'];
    codigoContrato: number;
    cp: ListaCalculosPendentes[];
    cpe: ListaCalculosPendentes[];
    constructor(private route: ActivatedRoute, private rescisaoService: RescisaoService, private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
      this.cp = this.route.snapshot.data.calculosPendentes;
      this.cpe = this.route.snapshot.data.calculosPendentesExecucao;
    }

    calculosPendentes() {
      this.rescisaoService.getCalculosPendentes().subscribe(res => {
        this.cp = res;
        this.ref.markForCheck();
        this.tabSelectionParams = ['select_tab', 'test3'];
        this.setPendentesActive();
      }, error2 => {
        this.cp = this.route.snapshot.data.calculosPendentes;
        this.ref.markForCheck();
        this.tabSelectionParams = ['select_tab', 'test3'];
        this.setPendentesActive();
      });
      window.scroll(0, 0);
    }

    calculosExecutados() {
      this.rescisaoService.getCalculosPendentesExecucao().subscribe(res => {
        this.cpe = res;
        this.ref.markForCheck();
        this.tabSelectionParams = ['select_tab', 'test4'];
        this.setExecutadosActive();
      }, error2 => {
        this.cpe = this.route.snapshot.data.calculosPendentesExecucao;
        this.ref.markForCheck();
        this.tabSelectionParams = ['select_tab', 'test4'];
        this.setExecutadosActive();
      });
      window.scroll(0,0);
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
