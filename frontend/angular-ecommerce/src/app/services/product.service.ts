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

  getProductListPaginate(thePage: number,
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProducts>{
    const listProductsByCategoryPaginationUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`
    
    return this.httpClient.get<GetResponseProducts>(listProductsByCategoryPaginationUrl);
  }

  searchProductsPaginate(thePage: number,
                        thePageSize: number,
                        searchKeyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]>{
    const listProductsByCategoryUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    
    return this.getProducts(listProductsByCategoryUrl);
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
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number;

  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[]
  }
}

