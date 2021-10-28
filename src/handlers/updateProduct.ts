import { APIGatewayProxyHandler } from 'aws-lambda';
import { HttpResponse } from '../helpers/HttpResponse';
import { validate } from '../helpers/validate';
import { CommerceToolsProvider } from '../providers';
import { productSkuSchema } from '../schemas/productSkuSchema';

const ctProvider = new CommerceToolsProvider(
  process.env as { [key: string]: string }
);

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Lambda Invocation Event: ', JSON.stringify(event));

  try {
    await validate(productSkuSchema, event.pathParameters);
  } catch (e) {
    return HttpResponse.badRequest(e);
  }

  try {
    const productSku = event.pathParameters?.productSku as string;
    console.log('Product ID: ', productSku);

    const updateData = JSON.parse(event.body as string);
    console.log('Product Data for Update: ', updateData);

    const product = await ctProvider.updateProduct(
      productSku,
      updateData.description
    );

    console.log('Updated Product: ', product);

    return HttpResponse.success(product);
  } catch (e) {
    console.error('Error encountered', e);
    return HttpResponse.serverError(e);
  }
};
