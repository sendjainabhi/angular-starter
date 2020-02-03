import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from './items.gql';
import { GridOptions } from 'ag-grid-community';
import {NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('addUpdateForm' , {static: false}) addUpdateForm: NgForm;
  title = 'AngularRX';
  items: any;
  actionType = 'Add';
  columnDefs = [
    {headerName: 'Title', field: 'title' },
    {headerName: 'Description', field: 'description' },
    {headerName: 'Price', field: 'price'},
    {headerName: 'Edit', field: 'edit', cellRenderer: this.editCellRenderer, },
    {headerName: 'Delete', field: 'delete', cellRenderer: this.deleteCellRenderer, },
];
gridOptions: GridOptions;

  constructor(private apollo: Apollo){

  }

  ngOnInit() {
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
    const eGui = document.createElement('span');
    const icon = '/assets/icons/edit.png';
    eGui.innerHTML = '<img width="20px" style="cursor: pointer;" src="' + icon + '" />';
    return eGui;
  }

  deleteCellRenderer() {
    const eGui = document.createElement('span');
    const icon = '/assets/icons/delete.png';
    eGui.innerHTML = '<img width="20px" style="cursor: pointer;" src="' + icon + '" />';
    return eGui;
  }

  onAddUpdate(form) {
    if (this.actionType === 'Add') {
      // Need to call Add service request
    } else if ( this.actionType === 'Update') {
      // Need to call Update service request
    }
    this.onResetForm();
  }

  onCellClicked(evt) {
    switch (evt.column.colId) {
      case 'delte':
        // Need to call Delete Service request
      break;
      case 'edit':
        this.addUpdateForm.setValue({
          title: evt.data.title,
          description: evt.data.description,
          price: evt.data.price
        });
        this.actionType = 'Update';
        break;

    }
  }

  onResetForm() {
    this.addUpdateForm.reset();
    this.actionType = 'Add';
  }

}
