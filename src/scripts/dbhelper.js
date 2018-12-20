import idb from 'idb';
/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Open a IDB Database
   */
  static openDatabase() {
    return idb.open('restaurants', 1, (upgradeDb) => {
      upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });

      const reviewStore = upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
      reviewStore.createIndex('restaurant_id', 'restaurant_id');
      reviewStore.createIndex('date', 'createdAt');

      upgradeDb.createObjectStore('offlineFavorites', { keyPath: 'restaurant_id' });

      const offlineReviewStore = upgradeDb.createObjectStore('offlineReviews', {
        keyPath: 'id',
        autoIncrement: true,
      });
      offlineReviewStore.createIndex('restaurant_id', 'restaurant_id');
      offlineReviewStore.createIndex('date', 'createdAt');
    });
  }
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}`;
  }
  /**
   * Show cached restaurants stored in IDB
   */
  static async getStoredRestaurants() {
    const db = await DBHelper.openDatabase();
    //if we showing posts or very first time of the page loading.
    //we don't need to go to idb
    if (!db) return;

    const tx = db.transaction('restaurants');
    const store = tx.objectStore('restaurants');

    return store.getAll();
  }

  static async getStoredRestaurantById(id) {
    const db = await DBHelper.openDatabase();
    //if we showing posts or very first time of the page loading.
    //we don't need to go to idb
    if (!db) return;

    const tx = db.transaction('restaurants');
    const store = tx.objectStore('restaurants');

    return store.get(id);
  }

  static async getStoredRestaurantReviews(id) {
    const db = await DBHelper.openDatabase();
    //if we showing posts or very first time of the page loading.
    //we don't need to go to idb
    if (!db) return;

    const tx = db.transaction('reviews');
    const store = tx.objectStore('reviews');
    const index = store.index('restaurant_id', 'date');

    return index.getAll(id);
  }

  /**
   * Fetch all restaurants.
   */
  static async fetchRestaurants(callback) {
    let restaurants = [];
    // get stored data from indexed db
    if (navigator.serviceWorker) restaurants = await DBHelper.getStoredRestaurants();
    // if we have data to show then we pass it immediately.
    if (restaurants.length > 0) {
      callback(null, restaurants);
    }

    try {
      // fetch from the network
      const response = await fetch(`${DBHelper.DATABASE_URL}/restaurants`);
      if (response.status === 200) {
        // Got a success response from server!
        restaurants = await response.json();

        // store data from network on indexed db
        if (navigator.serviceWorker) DBHelper.addRestaurantsToIDB(restaurants);
        // update webpagw with new data
        callback(null, restaurants);
      } else {
        callback('Could not fetch restaurants', null);
      }
    } catch (error) {
      callback(error, null);
    }
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static async fetchRestaurantById(id, callback) {
    let restaurant;
    if (navigator.serviceWorker) restaurant = await DBHelper.getStoredRestaurantById(Number(id));

    // if we have data to show then we pass it immediately.
    if (restaurant) {
      callback(null, restaurant);
    }
    try {
      const response = await fetch(`${DBHelper.DATABASE_URL}/restaurants/${id}`);
      if (response.status === 200) {
        // Got a success response from server!
        const restaurant = await response.json();

        if (navigator.serviceWorker) DBHelper.addRestaurantToIDB(restaurant);
        // update webpage with new data
        callback(null, restaurant);
      } else {
        callback('Restaurant does not exist', null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
  /**
   * Fetch a restaurant reviews by its ID.
   */
  static async fetchRestaurantReviews(id, callback) {
    let reviews = [];
    let storedReviews = [];
    let offlineReviews = [];

    if (navigator.serviceWorker) {
      storedReviews = await DBHelper.getStoredRestaurantReviews(Number(id));
      // get offline reviews that havent been synced
      offlineReviews = await DBHelper.getOfflineReviews(Number(id));
    }

    reviews = [...(storedReviews && storedReviews), ...(offlineReviews && offlineReviews)];
    // if we have data to show then we pass it immediately.
    if (reviews && reviews.length > 0) {
      callback(null, reviews);
    }
    try {
      const response = await fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${id}`);
      if (response.status === 200) {
        // Got a success response from server!
        const reviews = await response.json();
        if (navigator.serviceWorker) DBHelper.addReviewsToIDB(reviews);
        // update webpage with new data
        callback(null, [...reviews, ...(offlineReviews && offlineReviews)]);
      } else {
        callback('Could not fetch reviews', null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter((r) => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter((r) => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') {
          // filter by cuisine
          results = results.filter((r) => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') {
          // filter by neighborhood
          results = results.filter((r) => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }
  /**
   * Add restaurants to IDB.
   */

  static async addRestaurantsToIDB(restaurants) {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');

    restaurants.forEach((restaurant) => store.put(restaurant));

    // limit data stored in indexed db
    store
      .openCursor(null, 'prev')
      .then((cursor) => cursor.advance(30))
      .then(function deleteRest(cursor) {
        if (!cursor) return;
        cursor.delete();
        return cursor.continue().then(deleteRest);
      });
    return tx.complete;
  }
  /**
   * Add a restaurant to IDB.
   */

  static async addRestaurantToIDB(restaurant) {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    // update restaurant on indexed db
    store.put(restaurant);
    return tx.complete;
  }

  /**
   * Add reviews to IDB.
   */

  static async addReviewsToIDB(reviews) {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('reviews', 'readwrite');
    const store = tx.objectStore('reviews');
    reviews.forEach((review) => store.put(review));
    return tx.complete;
  }
  /**
   * Add review to IDB.
   */

  static async addReviewToIDB(review) {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('reviews', 'readwrite');
    const store = tx.objectStore('reviews');
    store.put(review);
    return tx.complete;
  }
  /**
   * Add offline review.
   */
  static async addOfflineReview(review, callback) {
    try {
      if (navigator.serviceWorker && window.SyncManager) {
        const db = await DBHelper.openDatabase();
        if (!db) return;
        const tx = db.transaction('offlineReviews', 'readwrite');
        const store = tx.objectStore('offlineReviews');
        store.put(review);
        callback(null, review);
        // Request for notification permission
        if (Notification.permission !== 'granted') {
          await DBHelper.requestNotificationPermission();
        }
        // register a sync
        navigator.serviceWorker.ready
          .then((reg) => {
            return reg.sync.register('syncReviews');
          })
          .catch((err) => console.log(err));
      } else {
        DBHelper.postReview(review, callback);
      }
    } catch (error) {
      callback('Error adding review!', null);
    }
  }
  /**
   * Get offline review.
   */
  static async getOfflineReviews(id) {
    const db = await DBHelper.openDatabase();
    //if we showing posts or very first time of the page loading.
    //we don't need to go to idb
    if (!db) return;

    const tx = db.transaction('offlineReviews');
    const store = tx.objectStore('offlineReviews');
    const index = store.index('restaurant_id', 'date');

    return index.getAll(id);
  }
  /**
   * Delete offline review from IDB.
   */
  static async deleteOfflineReviewFromIDB(id) {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('offlineReviews', 'readwrite');
    const store = tx.objectStore('offlineReviews');
    store.delete(id);
    return tx.complete;
  }
  /**
   * Add a new review
   */
  static async postReview(data, callback = () => {}) {
    try {
      const response = await fetch(`${DBHelper.DATABASE_URL}/reviews`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (response.status === 201) {
        const responseData = await response.json();
        callback(null, responseData);
        return responseData;
      }
    } catch (error) {
      callback('Error adding review', null);
      return error;
    }
  }
  /**
   * Add offline favorite.
   */
  static async addOfflineFavourite(restaurant_id, isFavourite, callback = () => {}) {
    try {
      if (navigator.serviceWorker && window.SyncManager) {
        const db = await DBHelper.openDatabase();
        if (!db) return;
        const tx = db.transaction('offlineFavorites', 'readwrite');
        const store = tx.objectStore('offlineFavorites');
        store.put({ restaurant_id, isFavourite });
        callback(null, 'Liked');
        // register a sync
        navigator.serviceWorker.ready
          .then((reg) => {
            return reg.sync.register('syncFavourites');
          })
          .catch((err) => console.log(err));
      } else {
        DBHelper.toggleRestaurantFavoriteStatus(restaurant_id, isFavourite, callback);
      }
    } catch (error) {
      callback(error, null);
    }
  }
  /**
   * Delete offline favorite from IDB.
   */
  static async deleteOfflineFavoriteFromIDB(id) {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('offlineFavorites', 'readwrite');
    const store = tx.objectStore('offlineFavorites');
    store.delete(id);
    return tx.complete;
  }
  /**
   * Toggle a restaurants favourite status
   */
  static async toggleRestaurantFavoriteStatus(restaurant_id, isFavourite, callback = () => {}) {
    try {
      const response = await fetch(
        `${DBHelper.DATABASE_URL}/restaurants/${restaurant_id}?is_favorite=${!isFavourite}`,
        {
          method: 'PUT',
        },
      );
      if (response.status === 200) {
        const responseData = await response.json();
        callback(null, responseData);
        console.log(responseData);
      }
    } catch (error) {
      callback(error, null);
      return error;
    }
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}`;
  }
  /**
   * Generate source set for image.
   */
  static imageSrcSetForRestaurant(imageUrl) {
    return `${imageUrl}-small.jpg 320w, ${imageUrl}-medium.jpg 480w, ${imageUrl}-large.jpg 800w`;
  }
  /**
   * Generate source sizes for image.
   */
  static imageSizesForRestaurant() {
    return '(max-width: 320px) 280px, (max-width: 480px) 440px, 800px';
  }
  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP,
    });
    return marker;
  }
  /**
   * Lazy load images.
   */
  static lazyLoadImages() {
    let lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

    if (
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype
    ) {
      let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove('lazy');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });

      lazyImages.forEach((lazyImage) => {
        lazyImageObserver.observe(lazyImage);
      });
    }
  }

  static async requestNotificationPermission() {
    const response = await Notification.requestPermission();
    if (response === 'granted') {
      return true;
    }
    return false;
  }
}

export default DBHelper;
