import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => { this.handleProductDetails() });
  }

  handleProductDetails() {
    // get the "id" param and convert to number using + before the string
    const theProductId: number = +this.route.snapshot.paramMap.get("id");

    this.productService.getProduct(theProductId).subscribe(data => { this.product = data });
  }

  goBack(){
      this.location.back();
  }

}
