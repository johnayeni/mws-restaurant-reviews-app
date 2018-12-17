import DBHelper from './dbhelper';

let restaurants, neighborhoods, cuisines;
let map;
let markers = [];
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  setEventListeners();
  fetchNeighborhoods();
  fetchCuisines();
});
/**
 * Set event listeners for filter changing
 */
const setEventListeners = () => {
  const neighborHoodSelect = document.getElementById('neighborhoods-select');
  neighborHoodSelect &&
    neighborHoodSelect.addEventListener('change', () => {
      updateRestaurants();
    });

  const cuisineSelect = document.getElementById('cuisines-select');
  cuisineSelect &&
    cuisineSelect.addEventListener('change', () => {
      updateRestaurants();
    });
};

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, data) => {
    if (error != null) {
      // Got an error
      console.error(error);
    } else {
      neighborhoods = data;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (data = neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');

  select &&
    data.forEach((neighborhood, i) => {
      const option = document.createElement('option');
      option.innerHTML = neighborhood;
      option.value = neighborhood;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-posinset', i + 1);
      option.setAttribute('aria-setsize', data.length);
      select.append(option);
    });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, data) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      cuisines = data;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (data = cuisines) => {
  const select = document.getElementById('cuisines-select');

  select &&
    data.forEach((cuisine, i) => {
      const option = document.createElement('option');
      option.innerHTML = cuisine;
      option.value = cuisine;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-posinset', i + 1);
      option.setAttribute('aria-setsize', cuisines.length);
      select.append(option);
    });
};

/**
 * Initialize Google map, called from HTML.
 */
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  window.initMap = () => {
    let loc = {
      lat: 40.722216,
      lng: -73.987501,
    };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: loc,
      scrollwheel: false,
    });
    updateRestaurants();
  };
}

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (data) => {
  // Remove all restaurants
  restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  markers.forEach((m) => m.setMap(null));
  markers = [];
  restaurants = data;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (data = restaurants) => {
  const ul = document.getElementById('restaurants-list');
  data.forEach((restaurant) => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
  // lazy load images for each restaurant
  DBHelper.lazyLoadImages();
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.setAttribute('role', 'listitem');

  const image = document.createElement('img');
  const imageUrl = DBHelper.imageUrlForRestaurant(restaurant);
  image.className = 'lazy restaurant-img';
  image.setAttribute('data-src', `${imageUrl}-large.jpg`);
  image.setAttribute('data-srcset', DBHelper.imageSrcSetForRestaurant(imageUrl));
  image.sizes = DBHelper.imageSizesForRestaurant();
  image.alt = `${restaurant.name} restaurant's photo.`;

  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.tabIndex = 0;
  name.setAttribute('aria-label', `${restaurant.name} , ${restaurant.neighborhood}`);
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('aria-label', `View details of ${restaurant.name}'s restaurant`);
  li.append(more);
  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (data = restaurants) => {
  data.forEach((restaurant) => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    markers.push(marker);
  });
};
