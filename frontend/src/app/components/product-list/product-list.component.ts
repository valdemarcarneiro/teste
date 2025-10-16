import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  columns: PoTableColumn[] = [
    { property: 'name', label: 'Name' },
    { property: 'description', label: 'Description' },
    { property: 'price', label: 'Price', type: 'currency', format: 'BRL' }
  ];
  actions: PoTableAction[] = [
    { action: this.editProduct.bind(this), label: 'Edit', icon: 'po-icon-edit' },
    { action: this.deleteProduct.bind(this), label: 'Delete', icon: 'po-icon-delete', type: 'danger' }
  ];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  deleteProduct(item: { id: number }): void {
    this.productService.deleteProduct(item.id).subscribe(() => {
      this.loadProducts();
    });
  }

  editProduct(item: { id: number }): void {
    this.router.navigate(['/products/edit', item.id]);
  }

  addProduct(): void {
    this.router.navigate(['/products/new']);
  }
}
