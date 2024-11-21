# mockAPI

This project runs API and manages their endpoints to apply coupons to an e-commerce website.

Each coupon has the following three mandatory fields-

  1- **ID**
  
  2- **Type of Coupon**
  
  3- **Details** of the coupon, which vary among the types of the coupon

An in-memory database is used to serve to store the coupons. The file **database.json** stores the array of all coupons.  To promote simplicity, a randomly initialized cart is provided to perform data manipulation.


**END-POINTS IMPLEMENTED/ PARTIALLY IMPLEMENTED:**



Implemented-
● POST /coupons: Create a new coupon with the fields/specifications provided.

● GET /coupons: Retrieve all coupons.

● GET /coupons/{id}: Retrieve a specific coupon by its ID.

● PUT /coupons/{id}: Update a specific coupon by its ID. A coupon with provided ID need to exist for this endpoint, else an **ID not found** error is thrown.

● DELETE /coupons/{id}: Delete a specific coupon by its ID. Suitable error is thrown if the ID is not found.

● POST /applicable-coupons: Fetch all applicable coupons for a given cart and
calculate the total discount that will be applied by each coupon. With the cart randomly initialized in the code(server.js), this end point returns an array of all coupon instances that are valid. This includes coupons of all types. The returned output contains coupon objects with their **ID, type and details**.


**Partially Implemented**- (the partial implementation is due to the endpoint returning the Discount value and **NOT** the updated cart.)


● POST /apply-coupon/{id}: Apply a specific coupon to the cart and **return the discount obtained**. This endpoint calculates the total discount by any type of coupon(cart-wise, product-wise or BxGy) on the given cart and returns the **numeric discount** that is achieved.
 **Note**- The discounts in the discount field of the object coupon is considered **ABSOLUTE and NOT RELATIVE(percentage)**. That is, if the discount field of a coupon object is set to 40, it means the discount available is INR(or other currency) 40 and 40%. Hence the discount returned by the API is also ABSOLUTE.

Types of Coupon:

  **Implemented-**
  
      ● Cart-wise: Apply a discount to the entire cart if the total amount exceeds a
      certain threshold.
      
      ● Product-wise: Apply a discount to specific products.
      
      ● BxGy: “Buy X, Get Y” deals can be applicable to a set
      of products, i.e. if a certain amount of product X is bought, then a provided amount of product Y is received without any cost.
      
 **Unimplemented-**
      1- Payment Method: Apply a discount if a specific payment mode is chosen.
      2- Buy X for Y% off- Apply Y% of discount on product X if a minimum number of its instances are bought.

  Error Handling is implemented to retrieve and post coupons. **Invalid Coupons cannot be applied. Also, a new coupon with a duplicate ID cannot be created.**
**Installation and Run**

Install Expressjs, bode-parser and nodemon using npm

Run nodemon ./server.js in the folder

<img width="1440" alt="Screenshot 2024-11-19 at 2 46 23 PM" src="https://github.com/user-attachments/assets/4214a496-09f8-4cfd-ba26-8e7084c3f86c">

