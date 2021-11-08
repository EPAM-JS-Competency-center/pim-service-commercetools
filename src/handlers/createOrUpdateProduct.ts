import { APIGatewayProxyHandler } from 'aws-lambda';
import { ProductDetails } from 'types/product-details';
import { HttpResponse } from '../helpers/HttpResponse';
import { CommerceToolsProvider } from '../providers';

const ctProvider = new CommerceToolsProvider(
  process.env as { [key: string]: string }
);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('Lambda Invocation Event: ', JSON.stringify(event));

    const productDetails = JSON.parse(event.body as string) as ProductDetails;
    console.log('Product Data: ', productDetails);

    let product = null;

    if ('id' in productDetails) {
      product = await ctProvider.updateProduct(
        productDetails.id,
        productDetails.description
      );

      console.log('Updated Product: ', product);
    } else {
      product = await ctProvider.createProduct(productDetails);

      console.log('Created Product: ', product);
    }

    return HttpResponse.success(product);
  } catch (e) {
    console.error('Error encountered', e);
    return HttpResponse.serverError(e);
  }
};
