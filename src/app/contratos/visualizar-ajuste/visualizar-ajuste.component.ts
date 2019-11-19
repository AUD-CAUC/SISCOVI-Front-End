import {Component} from '@angular/core';
import {Contrato} from '../contrato';
import {HistoricoGestor} from '../../historico/historico-gestor';
import {HistoricoService} from '../../historico/historico.service';
import {ContratosService} from '../contratos.service';
import {ActivatedRoute, Router} from '@angular/router';
import html2canvas from 'html2canvas';
import * as JsPDF from 'jspdf';

@Component({
    selector: 'app-visualizar-ajuste.component',
    templateUrl: './visualizar-ajuste.component.html',
    styleUrls: ['./visualizar-ajuste.component.scss']
})
export class VisualizarAjusteComponent {
    contratos: Contrato[];
    contrato: Contrato;
    codContrato: number;
    codAjuste: number;
    historicoGestor: HistoricoGestor[];
    histoServ: HistoricoService;
    contServ: ContratosService;

    constructor(contServ: ContratosService, private router: Router, private route: ActivatedRoute, histoServ: HistoricoService) {
        this.contServ = contServ;
        this.histoServ = histoServ;
        route.params.subscribe(params => {
            this.codContrato = params['codContrato'];
            this.codAjuste = params['codAjuste'];
        });
        if (this.codAjuste.toString() !== '0') {
            this.contServ.getAjusteCompleto(this.codContrato, this.codAjuste).subscribe(res => {
                this.contrato = res;
            });
        } else {
            this.contServ.getContratoCompletoUsuario(this.codContrato).subscribe(res => {
                this.contrato = res;
            });
        }
    }

    voltaContratos() {
        this.router.navigate(['/contratos']);
    }
  captureScreen(nomeEmpresa) {
    const data = document.getElementById(nomeEmpresa);
    html2canvas(data, {scrollX: 0, scrollY: -window.scrollY}).then(canvas => {
      // Few necessary setting options
      const imgWidth = 205;
      const imgWidth1 = canvas.width;
      const imgHeight1 = canvas.height;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpg');
      const pdf = new JsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 35;

      // dataReferencia = dataReferencia.split('-');
      pdf.setFontSize(12);
      pdf.text('Relatório de Ajuste Cadastrado', 105, 15, {align: 'center'});
      pdf.text(nomeEmpresa, 105, 25, {align: 'center'});
      // pdf.text(dataReferencia[1] + '/' + dataReferencia[0], 105, 35, {align: 'center'});
      pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {

        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'jpg', 5, position, imgWidth - 5, imgHeight);
        // pdf.text('Saldo Individual', 105, 15, {align: 'center'});
        heightLeft -= pageHeight;
      }

      pdf.save(nomeEmpresa + '_-visualizacao-ajuste.pdf'); // Generated PDF
    });
  }
}
