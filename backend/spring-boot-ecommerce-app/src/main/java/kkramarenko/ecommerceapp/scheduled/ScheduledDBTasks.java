package kkramarenko.ecommerceapp.scheduled;

import kkramarenko.ecommerceapp.entity.Order;
import kkramarenko.ecommerceapp.enums.OrderStatusEnum;
import kkramarenko.ecommerceapp.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.time.Duration;
import java.util.Date;
import java.util.List;

@Component
@Transactional
public class ScheduledDBTasks {

    private OrderRepository orderRepository;

    public ScheduledDBTasks(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 1800000 milliseconds = 30 mins, task runs once in half an hour
    @Scheduled(fixedRate = 1800000)
    public void checkOrderStatus(){

        //get all orders
        List<Order> orders = orderRepository.findAll();

        //iterate through orders, check last_updated column:
        for(Order tempOrder: orders){
            //get order status
            //since some statuses were stored lowercase, convert to UpperCase
            OrderStatusEnum orderStatus = OrderStatusEnum.valueOf(tempOrder.getStatus().toUpperCase());

            //get current Date
            Date currentDate = new Date();

            //get order last updated Date
            Date lastUpdatedDate = tempOrder.getLastUpdated();

            //delta between these Dates in hours
            Duration delta = Duration.between(lastUpdatedDate.toInstant(), currentDate.toInstant());
            long hoursFromLastUpdate = delta.toHours();

            //if order was last updated more than 24h ago, and is not completed yet, then update its status to next in enum
            if (hoursFromLastUpdate >= 24 && !(orderStatus.equals(OrderStatusEnum.COMPLETED))){
                switch (orderStatus){
                    case CREATED:
                        orderStatus = OrderStatusEnum.PROCESSING;
                    case PROCESSING:
                        orderStatus = OrderStatusEnum.SHIPPING;
                    case SHIPPING:
                        orderStatus = OrderStatusEnum.COMPLETED;
                }
            }
            //change order status
            tempOrder.setStatus(orderStatus.toString());

            //save order
            orderRepository.save(tempOrder);
        }


    }
}
