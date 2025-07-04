import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDespesasComponent } from './consultar-despesas.component';

describe('ConsultarDespesasComponent', () => {
  let component: ConsultarDespesasComponent;
  let fixture: ComponentFixture<ConsultarDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarDespesasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultarDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
