export type ProductDetails =
  | {
      name: { en: string };
      productType: ProductTypeDetails | ProductTypeDetailsDraft;
      slug: { en: string };
    }
  | {
      id: string;
      description: ProductDescription;
    };

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
