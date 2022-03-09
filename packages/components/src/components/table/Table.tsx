import * as React from 'react';
import { Checkbox, Icon, Dropdown } from '..';
import SelectionStatus from '../selection/SelectionStatus';

export type TableProps = {
  items: { [key: string]: string }[];
  header: { [key: string]: string }[];
  rowsPerPage?: number;
  showSorting?: boolean;
  showPagination?: boolean;
  showCheckbox?: boolean;
};

export const Table: React.FC<TableProps> = ({
  items,
  header,
  showCheckbox,
  rowsPerPage,
  showSorting,
  showPagination,
}: TableProps) => {
  const [data, setData] = React.useState(items);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowNumber, setRowNumber] = React.useState(rowsPerPage);
  const [order, setOrder] = React.useState('DSC');
  const totalEntries = data.length;
  const [checkedState, setCheckedState] = React.useState(
    new Array(totalEntries).fill(false)
  );
  const [headingKey, setHeadingKey] = React.useState({
    company: true,
    contact: true,
    country: true,
  });

  const renderIcon = (key) => {
    if ([key] && headingKey[key]) {
      return <Icon iconName="drop-down" onClick={() => sortColumn(key)} />;
    } else {
      return <Icon iconName="drop-up" onClick={() => sortColumn(key)} />;
    }
  };

  const sortColumn = (key) => {
    if (!key) {
      return;
    }
    if (order === 'ASC') {
      const sorted = [...data].sort((a, b) => (a[key] < b[key] ? 1 : -1));
      setData(sorted);
      setOrder('DSC');
      setHeadingKey({ ...headingKey, [key]: true });
    } else if (order === 'DSC') {
      const sorted = [...data].sort((a, b) => (a[key] > b[key] ? 1 : -1));
      setData(sorted);
      setOrder('ASC');
      setHeadingKey({ ...headingKey, [key]: false });
    }
  };

  const handleRowsPerPageChange = (e) => {
    setCurrentPage(1);
    setRowNumber(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const updatedList = [...checkedState];
    updatedList[e.target.value] = e.target.checked;
    setCheckedState(updatedList);
  };

  console.log(checkedState);

  const checkboxIsChecked = (index) => {
    if (checkedState[index]) {
      return 'tk-table-checkbox-isChecked';
    }
  };

  const getRowsPerPages = (row) => {
    if (row.value) {
      return row.value;
    } else {
      return rowsPerPage;
    }
  };

  const getPage = (currentIndex, pageSize, array) => {
    const startIndex = (currentIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
  };

  const getTotalPages = (pageSize, array) => {
    const result = array.length / pageSize;
    return Math.ceil(result);
  };

  const hasNextPage = (currentPage, pageSize, array) => {
    const nextPageIndex = currentPage * pageSize;
    return nextPageIndex < array.length;
  };

  const GetStartIndexPerPage = (currentPage, pageSize) => {
    return (currentPage - 1) * pageSize;
  };

  const renderPagination = () => {
    return (
      <div className="tk-table-pagination">
        <Icon
          className={
            currentPage === 1 ? 'tk-table-button-disabled' : 'tk-table-button'
          }
          iconName="chevron-left"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        />
        <Icon
          className={
            currentPage <= 1 ? 'tk-table-button-disabled' : 'tk-table-button'
          }
          iconName="left"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        <p>Rows per page: </p>
        <Dropdown
          className="tk-table-dropdown"
          size="small"
          onChange={handleRowsPerPageChange}
          placeHolder={rowsPerPage.toString()}
          options={[
            {
              label: '5',
              value: 5,
            },
            {
              label: '10',
              value: 10,
            },
            {
              label: '25',
              value: 25,
            },
            {
              label: '50',
              value: 50,
            },
            {
              label: '100',
              value: 100,
            },
          ]}
        />
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <Icon
          className={nextPage ? 'tk-table-button' : 'tk-table-button-disabled'}
          iconName="right"
          disabled={!nextPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
        <Icon
          className={nextPage ? 'tk-table-button' : 'tk-table-button-disabled'}
          iconName="chevron-right"
          disabled={!nextPage}
          onClick={() => setCurrentPage(totalPages)}
        />
      </div>
    );
  };

  const page = getPage(currentPage, getRowsPerPages(rowNumber), data);
  const totalPages = getTotalPages(getRowsPerPages(rowNumber), data);
  const nextPage = hasNextPage(currentPage, getRowsPerPages(rowNumber), data);
  const startIndexPerPage = GetStartIndexPerPage(
    currentPage,
    getRowsPerPages(rowNumber)
  );

  return (
    <>
      <table className="tk-table">
        <thead>
          <tr>
            {showCheckbox && (
              <th className="tk-table-checkbox">
                <Checkbox disabled />{' '}
              </th>
            )}

            {header.map((value, index) => (
              <th key={index}>
                <h3>
                  {value.heading.toUpperCase()}
                  {showSorting && renderIcon(value.key)}
                </h3>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {page.map((column, index) => (
            <tr
              key={index}
              className={checkboxIsChecked(startIndexPerPage + index)}
            >
              {showCheckbox && (
                <td>
                  <Checkbox
                    status={
                      checkedState[startIndexPerPage + index]
                        ? SelectionStatus.CHECKED
                        : SelectionStatus.UNCHECKED
                    }
                    onChange={(e) => handleCheckboxChange(e)}
                    value={startIndexPerPage + index}
                  />
                </td>
              )}

              {header.map((columnItem, index) => {
                return <td key={index}>{column[columnItem.key]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {showPagination && renderPagination()}
      <div>Total entries: {totalEntries}</div>
    </>
  );
};

export default Table;