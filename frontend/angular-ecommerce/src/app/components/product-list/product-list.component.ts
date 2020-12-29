import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // properties for pagination

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  
  previousKeyword: string = null;


  constructor(private productService: ProductService,
              private cartService: CartService,
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

    // if we have a different category id than previous, than set pageNumber back to 1
    if(this.previousKeyword != searchKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = searchKeyword;

    // now searching for the items containing keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               searchKeyword).subscribe(this.processResult())

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

    // check if we have a different category than previous
    // This may happens because Angular reuses components that are currently viewed
    
    // if we have a different category id than previous, than set pageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // get products for the given category id with pagination
    // pageNumber - 1 because in Spring pages are 0-based, in Angular pages are 1-based
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
  }

  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements= data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
