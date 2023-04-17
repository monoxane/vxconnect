import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate, { getAxiosPrivate } from '../hooks/useAxiosPrivate';
import {
    Button,
    Column,
    Grid,
    InlineLoading,
    Row,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    TableToolbarContent,
    TableSelectRow,
    TableSelectAll,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TextInput,
    Select,
    SelectItem,
    InlineNotification,
    Theme,
    Checkbox,
    Pagination,
    Search,
    ExpandableSearch,
    Breadcrumb,
    BreadcrumbItem,
    CodeSnippet,
    NumberInput,
    DataTableSkeleton,
    BreadcrumbSkeleton,
    Tag
} from "carbon-components-react";
import { Add, Edit, TrashCan, Error, Renew, UserMultiple } from "@carbon/icons-react";
import StateManager from "../components/StateManager"

const headers = [
    {
        key: 'username',
        header: 'Name',
        sortable: true
    },
    {
        key: 'id',
        header: 'ID',
        sortable: false
    },
    {
        key: 'roles',
        header: 'Roles',
        sortable: false
    },
    {
        key: 'zones',
        header: 'Zones',
        sortable: false
    },
    {
        key: 'created_at',
        header: 'Created',
        sortable: true
    },
    {
        key: 'updated_at',
        header: 'Updated',
        sortable: true
    }
]

const roleColours = [
    {
        role: 'GLOBAL_ADMIN',
        colour: 'purple'
    },
    {
        role: 'ADMIN',
        colour: 'red'
    },
    {
        role: 'USER',
        colour: 'green'
    }
]

const Users = function Users() {
    const axios = getAxiosPrivate()
    const navigate = useNavigate()
    const [{ data, loading, error }, refresh] = useAxiosPrivate()(
        '/api/v1/users'
    )
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('username');

    if (error) return error.Message
    if (loading & !data) {
        return (
            <>
                <BreadcrumbSkeleton />
                <br />
                <br />
                <Grid>
                    <Column lg={16}>
                        <DataTableSkeleton />
                    </Column>
                </Grid>
            </>
        )
    }
    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    const sortedData = data.results.sort((a, b) => {
        const compare = a[sortField].localeCompare(b[sortField]);
        return sortOrder === 'asc' ? compare : -compare;
      });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredItems = data.results.filter((item) =>
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <>
        <Breadcrumb>
            <BreadcrumbItem>
            <Link to="/admin">Admin</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/admin/users">Users</Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <br />
        <br />
        <Grid>
          <Column lg={16}>
            <TableContainer>
                <TableToolbar>
                    <TableToolbarContent>
                        <Search
                            id="search-1"
                            placeHolderText="Search"
                            labelText="Search"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            renderIcon={Add}
                            iconDescription="Add"
                            onClick={() => navigate('/admin/users/create')}
                        >
                            Add
                        </Button>
                    </TableToolbarContent>
                </TableToolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableSelectAll />
                            {headers.map((header) => (
                                <TableHeader
                                    key={header.key}
                                    isSortable={header.sortable}
                                    onClick={() => handleSort(header.key)}
                                    sortDirection={sortField === header.key ? sortOrder : 'none'}
                                >
                                    {header.header}
                                </TableHeader>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems.slice(indexOfFirstItem, indexOfLastItem).map((row) => (
                            <TableRow key={row.id}>
                                <TableSelectRow />
                                <TableCell>{row.username}</TableCell>
                                <TableCell><CodeSnippet type="single" feedback="Copied">{row.id}</CodeSnippet></TableCell>
                                <TableCell>
                                    {row.roles.map((role) => (  
                                        <Tag type={roleColours.find((colour) => colour.role === role).colour} key={role}>{role}</Tag>
                                    ))}
                                </TableCell>
                                <TableCell>{row.zones.join(', ')}</TableCell>
                                <TableCell>{row.created_at}</TableCell>
                                <TableCell>{row.updated_at}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableToolbar>
                    <TableToolbarContent>
                        <Pagination
                            backwardText="Previous page"
                            forwardText="Next page"
                            itemsPerPageText="Items per page:"
                            pageNumberText="Page Number"
                            onChange={({ page, pageSize }) => {
                                setCurrentPage(page);
                                setItemsPerPage(pageSize);
                            }}
                            page={currentPage}
                            pageSize={itemsPerPage}
                            pageSizes={[10, 20, 30, 40, 50]}
                            totalItems={filteredItems.length}
                        />
                    </TableToolbarContent>
                </TableToolbar>
            </TableContainer>
            </Column>
        </Grid>
            </>
    )
}


export default Users;