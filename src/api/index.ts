import axios, { AxiosResponse } from "axios";

const baseURL = "https://scanditestserver-nhst8lyo.b4a.run/public/graphql";

// Type definition for the response data
interface GraphQLResponse<T> {
  data: T;
  errors?: any[];
}

// Generic type for the query response
const fetchProducts = async <T>(query: string, params: any[] = []): Promise<GraphQLResponse<T> | undefined> => {
  try {
    const response: AxiosResponse<GraphQLResponse<T>> = await axios.post(
      baseURL,
      { query, params },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return undefined;
  }
};

export default fetchProducts;
