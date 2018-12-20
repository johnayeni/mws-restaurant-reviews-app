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

  const isTrue = JSON.parse(restaurant.is_favorite);
  toggleFavoriteButton(isTrue);

  favoriteButton.addEventListener('click', () => {
    DBHelper.toggleRestaurantFavoriteStatus(restaurant.id, isTrue, (error, response) => {
      if (error) {
        alert('Error occured');
        return;
      }
      toggleFavoriteButton(!isTrue);
    });
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
 * toggle favorite button
 */
const toggleFavoriteButton = (isTrue) => {
  const favoriteButton = document.querySelector('.favorite-button');
  if (isTrue) {
    favoriteButton.classList.add('favorited');
  } else {
    favoriteButton.classList.remove('favorited');
  }
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
  const title = document.createElement('h1');
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
const createReviewHTML = (review, newReview = false) => {
  const li = document.createElement('li');
  li.tabIndex = 0;

  const name = document.createElement('h3');
  name.innerHTML = review.name.toUpperCase();
  li.appendChild(name);

  const date = document.createElement('h4');
  date.innerHTML = new Date(review.createdAt).toDateString();
  li.appendChild(date);

  const rating = document.createElement('h3');
  rating.innerHTML = `Rating: ${review.rating}&nbsp;Stars`;
  // for (let i = 0; i < Number(review.rating); i++) {
  //   const star = document.createElement('span');
  //   star.className = 'star-icon';
  //   star.innerHTML = '&#9733;';
  //   rating.appendChild(star);
  // }
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  // if its a new review, show the user
  if (newReview) {
    li.classList.add('new-review');
    const newReviewText = document.createElement('p');
    newReviewText.classList.add('new-review-text');
    newReviewText.innerHTML = 'New';
    li.insertBefore(newReviewText, li.childNodes[0]);

    // remove class and text of new review after 10 seconds
    setTimeout(() => {
      li.classList.remove('new-review');
      // remove the first child of the element since that is the new review text
      li.removeChild(li.childNodes[0]);
    }, 10000);
    const list = document.getElementById('reviews-list');
    // if there is no reviews list create one
    if (list) {
      // insert at the top of the list
      list.insertBefore(li, list.childNodes[0]);
    } else {
      const container = document.getElementById('reviews-container');
      list = document.createElement('ul');
      list.setAttribute('id', 'reviews-list');
      list.appendChild(li);
      container.appendChild(list);
    }
  } else {
    return li;
  }
};

const createReviewFormHTML = () => {
  const section = document.getElementById('review-form-container');
  while (section.hasChildNodes()) {
    section.removeChild(section.lastChild);
  }

  const form = document.createElement('form');
  form.setAttribute('id', 'review-form');
  const title = document.createElement('h2');
  title.innerHTML = 'Review Restaurant';
  form.appendChild(title);

  const nameInputDiv = document.createElement('div');
  nameInputDiv.classList.add('form-input-group');
  const nameInputLabel = document.createElement('label');
  nameInputLabel.innerHTML = 'Name';
  nameInputLabel.setAttribute('id', 'name_label');
  nameInputDiv.appendChild(nameInputLabel);
  const nameInput = document.createElement('input');
  nameInput.setAttribute('placeholder', 'Name');
  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('id', 'name');
  nameInput.setAttribute('aria-labelledby', 'name_label');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('required', true);
  nameInputDiv.appendChild(nameInput);

  form.appendChild(nameInputDiv);

  const radioInputDiv = document.createElement('div');
  const text = document.createElement('p');
  text.innerHTML = 'Select a star rating';
  radioInputDiv.appendChild(text);

  radioInputDiv.classList.add('rating');
  for (let i = 5; i >= 1; i--) {
    const radioInput = document.createElement('input');
    radioInput.setAttribute('value', i);
    radioInput.setAttribute('id', `star${i}`);
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'rating');
    radioInput.setAttribute('required', true);
    radioInputDiv.appendChild(radioInput);
    const radioInputLabel = document.createElement('label');
    radioInputLabel.setAttribute('for', `star${i}`);
    radioInputDiv.appendChild(radioInputLabel);
  }
  form.appendChild(radioInputDiv);

  const commentTextAreaDiv = document.createElement('div');
  commentTextAreaDiv.classList.add('form-input-group');
  const commentTextAreaLabel = document.createElement('label');
  commentTextAreaLabel.innerHTML = 'Comments';
  commentTextAreaLabel.setAttribute('id', 'comments_label');
  commentTextAreaDiv.appendChild(commentTextAreaLabel);
  const commentTextArea = document.createElement('textarea');
  commentTextArea.setAttribute('placeholder', 'Comments');
  commentTextArea.setAttribute('name', 'comments');
  commentTextArea.setAttribute('id', 'comments');
  commentTextArea.setAttribute('aria-labelledby', 'comments_label');
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
    addButton.setAttribute('disabled', true);
    const data = {
      restaurant_id: restaurant.id,
      name: form.name.value,
      comments: form.comments.value,
      rating: form.rating.value,
      createdAt: new Date().toISOString(),
    };
    DBHelper.addOfflineReview(data, (error, review) => {
      addButton.setAttribute('disabled', false);
      if (error) {
        alert('Could not add review');
        return;
      }
      createReviewHTML(review, true);
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
