import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  ProductsByCategoryComponent } from './categoria.component';

describe('CategoriaComponent', () => {
  let component: ProductsByCategoryComponent;
  let fixture: ComponentFixture<ProductsByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsByCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
