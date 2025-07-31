'use client'
import { Components, Utils } from '@formio/js';
import editForm from './dataTable.form';
import {
    DataTableComponentSchema,
    DataTableColumn,
    DataTableRow,
    PaginationState,
    SortState,
    FilterState
} from '../../types/formio';

const FieldComponent = (Components as any).components.field;

export default class DataTableComponent extends FieldComponent {
    public data: DataTableRow[] = [];
    public filteredData: DataTableRow[] = [];
    public displayData: DataTableRow[] = [];
    public selectedRows: Set<string> = new Set();
    public pagination: PaginationState = {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    };
    public sortState: SortState = {
        column: null,
        direction: null
    };
    public filterState: FilterState = {};
    public searchQuery: string = '';
    public loading: boolean = false;
    public columnBuilder: boolean = false;
    public editingColumn: DataTableColumn | null = null;
    public editingColumnIndex: number = -1;

    declare component: DataTableComponentSchema;

    static schema(...extend: any[]): DataTableComponentSchema {
        return FieldComponent.schema({
            type: 'dataTable',
            label: 'Data Table',
            key: 'dataTable',
            input: true,
            tableView: false,

            // Column configuration for builder
            columns: [],

            // Fetch configuration
            fetch: {
                enabled: false,
                sourceType: 'url' as const,
                url: '',
                method: 'GET' as const,
                headers: [],
                authenticate: false,
                cache: true,
                transformData: ''
            },

            // Display configuration
            display: {
                itemsPerPage: 10,
                sortable: true,
                filterable: true,
                searchable: true,
                pagination: true,
                selectable: true,
                multiSelect: true,
                inlineEditing: false,
                showAddButton: true,
                showEditButton: true,
                showDeleteButton: true,
                showDeleteAllButton: false
            },

            // Selection configuration
            selection: {
                submitSelectedRows: false,
                selectAllEnabled: true,
                selectionKey: '_id'
            }
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: 'Data Table',
            group: 'premium',
            icon: 'fa fa-table',
            weight: 80,
            documentation: '/developers/custom-components#data-table',
            schema: DataTableComponent.schema()
        };
    }

    static editForm = editForm;

    constructor(component: any, options: any, data: any) {
        super(component, options, data);

        // Ensure component has required structure
        if (!this.component.columns) {
            this.component.columns = [];
        }

        if (!this.component.display) {
            this.component.display = {
                itemsPerPage: 10,
                sortable: true,
                filterable: true,
                searchable: true,
                pagination: true,
                selectable: true,
                multiSelect: true,
                inlineEditing: false,
                showAddButton: true,
                showEditButton: true,
                showDeleteButton: true,
                showDeleteAllButton: false
            };
        }

        if (!this.component.fetch) {
            this.component.fetch = {
                enabled: false,
                sourceType: 'url',
                url: '',
                method: 'GET',
                headers: [],
                authenticate: false,
                cache: true,
                transformData: ''
            };
        }

        if (!this.component.selection) {
            this.component.selection = {
                submitSelectedRows: false,
                selectAllEnabled: true,
                selectionKey: '_id'
            };
        }

        this.pagination.itemsPerPage = this.component.display?.itemsPerPage || 10;
        this.initializeComponent();
    }

    get defaultSchema() {
        return DataTableComponent.schema();
    }

    get emptyValue() {
        return this.component.selection?.submitSelectedRows ? [] : null;
    }

    get isBuilderMode() {
        return this.options && this.options.builder;
    }

    get hasColumns() {
        return this.component.columns && this.component.columns.length > 0;
    }

    initializeComponent(): void {
        if (this.component.fetch?.enabled && !this.isBuilderMode) {
            this.loadData();
        } else {
            this.data = [];
            this.updateDisplayData();
        }
    }

    // Column management methods for builder
    addColumn(): void {
        this.editingColumn = {
            label: '',
            key: '',
            type: 'textfield',
            input: true,
            tableView: true,
            sortable: true,
            filterable: false,
            width: '',
            align: 'left'
        };
        this.editingColumnIndex = -1;
        this.columnBuilder = true;
        this.redraw();
    }

    editColumn(index: number): void {
        this.editingColumn = { ...this.component.columns[index] };
        this.editingColumnIndex = index;
        this.columnBuilder = true;
        this.redraw();
    }

    saveColumn(): void {
        if (!this.editingColumn) return;

        // Validate required fields
        if (!this.editingColumn.label || !this.editingColumn.key) {
            alert('Label and Property Name are required');
            return;
        }

        // Check for duplicate keys
        const isDuplicate = this.component.columns.some((col: DataTableColumn, index: number) =>
            col.key === this.editingColumn!.key && index !== this.editingColumnIndex
        );

        if (isDuplicate) {
            alert('Property Name must be unique');
            return;
        }

        if (this.editingColumnIndex >= 0) {
            // Update existing column
            this.component.columns[this.editingColumnIndex] = { ...this.editingColumn };
        } else {
            // Add new column
            this.component.columns.push({ ...this.editingColumn });
        }

        this.cancelColumnEdit();
        this.rebuild();
    }

    cancelColumnEdit(): void {
        this.columnBuilder = false;
        this.editingColumn = null;
        this.editingColumnIndex = -1;
        this.redraw();
    }

    removeColumn(index: number): void {
        if (confirm('Are you sure you want to remove this column?')) {
            this.component.columns.splice(index, 1);
            this.rebuild();
        }
    }

    moveColumn(fromIndex: number, direction: 'up' | 'down'): void {
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

        if (toIndex < 0 || toIndex >= this.component.columns.length) return;

        const columns = [...this.component.columns];
        [columns[fromIndex], columns[toIndex]] = [columns[toIndex], columns[fromIndex]];
        this.component.columns = columns;
        this.rebuild();
    }

    // ... rest of the methods remain the same as in the previous implementation
    async loadData(): Promise<void> {
        if (!this.component.fetch?.enabled) return;

        this.loading = true;

        try {
            let url = this.component.fetch.url || '';

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

            if (this.component.fetch.transformData) {
                const transformFunction = new Function('data', this.component.fetch.transformData);
                data = transformFunction(data);
            }

            if (!Array.isArray(data)) {
                if (data.data && Array.isArray(data.data)) {
                    data = data.data;
                } else {
                    data = [data];
                }
            }

            this.data = data.map((item: any, index: number) => ({
                ...item,
                _tableIndex: index,
                _selected: false
            }));

            this.updateDisplayData();
            this.emit('dataLoaded', this.data);

        } catch (error) {
            console.error('Error loading data table data:', error);
            this.emit('dataLoadError', error);
            this.data = [];
            this.updateDisplayData();
        } finally {
            this.loading = false;
        }
    }

    buildHeaders(): Record<string, string> {
        const headers: Record<string, string> = {};

        if (this.component.fetch?.headers) {
            this.component.fetch.headers.forEach(header => {
                if (header.key && header.value) {
                    headers[header.key] = this.interpolate(header.value, this.root?.data || {});
                }
            });
        }

        return headers;
    }

    updateDisplayData(): void {
        if (this.isBuilderMode) return;

        let processedData = [...this.data];

        if (this.searchQuery && this.component.display?.searchable) {
            processedData = this.applyGlobalSearch(processedData);
        }

        if (this.component.display?.filterable) {
            processedData = this.applyFilters(processedData);
        }

        if (this.sortState.column && this.component.display?.sortable) {
            processedData = this.applySorting(processedData);
        }

        this.filteredData = processedData;
        this.pagination.totalItems = processedData.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);

        if (this.component.display?.pagination) {
            const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
            const endIndex = startIndex + this.pagination.itemsPerPage;
            this.displayData = processedData.slice(startIndex, endIndex);
        } else {
            this.displayData = processedData;
        }

        this.redraw();
    }

