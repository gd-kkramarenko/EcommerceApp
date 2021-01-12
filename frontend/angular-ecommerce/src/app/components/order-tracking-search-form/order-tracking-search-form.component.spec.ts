import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTrackingSearchFormComponent } from './order-tracking-search-form.component';

describe('OrderTrackingSearchFormComponent', () => {
  let component: OrderTrackingSearchFormComponent;
  let fixture: ComponentFixture<OrderTrackingSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTrackingSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTrackingSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
