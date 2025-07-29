import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importar os modelos
import { Despesa } from '../../models/despesa';
import { Receita } from '../../models/receita';
import { Categoria } from '../../models/categoria';
import { Usuario } from '../../models/usuario';

// Importar os serviços
import { DespesaService } from '../../services/despesa.service';
import { ReceitaService } from '../../services/receita.service';
import { CategoriaService } from '../../services/categoria.service';
import { UsuarioService } from '../../services/usuario.service';

// Interface para transações (Despesas e Receitas combinadas)
interface ITransacao {
  id: number;
  data: string; // ou LocalDate se preferir tratar como objeto Date
  valor: number;
  tipo: 'Crédito' | 'Débito'; // Tipo de operação financeira (interno para cálculo e cor)
  tipoOperacao: 'Receita' | 'Despesa'; // NOVO: Para exibir na coluna 'Operação'
  descricaoDetalhada: string; // NOVO: Descrição da despesa OU da categoria da receita
  categoria?: string; // Descrição da categoria
  usuario?: string; // Nome do usuário
  categoriaTipo?: string; // Tipo da categoria (Fixa, Variável, Fixo)
}

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {

  totalDespesas: number = 0;
  totalReceitas: number = 0;
  balanco: number = 0;

  listaTransacoes: ITransacao[] = []; // Lista principal de transações
  
  // Novos balanços detalhados
  balancoPorCategoria: { [key: string]: number } = {};
  balancoPorUsuario: { [key: string]: number } = {};

  // Variáveis para exibir a quantidade de registros (mantidas, mas podem ser removidas se não usadas no HTML)
  quantidadeDespesas: number = 0;
  quantidadeReceitas: number = 0;
  quantidadeCategorias: number = 0;
  quantidadeUsuarios: number = 0;

  constructor(
    private despesaService: DespesaService,
    private receitaService: ReceitaService,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.carregarDadosExtrato();
  }

  carregarDadosExtrato(): void {
    let despesasCarregadas: Despesa[] = [];
    let receitasCarregadas: Receita[] = [];

    // Carregar Despesas
    this.despesaService.listar().subscribe({
      next: (despesas: Despesa[]) => {
        despesasCarregadas = despesas;
        this.totalDespesas = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
        this.quantidadeDespesas = despesas.length;
        this.combinarEOrdenarTransacoes(despesasCarregadas, receitasCarregadas);
      },
      error: (err) => {
        console.error('Erro ao carregar despesas:', err);
        alert('Erro ao carregar o total de despesas.');
      }
    });

    // Carregar Receitas
    this.receitaService.listar().subscribe({
      next: (receitas: Receita[]) => {
        receitasCarregadas = receitas;
        this.totalReceitas = receitas.reduce((sum, r) => sum + (r.valor || 0), 0);
        this.quantidadeReceitas = receitas.length;
        this.combinarEOrdenarTransacoes(despesasCarregadas, receitasCarregadas);
      },
      error: (err) => {
        console.error('Erro ao carregar receitas:', err);
        alert('Erro ao carregar o total de receitas.');
      }
    });

    // Carregar quantidades de Categorias e Usuários (se ainda forem necessárias para o resumo)
    this.categoriaService.listar().subscribe({
      next: (categorias: Categoria[]) => {
        this.quantidadeCategorias = categorias.length;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias para resumo:', err);
      }
    });

    this.usuarioService.listar().subscribe({
      next: (usuarios: Usuario[]) => {
        this.quantidadeUsuarios = usuarios.length;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários para resumo:', err);
      }
    });
  }

  // Método para combinar e ordenar as transações
  private combinarEOrdenarTransacoes(despesas: Despesa[], receitas: Receita[]): void {
    const transacoes: ITransacao[] = [];

    // Mapear Despesas para ITransacao
    despesas.forEach(d => {
      transacoes.push({
        id: d.id,
        data: d.dataPagamento?.toString() || d.dataVencimento?.toString() || '',
        valor: d.valor || 0,
        tipo: 'Débito', // Tipo financeiro (interno)
        tipoOperacao: 'Despesa', // Tipo para exibição
        descricaoDetalhada: d.descricao ?? '', // Descrição da despesa
        categoria: d.categoria?.descricao,
        usuario: d.usuario?.nome,
        categoriaTipo: d.categoria?.tipo
      });
    });

    // Mapear Receitas para ITransacao
    receitas.forEach(r => {
      transacoes.push({
        id: r.id,
        data: r.dataEntrada?.toString() || '',
        valor: r.valor || 0,
        tipo: 'Crédito', // Tipo financeiro (interno)
        tipoOperacao: 'Receita', // Tipo para exibição
        descricaoDetalhada: r.categoria?.descricao ?? '', // Descrição da categoria da receita
        categoria: r.categoria?.descricao,
        usuario: r.usuario?.nome,
        categoriaTipo: r.categoria?.tipo
      });
    });

    // Ordenar por data (do mais recente para o mais antigo)
    this.listaTransacoes = transacoes.sort((a, b) => {
      if (a.data < b.data) return 1;
      if (a.data > b.data) return -1;
      return 0;
    });

    this.calcularBalanco();
    this.calcularBalancoDetalhado();
  }

  calcularBalanco(): void {
    this.balanco = this.totalReceitas - this.totalDespesas;
  }

  // Método para calcular balanços por categoria e por usuário
  calcularBalancoDetalhado(): void {
    this.balancoPorCategoria = {};
    this.balancoPorUsuario = {};

    this.listaTransacoes.forEach(transacao => {
      const valor = transacao.tipo === 'Crédito' ? transacao.valor : -transacao.valor;

      // Balanço por Categoria
      if (transacao.categoria) {
        if (!this.balancoPorCategoria[transacao.categoria]) {
          this.balancoPorCategoria[transacao.categoria] = 0;
        }
        this.balancoPorCategoria[transacao.categoria] += valor;
      }

      // Balanço por Usuário
      if (transacao.usuario) {
        if (!this.balancoPorUsuario[transacao.usuario]) {
          this.balancoPorUsuario[transacao.usuario] = 0;
        }
        this.balancoPorUsuario[transacao.usuario] += valor;
      }
    });
  }
}