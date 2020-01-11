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
  renderNews(res.articles);
};

// Function render news
function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');


  let fragment = '';
  news.forEach(newsItem => {
    const element = newsTemplate(newsItem);
    fragment += element;
  });
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
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