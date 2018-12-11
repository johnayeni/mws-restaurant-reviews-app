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
      callback(null, data);
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
  image.className = 'restaurant-img';
  image.srcset = `${imageUrl}-320w.jpg 320w,
  ${imageUrl}-480w.jpg 480w, ${imageUrl}-800w.jpg 800w`;
  image.sizes = `(max-width: 320px) 280px,
    (max-width: 480px) 440px,
      800px`;
  image.src = `${imageUrl}-800w.jpg`;
  image.alt = `${data.name} restaurant's photo.`;
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = data.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
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
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach((review) => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.tabIndex = 0;
  const name = document.createElement('h4');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('h6');
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('h5');
  rating.innerHTML = `Rating: ${review.rating}`;
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
