const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require("fs"); 
const file="database.json";
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

var cart={"cart": {
                  "items": [
                            {"product_id": 1, "quantity": 6, "price": 50}, // Product X
                            {"product_id": 2, "quantity": 3, "price": 30}, // Product Y
                            {"product_id": 3, "quantity": 2, "price": 25} // Product Z
                            ]
                  }}


app.get('/coupons', (req, res) => {
  var data=fs.readFileSync(file);
  res.json(JSON.parse(data)); 
});

app.get('/coupons/:id', (req, res) => {
  var id =parseInt(req.params.id)
  var data=fs.readFileSync(file);
  const list=JSON.parse(data);
  const result=list.find(item=>item.id === id);
  if(result)
  res.json(result);
  else 
  res.json("ID not found"); 
});

app.put('/coupons/:id',(req,res) =>{
  var id=parseInt(req.params.id);
  var data=fs.readFileSync(file);
  const list=JSON.parse(data);
  const coupon=list.findIndex(item => item.id ===id);
  var newCoupon=req.body;
  if (coupon === -1) {
    return res.status(404).send('Item not found');
  }
  list.splice(coupon, 1);
  list.push(newCoupon);
  fs.writeFile(file, JSON.stringify(list), (err) => {
    if (err) throw err;
    console.log("New data added");
  }); 
  res.json(list);
});

app.delete('/coupons/:id',(req,res) =>{
  var id=parseInt(req.params.id);
  var data=fs.readFileSync(file);
  const list=JSON.parse(data);
  const coupon=list.findIndex(item => item.id ===id);
  if (coupon === -1) {
    return res.status(404).send('Item not found');
  }
  list.splice(coupon, 1);
  fs.writeFile(file,JSON.stringify(list),(err) => {
    if (err) throw err;
    console.log("New data added");
  });
  res.json({});
});

app.post('/coupons', (req, res) => {
  const newCoupon=req.body;
  var data1=JSON.parse(fs.readFileSync(file));
  for (var i = data1.length - 1; i >= 0; i--) {
    if(data1[i].id==newCoupon.id)
      res.send("Coupon with given ID exists");
  }
  data1.push(newCoupon);
  fs.writeFile(file, JSON.stringify(data1), (err) => {
    if (err) throw err;
    console.log("New data added");
  });
  res.send(data1); 
});

app.post('/applicable-coupons',(req,res) => {
  let result=[];
  var data=fs.readFileSync(file);
  var coupons=JSON.parse(data);


  //cart-wise
  let cartPrice=0;
  for (var i = cart.cart.items.length - 1; i >= 0; i--) {
    cartPrice+=cart.cart.items[i].price*cart.cart.items[i].quantity;
  }
  var appCoupons=coupons.filter(item => item.type=="cart-wise"&&item.details.threshold<=cartPrice);
  if(result!=[])result.push(appCoupons);

  //product-wise
  for (let i = 0; i < cart.cart.items.length; i++) {
    appCoupons=coupons.filter(item =>item.type=="product-wise"&&item.details.product_id==cart.cart.items[i].product_id);
    if(result!=[])result.push(appCoupons);
  }

  //bxgy
  coupons=coupons.filter(item => item.type ==="bxgy");
  for (var ij = coupons.length - 1; ij >= 0; ij--) {
    var items=coupons[ij].details.buy_products;
    var notify=0;
    for (var i = items.length - 1; i >= 0; i--) {
      var item=items[i];
      var flag=0;
      for(var j=cart.cart.items.length-1;j>-1;j--)
      {
          console.log(item);
        if (item.product_id==cart.cart.items[j].product_id && item.quantity<=cart.cart.items[j].quantity)
          {
          flag=1;
          break;
          }
        }
        if(flag==1)
          {notify++;}
    }
      if(notify==items.length)
        result.push(coupons[ij]);
  }
  res.send(result);
});

app.post('/apply-coupon/:id', (req, res) => {
  var id =parseInt(req.params.id)
  var data=fs.readFileSync(file);
  const list=JSON.parse(data);
  const result=list.find(item=>item.id === id);
  var coupon=0;
  if(result){
    var type=result.type;
    let cartPrice=0;
      for (var i = cart.cart.items.length - 1; i >= 0; i--) {
        cartPrice+=cart.cart.items[i].price*cart.cart.items[i].quantity;
        }
    if(type=="cart-wise"){
        if(result.details.threshold<=cartPrice)
          {coupon=result.details.discount;
           var newPrice=cartPrice-coupon;
            res.json({"Discount":coupon,"Initial Cart Value":cartPrice,"Updated Cart Value":newPrice});}
        else
    return res.status(404).send('Invalid Coupon');
    }
    else if(type=="product-wise"){
      for (var i = cart.cart.items.length - 1; i >= 0; i--) {
        console.log(cart.cart.items[i].product_id);
        if(cart.cart.items[i].product_id==result.details.product_id)
          coupon=result.details.discount;
        // else{
        //   res.send('Invalid Coupon');
        // }
      }
      if(coupon==0)
        res.send('Invalid Coupon');
      else var newPrice=cartPrice-coupon;
            res.json({"Discount":coupon,"Initial Cart Value":cartPrice,"Updated Cart Value":newPrice});
    }
        else{
          var buy_products=result.details.buy_products;
          var get_products=result.details.get_products;
          if(cartContains(buy_products))
          {
            for (var i = get_products.length - 1; i >= 0; i--) {
              var pid=get_products[i].product_id;
              var pq=get_products[i].quantity;
              for (var i = cart.cart.items.length - 1; i >= 0; i--) {
                if(cart.cart.items[i].product_id==pid && cart.cart.items[i].quantity>=pq)
                  coupon+= pq*cart.cart.items[i].price;
              }
            } var newPrice=cartPrice-coupon;
            res.json({"Discount":coupon,"Initial Cart Value":cartPrice,"Updated Cart Value":newPrice});
          }
          else
            res.send("Invalid Coupon");
        }
  }
  else 
  res.json("Coupon does not exist"); });



function cartContains(buy_products){
  var flag=0;
  for (var i = buy_products.length - 1; i >= 0; i--) {
    for (var j = cart.cart.items.length - 1; j >= 0; j--) {
      if(cart.cart.items[j].product_id==buy_products[i].product_id && cart.cart.items[j].quantity>=buy_products[i].quantity)
        flag++;
    }
  }
  if(flag==buy_products.length)


  return true;
else
  return false;
}


