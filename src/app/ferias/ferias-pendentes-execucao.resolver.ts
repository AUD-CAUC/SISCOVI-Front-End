import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ListaCalculosPendentes} from './ferias-pendentes/lista-calculos-pendentes';
import {FeriasService} from './ferias.service';

@Injectable()
export class FeriasPendentesExecucaoResolver implements  Resolve<Observable<ListaCalculosPendentes[]>> {

  constructor(private feriasService: FeriasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListaCalculosPendentes[]> {
    return this.feriasService.getCalculosPendentesExecucao();
  }


}
