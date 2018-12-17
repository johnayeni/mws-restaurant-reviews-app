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
        fillBreadcrumb();
        DBHelper.mapMarkerForRestaurant(restaurant, map);
      }
    });
  };
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
  if (restaurant) {
    // restaurant already fetched!
    callback(null, restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    const error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, data) => {
      restaurant = data;
      if (!data) {
        console.error(error);
        return;
      }
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
const fetchRestaurantReviewsFromURL = (id) => {
  if (!id) {
    // no id found in URL
    const error = 'No restaurant id';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantReviews(id, (error, reviews) => {
      if (!reviews) {
        console.error(error);
        return;
      }
      fillReviewsHTML(reviews);
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
  fetchRestaurantReviewsFromURL(restaurant.id);
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

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (data = restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = data.name;
  breadcrumb.appendChild(li);
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
