import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DespesaService } from '../../services/despesa.service';
import { Despesa } from '../../models/despesa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultar-despesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultar-despesas.component.html',
  styleUrl: './consultar-despesas.component.css'
})
export class ConsultarDespesasComponent {
  despesas: Despesa[] = [];

  constructor(private despesaService: DespesaService, private router: Router){ }

    ngOnInit(): void {
      this.carregarDespesas();
  }

  editarDespesa(despesa: Despesa): void {
    this.router.navigate(['/cadastrar', despesa.id]);
  }

  excluirDespesa(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta despesa ? ')){
      this.despesaService.excluir(id).subscribe(() => {
        alert('Despesa excluída com sucesso!');
        this.carregarDespesas();
      });
    }
  }

  carregarDespesas(): void {
    this.despesaService.listar().subscribe(despesas => {
      this.despesas = despesas;
    });
  }
}