import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from './items.gql';
import { GridOptions } from 'ag-grid-community';

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
    {headerName: 'Price', field: 'price'},
    {headerName: 'Edit', field: 'edit', cellRenderer: this.editCellRenderer,},
    {headerName: 'Delete', field: 'delete', cellRenderer: this.deleteCellRenderer,},
];
gridOptions: GridOptions;

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
  editCellRenderer() {
    var eGui = document.createElement("span");
    var imgForMood = '/assets/icons/edit.png';
    eGui.innerHTML = '<img width="20px" src="' + imgForMood + '" />';
    return eGui;
  }

  deleteCellRenderer() {
    var eGui = document.createElement("span");
    var imgForMood = '/assets/icons/delete.png';
    eGui.innerHTML = '<img width="20px" src="' + imgForMood + '" />';
    return eGui;
  }

}
