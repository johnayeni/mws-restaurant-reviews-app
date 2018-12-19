import DBHelper from './dbhelper';

let restaurant;
let map;
/**
 * Initialize Google map, called from HTML.
 */
if (window.location.pathname === '/restaurant.html') {
  window.initMap = () => {
    fetchRestaurantFromURL((error, data) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: data.latlng,
          scrollwheel: false,
        });
        DBHelper.mapMarkerForRestaurant(restaurant, map);
      }
    });
  };
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    const error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, data) => {
      if (!data) {
        console.error(error);
        return;
      }
      restaurant = data;
      fillBreadcrumb();
      fillRestaurantHTML();
      // lazy load images for each restaurant
      DBHelper.lazyLoadImages();
      callback(null, data);
    });
  }
};
/**
 * Get restaurant reviews from page URL.
 */
const fetchRestaurantReviews = (id) => {
  if (!id) {
    const error = 'No restaurant id';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantReviews(id, (error, reviews) => {
      if (!reviews) {
        console.error(error);
        return;
      }
      fillReviewsHTML(reviews.reverse());
      // create reviews from
      createReviewFormHTML();
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (data = restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = data.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = data.address;

  const favoriteButton = document.querySelector('.favorite-button');
  if (JSON.parse(restaurant.is_favorite)) {
    favoriteButton.classList.add('favorited');
  } else {
    favoriteButton.classList.remove('favorited');
  }
  favoriteButton.addEventListener('click', () => {
    DBHelper.toggleRestaurantFavoriteStatus(restaurant.id, JSON.parse(restaurant.is_favorite));
  });

  const image = document.getElementById('restaurant-img');
  const imageUrl = DBHelper.imageUrlForRestaurant(restaurant);
  image.className = 'lazy restaurant-img';
  image.setAttribute('data-src', `${imageUrl}-large.jpg`);
  image.setAttribute('data-srcset', DBHelper.imageSrcSetForRestaurant(imageUrl));
  image.sizes = DBHelper.imageSizesForRestaurant();
  image.alt = `${data.name} restaurant's photo.`;
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = data.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fetchRestaurantReviews(restaurant.id);
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  // remove all child nodes of this container incase it has been filled before by data from indexed db
  while (hours.hasChildNodes()) {
    hours.removeChild(hours.lastChild);
  }
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};
/**
 * Create reviews form and add to the webpage.
 */

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews) => {
  const container = document.getElementById('reviews-container');
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }
  // remove all child nodes of this container incase it has been filled before by data from indexed db
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews || reviews.length < 1) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  } else {
    const ul = document.createElement('ul');
    ul.setAttribute('id', 'reviews-list');
    reviews.forEach((review) => {
      let reviewHtml = createReviewHTML(review);
      ul.appendChild(reviewHtml);
    });
    container.appendChild(ul);
  }
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.tabIndex = 0;

  if (review.offline) {
    li.className = 'offline-review';
    const offlineText = document.createElement('p');
    offlineText.className = 'offline-text';
    offlineText.innerHTML = 'Adding Review ...';
    li.appendChild(offlineText);
  }

  const name = document.createElement('h3');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('h4');
  date.innerHTML = new Date(review.createdAt).toDateString();
  li.appendChild(date);

  const rating = document.createElement('h3');
  rating.innerHTML = `Rating: ${review.rating}`;
  for (let i = 0; i < review.rating; i++) {
    const star = document.createElement('span');
    star.className = 'star-icon';
    star.innerHTML = '&#9733;';
    rating.appendChild(star);
  }
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

const createReviewFormHTML = () => {
  const section = document.getElementById('review-form-container');
  while (section.hasChildNodes()) {
    section.removeChild(section.lastChild);
  }

  const form = document.createElement('form');
  form.setAttribute('id', 'review-form');
  const title = document.createElement('h3');
  title.innerHTML = 'Review Restaurant';
  form.appendChild(title);

  const nameInputDiv = document.createElement('div');
  const nameInput = document.createElement('input');
  nameInput.setAttribute('placeholder', 'Name');
  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('required', true);
  nameInputDiv.appendChild(nameInput);

  form.appendChild(nameInputDiv);

  const radioInputDiv = document.createElement('div');

  for (let i = 1; i <= 5; i++) {
    const radioInput = document.createElement('input');
    radioInput.setAttribute('value', i);
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'rating');
    radioInput.setAttribute('required', true);
    radioInputDiv.appendChild(radioInput);

    for (let j = 0; j < i; j++) {
      const star = document.createElement('span');
      star.className = 'star-icon';
      star.innerHTML = '&#9733;';
      radioInputDiv.appendChild(star);
    }
  }

  form.appendChild(radioInputDiv);
  const commentTextAreaDiv = document.createElement('div');
  const commentTextArea = document.createElement('textarea');
  commentTextArea.setAttribute('placeholder', 'Comments');
  commentTextArea.setAttribute('name', 'comments');
  commentTextArea.setAttribute('rows', 4);
  commentTextArea.setAttribute('required', true);
  commentTextAreaDiv.appendChild(commentTextArea);

  form.appendChild(commentTextAreaDiv);

  const addButtonDiv = document.createElement('div');
  const addButton = document.createElement('button');
  addButton.setAttribute('type', 'submit');
  addButton.setAttribute('aria-label', 'Add Review');
  addButton.classList.add('review-form-button');
  addButton.innerHTML = 'Add Review';
  addButtonDiv.appendChild(addButton);
  form.appendChild(addButtonDiv);

  form.onsubmit = (e) => {
    e.preventDefault();
    const data = {
      restaurant_id: restaurant.id,
      name: form.name.value,
      comments: form.comments.value,
      rating: form.rating.value,
      createdAt: new Date().toISOString(),
    };
    DBHelper.addOfflineReview(data, (error, response) => {
      if (error) {
        alert('Could not add review');
        return;
      }
      alert(response);
      fetchRestaurantReviews(restaurant.id);
    });
  };

  section.appendChild(form);
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (data = restaurant) => {
  const breadcrumb = document.getElementById('page-breadcrumb');
  breadcrumb.innerHTML = data.name;
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
