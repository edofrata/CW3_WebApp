<template>
     
     <div>
        <p class ="price" v-bind:price="shopping_price"><strong>TOTAL: £{{shopping_price()}} </strong></p>
        <div class="shopping-list">
           <div class="lessons cart" v-bind:key=index v-for="(carts, index) in cart">
                <img v-bind:src="carts.image">
             <div class ="lesson-details">
                <h2 class="product product_title" v-text="carts.title"></h2>
                <p class="product product_location">Location: {{carts.location}}</p>
                <p class="product product_price">Price: £{{carts.price}}</p>
                <p class="product product_space" >Booked: {{bookings(index)}}</p>
                <button type="button" class="btn-remove btn-danger" @click='productRemove(index)'>Remove</button>
             </div>
            </div>
            
        <!-- customer checkout  -->
        </div>
        <div class="customer-checkout">
            <h2> Order Information </h2>
            <p class="order_details"><strong>Full Name</strong></p>
            <input id="name_checkout" v-on:keyup="check_name(this)" class="order_input" v-model="order.full_name"/>
            <p class="order_details"><strong>Phone Number</strong></p>
            <input id="phone_checkout"  v-on:keyup="check_phone(this)" class="order_input" v-model="order.phone_number"/>
            <button type="button" id="btn-submit" @click='submitOrder()' class="btn btn-success" :disabled="!check_name(order.full_name) || !check_phone(order.phone_number) || cart.length <= 0">Submit Order</button>
        </div>
        
    </div>

</template>



<script>

export default({
    name: "CheckoutFile",
    props:[
            'cart',
            'product',
            'check_name()',
            'check_phone()'
        ],
    data: () => ({

      order: {
          full_name: '',
          phone_number: '',
          price: '',
          lessons_booked: [],
      } 

    }),

    methods: {

            productRemove(index){
                this.$emit('productRemove', index);
            },

            submitOrder(){
                this.$emit('submitOrder')
            },

            shopping_price() {
                let price = 0;
                for (var i = 0; i < this.product.length; i++) {
                    price += (this.product[i].booking * this.product[i].price);
                }
                return price;
            },
            
            // checks the name to be only letters
            check_name() {
                var letters = new RegExp(/^[A-Za-z]+ [A-Za-z]+$/);
                return letters.test(this.order.full_name);
            },

                // checks the phone number to be only numbers
            check_phone() {
                var digits = new RegExp(/^\d+$/);
                return digits.test(this.order.phone_number) && this.order.phone_number.length == 11;
            },

                // retrieves number of bookings for the lesson
            bookings(index) {
                for (var i = 0; i < this.product.length; i++) {
                    if (this.cart[index].title === this.product[i].title) {
                        return this.product[i].booking;
                    }
                }
            },

            

            
            
    }

    
})
</script>

<style scoped>

</style>
