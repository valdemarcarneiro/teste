import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    EditorModule,
    ButtonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      descricao: ['', Validators.required],
      quantidadeEmEstoque: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.produtoService.getProduto(this.productId).subscribe((produto) => {
        this.productForm.patchValue(produto);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const produto: Produto = this.productForm.value;
      if (this.isEditMode && this.productId) {
        produto.id = this.productId;
        this.produtoService.updateProduto(this.productId, produto).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.produtoService.createProduto(produto).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
    }
  }
}
