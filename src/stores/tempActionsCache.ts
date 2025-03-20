type ActionType = "likes" | "saves" | "cart" | "follows" | "reviews";

class TempActionsCache {
  private static instance: TempActionsCache;
  private caches: Map<ActionType, Map<string, boolean>> = new Map();

  private constructor() {
    this.caches.set("likes", new Map());
    this.caches.set("saves", new Map());
    this.caches.set("cart", new Map());
    this.caches.set("follows", new Map());
    this.caches.set("reviews", new Map());
  }

  public static getInstance(): TempActionsCache {
    if (!TempActionsCache.instance) {
      TempActionsCache.instance = new TempActionsCache();
    }
    return TempActionsCache.instance;
  }

  public set(type: ActionType, id: string, value: boolean): void {
    const cache = this.caches.get(type);
    if (cache) {
      cache.set(id, value);
    }
  }

  public get(type: ActionType, id: string): boolean {
    const cache = this.caches.get(type);
    return cache ? cache.get(id) || false : false;
  }

  public clear(type?: ActionType): void {
    if (type) {
      const cache = this.caches.get(type);
      if (cache) {
        cache.clear();
      }
    } else {
      this.caches.forEach((cache) => cache.clear());
    }
  }

  public remove(type: ActionType, id: string): void {
    const cache = this.caches.get(type);
    if (cache) {
      cache.delete(id);
    }
  }

  public getAllIds(type: ActionType): string[] {
    const cache = this.caches.get(type);
    return cache ? Array.from(cache.keys()) : [];
  }

  public has(type: ActionType, id: string): boolean {
    const cache = this.caches.get(type);
    return cache ? cache.has(id) : false;
  }

  public getSize(type: ActionType): number {
    const cache = this.caches.get(type);
    return cache ? cache.size : 0;
  }
}

const tempActions = TempActionsCache.getInstance();
export default tempActions;

export const getActualProductLike = (productId: string, serverLikeState: boolean) => {
  if (tempActions.has("likes", productId)) return tempActions.get("likes", productId);
  return serverLikeState;
};

export const getActualProductSave = (productId: string, serverSaveState: boolean) => {
  if (tempActions.has("saves", productId)) return tempActions.get("saves", productId);
  return serverSaveState;
};

export const getActualProductCart = (productId: string, serverCartState: boolean) => {
  if (tempActions.has("cart", productId)) return tempActions.get("cart", productId);
  return serverCartState;
};

export const getActualProductReview = (productId: string, serverReviewState: boolean) => {
  if (tempActions.has("reviews", productId)) return tempActions.get("reviews", productId);
  return serverReviewState;
};

export const getActualVendorFollow = (vendorId: string, serverFollowState: boolean) => {
  if (tempActions.has("follows", vendorId)) return tempActions.get("follows", vendorId);
  return serverFollowState;
};
