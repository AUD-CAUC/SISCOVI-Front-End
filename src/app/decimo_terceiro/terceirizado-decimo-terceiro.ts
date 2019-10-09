import {ValorDecimoTerceiro} from './valor-decimo-terceiro';

export class TerceirizadoDecimoTerceiro {
    codigoTerceirizadoContrato: number;
    nomeTerceirizado: string;
    inicioContagem: Date;
    valorDisponivel: number;
    tipoRestituicao: string;
    valorMovimentado: number;
    parcelas: number;
    valoresDecimoTerceiro: ValorDecimoTerceiro;
    nomeCargo: string;
    fimContagem: Date;
    private id: String;
    emAnalise: boolean;
    restituidoAnoPassado: boolean;
    parcelaAnterior: string;

    constructor(codigoTerceirizadoContrato: number, nomeTerceirizado: string, inicioContagem: Date, valorDisponivel: number, valorMovimentado: number, parcelas: number) {
        this.codigoTerceirizadoContrato = codigoTerceirizadoContrato;
        this.nomeTerceirizado = nomeTerceirizado;
        this.inicioContagem = inicioContagem;
        this.valorDisponivel = valorDisponivel;
        this.valorMovimentado = valorMovimentado;
        this.parcelas = parcelas;
    }
    public setNomeTerceirizado(nomeTerceirizado: string) {
        this.nomeTerceirizado = nomeTerceirizado;
    }
    public setValoresDecimoTerceiro(valores: ValorDecimoTerceiro) {
        this.valoresDecimoTerceiro = valores;
    }
}
