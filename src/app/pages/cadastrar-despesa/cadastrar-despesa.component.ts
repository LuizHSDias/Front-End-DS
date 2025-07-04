import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DespesaService } from '../../services/despesa.service';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastrar-despesa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar-despesa.component.html',
  styleUrl: './cadastrar-despesa.component.css'
})
export class CadastrarDespesaComponent {

  formulario: FormGroup;

  constructor(private fb: FormBuilder, private despesaService: DespesaService, private route: ActivatedRoute, private router: Router){
    this.formulario = this.fb.group({
      id: [''], // campo opcional para identificar edição
      descricao: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      dataPagamento: ['', Validators.required],
      situacao: ['', Validators.required],
      valor: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.despesaService.buscarPorId(id).subscribe(despesa => {
        this.formulario.patchValue(despesa);
      });
    }
  }

  onSubmit(): void {
    if (this.formulario.valid){
      this.despesaService.salvar(this.formulario.value).subscribe(() => {
        alert('Despesa cadastrada com sucesso!');
        this.formulario.reset();
        this.router.navigate(['/consultar']);
      });
    }
  }

}
