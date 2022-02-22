import './sass/main.scss';
import { Notify} from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import hitsCard from './hits.hbs';
const axios = require('axios').default;




const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('.search-form__input'),
    btn: document.querySelector('.search-form__button'),
    loadMoreBtn: document.querySelector('.load-more'),
    clearBtn: document.querySelector('.clear-btn'),
    gallery: document.querySelector('.gallery'),
    card: document.querySelector('.photo-card'),
};

const URL = 'https://pixabay.com/api/';
const searchOption = {
  params: {
    key: '25818588-81f655bfb5dc7dceedfe6e773',
    q: ` `,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 0,
  },
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', loadMore);

let gallery = new SimpleLightbox('.gallery a', {
  showCounter: true,
  disableScroll: true,
});

function onCardClick(evt) {
  evt.preventDefault();

  gallery.open('.gallery');
}

async function onFormSubmit(e) {
  e.preventDefault();
  searchOption.params.page = 0;
  const inputValue = e.currentTarget.searchQuery.value.trim();
  if (!inputValue.length) {
    Notify.failure('Please enter a valid query text');
    return;
  }
  try {
    const collection = await getColection(inputValue);
    onSucces(collection);
    totalHits(collection);
  } catch {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }

  refs.form.reset();
}

function onSucces(respond) {
  clearInterface();

  makeMarkUp(respond);

  refs.gallery.addEventListener('click', onCardClick);
  gallery.refresh();

  Notify.success(`Hooray! We found ${respond.data.totalHits} images.`);
}

function clearInterface() {
  refs.gallery.removeEventListener('click', onCardClick);
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('visually-hidden');
}

async function getColection(query = searchOption.params.q) {
  searchOption.params.q = `${query}`;
  searchOption.params.page = searchOption.params.page + 1;

  const respons = await axios.get(URL, searchOption);

  if (respons.data.hits.length === 0) {
    throw new Error();
  }

  return respons;
}

async function loadMore() {
  try {
    const collection = await getColection();

    makeMarkUp(collection);
    gallery.refresh();
    smoothScroll();
  } catch {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.classList.add('visually-hidden');
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 + 180,
    behavior: 'smooth',
  });
}

function totalHits(totalHits) {
  const total = document.querySelectorAll('.photo-card').length;
  if (total >= totalHits) {
    refs.loadMoreBtn.classList.remove('visually-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function makeMarkUp({ data }) {
  const items = data.hits.map(hitsCard).join('');

  refs.gallery.insertAdjacentHTML('beforeend', items);

  refs.loadMoreBtn.classList.remove('visually-hidden');
}