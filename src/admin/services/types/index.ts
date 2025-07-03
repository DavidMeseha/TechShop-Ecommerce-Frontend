export type Value = {
  id: string;
  name: string;
  price_adjustment_value: number;
  color_rgb: string;
};

export type Attribute = {
  id: string;
  name: string;
  attribute_control_type: string;
  values: Value[];
};

export type Product = {
  id: string;
  name: string;
  se_name: string;
  sku: string;
  description: string;
  has_attributes: boolean;
  attributes: Attribute[];
  stock: number;
  likes: number;
  saves: number;
  carts: number;
  product_review_overview: {
    rating_sum: number;
    total_reviews: number;
  };
  gender: string;
  category: string;
  tags: string[];
  vendor: string;
  pictures: [
    {
      image_url: string;
      title: string;
      alternate_text: string;
    }
  ];
  in_stock: boolean;
  deleted: boolean;
  price: {
    old_price: number;
    price: number;
  };
  created_at: string;
  updated_at: string;
};

export interface PaginatedResponse<Data> {
  data: Data[];
  currentPage: number;
  nextPage: number;
  previousPage: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
  totalCount: number;
}

export interface Vendor {
  id: string;
  name: string;
  se_name: string;
  image_url: string;
  product_count: number;
  followers_count: number;
  user: string;
}

export interface Tag {
  id: string;
  name: string;
  seName: string;
}
