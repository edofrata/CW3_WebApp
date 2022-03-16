import { createApp } from 'vue'
import App from './App.vue'
import lesson from './components/LessonsFile.vue'

(async() => {
    const response = await fetch("https://cst3145-edo.herokuapp.com/collection/lessons");
    lesson.productList = await response.json();
    startVue();
    console.log(lesson.productList)
  })()


function startVue(){createApp(App).mount('#app')}
