import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "42039284-aa75c07fa754230e40c75f28c";

const btn = document.querySelector(".btn");
const form = document.querySelector(".foto-form");
const list = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

form.addEventListener('submit', event => {
  event.preventDefault();
  const query = form.query.value.trim();
  if (!query) {
    createMessage(
      `The search field can't be empty! Please, enter your request!`
    );
    return;
  }
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

  getPictures(url)
    .then(data => {
      if (data.hits.length === 0) {
        createMessage(
          `Sorry, there are no images matching your search query. Please, try again!`
        );
        showLoader(false);
      }

      list.innerHTML = createList(data.hits);
      showLoader(false);
      const simplyGallery = new SimpleLightbox('.gallery-item a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      form.reset();
      simplyGallery.refresh();
    })
    .catch(error => {
      iziToast.error({
        title: 'ERROR',
        message: `❌ Ooopsi Doopsi ${error}`,
      });
    });
  
});

function getPictures(url) {
  showLoader(true);
  return fetch(url).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

function createList(hits) {
  return hits
    .map(
      ({
        webformatURL, largeImageURL, tags, likes, views, comments, downloads, }) =>
        `<li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}"/>
        <p class="gallery-text">Likes: ${likes} Views: ${views} Comments: ${comments} Downloads: ${downloads}</p>
        </a>
        </li>`)
    .join('');
    simplyGallery.refresh();
}


function createMessage(message) {
  iziToast.show({
    message: message,
    close: false,
    closeOnClick: true,
  });
}

function showLoader(state = true) {
  loader.classList.add('loader')
  loader.style.display = !state ? 'none' : 'inline-block';
  btn.disabled = state;
}

loader.classList.remove('loader')