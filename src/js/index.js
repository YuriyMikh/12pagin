import '../styles.css';
import PixabayApiService from './api-pixabay.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import '../tui.css';

import arrayData from '../arrayData.json';

import Pagination from 'tui-pagination'; //!!!!!!!!!!!!!!
// import 'tui-pagination/dist/tui-pagination.css'; //!!!!!!!!!

const paginationContainerRef = document.querySelector('.js-tui-pagination'); //!!!!!!!!!

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
// const loadMoreButtonRef = document.querySelector('.load-more');

//инициализируем SimpleLightbox
let simpleLightboxGallery = new SimpleLightbox('.gallery a');

const pixabayApiService = new PixabayApiService(); //на основе класса PixabayApiService из файла api-pixabay.js создаем экземпляр класса (со свойствами и методами)

formRef.addEventListener('submit', onSearch);
// loadMoreButtonRef.addEventListener('click', onLoadMore);

//-------------------------------------------
//-------------------------------------------
//-------------------------------------------
const LOCALSTORAGE_KEY = 'array';
localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(arrayData));

let currentPage = 1;
let itemsPerPageDesktop = 3;
let itemsPerPageMobile = 4;

function start() {
  const dataLocalStorage = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
  if (!dataLocalStorage || dataLocalStorage.length === 0) {
    Notiflix.Notify.info('в localStorage нічого немає');
    console.log('в localStorage нічого немає');
    return;
  } else {
    const totalItems = dataLocalStorage.length;
    createMarkup(dataLocalStorage, currentPage);
    paginationStart(totalItems);
  }
}

start();

function createMarkup(arrayData, page) {
  const startIndex = itemsPerPageDesktop * page - itemsPerPageDesktop;
  const endIndex = itemsPerPageDesktop * currentPage;
  newRenderMarkupFromLocalStorage(arrayData.slice(startIndex, endIndex));
}

function paginationStart(totalItems) {
  const paginationOptions = {
    totalItems: totalItems,
    itemsPerPage: itemsPerPageDesktop,
    visiblePages: Math.ceil(totalItems / itemsPerPageDesktop),
    page: currentPage,
    centerAlign: false,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn custom-tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn custom-tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn custom-tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn custom-tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };

  const pagination = new Pagination(paginationContainerRef, paginationOptions);

  pagination.on('beforeMove', event => {
    currentPage = event.page;

    const dataLocalStorage = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
    createMarkup(dataLocalStorage, currentPage);
  });
}


//-------------------------------
//-------------------------------
//--------------------------------
function onSearch(event) {
  event.preventDefault();

  //записываем термин поиска в свойство searchQuery через геттер и сеттер в файл api-pixabay.js
  pixabayApiService.query = event.currentTarget.elements.searchQuery.value
    .toLowerCase()
    .trim();
  console.log(pixabayApiService.query);
  pixabayApiService.resetPage(); //при сабмите формы сбрасываем странички до единицы

  //на экземпляре класса pixabayApiService вызываем метод fetchData() из файла api-pixabay.js. Обрабатываем данные через async await

  // pixabayApiService.fetchData().then(({ data }) => {
  //   console.log(data.hits);
  //   localStorage.setItem('array', JSON.stringify(data.hits));

  //   const arrayInLocalStorage = localStorage.getItem('array');
  //   const arrayParsedFromLocalStorage = JSON.parse(arrayInLocalStorage);

  //   renderMarkupFromLocalStorage(arrayParsedFromLocalStorage);

  //   //налаштування пагінації
  //   const paginationOptions = {
  //     totalItems: arrayParsedFromLocalStorage,
  //     itemsPerPage: 40,
  //     // visiblePages: Math.ceil(data.totalHits / 40),
  //     visiblePages: 5,
  //     page: 1,
  //     centerAlign: false,
  //     firstItemClassName: 'tui-first-child',
  //     lastItemClassName: 'tui-last-child',
  //     template: {
  //       page: '<a href="#" class="tui-page-btn">{{page}}</a>',
  //       currentPage:
  //         '<strong class="tui-page-btn custom-tui-page-btn tui-is-selected">{{page}}</strong>',
  //       moveButton:
  //         '<a href="#" class="tui-page-btn custom-tui-page-btn tui-{{type}}">' +
  //         '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //         '</a>',
  //       disabledMoveButton:
  //         '<span class="tui-page-btn custom-tui-page-btn tui-is-disabled tui-{{type}}">' +
  //         '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //         '</span>',
  //       moreButton:
  //         '<a href="#" class="tui-page-btn custom-tui-page-btn tui-{{type}}-is-ellip">' +
  //         '<span class="tui-ico-ellip">...</span>' +
  //         '</a>',
  //     },
  //   };

  //   //ініціалізація пагінації
  //   const pagination = new Pagination(
  //     paginationContainerRef,
  //     paginationOptions
  //   );

  //   let currentPage = 1;

  //   pagination.on('beforeMove', async event => {
  //     currentPage = event.page;
  //     console.log(currentPage);
  //   });
  // });

  //если вернулся пустой массив или пустая строка - выводим соответствующее сообщение-предупреждение.
  // if (data.hits.length === 0 || pixabayApiService.query === '') {
  //   notificationFailure();
  //   clearGalleryContainer();
  //   paginationContainerRef.classList.add('is-hidden');
  //   return;
  // }

  //если вернулось менее 40 фоток (data.hits.length) - просто рендерим разметку и вызываем нотификашку
  //если более 40 - делаем всё тоже самое, но открываем кнопку "Load more". Обработка ее нажатия ниже по коду
  //   if (data.hits.length < pixabayApiService.per_page) {
  //     notificationSuccess(data.totalHits);
  //     clearGalleryContainer();
  //     renderMarkup(data);
  //     simpleLightboxGallery.refresh();
  //   } else
  //   {
  //     clearGalleryContainer();
  //     notificationSuccess(data.totalHits);
  //     // loadMoreButtonRef.classList.remove('is-hidden');
  //     renderMarkup(data);
  //     simpleLightboxGallery.refresh();
  //     console.log(data.totalHits);

  //     //-------------
  //     console.log(pixabayApiService.per_page);
  //     const paginationOptions = {
  //       //!!!!!!!!!!!
  //       totalItems: data.totalHits,
  //       itemsPerPage: 40,
  //       // visiblePages: Math.ceil(data.totalHits / 40),
  //       visiblePages: 5,
  //       page: 1,
  //       centerAlign: false,
  //       firstItemClassName: 'tui-first-child',
  //       lastItemClassName: 'tui-last-child',
  //       template: {
  //         page: '<a href="#" class="tui-page-btn">{{page}}</a>',
  //         currentPage:
  //           '<strong class="tui-page-btn custom-tui-page-btn tui-is-selected">{{page}}</strong>',
  //         moveButton:
  //           '<a href="#" class="tui-page-btn custom-tui-page-btn tui-{{type}}">' +
  //           '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //           '</a>',
  //         disabledMoveButton:
  //           '<span class="tui-page-btn custom-tui-page-btn tui-is-disabled tui-{{type}}">' +
  //           '<span class="tui-ico-{{type}}">{{type}}</span>' +
  //           '</span>',
  //         moreButton:
  //           '<a href="#" class="tui-page-btn custom-tui-page-btn tui-{{type}}-is-ellip">' +
  //           '<span class="tui-ico-ellip">...</span>' +
  //           '</a>',
  //       },
  //     };

  //     const pagination = new Pagination(
  //       paginationContainerRef,
  //       paginationOptions
  //     ); //!!!!!!!!!!
  //     paginationContainerRef.classList.remove('is-hidden');

  //     pagination.on('beforeMove', async event => {
  //       pixabayApiService.page = event.page;

  //       try {
  //         const { data } = await pixabayApiService.fetchData();
  //         console.log(data);
  //         galleryRef.innerHTML = markupPagination(data);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     });
  //   }
  // } catch (error) {
  //   Notiflix.Notify.failure(
  //     'Oops! Something went wrong! Try reloading the page!'
  //   );
  // }
}

