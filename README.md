# EcommerceApp
Now we can save the order in the database(backend):

created 4 new tables in db, entities for them, repository for Customer,
service and controller.

We have http://localhost:8000/api/checkout/purchase endpoint, accepting http POST with JSON Body of DTO

We need only 1 JpaRepo for Customer, since through customer we may access any entities, and we use cascading to save all the related info, such as Items, order, etc. as we save Customer to db.
Cascading will handle saving all related entities 
