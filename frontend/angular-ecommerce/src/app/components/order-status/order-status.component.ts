import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderDetails } from 'src/app/common/order-details';
import { OrderStatusService } from 'src/app/services/order-status.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {

  constructor(private orderStatusService: OrderStatusService,
              private route: ActivatedRoute) { }

  orderDetails: OrderDetails = new OrderDetails();

  requestStatusCode: number;

  orderStatus: string;

  // creating strings with all data about customer, address, etc.(for convenient use in html)
  customerInfo: string = '';
  shippingAddressInfo: string = '';


  orderTrackingNumber: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => { this.getOrderDetails() });
  }

  getOrderDetails(){
    // get the tracking number from param
    const currentOrderTrackingNumber: string = this.route.snapshot.paramMap.get("orderTrackingNumber");
    this.orderTrackingNumber = currentOrderTrackingNumber;

    // get the status code: if it's not 200(Status code == OK), then show user message that tracking number doesn't exist
    this.orderStatusService.getOrderDetails(currentOrderTrackingNumber).subscribe(response => {
        this.requestStatusCode = response.status;
        this.orderDetails = response.body;
        this.orderStatus = this.orderDetails.order.status;
    });


  }

}
