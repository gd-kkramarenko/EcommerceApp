package kkramarenko.ecommerceapp.service;

import kkramarenko.ecommerceapp.dto.Purchase;
import kkramarenko.ecommerceapp.entity.Address;
import kkramarenko.ecommerceapp.entity.Customer;
import kkramarenko.ecommerceapp.entity.Order;
import kkramarenko.ecommerceapp.entity.OrderItem;
import kkramarenko.ecommerceapp.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class OrderServiceImpl implements OrderService {

    private OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Purchase getOrderDetailsByTrackingNumber(String orderTrackingNumber) {

        // create new Purchase
        Purchase currentPurchase = new Purchase();

        // get Order by trackingNumber, set to purchase
        Order currentOrder = orderRepository.findByOrderTrackingNumber(orderTrackingNumber);
        currentPurchase.setOrder(currentOrder);

        // get customer from order, set to purchase
        Customer currentCustomer = currentOrder.getCustomer();
        currentPurchase.setCustomer(currentCustomer);

        // get shipping and billing Addresses from order, set to purchase
        Address currentShippingAddress = currentOrder.getShippingAddress();
        Address currentBillingAddress = currentOrder.getBillingAddress();
        currentPurchase.setShippingAddress(currentShippingAddress);
        currentPurchase.setBillingAddress(currentBillingAddress);

        // get Set of orderItems, set to purchase
        Set<OrderItem> currentItems = currentOrder.getOrderItems();
        currentPurchase.setOrderItems(currentItems);

        // return set up purchase
        return currentPurchase;
    }
}
