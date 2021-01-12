package kkramarenko.ecommerceapp.service;

import kkramarenko.ecommerceapp.dto.Purchase;

public interface OrderService {

    Purchase getOrderDetailsByTrackingNumber(String orderTrackingNumber);
}