// async function onLoadMore() {
//   const { data } = await pixabayApiService.fetchData();

//   try {
//     //если с сервера пришло больше фоток чем общее кол-во фоток (data.totalHits), - выводим нотификацию об окончании поиска и прячем кнопку "Load more"
//     // так как кол-во page приплюсовывается после каждого нажатия - в конце проверки делаем минус pixabayApiService.per_page
//     if (
//       pixabayApiService.page * pixabayApiService.per_page -
//         pixabayApiService.per_page >
//       data.totalHits
//     ) {
//       notificationEndSearch();
//       renderMarkup(data);
//       simpleLightboxGallery.refresh();
//       loadMoreButtonRef.classList.add('is-hidden');
//     } else {
//       renderMarkup(data);
//       loadMoreButtonRef.classList.remove('is-hidden');
//       simpleLightboxGallery.refresh();

//       //фича для плавной прокрутки странички вниз после нажатия на 'Load more'
//       const { height: cardHeight } = document
//         .querySelector('.gallery')
//         .firstElementChild.getBoundingClientRect();

//       window.scrollBy({
//         top: cardHeight * 2,
//         behavior: 'smooth',
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

//рендерим разметку
function renderMarkup(data) {
  const markup = data.hits
    .map(
      element => `
  <a href="${element.largeImageURL}" >
    <div class="photo-card">
      <div class="thumb">
        <img class="img" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${element.downloads}
        </p>
      </div>
    </div>
  </a>
    `
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

//функция для сброса разметки. Будет использоваться при смене термина запроса
function clearGalleryContainer() {
  galleryRef.innerHTML = '';
}

//функция для вывода уведомления о сбое
function notificationFailure() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

//функция для вывода уведомления о кол-ве найденых фоток
function notificationSuccess(total) {
  Notiflix.Notify.success(`Hooray! We found ${total} images.`);
}

//функция для вывода уведомления об окончании рендера фоток, т.к. больше фотографий не найдено
function notificationEndSearch() {
  Notiflix.Notify.info(
    `We're sorry, but you've reached the end of search results.`
  );
}

function markupPagination(array) {
  const imagesMarkup = array.hits.map(element => {
    return `<a href="${element.largeImageURL}" >
    <div class="photo-card">
      <div class="thumb">
        <img class="img" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${element.downloads}
        </p>
      </div>
    </div>
  </a>
    `;
  });
  return imagesMarkup.join('');
}

function renderMarkupFromLocalStorage(data) {
  const markup = data
    .map(
      element => `
  <a href="${element.largeImageURL}" >
    <div class="photo-card">
      <div class="thumb">
        <img class="img" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${element.downloads}
        </p>
      </div>
    </div>
  </a>
    `
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function newRenderMarkupFromLocalStorage(data) {
  const markup = data
    .map(
      element => `
  <a href="${element.largeImageURL}" >
    <div class="photo-card">
      <div class="thumb">
        <img class="img" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${element.downloads}
        </p>
      </div>
    </div>
  </a>
    `
    )
    .join('');

  galleryRef.innerHTML = markup;
}
