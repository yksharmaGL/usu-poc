'use client'

export default function dataTableTemplate(ctx: any): string {
  const { 
    component, 
    data, 
    components,
    pagination, 
    sortState, 
    loading,
    isBuilderMode,
    selectedRows,
    sortable, 
    selectable, 
    showPagination 
  } = ctx;

  // Get column definitions from components
  const columns = components || [];

  return `
    <div class="formio-component formio-component-datatable" data-component-key="${component.key}">
      ${component.label && !component.hideLabel ? `
        <label class="control-label">
          ${component.label}
          ${component.validate?.required ? '<span class="field-required">*</span>' : ''}
        </label>
      ` : ''}

      ${isBuilderMode ? `
        <!-- Builder Mode -->
        <div class="alert alert-info">
          <strong>Data Table (Premium Component)</strong><br>
          Configure columns and data source in the component settings.
          ${!columns.length ? '<br><em>No columns configured.</em>' : ''}
        </div>
        
        ${columns.length ? `
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  ${columns.map((col: any) => `<th>${col.label || col.key}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  ${columns.map(() => '<td><em>Sample data</em></td>').join('')}
                </tr>
              </tbody>
            </table>
          </div>
        ` : ''}
      ` : `
        <!-- Runtime Mode -->
        ${loading ? `
          <div class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ` : `
          ${data.length === 0 ? `
            <div class="alert alert-info">No data available</div>
          ` : `
            <div class="table-responsive">
              <table class="table table-striped table-hover" ref="table">
                <thead class="thead-dark">
                  <tr>
                    ${selectable ? `
                      <th style="width: 50px;">
                        <input type="checkbox" class="form-check-input" ref="selectAllCheckbox">
                      </th>
                    ` : ''}
                    
                    ${columns.map((col: any) => `
                      <th>
                        <div class="d-flex justify-content-between align-items-center">
                          <span>${col.label || col.key}</span>
                          ${sortable ? `
                            <button 
                              type="button" 
                              class="btn btn-sm btn-link p-0" 
                              data-column="${col.key}"
                              ref="sortButtons"
                            >
                              <i class="fa ${
                                sortState.column === col.key 
                                  ? (sortState.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down')
                                  : 'fa-sort'
                              }"></i>
                            </button>
                          ` : ''}
                        </div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                
                <tbody>
                  ${data.map((row:any, index: any) => `
                    <tr>
                      ${selectable ? `
                        <td>
                          <input 
                            type="checkbox" 
                            class="form-check-input" 
                            ref="rowCheckboxes"
                            ${selectedRows.includes((row._id || row.id || index).toString()) ? 'checked' : ''}
                          >
                        </td>
                      ` : ''}
                      
                      ${columns.map((col: any) => `
                        <td>${row[col.key] != null ? String(row[col.key]) : ''}</td>
                      `).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            ${showPagination && pagination.totalPages > 1 ? `
              <nav aria-label="Data table pagination">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <small class="text-muted">
                      Showing ${((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to 
                      ${Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                      of ${pagination.totalItems} entries
                    </small>
                  </div>
                  
                  <ul class="pagination pagination-sm mb-0">
                    <li class="page-item ${pagination.currentPage === 1 ? 'disabled' : ''}">
                      <button class="page-link" data-page="${pagination.currentPage - 1}" ref="paginationButtons">
                        Previous
                      </button>
                    </li>
                    
                    ${Array.from({length: pagination.totalPages}, (_, i) => i + 1).map(page => `
                      <li class="page-item ${page === pagination.currentPage ? 'active' : ''}">
                        <button class="page-link" data-page="${page}" ref="paginationButtons">
                          ${page}
                        </button>
                      </li>
                    `).join('')}
                    
                    <li class="page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}">
                      <button class="page-link" data-page="${pagination.currentPage + 1}" ref="paginationButtons">
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
            ` : ''}
          `}
        `}
      `}
    </div>
  `;
}
