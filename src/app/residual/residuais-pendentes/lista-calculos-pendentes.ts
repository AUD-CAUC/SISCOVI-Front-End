import {ResiduaisCalculosPendentes} from './residuais-calculos-pendentes';
import {TerceirizadoResiduaisMovimentacaoFerias} from '../calculo-residuais/terceirizado-residuais-movimentacao';

export class ListaCalculosPendentes {
  titulo: string;
  codigo: number;
  calculosFerias: TerceirizadoResiduaisMovimentacaoFerias[];
}
