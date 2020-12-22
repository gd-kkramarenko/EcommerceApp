import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = 'http://localhost:8000/api/products';
  private categoryUrl = 'http://localhost:8000/api/product-category'

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`

    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(categoryId: number): Observable<Product[]>{
    const listProductsByCategoryUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    
    return this.getProducts(listProductsByCategoryUrl);
  }

  searchProducts(searchKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchKeyword}`;

    return this.getProducts(searchUrl);
  }

  getProducts(Url: string): Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(Url).pipe(map(response => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(map(response => response._embedded.productCategory));
  }

  
}

interface GetResponseProducts{
  _embedded: {
    products: Product[]
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[]
  }
}

