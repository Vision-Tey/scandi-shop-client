import axios, { AxiosResponse } from "axios";

const baseURL = "http://0.0.0.0:8000/public/graphql";

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