    applyGlobalSearch(data: DataTableRow[]): DataTableRow[] {
        if (!this.searchQuery.trim()) return data;

        const query = this.searchQuery.toLowerCase();
        return data.filter(row => {
            return this.component.columns.some((column: DataTableColumn) => {
                const value = row[column.key];
                return value && value.toString().toLowerCase().includes(query);
            });
        });
    }

    applyFilters(data: DataTableRow[]): DataTableRow[] {
        return data.filter(row => {
            return Object.entries(this.filterState).every(([columnKey, filter]) => {
                if (!filter.value) return true;

                const cellValue = row[columnKey];
                if (cellValue == null) return false;

                const value = cellValue.toString().toLowerCase();
                const filterValue = filter.value.toLowerCase();

                switch (filter.operator) {
                    case 'contains':
                        return value.includes(filterValue);
                    case 'equals':
                        return value === filterValue;
                    case 'startsWith':
                        return value.startsWith(filterValue);
                    case 'endsWith':
                        return value.endsWith(filterValue);
                    case 'greaterThan':
                        return parseFloat(value) > parseFloat(filterValue);
                    case 'lessThan':
                        return parseFloat(value) < parseFloat(filterValue);
                    default:
                        return true;
                }
            });
        });
    }

    applySorting(data: DataTableRow[]): DataTableRow[] {
        if (!this.sortState.column || !this.sortState.direction) return data;

        return [...data].sort((a, b) => {
            const aValue = a[this.sortState.column!];
            const bValue = b[this.sortState.column!];

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

    // Form.io integration methods
    render() {
        return super.render(this.renderTemplate('dataTable', {
            component: this.component,
            data: this.displayData,
            columns: this.component.columns || [],
            pagination: this.pagination,
            sortState: this.sortState,
            filterState: this.filterState,
            searchQuery: this.searchQuery,
            selectedRows: Array.from(this.selectedRows),
            loading: this.loading,
            isBuilderMode: this.isBuilderMode,
            hasColumns: this.hasColumns,
            columnBuilder: this.columnBuilder,
            editingColumn: this.editingColumn,
            editingColumnIndex: this.editingColumnIndex,
            // Display settings
            selectable: this.component.display?.selectable && !this.isBuilderMode,
            multiSelect: this.component.display?.multiSelect,
            searchable: this.component.display?.searchable && !this.isBuilderMode,
            sortable: this.component.display?.sortable && !this.isBuilderMode,
            filterable: this.component.display?.filterable && !this.isBuilderMode,
            showPagination: this.component.display?.pagination && !this.isBuilderMode,
            inlineEditing: this.component.display?.inlineEditing,
            showAddButton: this.component.display?.showAddButton,
            showEditButton: this.component.display?.showEditButton,
            showDeleteButton: this.component.display?.showDeleteButton,
            showDeleteAllButton: this.component.display?.showDeleteAllButton
        }));
    }

    attach(element: HTMLElement) {
        this.loadRefs(element, {
            table: 'single',
            searchInput: 'single',
            selectAllCheckbox: 'single',
            sortButtons: 'multiple',
            filterInputs: 'multiple',
            rowCheckboxes: 'multiple',
            paginationButtons: 'multiple',
            itemsPerPageSelect: 'single',
            // Column builder refs
            addColumnButton: 'single',
            columnList: 'single',
            columnBuilderModal: 'single',
            columnForm: 'single',
            saveColumnButton: 'single',
            cancelColumnButton: 'single',
            editColumnButtons: 'multiple',
            removeColumnButtons: 'multiple',
            moveUpButtons: 'multiple',
            moveDownButtons: 'multiple'
        });

        this.attachEventListeners();

        return super.attach(element);
    }

    attachEventListeners(): void {
        // Column builder event listeners
        if (this.refs.addColumnButton) {
            this.addEventListener(this.refs.addColumnButton, 'click', () => {
                this.addColumn();
            });
        }

        if (this.refs.saveColumnButton) {
            this.addEventListener(this.refs.saveColumnButton, 'click', () => {
                // Get form values
                const label = (document.getElementById('columnLabel') as HTMLInputElement)?.value;
                const key = (document.getElementById('columnKey') as HTMLInputElement)?.value;
                const type = (document.getElementById('columnType') as HTMLSelectElement)?.value;
                const width = (document.getElementById('columnWidth') as HTMLInputElement)?.value;
                const align = (document.getElementById('columnAlign') as HTMLSelectElement)?.value as 'left' | 'center' | 'right';
                const sortable = (document.getElementById('columnSortable') as HTMLInputElement)?.checked;
                const filterable = (document.getElementById('columnFilterable') as HTMLInputElement)?.checked;

                // Update editing column
                if (this.editingColumn) {
                    this.editingColumn.label = label;
                    this.editingColumn.key = key;
                    this.editingColumn.type = type;
                    this.editingColumn.width = width;
                    this.editingColumn.align = align;
                    this.editingColumn.sortable = sortable;
                    this.editingColumn.filterable = filterable;
                    this.editingColumn.input = true;
                    this.editingColumn.tableView = true;
                }

                this.saveColumn();
            });
        }

        if (this.refs.cancelColumnButton) {
            this.addEventListener(this.refs.cancelColumnButton, 'click', () => {
                this.cancelColumnEdit();
            });
        }

        // Edit column buttons
        if (this.refs.editColumnButtons) {
            this.refs.editColumnButtons.forEach((button: HTMLElement, index: number) => {
                this.addEventListener(button, 'click', () => {
                    this.editColumn(index);
                });
            });
        }

        // Remove column buttons
        if (this.refs.removeColumnButtons) {
            this.refs.removeColumnButtons.forEach((button: HTMLElement, index: number) => {
                this.addEventListener(button, 'click', () => {
                    this.removeColumn(index);
                });
            });
        }

        // Move column buttons
        if (this.refs.moveUpButtons) {
            this.refs.moveUpButtons.forEach((button: HTMLElement, index: number) => {
                this.addEventListener(button, 'click', () => {
                    this.moveColumn(index, 'up');
                });
            });
        }

        if (this.refs.moveDownButtons) {
            this.refs.moveDownButtons.forEach((button: HTMLElement, index: number) => {
                this.addEventListener(button, 'click', () => {
                    this.moveColumn(index, 'down');
                });
            });
        }

        // Regular data table event listeners
        if (this.refs.searchInput) {
            this.addEventListener(this.refs.searchInput, 'input', (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.handleSearch(target.value);
            });
        }

        if (this.refs.sortButtons) {
            this.refs.sortButtons.forEach((button: HTMLElement) => {
                this.addEventListener(button, 'click', (event: Event) => {
                    const columnKey = button.getAttribute('data-column');
                    if (columnKey) {
                        this.handleSort(columnKey);
                    }
                });
            });
        }

        if (this.refs.filterInputs) {
            this.refs.filterInputs.forEach((input: HTMLInputElement) => {
                this.addEventListener(input, 'input', (event: Event) => {
                    const target = event.target as HTMLInputElement;
                    const columnKey = target.getAttribute('data-column');
                    if (columnKey) {
                        this.handleFilter(columnKey, target.value);
                    }
                });
            });
        }

        if (this.refs.selectAllCheckbox) {
            this.addEventListener(this.refs.selectAllCheckbox, 'change', (event: Event) => {
                const target = event.target as HTMLInputElement;
                this.handleSelectAll(target.checked);
            });
        }

        if (this.refs.rowCheckboxes) {
            this.refs.rowCheckboxes.forEach((checkbox: HTMLInputElement, index: number) => {
                this.addEventListener(checkbox, 'change', (event: Event) => {
                    const target = event.target as HTMLInputElement;
                    this.handleRowSelection(index, target.checked);
                });
            });
        }

        if (this.refs.paginationButtons) {
            this.refs.paginationButtons.forEach((button: HTMLElement) => {
                this.addEventListener(button, 'click', (event: Event) => {
                    const page = parseInt(button.getAttribute('data-page') || '1');
                    this.handlePageChange(page);
                });
            });
        }

        if (this.refs.itemsPerPageSelect) {
            this.addEventListener(this.refs.itemsPerPageSelect, 'change', (event: Event) => {
                const target = event.target as HTMLSelectElement;
                this.pagination.itemsPerPage = parseInt(target.value);
                this.pagination.currentPage = 1;
                this.updateDisplayData();
            });
        }
    }

    // Event handler methods
    handleSort(columnKey: string): void {
        const column = this.component.columns.find((col: DataTableColumn) => col.key === columnKey);
        if (!column?.sortable) return;

        if (this.sortState.column === columnKey) {
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

    handleFilter(columnKey: string, value: string, operator: FilterState[string]['operator'] = 'contains'): void {
        if (value.trim()) {
            this.filterState[columnKey] = { value: value.trim(), operator };
        } else {
            delete this.filterState[columnKey];
        }

        this.pagination.currentPage = 1;
        this.updateDisplayData();
    }

    handleSearch(query: string): void {
        this.searchQuery = query;
        this.pagination.currentPage = 1;
        this.updateDisplayData();
    }

    handlePageChange(page: number): void {
        if (page >= 1 && page <= this.pagination.totalPages) {
            this.pagination.currentPage = page;
            this.updateDisplayData();
        }
    }

    handleRowSelection(rowIndex: number, selected: boolean): void {
        if (!this.component.display?.selectable) return;

        const row = this.displayData[rowIndex];
        if (!row) return;

        const selectionKey = this.component.selection?.selectionKey || '_tableIndex';
        const rowId = row[selectionKey]?.toString() || rowIndex.toString();

        if (selected) {
            this.selectedRows.add(rowId);
            row._selected = true;
        } else {
            this.selectedRows.delete(rowId);
            row._selected = false;
        }

        const originalRowIndex = this.data.findIndex(dataRow =>
            dataRow[selectionKey]?.toString() === rowId
        );
        if (originalRowIndex !== -1) {
            this.data[originalRowIndex]._selected = selected;
        }

        this.updateValue();
    }

    handleSelectAll(selected: boolean): void {
        if (!this.component.display?.selectable || !this.component.selection?.selectAllEnabled) return;

        const selectionKey = this.component.selection?.selectionKey || '_tableIndex';

        this.displayData.forEach((row, index) => {
            const rowId = row[selectionKey]?.toString() || index.toString();

            if (selected) {
                this.selectedRows.add(rowId);
            } else {
                this.selectedRows.delete(rowId);
            }

            row._selected = selected;
        });

        this.data.forEach(row => {
            const rowId = row[this.component.selection?.selectionKey || '_tableIndex']?.toString();
            if (rowId && this.selectedRows.has(rowId)) {
                row._selected = true;
            } else if (!selected) {
                row._selected = false;
            }
        });

        this.updateValue();
    }

    updateValue(): void {
        if (this.component.selection?.submitSelectedRows) {
            const selectedData = this.data.filter(row => row._selected);
            this.dataValue = selectedData;
        } else {
            this.dataValue = Array.from(this.selectedRows);
        }

        super.updateValue(this.dataValue, { modified: true });
    }

    getValue() {
        if (this.component.selection?.submitSelectedRows) {
            return this.data.filter(row => row._selected);
        }
        return Array.from(this.selectedRows);
    }

    setValue(value: any, flags: any = {}) {
        if (Array.isArray(value)) {
            this.selectedRows.clear();

            if (this.component.selection?.submitSelectedRows) {
                value.forEach((rowData: any) => {
                    const selectionKey = this.component.selection?.selectionKey || '_tableIndex';
                    const rowId = rowData[selectionKey]?.toString();
                    if (rowId) {
                        this.selectedRows.add(rowId);
                    }
                });
            } else {
                value.forEach(id => this.selectedRows.add(id.toString()));
            }
            if (Array.isArray(this.data)) {
                this.data.forEach(row => {
                    const selectionKey = this.component.selection?.selectionKey || '_tableIndex';
                    const rowId = row[selectionKey]?.toString();
                    row._selected = rowId ? this.selectedRows.has(rowId) : false;
                });
            }

            this.updateDisplayData();
        }

        return super.setValue(value, flags);
    }

    refresh(): void {
        if (this.component.fetch?.enabled) {
            this.loadData();
        }
    }
}
