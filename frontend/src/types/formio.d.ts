import { Component } from '@formio/js';

export interface DataTableColumn {
  key: string;
  label: string;
  type: string;
  sortable: boolean;
  filterable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  input: boolean;
  tableView: boolean;
}

export interface DataTableComponentSchema {
  type: 'dataTable';
  key: string;
  label: string;
  input: boolean;
  tableView: boolean;
  
  // Column configuration for builder
  columns: DataTableColumn[];
  
  // Data fetching configuration
  fetch: {
    enabled: boolean;
    sourceType: 'url' | 'resource';
    url?: string;
    resource?: string;
    method?: 'GET' | 'POST';
    headers?: Array<{ key: string; value: string }>;
    authenticate?: boolean;
    cache?: boolean;
    transformData?: string;
  };
  
  // Display configuration
  display: {
    itemsPerPage: number;
    sortable: boolean;
    filterable: boolean;
    searchable: boolean;
    pagination: boolean;
    selectable: boolean;
    multiSelect: boolean;
    inlineEditing: boolean;
    showAddButton: boolean;
    showEditButton: boolean;
    showDeleteButton: boolean;
    showDeleteAllButton: boolean;
  };
  
  // Selection configuration
  selection: {
    submitSelectedRows: boolean;
    selectAllEnabled: boolean;
    selectionKey: string;
  };
}

export interface DataTableRow {
  [key: string]: any;
  _selected?: boolean;
  _id?: string;
  _tableIndex?: number;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface SortState {
  column: string | null;
  direction:  'asc' | 'desc' | null;
}

export interface FilterState {
  [columnKey: string]: {
    value: string;
    operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  };
}


export interface SignatureComponentSchema {
  type: 'signature';
  key: string;
  label: string;
  input: boolean;
  tableView: boolean;
  
  // Signature-specific properties
  footerLabel: string;
  backgroundColor: string;
  penColor: string;
  minWidth: number;
  maxWidth: number;
  width: string;
  height: string;
  
  // Signature options
  signatureOptions: {
    provider: 'default' | 'box';
    velocityFilterWeight: number;
    minDistance: number;
    throttle: number;
    dotSize: number;
    strokeStyle: string;
    lineWidth: number;
  };
  
  // Display options
  showFooter: boolean;
  clearOnResize: boolean;
  
  // Validation
  validate: {
    required: boolean;
    custom: string;
    customMessage: string;
  };
}

export interface SignatureData {
  signature: string; // base64 data URL
  isEmpty: boolean;
  timestamp: number;
}
