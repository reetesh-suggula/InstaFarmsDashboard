import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const AgGridTable = ({ columnDefs, rowData, rowHeight=null }) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [searchText, setSearchText] = useState('');

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const expandRow = (rowNode) => {
    rowNode.setExpanded(!rowNode.expanded);
  };

  const rowClicked = (event) => {
    if (event.data) {
      expandRow(event.node);
    }
  };

  const onSearchTextChange = (event) => {
    setSearchText(event.target.value);
    gridApi?.setQuickFilter(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={onSearchTextChange}
      />
      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%', overflow:'visible' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          rowGroupPanelShow="always"
          onRowClicked={rowClicked}
          rowHeight={rowHeight}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          suppressRowClickSelection={true}
          autoHeight={true}
          suppressRowTransform={true}
          suppressCellFocus={true}
          suppressCellSelection={true}
        />
      </div>
    </div>
  );
};

export default AgGridTable;


