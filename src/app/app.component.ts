import { Component, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import {  DELETE_ITEM_MUTATION, CREATE_ITEM_MUTATION, UPDATE_ITEM_MUTATION, GET_ALL_ITEMS, GET_ALL_ITEMS_MD } from './items.gql';
import { GridOptions } from 'ag-grid-community';
import { NgForm } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointObserverService } from './services/breakpoint-observer.service';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public size$: Observable<string>;
  @ViewChild('addUpdateForm', { static: false }) addUpdateForm: NgForm;
  @ViewChild('itemsGrid', { static: false }) itemsGrid: AgGridAngular;
  title = 'AngularRX';
  items: any;
  slectedItem: any;
  latestSize: string;
  actionType = 'Add';
  columnDefs = [];
  cellRenderers = [
    { headerName: 'Edit', field: 'edit', cellRenderer: this.editCellRenderer, cellStyle: { 'text-align': 'center' }, width: 80, },
    { headerName: 'Delete', field: 'delete', cellRenderer: this.deleteCellRenderer, cellStyle: { 'text-align': 'center'}, width: 80, },
  ];
  gridOptions: GridOptions;

  constructor(private apollo: Apollo, private breakpointObserver: BreakpointObserver,
              private breakpointservce: BreakpointObserverService) {
    this.size$ = breakpointservce.size$;
  }


  generateColumns(items: any[]) {
    let columnDefinitions = [];
    // tslint:disable-next-line: forin
    for (const key in items[0]) {
      if (key !== '__typename') {
        const mappedColumn = {
          headerName: key.toUpperCase(),
          field: key
        };
        columnDefinitions.push(mappedColumn);
      }
    }
    return columnDefinitions;
  }

  ngOnInit() {
    this.showColumnsByWindowSize();
    this.getAllItems();
  }

  getAllItems() {
    this.apollo
      .watchQuery({
        query: GET_ALL_ITEMS
      })
      .valueChanges.subscribe(result => {
        this.items = result.data['items'];
        this.columnDefs = this.generateColumns(this.items);
        this.columnDefs = [...this.columnDefs, ...this.cellRenderers];
        this.itemsGrid.gridOptions.api.setColumnDefs(this.columnDefs );
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
    } else if (this.actionType === 'Update') {
      this.apollo.mutate<any>({
        mutation: UPDATE_ITEM_MUTATION,
        variables: {
          id: this.slectedItem.id,
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
        this.slectedItem = evt.data;
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

  showColumnsByWindowSize() {
    this.size$.subscribe(value => {
      this.latestSize = value;
      if (value === 'md') {
        this.apollo
          .watchQuery({
            query: GET_ALL_ITEMS_MD
          })
          .valueChanges.subscribe(result => {
            this.items = result.data['items'];
            this.columnDefs = this.generateColumns(this.items);
            console.log(this.items);
          });
      }
    });
  }

}
