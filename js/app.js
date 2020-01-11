function customHttp() {
  return {
    get(url, callback) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            callback(`Error.Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          callback(null, response);

        });
        xhr.addEventListener('error', () => {
          callback(`Error.Status code: ${xhr.status}`, xhr);
        });
        xhr.send();
      } catch (error) {
        callback(error);
      }
    },
    post(url, body, headers, callback) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            callback(`Error.Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          callback(null, response);

        });
        xhr.addEventListener('error', () => {
          callback(`Error.Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }
        xhr.send(JSON.stringify(body));
      } catch (error) {
        callback(error);
      }

    },
  };
};

//Init http module
const http = customHttp();


//Elements
const form = document.forms['newsControls'];
const selectInput = form['country']
const searchInput = form['search'];

//Events
form.addEventListener('submit', (e) => {
  loadNews();
  e.preventDefault();
});

selectInput.addEventListener('change', (e) => {
  e.preventDefault();
  loadNews();
});

//init selects
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});


const newsService = (function () {
  const apiKey = '94451d30f5864e7f9e4c4dda5e6f514c';
  const apiUrl = 'https://newsapi.org/v2';

  return {
    topHeadlines(country = 'ua', callback) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`, callback);
    },
    everything(query, callback) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, callback);
    }
  }
}());


// Load news function
function loadNews() {

  showPreloader();
  const country = selectInput.value;
  const searchText = searchInput.value;
  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse)
  } else {
    newsService.everything(searchText, onGetResponse)
  }

};

// Function on get response from server
function onGetResponse(err, res) {
  removePreloader();

  if (err) {
    showAlert(err, 'err-msg');
    return
  }
  if (!res.articles.length) {
    showAlert('There is no such news. Enter the correct data', 'rounded');
    return;
  }

  renderNews(res.articles);
};

// Function render news
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }

  let fragment = '';
  news.forEach(newsItem => {
    const element = newsTemplate(newsItem);
    fragment += element;
  });
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
};

//Function clear newContainer
function clearContainer(container) {
  // container.textContent = '';

  let child = container.lastElementChild;
  while (child) {
    child.remove();
    child = container.lastElementChild;
  }
};

//Function news item template
function newsTemplate({
  urlToImage,
  title,
  url,
  description
} = {}) {
  //console.log(news);
  return `
  <div class="col s12">
    <div class="card">
      <div class="card-image">
          <img src="${urlToImage}">
          <span class="card-title">${title || ''}</span>
      </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more</a>
        </div>
    </div>
  </div>`;
};

//Function showWarning
function showAlert(msg, type = 'succes') {
  M.toast({
    html: msg,
    classes: type
  })
};

//Function show preloader
function showPreloader() {
  document.body.insertAdjacentHTML('afterbegin',
    `<div class="progress">
      <div class="indeterminate"></div>
     </div>`);
};

//Function remove preloader
function removePreloader() {
  const preloader = document.querySelector('.progress');
  if (preloader) {
    preloader.remove();
  }
};