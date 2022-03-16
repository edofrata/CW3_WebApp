<template>

  <div>
     <div class="btn-group">
        <button type="button" class="btn-sort btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Sort By
        </button>
            <div class="dropdown-menu">
                <template v-for=" sort_option in sort_options">
                    <option v-for="(val,key) in sort_option" v-bind:key=key class="dropdown-item" @click="sort_products(key)" >{{ val }}</option>
                </template>
            </div>
    </div>

        <div class="ascending-sort" @click="ascending_selected">
            <input type="radio" id="ascending" name="horns" checked>
            <label for="horns">Ascending</label>
        </div>

        <div class="descending-sort" @click="descending_selected">
                <input type="radio" id="descending" name="horns">
                <label for="horns">Descending</label>
        </div>
        
        <!-- Search Box input -->
        <div class="search-box">
            <input class = "search-text" v-model="search_lessons" v-on:keyup="search_lesson(this)" type="text" placeholder = "Search Anything">
            <a class = "search-btn">
                <i class="fas fa-search"></i>
            </a>
        </div>
        <template v-if="searches.length > 0 && search_on">
            <div class="lesson_display">
            <div class="lessons" v-for="(search, index) in searches" :key="index">
                    <img v-bind:src="search.image">
                    <div class ="lesson-details">
                    <h2 class="product product_title" v-text="search.title"></h2>
                    <p class="product product_location">Location: {{search.location}}</p>
                    <p class="product product_price">Price: £{{search.price}}</p>
                    <p class="product product_space" v-bind="product.spaces" >Spaces: {{search.spaces}}</p>
                    <button type="button" class="btn btn-primary" v-on:click="AddToCart(index)" :disabled="!canAddToCart(index)">Add To Cart</button>
                </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="container wrapper">
        <div class="row">
            <div id="carousel-lessons" class="carousel slide"
                data-ride="carousel">
                <!-- Indicators -->
                <ol class="carousel-indicators hidden-xs">
                    <li data-target="#carousel-lessons" data-slide-to="0"
                        class="active"></li>
                    <li data-target="#carousel-lessons" data-slide-to="1"></li>
                </ol>
    
                <div class="carousel-inner hidden-xs"
                    role="listbox">
                    <div class="item active">
                        <div class="row">
                            <div class="lessons" v-for="index in 6" :key="index">
                                <img v-bind:src="product[index - 1].image">  
                                <div class ="lesson-details">
                                <h2 class="product product_title" v-text="product[index - 1].title"></h2>
                                <p class="product product_location">Location: {{product[index - 1].location}}</p>
                                <p class="product product_price">Price: £{{product[index - 1].price}}</p>
                                <p class="product product_space" v-bind="product.spaces" >Spaces: {{product[index - 1].spaces}}</p>
                                <button type="button" class="btn btn-primary" v-on:click="AddToCart([index -1])" :disabled="!canAddToCart([index-1])">Add To Cart</button>
                             </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="item">
                        <div class="row">
                            <div class="lessons" v-for="index in (product.length - 6)" :key="index" >
                                <img v-bind:src="product[index + 5].image">
                                <div class ="lesson-details">
                                <h2 class="product product_title" v-text="product[index + 5].title"></h2>
                                <p class="product product_location">Location: {{product[index + 5].location}}</p>
                                <p class="product product_price">Price: £{{product[index+5].price}}</p>
                                <p class="product product_space" >Spaces: {{product[index + 5].spaces}}</p>
                                <button type="button" class="btn btn-primary" v-on:click="AddToCart([index + 5])" :disabled="!canAddToCart([index + 5])">Add To Cart</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Controls -->
                <a href="#carousel-lessons" class="left carousel-control"
                    role="button" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left"
                        aria-hidden="true"></span>
                </a>
                <a href="#carousel-lessons" class="right carousel-control"
                    role="button" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right"
                        aria-hidden="true"></span>
                </a>
            </div>
        </div>
    </div>
    </template>

  </div>

</template>



<script>


