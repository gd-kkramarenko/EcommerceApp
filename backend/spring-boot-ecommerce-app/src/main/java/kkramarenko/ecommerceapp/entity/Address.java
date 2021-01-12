package kkramarenko.ecommerceapp.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "country")
    private String country;

    @Column(name = "state")
    private String state;

    @Column(name = "city")
    private String city;

    @Column(name = "street")
    private String street;

    @Column(name = "zipCode")
    private String zipCode;

    //todo check if this works as intended(write data to db when posted, but excluded from JSON when get())
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToOne
    @PrimaryKeyJoinColumn
    private Order order;


}
