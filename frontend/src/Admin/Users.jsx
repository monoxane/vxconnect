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
    Tag,
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

    const [newUserName, setNewUserName] = useState("")
    const [newUserLoading, setNewUserLoading] = useState(false)
    const [newUserError, setNewUserError] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserRole, setNewUserRole] = useState("USER");
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

    const handleCloseModal = (setOpen) => {
        setNewUserName("")
        setNewUserLoading(false)
        setNewUserError("")
        setOpen(false)
    }

    async function modelUserAddSubmit() {
        setNewUserLoading(true)
        console.log(newUserName)
        if (newUserName.length < 3) {
            setNewUserError("Username too short")
            setNewUserLoading(false)
            return
        }
        if (newUserPassword.length < 8) {
            setNewUserError("Password too short")
            setNewUserLoading(false)
            return
        }
        try {
            const response = await axios.post('/api/v1/users', {
                username: newUserName,
                password: newUserPassword,
                roles: [newUserRole]
            })
            console.log(response)
            handleCloseModal(setOpen)
            refresh()
        } catch (error) {
            console.log(error)
            setNewUserError(error.response.data.message)
            setNewUserLoading(false)
        }
        setNewUserLoading(false)
        refresh()
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
                    <TableContainer title="Users">
                        <TableToolbar>
                            <TableToolbarContent>
                                <Search
                                    id="search-1"
                                    placeHolderText="Search"
                                    labelText="Search"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button
                                    hasIconOnly
                                    kind="secondary"
                                    iconDescription='Refresh'
                                    className="table-refresh-button"
                                    onClick={() => refresh()}
                                >
                                    {loading && <InlineLoading
                                        status="active"
                                        small
                                        className="table-loading-spinner"
                                    />}
                                    {!loading && <Renew />}
                                </Button>
                                <StateManager
                                    renderLauncher={({ setOpen }) => (
                                        <Button renderIcon={Add} kind="primary" iconDescription="Create new user" onClick={() => setOpen(true)}>Create</Button>)}>
                                    {({ open, setOpen }) => (
                                        <Modal
                                            open={open}
                                            modalHeading="Add User"
                                            modalLabel="Admin/Users"
                                            primaryButtonText="Add"
                                            secondaryButtonText="Cancel"
                                            onRequestClose={() => handleCloseModal(setOpen)}
                                            onRequestSubmit={() => modelUserAddSubmit(setOpen)}
                                            onSecondarySubmit={() => handleCloseModal(setOpen)}
                                            primaryButtonDisabled={newUserLoading}
                                        >
                                            <p style={{ marginBottom: '1rem' }}>
                                                Create a new user
                                            </p>
                                            <TextInput
                                                key="username-input"
                                                id="username"
                                                labelText="Username"
                                                placeholder="Username"
                                                value={newUserName}
                                                invalid={newUserError.length > 0}
                                                invalidText={newUserError}
                                                onChange={(e) => setNewUserName(e.target.value)}
                                            />
                                            <br />
                                            <TextInput.PasswordInput
                                                id="password"
                                                labelText="Password"
                                                placeholder="Password"
                                                value={newUserPassword}
                                                onChange={(e) => setNewUserPassword(e.target.value)}
                                                invalid={newUserError.length > 0}
                                                invalidText={newUserError}
                                            />
                                            <br />
                                            <Select
                                                id="role"
                                                labelText="Role"
                                                value={newUserRole}
                                                onChange={(e) => setNewUserRole(e.target.value)}
                                            >
                                                <SelectItem
                                                    value="USER"
                                                    text="User"
                                                />
                                                <SelectItem
                                                    value="ADMIN"
                                                    text="Admin"
                                                />
                                            </Select>
                                            {newUserError && (
                                                <InlineNotification
                                                    kind="error"
                                                    title="Error"
                                                    subtitle={newUserError}
                                                    iconDescription="Close notification"
                                                    onCloseButtonClick={() => setNewUserError("")}
                                                />
                                            )}
                                            {newUserLoading && (
                                                <InlineLoading
                                                    status="active"
                                                    description="Loading"
                                                    className="loading-spinner"
                                                />
                                            )
                                            }
                                        </Modal>
                                    )}

                                </StateManager>
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
                    {loading && <InlineLoading
                        description="Refreshing..."
                        status="active"
                        small
                    />}
                </Column>
            </Grid>
        </>
    )
}


export default Users;