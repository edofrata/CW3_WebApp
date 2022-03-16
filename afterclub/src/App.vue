<template>
  <div id="app">
    <head>
        <title> {{sitename}} </title>
        <link rel="stylesheet" href="../css/style.css">
        <link rel="stylesheet" href="../css/moon_walk.css">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css" integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog==" crossorigin="anonymous" />
    </head>

     <body>
            <img class="title" v-bind:src="siteimage">
            <div class="lesson_box">
                <!-- checkout button -->
               <button type="button" class="btn-checkout btn-primary" @click="showPage" v-if="cart.length > 0 || show_products == false" > {{cartItemCount()}} <img class="checkout-img" src="https://cst3145-edo.herokuapp.com/images/order.png"></button>
               
                <main>
                    <div v-if="show_products">
                         <lessons-file :product="product" @AddToCart ='addProduct'></lessons-file>
                    </div>
                    
                    <div v-else>
                        <checkout :product="product" @submitOrder='submit_order' @productRemove='item_remove' :cart="cart"></checkout>
                    </div>
                </main>
            </div>
         </body>
    </div>

</template>

   
  
<script>
import lessonsFile from './components/LessonsFile.vue';
import Checkout from './components/CheckoutFile.vue';

export default {
  name: 'App',
  components: { 
    lessonsFile,
    Checkout,  
  },
 
  data(){ 
    return {  
      sitename : "Lessons Club", 
      siteimage: 'https://cst3145-edo.herokuapp.com/images/logo.png',
      cart : [],
      product : [],
    //   currentPage : lessonsFile,
      show_products : true,
   
    }   
  },

  props: ['addProduct()', 'no_double()', 'Update()',' cartItemCount()', 'showPage()' ],  
  
  created(){
    this.product = lessonsFile.productList;
  },

  methods : {
     
     //fetch wich will update a lesson
      Update: function (id, index_obj) {
          fetch("https://cst3145-edo.herokuapp.com/collection/lessons/" + id, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.product[index_obj]),
          })
              .then(response => response.json())
      },

          // adding a product
            Order: function (collection, order) {
                fetch("https://cst3145-edo.herokuapp.com/collection/" + collection, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(order),
                })
                    .then(response => response.json())
            },

       // changing the current page attribute
            showPage() {
                // this.currentPage = this.currentPage === lessonsFile ? Checkout : lessonsFile;
                this.show_products = this.show_products ? false : true;
            },

        // adds the product to the cart
        addProduct: function (item) {
            if (this.search_on) {
                for (var i = 0; i < this.product.length; i++) {
                    if (this.searches[item]._id === this.product[i]._id) { this.no_double(i); }
                }
            } else { this.no_double(item); }

        },

           no_double(item) {

              let count = 0;
              // check the length of the cart, if 0 emans that it is empty
              if (this.cart.length > 0) {
                  for (let i = 0; i < this.cart.length; i++) {
                      // if the in the cart is equqal to the product sent means that it is already in the cart
                      if (this.cart[i]._id === this.product[item]._id) {
                          count++;
                          this.product[item].spaces--;
                          this.product[item].booking++;
                      }
                  }
                  // if the count is still 0 means no double was found and can add to the cart
                  if (count == 0) {
                      this.cart.push(this.product[item]);
                      this.product[item].spaces--;
                      this.product[item].booking++;
                  }
              } else {
                  this.cart.push(this.product[item]);
                  this.product[item].spaces--;
                  this.product[item].booking++;
              }
          },

           cartItemCount: function () {
                let sum = 0;
                if (this.cart.length > 0) {
                    for (let i = 0; i < this.product.length; i++) {
                        sum += this.product[i].booking;
                    }
                    return sum;

                } else { return sum; }

            },

              //item remove and adds back the items
            item_remove(item) {
                for (var i = 0; i < this.product.length; i++) {
                    if (this.product[i]._id === this.cart[item]._id) {
                        this.product[i].booking--;
                        this.product[i].spaces++;
                        if (this.product[i].booking < 1) {
                            this.cart.splice(item, 1);
                            break;
                        }

                    }
                }

            },


             //  submit order function 
            submit_order() {

                if (Checkout.check_name() && Checkout.check_phone()) {
                    Checkout.order.lessons_booked.push(this.cart);
                    Checkout.order.price = Checkout.shopping_price();
                    for (let i = 0; i < this.cart.length; i++) {
                        let booking = this.product.map(function (x) { return x._id; }).indexOf(this.cart[i]._id);
                        this.Update(this.cart[i]._id, booking);
                    }
                    this.Order("orders", this.order); //fetches the order to the orders collection
                    alert('SUCCESS! Your Order went through');

                    // clearing up all variables
                    Checkout.order.full_name = '';
                    Checkout.order.phone_number = '';
                    Checkout.order.price = '';
                    Checkout.order.lessons_booked = [];
                    this.cart = [];
                    // setting bookings back to 0
                    for (var i = 0; i < this.product.length; i++) {
                        this.product[i].booking = 0;
                    }
                    this.showPage();
                } else { alert('ERROR! Something went wrong'); }
            }
  }
}
</script>
 
<style scoped>
</style>
