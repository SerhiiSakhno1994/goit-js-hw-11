import './css/styles.css';
import ApiPixabay from './js/pixabayAPI';
import hitsTpl from './hits.hbs';
import Notiflix from 'notiflix';


const refs = {
  searchForm: document.querySelector('.js-search-form'),
    articlesContainer: document.querySelector('.js-articles-container'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const newApiPixabay = new ApiPixabay();

    



refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);




function onSearch(e) {
    e.preventDefault();

    
    newApiPixabay.query = e.currentTarget.elements.query.value;
    newApiPixabay.resetPage();
    newApiPixabay.fetchArticles().then(({ hits, totalHits }) => {

        if (newApiPixabay.query === '') {
      Notiflix.Notify.failure('Oops... Please enter the text');
    } else if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
        clearHitsContainer();
        appenHitsMarkup(hits)

    });


}



function onLoadMore() { 
  newApiPixabay.fetchArticles().then(appenHitsMarkup);

};

function appenHitsMarkup(hits) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', hitsTpl(hits));
}

function clearHitsContainer() {
  refs.articlesContainer.innerHTML = '';
}
