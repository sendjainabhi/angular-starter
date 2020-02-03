import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
export type ItemsQuery = {
    items: Item[];
  }

export type Item = {
  id: number;
  name: string;
  title: string;
  description: string;
}


export const DELETE_ITEM_MUTATION = gql`
mutation deleteItemMutation($id:String!){
  deleteItem(id: $id){
    id
    title
    price
    description
  }
}
`;

export const CREATE_ITEM_MUTATION = gql`
mutation createItemMutation($title:String!, $price: Int!, $description: String!){
  createItem(input:{title: $title, price: $price, description: $description}){
    title
    price
    description
    id
  }
}
`;

export const UPDATE_ITEM_MUTATION = gql`
mutation updateItemMutation($id:String!, $title:String!, $price: Int!, $description: String!){
  updateItem(id: $id, input:{title: $title, price: $price, description: $description}){
    title
    price
    description
    id
  }
}
`;

export const GET_ALL_ITEMS =  gql`
query getallitemsQuery
{
  items{
    title,
    id,
    price,
    description
  }
}
`;
