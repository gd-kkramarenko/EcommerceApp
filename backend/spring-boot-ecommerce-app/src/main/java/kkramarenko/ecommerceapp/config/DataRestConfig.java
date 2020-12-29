package kkramarenko.ecommerceapp.config;

import kkramarenko.ecommerceapp.entity.Country;
import kkramarenko.ecommerceapp.entity.Product;
import kkramarenko.ecommerceapp.entity.ProductCategory;
import kkramarenko.ecommerceapp.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {


        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //disable HTTP methods for Product: PUT, POST, DELETE
        disableHttpMethods(Product.class, config, theUnsupportedActions);


        //disable HTTP methods for ProductCategory: PUT, POST, DELETE
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        //disable HTTP methods for Country: PUT, POST, DELETE
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        //disable HTTP methods for State: PUT, POST, DELETE
        disableHttpMethods(State.class, config, theUnsupportedActions);

        // call aninternal helper method
        exposeIds(config);
    }

    private void disableHttpMethods(Class targetClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(targetClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {

        // expose entity ids

        // get a list of all entity classes
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // create anarray of entity types
        List<Class> entityClasses = new ArrayList<>();

        // get entity types for entities
        for(EntityType tempEntityType: entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        // expose entity ids for the array of entities/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
