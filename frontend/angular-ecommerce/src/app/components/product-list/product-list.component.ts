import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  listProducts(){

      // figuring out whether we are to search for specific products or just list them by category
      this.searchMode = this.route.snapshot.paramMap.has('keyword')

      if (this.searchMode){
          // doing search
          this.handleSearchProducts();
      } else{
        // just listing items 
        this.handleListProducts();
      }
  }

  handleSearchProducts(){
    const searchKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // now searching for the items containing keyword
    this.productService.searchProducts(searchKeyword).subscribe(
      data => { this.products = data }
    )

  }

  handleListProducts(){
      // check if id param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      // if category id is present -> read and convert to number (+'somestring' converts string to number)
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else{
      // if category id not specified -> set category id to default - 1
      this.currentCategoryId = 1;
    }

    // get products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(data => {
      this.products = data;
    })
  }

}
