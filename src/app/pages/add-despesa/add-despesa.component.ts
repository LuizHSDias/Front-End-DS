import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DespesaService } from '../../services/despesa.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-despesa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-despesa.component.html',
  styleUrl: './add-despesa.component.css'
})
export class AddDespesaComponent {

  formGroup: FormGroup;
  listaCategorias: Categoria[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private despesaService: DespesaService,
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      dataPagamento: ['', Validators.required],
      situacao: ['', Validators.required],
      valor: [null, Validators.required],
      categoria: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarListaCategoria();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.despesaService.buscarPorId(id).subscribe(retorno => {
        const categoriaSelecionada = this.listaCategorias.find(cat => cat.id === retorno.categoria?.id);
        this.formGroup.patchValue({
          descricao: retorno.descricao,
          dataVencimento: retorno.dataVencimento,
          dataPagamento: retorno.dataPagamento,
          situacao: retorno.situacao,
          valor: retorno.valor,
          categoria: categoriaSelecionada
        });
      });
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.despesaService.salvar(this.formGroup.value).subscribe({
        next: () => {
          alert('Registro salvo com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/despesas']);
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });
    }
  }

  carregarListaCategoria(): void {
    this.categoriaService.listar().subscribe({
      next: (retorno) => {
        this.listaCategorias = retorno;
      },
      error: () => {
        alert('Erro ao carregar a lista de categorias.');
      }
    });
  }

}
