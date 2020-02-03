import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item, DELETE_ITEM_MUTATION, CREATE_ITEM_MUTATION, UPDATE_ITEM_MUTATION, GET_ALL_ITEMS } from './items.gql';
import { GridOptions } from 'ag-grid-community';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('addUpdateForm', { static: false }) addUpdateForm: NgForm;
  title = 'AngularRX';
  items: any;
  actionType = 'Add';
  columnDefs = [
    { headerName: 'Title', field: 'title' },
    { headerName: 'Description', field: 'description' },
    { headerName: 'Price', field: 'price' },
    { headerName: 'Edit', field: 'edit', cellRenderer: this.editCellRenderer, },
    { headerName: 'Delete', field: 'delete', cellRenderer: this.deleteCellRenderer, },
  ];
  gridOptions: GridOptions;

  constructor(private apollo: Apollo) {

  }

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: GET_ALL_ITEMS
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
      this.apollo.mutate<any>({
        mutation: CREATE_ITEM_MUTATION,
        variables: {
          title: form.value.title,
          price: parseInt(form.value.price),
          description: form.value.description
        },
        refetchQueries: [{
          query: GET_ALL_ITEMS
        }]
      }).subscribe((response) => {
      });
      // Need to call Add service request
    } else if (this.actionType === 'Update') {
      this.apollo.mutate<any>({
        mutation: UPDATE_ITEM_MUTATION,
        variables: {
          id:"5e3890ff5942863f5c9daf50",
          title: form.value.title,
          price: parseInt(form.value.price),
          description: form.value.description
        },
        refetchQueries: [{
          query: GET_ALL_ITEMS
        }]
      }).subscribe((response) => {

      });
    }
    this.onResetForm();
  }

  onCellClicked(evt) {
    switch (evt.column.colId) {
      case 'delete':
        this.apollo.mutate<any>({
          mutation: DELETE_ITEM_MUTATION,
          variables: {
            id: evt.data.id
          },
          refetchQueries: [{
            query: GET_ALL_ITEMS
          }]
        }).subscribe((response) => {
        });
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
