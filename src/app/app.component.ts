import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from './items.gql';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AngularRX';
  items: any;//Observable<Item[]>;
  columnDefs = [
    {headerName: 'Make', field: 'title' },
    {headerName: 'Model', field: 'description' },
    {headerName: 'Price', field: 'price'}
];


  constructor(private apollo: Apollo){

  }

  ngOnInit(){
   this.apollo
    .watchQuery({
      query: gql`
        {
          items{
            title,
            id,
            price,
            description
          }
        }
      `,
    })
    .valueChanges.subscribe(result => {
      this.items = result.data['items'];
      console.log(this.items);
    });
  }

}
