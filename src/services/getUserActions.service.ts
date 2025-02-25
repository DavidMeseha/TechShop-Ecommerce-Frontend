import axios from "@/lib/axios";

export async function getLikeIds() {
  try {
    const res = await axios.get<string[]>("/api/common/likesId");
    return res.data;
  } catch {
    return [];
  }
}

export async function getSaveIds() {
  try {
    const res = await axios.get<string[]>("/api/common/savesId");
    return res.data;
  } catch {
    return [];
  }
}

export async function getFollowIds() {
  try {
    const res = await axios.get<string[]>("/api/common/followingIds");
    return res.data;
  } catch {
    return [];
  }
}

export async function getReviewIds() {
  try {
    const res = await axios.get<string[]>("/api/common/reviewedIds");
    return res.data;
  } catch {
    return [];
  }
}

export async function getCartIds() {
  try {
    const res = await axios.get<{ product: string; quantity: number }[]>("/api/common/cart/ids");
    return res.data;
  } catch {
    return [];
  }
}

export async function getUserActions() {
  try {
    const res = await axios.get<{
      reviews: string[];
      cart: { product: string; quantity: number }[];
      likes: string[];
      saves: string[];
      follows: string[];
    }>("/api/common/allActions");
    return res.data;
  } catch {
    return {
      reviews: [],
      cart: [],
      likes: [],
      saves: [],
      follows: []
    };
  }
}
