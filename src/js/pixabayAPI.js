const axios = require('axios');
const API_KEY = '25818588-81f655bfb5dc7dceedfe6e773';
const BASE_URL = 'https://pixabay.com/api/';


// fetch(`${BASE_URL}?key=${API_KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true&page=5&per_page=40`)
//     .then(r => r.json())
//     .then(console.log)

export default class ApiPixabay {

    constructor() {
    this.searchQuery = '';
    this.API_KEY = API_KEY;
    this.BASE_URL = BASE_URL;
    this.page = 1;
    }
    
    fetchArticles() { 
        console.log(this);
     return   fetch(`${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
    .then(r => r.json())
            .then(data => { 
                console.log(data)
              this.incrementPage() 
                return data;
            })
    }

    incrementPage() {
    this.page += 1;
    }
     resetPage() {
    this.page = 1;
  }

     get query() {
    return this.searchQuery;
    }
    
    set query(newQuery) {
    this.searchQuery = newQuery;
  }

 };