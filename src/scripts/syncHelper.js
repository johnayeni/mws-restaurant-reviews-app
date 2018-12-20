import DBHelper from './dbhelper';

class SyncHelper {
  static async getOfflineReviews() {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('offlineReviews');
    const store = tx.objectStore('offlineReviews');

    return store.getAll();
  }

  static async syncReviews() {
    const offlineReviews = await SyncHelper.getOfflineReviews();
    return offlineReviews.map(async (review) => {
      const offlineReviewID = review.id;
      delete review.id;
      const data = await DBHelper.postReview(review);
      await DBHelper.addReviewToIDB(data);
      await DBHelper.deleteOfflineReviewFromIDB(offlineReviewID);
      return;
    });
  }

  static async getOfflineFavorites() {
    const db = await DBHelper.openDatabase();
    if (!db) return;
    const tx = db.transaction('offlineFavorites');
    const store = tx.objectStore('offlineFavorites');

    return store.getAll();
  }

  static async syncFavorites() {
    const offlineFavorites = await SyncHelper.getOfflineFavorites();
    return offlineFavorites.map(async (favorite) => {
      const data = await DBHelper.toggleRestaurantFavoriteStatus(
        favorite.restaurant_id,
        favorite.isFavorite,
      );
      await DBHelper.addRestaurantToIDB(data);
      await DBHelper.deleteOfflineFavoriteFromIDB(favorite.restaurant_id);
      return;
    });
  }

  static async clearStore(storeName) {
    const db = await DBHelper.openDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    return tx.complete;
  }
}

export default SyncHelper;
