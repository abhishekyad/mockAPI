# mockAPI

This project runs API and manages their endpoints to apply coupons to an e-commerce website.

Each coupon has the following three mandatory fields-

  1- ID
  
  2- Type of Coupon
  
  3- Details of the coupon
  

An in-memory database is used to serve to store the coupons.  
END-POINTS:

● POST /coupons: Create a new coupon.

● GET /coupons: Retrieve all coupons.

● GET /coupons/{id}: Retrieve a specific coupon by its ID.

● PUT /coupons/{id}: Update a specific coupon by its ID.

● DELETE /coupons/{id}: Delete a specific coupon by its ID.

● POST /applicable-coupons: Fetch all applicable coupons for a given cart and
calculate the total discount that will be applied by each coupon.

● POST /apply-coupon/{id}: Apply a specific coupon to the cart and return the
updated cart with discounted prices for each item.


Types of Coupon:

  Implemented-
  
      ● Cart-wise: Apply a discount to the entire cart if the total amount exceeds a
      certain threshold.
      
      ● Product-wise: Apply a discount to specific products.
      
      ● BxGy: “Buy X, Get Y” deals with a repetition limit and can be applicable to a set
      of products
      
  Unimplemented-
      Payment Method: Apply a discount if a specific payment mode is chosen.
**Installation and Run**

Install Expressjs, bode-parser and nodemon using npm

Run nodemon ./server.js in the folder
