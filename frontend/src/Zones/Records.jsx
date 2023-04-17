import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"
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
    BreadcrumbSkeleton
} from '@carbon/react'
import { Add, Edit, TrashCan, Error, Renew } from '@carbon/icons-react'
import StateManager from "../components/StateManager";

const headers = [
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'type',
        label: 'Type',
    },
    {
        key: 'target',
        label: 'Target',
    },
    {
        key: 'ttl',
        label: 'TTL',
    },
    {
        key: 'actions',
        label: 'Actions',
    }
]

const Records = function Records() {
    const { zoneId } = useParams()
    const axios = getAxiosPrivate()
    const navigate = useNavigate()
    // check if zone exists first via /api/v1/zones/${zoneId}

    const [{ data: zoneData, loading: zoneLoading, error }, zoneRefresh] = useAxiosPrivate()(
        `/api/v1/zones/${zoneId}`
    )

    const [{ data: recordData, loading: recordLoading, error: recordError }, recordRefresh] = useAxiosPrivate()(
        `/api/v1/zones/${zoneId}/records`
    )
    const [newRecordName, setNewRecordName] = useState("")
    const [newRecordType, setNewRecordType] = useState("")
    const [newRecordTarget, setNewRecordTarget] = useState("")
    const [newRecordTTL, setNewRecordTTL] = useState(60)
    const [newRecordLoading, setNewRecordLoading] = useState(false)
    const [newRecordError, setNewRecordError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('name');
    const [zoneError, setZonesError] = useState(null);

    if (recordError) return recordError.Message
    if (recordLoading & !recordData) {
        return (
            <>
                <BreadcrumbSkeleton />
                <br />
                <br />
                <Grid>
                    <Column lg={16}>
                        <Row>
                            <DataTableSkeleton />
                        </Row>
                    </Column>
                </Grid>
            </>

        )
    }
    if (zoneLoading & !zoneData) return <InlineLoading />

    const handleSort = (field) => {
        setSortField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedData = recordData.results.sort((a, b) => {
        const compare = a[sortField].localeCompare(b[sortField]);
        return sortOrder === 'asc' ? compare : -compare;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredItems = recordData.results.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (error && error.response.status === 404) {
        return (
            <div>
                <InlineNotification
                    title="Zone not found"
                    subtitle="The specified zone was not found."
                    kind="error"
                    lowContrast={true}
                />

                <Button onClick={() => navigate('/dns/zones')}>Return to Zones</Button>
            </div>
        );
    }

    const handleCloseModal = (setOpen) => {
        setNewRecordName("")
        setNewRecordLoading(false)
        setNewRecordError("")
        setOpen(false)
    }

    const modalAddSubmit = async (setOpen) => {
        setNewRecordLoading(true)
        console.log(newRecordName)
        if (newRecordName != "") {
            try {
                const response = await axios.post(`/api/v1/zones/${zoneId}/records/new`,
                    JSON.stringify({
                        "name": newRecordName,
                        "type": newRecordType,
                        "target": newRecordTarget,
                        "ttl": newRecordTTL
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                // console.log(response)
                setNewRecordError("");
                handleCloseModal(setOpen)
            } catch (error) {
                console.error(error)
                setNewRecordError(error.response.data.Message)
            }
        }
        setNewRecordLoading(false)
        recordRefresh()
    }

    const modalDeleteSubmit = (id) => {
        const response = axios.delete(`/api/v1/zones/${zoneId}/records/${id}`)
        console.log(response)
    }


    return (
        <>
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to="/dns/zones">Zones</Link>
                </BreadcrumbItem>
                <BreadcrumbItem href="#">{`${zoneData.results[0].name}`}</BreadcrumbItem>
                <BreadcrumbItem>Records</BreadcrumbItem>
            </Breadcrumb>
            <br />
            <br />
            <Grid>
                <Column lg={16}>
                    <Row>
                        <TableContainer
                            title={`Records for ${zoneData.results[0].name}`}
                        >
                            <TableToolbar aria-label='data table toolbar'>
                                <TableToolbarContent>
                                    <Search
                                        label="Search"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                    />
                                    <Button renderIcon={Renew} hasIconOnly kind='secondary' iconDescription='Refresh' onClick={recordRefresh}>Refresh Records</Button>
                                    <StateManager
                                        renderLauncher={({ setOpen }) => (
                                            <Button renderIcon={Add} hasIconOnly kind='primary' iconDescription='Add Record' onClick={() => setOpen(true)}>Add Record</Button>)}>
                                        {({ open, setOpen }) => (
                                            <Modal
                                                open={open}
                                                modalHeading="Add Record"
                                                modalLabel="Add Record"
                                                primaryButtonText={newRecordLoading ? "Creating" : "Create"}
                                                secondaryButtonText="Cancel"
                                                onRequestClose={() => handleCloseModal(setOpen)}
                                                onRequestSubmit={() => modalAddSubmit(setOpen)}
                                            >
                                                <TextInput
                                                    id="newRecordName"
                                                    labelText="Name"
                                                    placeholder="Name"
                                                    pattern="^[a-zA-Z0-9-]*$"
                                                    value={newRecordName}
                                                    style={{ marginBottom: '1rem' }}
                                                    required
                                                    onChange={(event) => {
                                                        const inputValue = event.target.value;
                                                        if (inputValue.endsWith("@")) {
                                                            setNewRecordName(inputValue.replace("@", `${zoneData.results[0].name}`))
                                                        } else if (inputValue.endsWith(`${zoneData.results[0].name}`)) {
                                                            setNewRecordName(inputValue)
                                                        } else {
                                                            setNewRecordName(inputValue + `.${zoneData.results[0].name}`)
                                                        }
                                                    }}
                                                />
                                                <Select
                                                    id="newRecordType"
                                                    labelText="Type"
                                                    value={newRecordType}
                                                    onChange={(event) => setNewRecordType(event.target.value)}
                                                    style={{ marginBottom: '1rem' }}
                                                >
                                                    <SelectItem text="A" value="A" />
                                                    <SelectItem text="AAAA" value="AAAA" />
                                                    <SelectItem text="CNAME" value="CNAME" />
                                                    <SelectItem text="MX" value="MX" />
                                                    <SelectItem text="NS" value="NS" />
                                                    <SelectItem text="PTR" value="PTR" />
                                                    <SelectItem text="SRV" value="SRV" />
                                                    <SelectItem text="TXT" value="TXT" />
                                                </Select>
                                                <TextInput
                                                    id="newRecordTarget"
                                                    labelText="Target"
                                                    placeholder="Target"
                                                    value={newRecordTarget}
                                                    onChange={(event) => setNewRecordTarget(event.target.value)}
                                                    style={{ marginBottom: '1rem' }}
                                                />
                                                <NumberInput
                                                    id="newRecordTTL"
                                                    label="TTL"
                                                    min={0}
                                                    max={604800}
                                                    value={newRecordTTL}
                                                    onChange={(event) => setNewRecordTTL(event.target.value)}
                                                    placeholder="60"
                                                />
                                                {newRecordError && (
                                                    <InlineNotification
                                                        title="Error"
                                                        subtitle={newRecordError}
                                                        kind="error"
                                                        lowContrast={true}
                                                        style={{ marginBottom: '1rem' }}
                                                    />
                                                )}
                                            </Modal>
                                        )}
                                    </StateManager>
                                </TableToolbarContent>
                            </TableToolbar>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {/* <TableSelectAll {...getSelectionProps()} /> */}
                                        {headers.map((header) => (
                                            <TableHeader key={header.key}>{header.label}</TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredItems
                                        .slice(indexOfFirstItem, indexOfLastItem)
                                        .map((row) => (
                                            <TableRow key={row.id}>
                                                {/* <TableSelectRow {...getSelectionProps({ row })} /> */}
                                                <TableCell><CodeSnippet type="single" feedback="Copied">{row.name}</CodeSnippet></TableCell>
                                                <TableCell>{row.type}</TableCell>
                                                <TableCell><CodeSnippet type="single" feedback="Copied">{row.target}</CodeSnippet></TableCell>
                                                <TableCell>{row.ttl}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        renderIcon={Edit}
                                                        onClick={() => navigate(`/zones/${zoneId}/records/${row.id}/edit`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <StateManager
                                                        renderLauncher={({ setOpen }) => (
                                                            <Button
                                                                renderIcon={TrashCan}
                                                                iconDescription="Delete"
                                                                hasIconOnly
                                                                kind='ghost'
                                                                onClick={() => setOpen(true)} />
                                                        )}>
                                                        {({ open, setOpen }) => (
                                                            <Modal
                                                                open={open}
                                                                onRequestClose={() => setOpen(false)}
                                                                onRequestSubmit={() => modalDeleteSubmit(row.id)}
                                                                danger
                                                                modalHeading={`Are you sure you want to delete the ${row.name} record?`}
                                                                modalLabel={`${zoneData.results[0].name}/Records`}
                                                                primaryButtonText="Delete"
                                                                secondaryButtonText="Cancel"
                                                            >
                                                                <p>
                                                                    <CodeSnippet type="inline" feedback="Copied">{row.name}</CodeSnippet>
                                                                    record type
                                                                    <CodeSnippet type="inline" feedback="Copied">{row.type}</CodeSnippet>
                                                                    with property
                                                                    <CodeSnippet type="inline" feedback="Copied">{row.target}</CodeSnippet>
                                                                </p>

                                                            </Modal>

                                                        )}
                                                    </StateManager>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TableToolbar
                                aria-label='data table toolbar'>
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
                                        totalItems={recordData.results.length}
                                    />
                                </TableToolbarContent>
                            </TableToolbar>
                        </TableContainer>
                        {recordLoading && (
                            <InlineLoading
                                description="Refreshing..."
                                status="active"
                            />
                        )}
                    </Row>
                </Column>
            </Grid>
        </>
    )
}

export default Records