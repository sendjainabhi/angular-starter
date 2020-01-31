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