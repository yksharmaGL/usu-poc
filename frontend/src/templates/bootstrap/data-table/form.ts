import { DataTableRow, DataTableColumn, PaginationState, SortState, FilterState } from '../../../types/formio';

interface DataTableTemplateContext {
  component: any;
  data: DataTableRow[];
  columns: DataTableColumn[];
  pagination: PaginationState;
  sortState: SortState;
  filterState: FilterState;
  searchQuery: string;
  selectedRows: string[];
  loading: boolean;
  isBuilderMode: boolean;
  hasColumns: boolean;
  columnBuilder: boolean;
  editingColumn: DataTableColumn | null;
  editingColumnIndex: number;
  selectable: boolean;
  multiSelect: boolean;
  searchable: boolean;
  sortable: boolean;
  filterable: boolean;
  showPagination: boolean;
  inlineEditing: boolean;
  showAddButton: boolean;
  showEditButton: boolean;
  showDeleteButton: boolean;
  showDeleteAllButton: boolean;
}

export default function dataTableTemplate(ctx: DataTableTemplateContext): string {
  const { 
    component, 
    data, 
    columns, 
    pagination, 
    sortState, 
    filterState, 
    loading,
    isBuilderMode,
    hasColumns,
    columnBuilder,
    editingColumn,
    editingColumnIndex,
    selectable, 
    searchable, 
    sortable, 
    filterable, 
    showPagination,
    inlineEditing,
    showAddButton,
    showEditButton,
    showDeleteButton,
    showDeleteAllButton
  } = ctx;

  return `
    <div class="formio-data-table-wrapper" data-component-key="${component.key}">
      <!-- Always show this structure for builder mode -->
      ${isBuilderMode ? `
        <!-- Builder Preview Panel Content -->
        <div class="data-table-preview-panel">
          <div class="data-table-header d-flex justify-content-between align-items-center mb-3">
            <span class="data-table-title">Data Table</span>
            <div class="items-per-page-control">
              <span class="me-2">Items per page:</span>
              <select class="form-select form-select-sm" style="width: auto; display: inline-block;">
                <option value="10">10</option>
              </select>
              <span class="ms-3 text-muted">No items</span>
              <nav class="d-inline-block ms-3">
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item disabled"><span class="page-link">«</span></li>
                  <li class="page-item disabled"><span class="page-link">‹</span></li>
                  <li class="page-item disabled"><span class="page-link">›</span></li>
                  <li class="page-item disabled"><span class="page-link">»</span></li>
                </ul>
              </nav>
            </div>
          </div>

          ${!hasColumns ? `
            <!-- No Columns State -->
            <div class="no-columns-state text-center py-5">
              <div class="position-relative">
                <div class="empty-message">
                  <p class="mb-1">No components have been set up to display in the Data Table.</p>
                </div>
                <div class="position-absolute" style="right: 0; bottom: 0;">
                  <button type="button" class="btn btn-success btn-lg rounded-circle" 
                          ref="addColumnButton" style="width: 50px; height: 50px;">
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
                <!-- Progress bar -->
                <div class="progress mt-3" style="height: 8px;">
                  <div class="progress-bar bg-secondary" style="width: 100%;"></div>
                </div>
              </div>
            </div>
          ` : `
            <!-- Has Columns State -->
            <div class="columns-configured-state">
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead class="table-light">
                    <tr>
                      ${columns.map(column => `
                        <th style="${column.width ? `width: ${column.width};` : ''} text-align: ${column.align || 'left'};">
                          <div class="d-flex justify-content-between align-items-center">
                            <span>${column.label}</span>
                            <div class="column-actions">
                              <button type="button" class="btn btn-sm btn-outline-primary me-1" 
                                      title="Edit Column" ref="editColumnButtons">
                                <i class="fa fa-edit"></i>
                              </button>
                              <button type="button" class="btn btn-sm btn-outline-danger" 
                                      title="Remove Column" ref="removeColumnButtons">
                                <i class="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </th>
                      `).join('')}
                      <th style="width: 60px;">
                        <button type="button" class="btn btn-success btn-sm" ref="addColumnButton">
                          <i class="fa fa-plus"></i>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      ${columns.map(() => `
                        <td class="text-muted text-center">
                          <small>No data</small>
                        </td>
                      `).join('')}
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `}
        </div>

        <!-- Column Builder Modal -->
        ${columnBuilder ? `
          <div class="modal d-block" style="background-color: rgba(0,0,0,0.5); z-index: 9999;" ref="columnBuilderModal">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Add row</h5>
                  <button type="button" class="btn-close" ref="cancelColumnButton" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form ref="columnForm">
                    <div class="mb-3">
                      <label class="form-label">Label <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" id="columnLabel" 
                             value="${editingColumn?.label || ''}" required>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Property Name <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" id="columnKey" 
                             value="${editingColumn?.key || ''}" required>
                    </div>
                    
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Component Type</label>
                          <select class="form-select" id="columnType">
                            <option value="textfield" ${editingColumn?.type === 'textfield' ? 'selected' : ''}>Text Field</option>
                            <option value="number" ${editingColumn?.type === 'number' ? 'selected' : ''}>Number</option>
                            <option value="email" ${editingColumn?.type === 'email' ? 'selected' : ''}>Email</option>
                            <option value="datetime" ${editingColumn?.type === 'datetime' ? 'selected' : ''}>Date/Time</option>
                            <option value="select" ${editingColumn?.type === 'select' ? 'selected' : ''}>Select</option>
                            <option value="checkbox" ${editingColumn?.type === 'checkbox' ? 'selected' : ''}>Checkbox</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Width</label>
                          <input type="text" class="form-control" id="columnWidth" 
                                 value="${editingColumn?.width || ''}" placeholder="e.g., 100px, 20%">
                        </div>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Alignment</label>
                      <select class="form-select" id="columnAlign">
                        <option value="left" ${editingColumn?.align === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${editingColumn?.align === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${editingColumn?.align === 'right' ? 'selected' : ''}>Right</option>
                      </select>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="columnSortable" 
                                 ${editingColumn?.sortable !== false ? 'checked' : ''}>
                          <label class="form-check-label" for="columnSortable">
                            Sortable
                          </label>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="columnFilterable" 
                                 ${editingColumn?.filterable ? 'checked' : ''}>
                          <label class="form-check-label" for="columnFilterable">
                            Filterable
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-success" ref="saveColumnButton">Save</button>
                  <button type="button" class="btn btn-secondary" ref="cancelColumnButton">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      ` : `
        <!-- Runtime Mode Interface -->
        <div class="data-table-runtime">
          <!-- Search Bar -->
          ${searchable ? `
            <div class="data-table-search mb-3">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fa fa-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search..." 
                  ref="searchInput"
                  value="${ctx.searchQuery || ''}"
                >
              </div>
            </div>
          ` : ''}

          <!-- Loading Indicator -->
          ${loading ? `
            <div class="data-table-loading text-center py-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ` : ''}

          <!-- Data Table -->
          <div class="data-table-container ${loading ? 'd-none' : ''}">
            ${hasColumns ? `
              <div class="table-responsive">
                <table class="table table-striped table-hover" ref="table">
                  <thead class="table-dark">
                    <tr>
                      ${selectable ? `
                        <th style="width: 50px;">
                          ${ctx.multiSelect ? `
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              ref="selectAllCheckbox"
                              ${data.length > 0 && data.every(row => row._selected) ? 'checked' : ''}
                            >
                          ` : ''}
                        </th>
                      ` : ''}
                      
                      ${columns.map(column => `
                        <th style="${column.width ? `width: ${column.width};` : ''} text-align: ${column.align || 'left'};">
                          <div class="d-flex align-items-center justify-content-between">
                            <span>${column.label}</span>
                            ${sortable && column.sortable ? `
                              <button 
                                type="button" 
                                class="btn btn-sm btn-link p-0 ms-2 sort-button" 
                                data-column="${column.key}"
                                ref="sortButtons"
                              >
                                <i class="fa ${
                                  sortState.column === column.key 
                                    ? (sortState.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down')
                                    : 'fa-sort'
                                }"></i>
                              </button>
                            ` : ''}
                          </div>
                        </th>
                      `).join('')}
                    </tr>
                    
                    ${filterable ? `
                      <tr class="filter-row">
                        ${selectable ? '<th></th>' : ''}
                        ${columns.map(column => `
                          <th>
                            ${column.filterable ? `
                              <input 
                                type="text" 
                                class="form-control form-control-sm" 
                                placeholder="Filter ${column.label}..."
                                data-column="${column.key}"
                                ref="filterInputs"
                                value="${filterState[column.key]?.value || ''}"
                              >
                            ` : ''}
                          </th>
                        `).join('')}
                      </tr>
                    ` : ''}
                  </thead>
                  
                  <tbody>
                    ${data.length === 0 ? `
                      <tr>
                        <td colspan="${columns.length + (selectable ? 1 : 0)}" class="text-center py-4 text-muted">
                          No data available
                        </td>
                      </tr>
                    ` : data.map((row, index) => `
                      <tr class="${row._selected ? 'table-active' : ''}">
                        ${selectable ? `
                          <td>
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              ref="rowCheckboxes"
                              ${row._selected ? 'checked' : ''}
                            >
                          </td>
                        ` : ''}
                        
                        ${columns.map(column => `
                          <td style="text-align: ${column.align || 'left'};">
                            ${row[column.key] != null ? String(row[column.key]) : ''}
                          </td>
                        `).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              ${showPagination && pagination.totalPages > 1 ? `
                <div class="data-table-pagination d-flex justify-content-between align-items-center mt-3">
                  <div class="pagination-info">
                    <span class="text-muted">
                      Showing ${((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to 
                      ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                      of ${pagination.totalItems} entries
                    </span>
                  </div>
                  
                  <div class="d-flex align-items-center">
                    <div class="me-3">
                      <label class="form-label me-2 mb-0">Items per page:</label>
                      <select class="form-select form-select-sm" ref="itemsPerPageSelect" style="width: auto;">
                        <option value="5" ${pagination.itemsPerPage === 5 ? 'selected' : ''}>5</option>
                        <option value="10" ${pagination.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="25" ${pagination.itemsPerPage === 25 ? 'selected' : ''}>25</option>
                        <option value="50" ${pagination.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                        <option value="100" ${pagination.itemsPerPage === 100 ? 'selected' : ''}>100</option>
                      </select>
                    </div>
                    
                    <nav aria-label="Data table pagination">
                      <ul class="pagination pagination-sm mb-0">
                        <li class="page-item ${pagination.currentPage === 1 ? 'disabled' : ''}">
                          <button 
                            class="page-link" 
                            data-page="1" 
                            ref="paginationButtons"
                            ${pagination.currentPage === 1 ? 'disabled' : ''}
                          >
                            <i class="fa fa-angle-double-left"></i>
                          </button>
                        </li>
                        
                        <li class="page-item ${pagination.currentPage === 1 ? 'disabled' : ''}">
                          <button 
                            class="page-link" 
                            data-page="${pagination.currentPage - 1}" 
                            ref="paginationButtons"
                            ${pagination.currentPage === 1 ? 'disabled' : ''}
                          >
                            <i class="fa fa-angle-left"></i>
                          </button>
                        </li>
                        
                        ${generatePaginationNumbers(pagination).map(page => 
                          typeof page === 'number' ? `
                            <li class="page-item ${page === pagination.currentPage ? 'active' : ''}">
                              <button 
                                class="page-link" 
                                data-page="${page}" 
                                ref="paginationButtons"
                              >
                                ${page}
                              </button>
                            </li>
                          ` : `
                            <li class="page-item disabled">
                              <span class="page-link">...</span>
                            </li>
                          `
                        ).join('')}
                        
                        <li class="page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
                          <button 
                            class="page-link" 
                            data-page="${pagination.currentPage + 1}" 
                            ref="paginationButtons"
                            ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}
                          >
                            <i class="fa fa-angle-right"></i>
                          </button>
                        </li>
                        
                        <li class="page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
                          <button 
                            class="page-link" 
                            data-page="${pagination.totalPages}" 
                            ref="paginationButtons"
                            ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}
                          >
                            <i class="fa fa-angle-double-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              ` : ''}
            ` : `
              <!-- No Columns Runtime State -->
              <div class="text-center text-muted py-5">
                <i class="fa fa-table fa-3x mb-3" style="color: #ccc;"></i>
                <h5>No Columns Configured</h5>
                <p>This Data Table has no columns configured. Configure columns in the form builder to display data.</p>
              </div>
            `}
          </div>
        </div>
      `}

      <style>
        .formio-data-table-wrapper {
          margin-bottom: 1rem;
        }
        
        .data-table-preview-panel {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          padding: 1rem;
          min-height: 200px;
        }
        
        .data-table-header {
          font-size: 0.875rem;
          color: #6c757d;
        }
        
        .data-table-title {
          font-weight: 600;
          color: #495057;
        }
        
        .no-columns-state {
          background-color: white;
          border: 1px solid #e9ecef;
          border-radius: 0.375rem;
          padding: 2rem;
          position: relative;
          min-height: 150px;
        }
        
        .empty-message {
          color: #6c757d;
          margin-bottom: 2rem;
        }
        
        .columns-configured-state .table {
          background-color: white;
          margin-bottom: 0;
        }
        
        .columns-configured-state .table th {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 0.75rem;
        }
        
        .column-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .columns-configured-state .table th:hover .column-actions {
          opacity: 1;
        }
        
        .data-table-container .table th {
          border-top: none;
          font-weight: 600;
          background-color: var(--bs-dark);
          color: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .data-table-container .filter-row th {
          background-color: var(--bs-light);
          border-bottom: 2px solid var(--bs-border-color);
          padding: 0.5rem;
        }
        
        .data-table-container .table tbody tr:hover {
          background-color: var(--bs-light);
        }
        
        .data-table-container .table tbody tr.table-active {
          background-color: var(--bs-primary-bg-subtle);
        }
        
        .sort-button {
          color: white !important;
          text-decoration: none !important;
        }
        
        .sort-button:hover {
          color: var(--bs-primary) !important;
        }
        
        .data-table-loading {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pagination-info {
          font-size: 0.875rem;
        }
        
        .progress-bar {
          background-color: #6c757d !important;
        }
        
        /* Modal z-index fix */
        .modal {
          z-index: 1050;
        }
        
        .modal-backdrop {
          z-index: 1040;
        }
        
        @media (max-width: 768px) {
          .data-table-pagination {
            flex-direction: column;
            gap: 1rem;
          }
          
          .pagination-info {
            order: 2;
          }
          
          .data-table-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
        }
      </style>
    </div>
  `;
}

function generatePaginationNumbers(pagination: PaginationState): (number | string)[] {
  const { currentPage, totalPages } = pagination;
  const delta = 2;
  const pages: (number | string)[] = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (currentPage > delta + 2) {
      pages.push('...');
    }
    
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - delta - 1) {
      pages.push('...');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
}
