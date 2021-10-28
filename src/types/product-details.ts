export interface ProductDetails {
  name: { en: string };
  productType: ProductTypeDetails | ProductTypeDetailsDraft;
  slug: { en: string };
}

export interface ProductTypeDetails {
  id: string;
}

export interface ProductTypeDetailsDraft {
  key: string;
  name: string;
  description: string;
}

export interface ProductDescription {
  en: string;
}