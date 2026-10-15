"use client";

import React from "react";
import {useTable, useSortBy} from "react-table";
import type {CellProps, Column} from "react-table";
import {FaCheck, FaSort, FaSortUp, FaSortDown} from "react-icons/fa";
import {Table} from 'react-bootstrap';
import books from "../../pages/Library/books.json";
import type {Book} from "../../pages/Library/book";
import './LibraryTable.scss';

const realBooks: Book[] = books.filter(book => book.Titolo);
const LibraryTable = () => {
    const columns = React.useMemo<Column<Book>[]>(
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
                Cell: ({value}: CellProps<Book>) => (
                    <span className="libraryTable__read">
                        {value === 'TRUE'
                            ? <><FaCheck aria-hidden="true" /><span className="visually-hidden">Yes</span></>
                            : <span className="visually-hidden">No</span>}
                    </span>
                ),
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
            <caption className="visually-hidden">My books, sortable by column</caption>
            <thead>
            {// Loop over the header rows
                headerGroups.map(headerGroup => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {// Loop over the headers in each row
                            headerGroup.headers.map(column => {
                                // The sort toggle lives on a <button> (not the
                                // <th>) so it is keyboard operable; aria-sort
                                // exposes the current order to screen readers.
                                // (react-table's default "Toggle SortBy" title is dropped.)
                                const toggleProps = column.getSortByToggleProps({title: undefined})
                                return (
                                    // Apply the header cell props
                                    <th
                                        {...column.getHeaderProps()}
                                        aria-sort={column.isSorted ? (column.isSortedDesc ? 'descending' : 'ascending') : 'none'}
                                    >
                                        <button type="button" className="libraryTable__sortButton" {...toggleProps}>
                                            <span className="libraryTable__sorting" aria-hidden="true">
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? <FaSortDown />
                                                        : <FaSortUp />
                                                    : <FaSort />}
                                            </span>
                                            {// Render the header
                                                column.render('Header')}
                                        </button>
                                    </th>
                                )
                            })}
                    </tr>
                ))}
            </thead>
            {/* Apply the table body props */}
            {/* Book data is mostly Italian. */}
            <tbody lang="it" {...getTableBodyProps()}>
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