import React from "react";
import {useTable, useSortBy} from "react-table";
import {FaCheck, FaSort, FaSortUp, FaSortDown} from "react-icons/fa";
import {Table} from 'react-bootstrap';
import books from "../../pages/Library/books.json";
import './LibraryTable.scss';

const realBooks = books.filter(book => book.Titolo);
const LibraryTable = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Title',
                accessor: 'Titolo',
            },
            {
                Header: 'Author',
                accessor: 'Autore',
            },
            {
                Header: 'Publishing House',
                accessor: 'Casa editrice',
            },
            {
                Header: 'Read',
                accessor: 'Letto',
                Cell: ({value}) => <span className="libraryTable__read">{value === 'TRUE' ? <FaCheck /> : null}</span>,
            },
        ],
        []
    )

    const tableInstance = useTable({ columns, data: realBooks }, useSortBy)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
        // apply the table props
        <Table striped bordered hover className="libraryTable" {...getTableProps()}>
            <thead>
            {// Loop over the header rows
                headerGroups.map(headerGroup => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {// Loop over the headers in each row
                            headerGroup.headers.map(column => (
                                // Apply the header cell props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    <span className="libraryTable__sorting">
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <FaSortDown />
                                                : <FaSortUp />
                                            : <FaSort />}
                                    </span>
                                    {// Render the header
                                        column.render('Header')}
                                </th>
                            ))}
                    </tr>
                ))}
            </thead>
            {/* Apply the table body props */}
            <tbody {...getTableBodyProps()}>
            {// Loop over the table rows
                rows.map(row => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                        // Apply the row props
                        <tr {...row.getRowProps()}>
                            {// Loop over the rows cells
                                row.cells.map(cell => {
                                    // Apply the cell props
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {// Render the cell contents
                                                cell.render('Cell')}
                                        </td>
                                    )
                                })}
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default LibraryTable;
