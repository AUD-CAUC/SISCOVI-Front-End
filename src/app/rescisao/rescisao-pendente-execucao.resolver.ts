import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ListaCalculosPendentes} from './rescisoes-pendentes/lista-calculos-pendentes';
import {RescisaoService} from './rescisao.service';

@Injectable()
export class RescisaoPendenteExecucaoResolver implements Resolve<Observable<ListaCalculosPendentes[]>> {

  constructor(private rescisaoService: RescisaoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListaCalculosPendentes[]> {
    return this.rescisaoService.getCalculosPendentesExecucao();
  }

}
