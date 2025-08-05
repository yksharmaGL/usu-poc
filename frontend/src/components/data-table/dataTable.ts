import { Components } from '@formio/js';
import editForm from './dataTable.form';

const FieldComponent = (Components as any).components.field;

export default class DataTableComponent extends FieldComponent {
  public data: any[] = [];
  public displayData: any[] = [];
  public selectedRows: Set<string> = new Set();
  public pagination: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1
  };
  public sortState: any = {
    column: null,
    direction: null
  };
  public loading: boolean = false;

  static schema(...extend: any[]) {
    return FieldComponent.schema({
      type: 'datatable',
      label: 'Data Table',
      key: 'dataTable',
      input: true,
      tableView: false,
      
      // Data Table specific properties (matching Form.io structure)
      fetch: {
        enabled: false,
        sourceType: 'url',
        url: '',
        method: 'GET',
        headers: [],
        authenticate: false
      },
      
      // Components array for columns (like Form.io premium)
      components: [],
      
      // Display settings
      sortable: true,
      filterable: true,
      searchable: true,
      pagination: true,
      itemsPerPage: 10,
      
      // Selection settings
      selectable: false,
      multiSelect: false,
      submitSelectedRows: false
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Data Table',
      group: 'premium',
      icon: 'fa fa-table',
      weight: 80,
      documentation: '/userguide/form-building/form-components/premium-components#data-table',
      schema: DataTableComponent.schema()
    };
  }

  static editForm = editForm;

  constructor(component: any, options: any, data: any) {
    super(component, options, data);
    this.pagination.itemsPerPage = this.component.itemsPerPage || 10;
    this.init();
  }

  get defaultSchema() {
    return DataTableComponent.schema();
  }

  get emptyValue() {
    return this.component.submitSelectedRows ? [] : null;
  }

  get isBuilderMode() {
    return this.options && this.options.builder;
  }

  init() {
    if (this.component.fetch?.enabled && !this.isBuilderMode) {
      this.loadData();
    }
  }

  async loadData() {
    if (!this.component.fetch?.enabled) return;

    this.loading = true;
    
    try {
      let url = this.component.fetch.url || '';
      
      // Support Form.io URL interpolation
      url = this.interpolate(url, this.root?.data || {});
      
      const options: RequestInit = {
        method: this.component.fetch.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.buildHeaders()
        }
      };

      if (this.component.fetch.authenticate && this.options.formio) {
        options.headers = {
          ...options.headers,
          ...this.options.formio.headers
        };
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data = await response.json();
      
      // Handle Form.io resource format
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          this.data = data;
        } else if (data.data && Array.isArray(data.data)) {
          this.data = data.data;
        } else if (data.results && Array.isArray(data.results)) {
          this.data = data.results;
        } else {
          this.data = [data];
        }
      } else {
        this.data = [];
      }
      
      this.updateDisplayData();
      this.emit('dataLoaded', this.data);
      
    } catch (error) {
      console.error('Error loading data table data:', error);
      this.data = [];
      this.updateDisplayData();
    } finally {
      this.loading = false;
    }
  }

  buildHeaders() {
    const headers: Record<string, string> = {};
    
    if (this.component.fetch?.headers) {
      this.component.fetch.headers.forEach((header: any) => {
        if (header.key && header.value) {
          headers[header.key] = this.interpolate(header.value, this.root?.data || {});
        }
      });
    }
    
    return headers;
  }

  updateDisplayData() {
    if (this.isBuilderMode) return;

    let processedData = [...this.data];

    // Apply sorting if enabled
    if (this.component.sortable && this.sortState.column) {
      processedData = this.applySorting(processedData);
    }

    this.pagination.totalItems = processedData.length;
    this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);

    // Apply pagination
    if (this.component.pagination) {
      const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      const endIndex = startIndex + this.pagination.itemsPerPage;
      this.displayData = processedData.slice(startIndex, endIndex);
    } else {
      this.displayData = processedData;
    }

    this.redraw();
  }

  applySorting(data: any[]) {
    if (!this.sortState.column || !this.sortState.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = this.getValueByPath(a, this.sortState.column);
      const bValue = this.getValueByPath(b, this.sortState.column);
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = aValue.toString().localeCompare(bValue.toString());
      }
      
      return this.sortState.direction === 'desc' ? -comparison : comparison;
    });
  }

  getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Form.io integration methods
  render() {
    return super.render(this.renderTemplate('datatable', {
      component: this.component,
      data: this.displayData,
      components: this.component.components || [],
      pagination: this.pagination,
      sortState: this.sortState,
      loading: this.loading,
      isBuilderMode: this.isBuilderMode,
      selectedRows: Array.from(this.selectedRows),
      
      // Display settings
      sortable: this.component.sortable,
      filterable: this.component.filterable,
      searchable: this.component.searchable,
      selectable: this.component.selectable,
      multiSelect: this.component.multiSelect,
      showPagination: this.component.pagination
    }));
  }

  attach(element: HTMLElement) {
    this.loadRefs(element, {
      table: 'single',
      sortButtons: 'multiple',
      paginationButtons: 'multiple',
      itemsPerPageSelect: 'single',
      selectAllCheckbox: 'single',
      rowCheckboxes: 'multiple'
    });

    this.attachEventListeners();
    
    return super.attach(element);
  }

  attachEventListeners() {
    // Sort buttons
    if (this.refs.sortButtons) {
      this.refs.sortButtons.forEach((button: HTMLElement) => {
        this.addEventListener(button, 'click', () => {
          const columnKey = button.getAttribute('data-column');
          if (columnKey) {
            this.handleSort(columnKey);
          }
        });
      });
    }

    // Pagination buttons
    if (this.refs.paginationButtons) {
      this.refs.paginationButtons.forEach((button: HTMLElement) => {
        this.addEventListener(button, 'click', () => {
          const page = parseInt(button.getAttribute('data-page') || '1');
          this.handlePageChange(page);
        });
      });
    }

    // Items per page
    if (this.refs.itemsPerPageSelect) {
      this.addEventListener(this.refs.itemsPerPageSelect, 'change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        this.pagination.itemsPerPage = parseInt(target.value);
        this.pagination.currentPage = 1;
        this.updateDisplayData();
      });
    }

    // Row selection
    if (this.refs.rowCheckboxes) {
      this.refs.rowCheckboxes.forEach((checkbox: HTMLInputElement, index: number) => {
        this.addEventListener(checkbox, 'change', (event: Event) => {
          const target = event.target as HTMLInputElement;
          this.handleRowSelection(index, target.checked);
        });
      });
    }

    // Select all
    if (this.refs.selectAllCheckbox) {
      this.addEventListener(this.refs.selectAllCheckbox, 'change', (event: Event) => {
        const target = event.target as HTMLInputElement;
        this.handleSelectAll(target.checked);
      });
    }
  }

  handleSort(columnKey: string) {
    if (this.sortState.column === columnKey) {
      // Toggle sort direction
      if (this.sortState.direction === 'asc') {
        this.sortState.direction = 'desc';
      } else if (this.sortState.direction === 'desc') {
        this.sortState.column = null;
        this.sortState.direction = null;
      }
    } else {
      this.sortState.column = columnKey;
      this.sortState.direction = 'asc';
    }

    this.updateDisplayData();
  }

  handlePageChange(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.updateDisplayData();
    }
  }

  handleRowSelection(rowIndex: number, selected: boolean) {
    if (!this.component.selectable) return;

    const row = this.displayData[rowIndex];
    if (!row) return;

    const rowId = row._id || row.id || rowIndex.toString();

    if (selected) {
      this.selectedRows.add(rowId);
    } else {
      this.selectedRows.delete(rowId);
    }

    this.updateValue();
  }

  handleSelectAll(selected: boolean) {
    if (!this.component.selectable || !this.component.multiSelect) return;

    this.displayData.forEach((row, index) => {
      const rowId = row._id || row.id || index.toString();
      
      if (selected) {
        this.selectedRows.add(rowId);
      } else {
        this.selectedRows.delete(rowId);
      }
    });

    this.updateValue();
  }

  updateValue() {
    if (this.component.submitSelectedRows) {
      const selectedData = this.data.filter((row, index) => {
        const rowId = row._id || row.id || index.toString();
        return this.selectedRows.has(rowId);
      });
      this.dataValue = selectedData;
    } else {
      this.dataValue = Array.from(this.selectedRows);
    }
    
    super.updateValue(this.dataValue, { modified: true });
  }

  getValue() {
    if (this.component.submitSelectedRows) {
      return this.data.filter((row, index) => {
        const rowId = row._id || row.id || index.toString();
        return this.selectedRows.has(rowId);
      });
    }
    return Array.from(this.selectedRows);
  }

  setValue(value: any, flags: any = {}) {
    // Ensure this.data is always an array
    if (!Array.isArray(this.data)) {
      this.data = [];
    }

    if (Array.isArray(value)) {
      this.selectedRows.clear();
      value.forEach(id => this.selectedRows.add(id.toString()));
      this.updateDisplayData();
    }
    
    return super.setValue(value, flags);
  }
}
