import '../styles.css';
import Pagination from 'tui-pagination'; //!!!!!!!!!!!!!!
import 'tui-pagination/dist/tui-pagination.css'; //!!!!!!!!!

const page = 1;

//>768
function startPagination() {
  const storageData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const totalItems = storageData.length;
  if (totalItems < 4) {
    return;
  }

  if (window.innerWidth > 768) {
    const optionsPagination = {
      totalItems: totalItems, //загальна кількість елементів по запиту на localStorage
      itemsPerPage: 3, //кількість зображень на одній сторінці
      visiblePages: Math.ceil(totalItems / itemsPerPage), //скільки кнопочок з номерами сторінок буде відображатись. Можна вписати статичну цифру
      page: page, //яка сторінка буде першою
    };

    const pagination = new Pagination(
      paginationContainerRef,
      optionsPagination
    );

    pagination.on('beforeMove', event => {
      page = event.page;
      storageData;
    });
  }

  const optionsPagination = {
    totalItems: totalItems, //загальна кількість елементів по запиту на localStorage
    itemsPerPage: 3, //кількість зображень на одній сторінці
    visiblePages: Math.ceil(totalItems / itemsPerPage), //скільки кнопочок з номерами сторінок буде відображатись. Можна вписати статичну цифру
    page: page, //яка сторінка буде першою
  };

  const pagination = new Pagination(paginationContainerRef, optionsPagination);

  pagination.on('beforeMove', event => {
    page = event.page;

    storageData;

    
  });
}

//перше завантаження
