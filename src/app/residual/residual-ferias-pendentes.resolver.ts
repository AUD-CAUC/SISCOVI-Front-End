import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ListaCalculosPendentes} from './residuais-pendentes/lista-calculos-pendentes';
import {ResidualService} from './residual.service';

@Injectable()
export class ResidualFeriasPendentesResolver implements Resolve<Observable<ListaCalculosPendentes[]>> {

  constructor(private residualService: ResidualService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ListaCalculosPendentes[]> {
    return this.residualService.getCalculosPendentes();
  }

}
