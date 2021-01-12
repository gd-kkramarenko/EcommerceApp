package kkramarenko.ecommerceapp.controller;

import kkramarenko.ecommerceapp.dto.Purchase;
import kkramarenko.ecommerceapp.service.OrderService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/order")
public class OrderController {

    private OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    //todo create method to get all order details by orderTrackingNumber and collect them in Purchase object
    @GetMapping("/{trackingNumber}")
    public Purchase getOrderDetails(@PathVariable String trackingNumber){
        return orderService.getOrderDetailsByTrackingNumber(trackingNumber);
    }
}
