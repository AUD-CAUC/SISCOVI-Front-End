import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ConfigService} from '../_shared/config.service';


@Injectable()
export class SaldoService {
    constructor(private http: Http, private config: ConfigService) {}
    protected encapsulaDatas(value: any): Date {
        const a = value.split('/');
        const dia = Number(a[0]);
        const mes = Number(a[1]) - 1;
        const ano = Number(a[2]);
        return new Date(ano, mes, dia);
    }
    getSaldoFuncao(codigoContrato: number) {
        const url = this.config.myApi + '/saldo/getSaldoFuncao/' + codigoContrato + '/' + this.config.user.id;
        return this.http.get(url).map(res => res.json());
    }
    getSaldoIndividual(codigoContrato: number) {
        const url = this.config.myApi + '/saldo/getSaldoIndividual/' + codigoContrato;
        return this.http.get(url).map(res => res.json());
    }
}