export default({
  name: "LessonsFile",

  data: () => ({
 
      // currentPage: Lessons,
      show_products: true,
      search_on: false,
      ascending: true,
      descending: false,
      search_lessons: '',
      searches: [],
      sort_options: [
          { title: "Subject" },
          { location: "Location" },
          { price: "Price" },
          { spaces: "Availability" }],
  }),
        
    // },
  props: [

            'product',
            'canAddToCart()',
            'AddToCart()',

            // sort and search
            'ascending_selected()',
            'descending_selected()',
            'sort_products()',
            'search_lesson()',
            'search_local()'

        ],
  methods : {
    
     async search_remote(lesson) {
                try {
                    return await fetch('https://cst3145-edo.herokuapp.com/search/' + lesson, {
                        method: 'GET'
                    }).then(function (response) {
                        return response.json().then(
                            function (json) {
                                return json;
                            });
                    }).catch((err) => {
                        console.error(err);
                        return false;
                    });
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },




      AddToCart(product){
          this.$emit('AddToCart', product);
      },

      canAddToCart(item) {
            if (this.search_on) {
                return this.searches[item].spaces > 0;
            } else {
                return this.product[item].spaces  > 0;
            }

        },


        // ascending order
            ascending_selected() {
                if (!this.ascending) {
                    this.ascending = true;
                    this.descending = false;
                    this.sort_products('title')
                }

            },

            // descending order
            descending_selected: function () {
                if (!this.descending) {
                    this.descending = true;
                    this.ascending = false;
                    this.sort_products('title')
                }

            },

            // sorting array function
            sort_products: function (sort) {
                let array = !this.search_on ? this.product : this.searches;
                for (var i = 0; i < array.length; i++) {
                    for (var k = (i + 1); k < array.length; k++) {
                        let ascending = array[i][sort] > array[k][sort];
                        let descending = array[i][sort] < array[k][sort];
                        let bool = this.descending ? descending : ascending;
                        if (bool) {
                            var holder = array[i];
                            array[i] = array[k];
                            array[k] = holder;
                        }
                    }
                }
                // reloads root of vue
                this.$forceUpdate();
            },


            // function for searching 
            async search_lesson() {
                this.search_on = this.search_lessons.length > 0;
                if (!this.search_on) { return; }

                this.searches = [];
                const response = await this.search_remote(this.search_lessons);

                if (!response) {
                    this.search_local(this.search_lessons);
                    return;
                }

                for (let j = 0; j < this.product.length; j++) {
                    for (let i = 0; i < response.length; i++) {
                        if (this.product[j]._id === response[i]._id) {
                            this.searches.push(this.product[j]);
                        }
                    }
                }

            },

            // searching in local
            search_local(lesson) {
                this.searches = [];
                // in case the user inputs a space the search won't start
                if (!(/^\s*$/.test(lesson))) {
                    this.search_on = true;
                    for (var i = 0; i < this.product.length; i++) {
                        //counter for lessons found
                        let counter = 0;
                        //condition for searching just characters in a word
                        if (lesson.length < 2) {
                            for (var k = 0; k < (this.product[i].title.length + this.product[i].location.length); k++) {
                                if (lesson.toLowerCase() === this.product[i].title.charAt(k).toLowerCase() ||
                                    lesson.toLowerCase() === this.product[i].location.charAt(k).toLowerCase()) {
                                    //checking for double lessons
                                    for (var j = 0; j < this.searches.length; j++) {
                                        if (this.product[i]._id === this.searches[j]._id) {
                                            counter++;
                                        }
                                    }
                                    //if counter greater than 0 means that it has found duplicates
                                    if (counter == 0) {
                                        this.searches.push(this.product[i]);
                                    }
                                }
                            }
                        } else {
                            // searching lesson by the amount of characters input from the user
                            if (lesson.toLowerCase() === this.product[i].title.substr(0, lesson.length).toLowerCase() ||
                                lesson.toLowerCase() === this.product[i].location.substr(0, lesson.length).toLowerCase()) {
                                this.searches.push(this.product[i]);
                            }
                        }
                    }
                } else { this.search_on = false; }


            }
  }
})
</script>

<style scoped>
</style>