import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {ListaCalculosPendentes} from './ferias-pendentes/lista-calculos-pendentes';
import {FeriasService} from './ferias.service';

@Injectable()
export class FeriasResolver implements Resolve<Observable<ListaCalculosPendentes[]>> {

  constructor(private feriasService: FeriasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListaCalculosPendentes[]> {
    return this.feriasService.getCalculosPendentes();
  }

}
