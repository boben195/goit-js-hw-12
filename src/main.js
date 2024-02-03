import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import axios from "axios";

const API_KEY = "42039284-aa75c07fa754230e40c75f28c";

const btn = document.querySelector(".btn");
const form = document.querySelector(".foto-form");
const list = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadBtn = document.querySelector(".btn-load");

loadBtn.style.display = "none";
//************************ */
axios.defaults.baseURL = 'https://pixabay.com/api';
let page = 1;
let query = "";
let max = 0;

/*************************************** */


form.addEventListener('submit', handleSearch);

async function handleSearch(event) {
  event.preventDefault();
  list.innerHTML = "";
  page = 1;
  loadBtn.style.display = "block";
  query = form.query.value.trim();
  if (!query) {
    createMessage("The search field can't be empty! Please, enter your request!");
    loadBtn.style.display = "none";
    return;
  }
  try {
    const { hits, total } = await getPictures(query);
    max = Math.ceil(total / 15);
    createList(hits, list);
    if (hits.length > 0) {
      loadBtn.addEventListener("click", handleLoad);
    } else {
      loadBtn.style.display = "none";
      createMessage("Sorry, there are no images matching your search query. Please, try again!");
    };
  
    showLoader(false);
  } catch (error) {
        iziToast.error({
        title: "ERROR",
        message: `❌ Ooopsi Doopsi ${error}`,
      });
  } finally {
    form.reset();
    if (page === max) {
      loadBtn.style.display = "none";
      createMessage("We're sorry, but you've reached the end of search results!");
    };
  };
};
/*************************************************** */
async function handleLoad() {
  page++;
  try {
    showLoader(true);
    loadBtn.style.display = "block";
    const { hits } = await getPictures(query, page);
    createList(hits, list);
    showLoader(false);
  } catch (error) {
        iziToast.error({
        title: "ERROR",
        message: `❌ Ooopsi Doopsi ${error}`,
      });
  } finally {
    if (page === max) {
      loadBtn.style.display = "none";
      createMessage("We're sorry, but you've reached the end of search results!");
    };
  };
};

async function getPictures(query, page = 1) {
  showLoader(true);
  return axios
    .get("/", {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 15,
        page,
      },
    })
    .then(({ data }) => data);
}


 function createList(hits) {
  const markup = hits
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
     list.insertAdjacentHTML("beforeend", markup)
      simplyGallery.refresh();
}

      const simplyGallery = new SimpleLightbox('.gallery-item a', {
        captionsData: 'alt',
        captionDelay: 250,
      });

      function createMessage(message) {
        iziToast.show({
        message: message,
        close: false,
       closeOnClick: true,
    });
}

function showLoader(state = true) {
  loader.classList.add("loader")
  loader.style.display = !state ? 'none' : 'inline-block';
  btn.disabled = state;
}

loader.classList.remove("loader")



/************************************************************************************ */



