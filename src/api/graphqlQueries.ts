import { gql } from '@apollo/client';

const allProducts = `
query {
    categories {
        name
        __typename
    }
    products {
        id
        name
        inStock
        description
        category
        brand
        gallery
        attributes {
            name
            items {
                displayValue
                value
                id
            }
        }
        prices {
            amount
            currency {
                label
                symbol
            }
        }
    }
}
`;

const createOrderMutation = gql`
  mutation CreateOrder(
    $customer_name: String!,
    $customer_email: String!,
    $customer_address: String!,
    $status: String!,
    $total_price: Float!,
    $products: [OrderProductInput!]!
  ) {
    createOrder(
      customer_name: $customer_name,
      customer_email: $customer_email,
      customer_address: $customer_address,
      status: $status,
      total_price: $total_price,
      products: $products
    )
  }
`;

export {
    allProducts,
    createOrderMutation
}