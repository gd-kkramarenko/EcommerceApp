import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetails } from '../common/order-details';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {

  private orderDetailsBaseUrl = 'http://localhost:8000/api/order/';

  constructor(private httpClient: HttpClient) { }

  // OrderDetail class actually is a copy of Purchase(created for convenience, since this name is more informative here)
  getOrderDetails(theOrderTrackingNumber: string): Observable<HttpResponse<OrderDetails>> {
    const orderDetailsUrl = `${this.orderDetailsBaseUrl}${theOrderTrackingNumber}`

    return this.httpClient.get<OrderDetails>(orderDetailsUrl, {observe: 'response'});
  }
}
