export interface SearchMetadata {
  id: string;
  status: string;
  json_endpoint: string;
  created_at: string;
  processed_at: string;
  google_shopping_url: string;
  raw_html_file: string;
  total_time_taken: number;
}

export interface SearchParameters {
  engine: string;
  q: string;
  location_requested: string;
  location_used: string;
  google_domain: string;
  hl: string;
  gl: string;
  start: number;
  num: string;
  device: string;
}

export interface SearchInformation {
  shopping_results_state: string;
}

export interface ShoppingResult {
  position: number;
  title: string;
  product_link: string;
  product_id: string;
  serpapi_product_api: string;
  immersive_product_page_token: string;
  serpapi_immersive_product_api: string;
  source: string;
  source_icon: string;
  price: string;
  extracted_price: number;
  old_price?: string;
  extracted_old_price?: number;
  rating?: number;
  reviews?: number;
  thumbnail: string;
  delivery?: string;
  extensions?: string[];
  tag?: string;
}

export interface ShoppingSearchResponse {
  search_metadata: SearchMetadata;
  search_parameters: SearchParameters;
  search_information: SearchInformation;
  shopping_results: ShoppingResult[];
}
