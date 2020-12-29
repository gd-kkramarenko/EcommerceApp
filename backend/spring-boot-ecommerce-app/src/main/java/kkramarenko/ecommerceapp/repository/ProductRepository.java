package kkramarenko.ecommerceapp.repository;

import kkramarenko.ecommerceapp.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Spring generates endpoint for that method - .../api/products/search/findByCategoryId?id=2

    Page<Product> findByCategoryId(@RequestParam("id") Long id,Pageable pageable);


    // Spring generates a method that returns products with name that matches "%name%", name is specified in url param
    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);
}
