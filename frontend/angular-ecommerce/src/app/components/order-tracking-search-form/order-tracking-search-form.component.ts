import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-tracking-search-form',
  templateUrl: './order-tracking-search-form.component.html',
  styleUrls: ['./order-tracking-search-form.component.css']
})
export class OrderTrackingSearchFormComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  showOrderDetails(orderTrackingNumber: string){
    this.router.navigateByUrl(`/order-details/${orderTrackingNumber}`)
  }

}
