import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Despesa } from '../models/despesa';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  private apiUrl = 'http://localhost:8080/despesas';

  constructor(private http: HttpClient) { }

  listar(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(this.apiUrl);
  }

  salvar(despesa: Despesa): Observable<Despesa> {
    if (despesa.id){
      return this.http.put<Despesa>(`${this.apiUrl}/${despesa.id}`, despesa);
    } else {
      return this.http.post<Despesa>(this.apiUrl, despesa);
    }
  }

  buscarPorId(id: number){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
