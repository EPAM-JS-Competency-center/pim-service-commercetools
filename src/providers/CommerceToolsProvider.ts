// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createClient } from '@commercetools/sdk-client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import {
  Product,
  ProductType,
  createApiBuilderFromCtpClient,
} from '@commercetools/typescript-sdk';
import { ByProjectKeyRequestBuilder } from '@commercetools/typescript-sdk/dist/typings/generated/client/by-project-key-request-builder';
import fetch from 'node-fetch';
import {
  ProductDetails,
  ProductTypeDetailsDraft,
} from 'types/product-details';

export class CommerceToolsProvider {
  private api: ByProjectKeyRequestBuilder;

  constructor(env: { [key: string]: string }) {
    const {
      CTP_PROJECT_KEY,
      CTP_CLIENT_SECRET,
      CTP_CLIENT_ID,
      CTP_AUTH_URL,
      CTP_API_URL,
      CTP_SCOPES,
    } = env;

    const projectKey = CTP_PROJECT_KEY as string;

    const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
      host: CTP_AUTH_URL,
      projectKey,
      credentials: {
        clientId: CTP_CLIENT_ID,
        clientSecret: CTP_CLIENT_SECRET,
      },
      scopes: [CTP_SCOPES],
      fetch,
    });
    const httpMiddleware = createHttpMiddleware({
      host: CTP_API_URL,
      fetch,
    });
    const client = createClient({
      middlewares: [authMiddleware, httpMiddleware],
    });

    // Create an API root from API builder of commercetools platform client
    const apiRoot = createApiBuilderFromCtpClient(client);

    this.api = apiRoot.withProjectKey({ projectKey });
  }

  private async fetchProductTypeById(
    productTypeId: string
  ): Promise<ProductType | null> {
    const res = await this.api
      .productTypes()
      .withId({ ID: productTypeId })
      .get()
      .execute();

    return res.statusCode === 404 ? null : res.body;
  }

  private async addProductType(
    productTypeDetails: ProductTypeDetailsDraft
  ): Promise<ProductType> {
    const res = await this.api
      .productTypes()
      .post({
        body: productTypeDetails,
      })
      .execute();

    return res.body;
  }

  private async addProduct(
    productDetails: ProductDetails,
    productTypeId: string
  ) {
    const res = await this.api
      .products()
      .post({
        body: {
          name: productDetails.name,
          productType: { typeId: 'product-type', id: productTypeId },
          slug: productDetails.slug,
        },
      })
      .execute();

    return res.body;
  }

  async createProduct(productDetails: ProductDetails): Promise<Product | null> {
    console.log('CommerceToolsProvider: Creating Product...');

    let productTypeId = null;
    const { productType } = productDetails;

    if ('id' in productType) {
      productTypeId = productType.id;
      console.log('CommerceToolsProvider: Checking Product Type...');

      const existingProductType = await this.fetchProductTypeById(
        productTypeId
      );

      if (!existingProductType) {
        console.log(
          'CommerceToolsProvider: Product Type Not Found: ',
          productTypeId
        );

        return null;
      }
    } else {
      console.log(
        'CommerceToolsProvider: Creating NEW Product Type: ',
        productType
      );

      const { id } = await this.addProductType(productType);

      productTypeId = id;
    }

    return this.addProduct(productDetails, productTypeId);
  }

  async updateProduct(
    productId: string,
    description: { en: string }
  ): Promise<Product> {
    console.log('CommerceToolsProvider: Updating Product Description...');

    const res = await this.api
      .products()
      .withId({ ID: productId })
      .post({
        body: {
          version: 1,
          actions: [{ action: 'setDescription', description }],
        },
      })
      .execute();

    return res.body;
  }
}
