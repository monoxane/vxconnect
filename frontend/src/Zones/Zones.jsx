import React, { useState } from "react";
import { useNavigate } from "react-router-dom"

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
  ExpandableSearch
} from '@carbon/react'

import {
  Renew, Add, TrashCan, QueryQueue, CaretDown, CaretUp
} from '@carbon/icons-react'

import StateManager from "../components/StateManager";

const headers = [
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Created', key: 'created_at', sortable: true },
  { label: 'Actions', key: 'actions', sortable: false }
];

const Zones = function Zones() {
  const axios = getAxiosPrivate()
  const navigate = useNavigate()
  const [{ data, loading, error }, refresh] = useAxiosPrivate()(
    '/api/v1/zones'
  )

  const [newZoneName, setNewZoneName] = useState("")
  const [newZoneLoading, setNewZoneLoading] = useState(false)
  const [newZoneError, setNewZoneError] = useState("");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('name');

  if (error) return error.Message
  if (loading & !data) return <InlineLoading />

  const handleCloseModal = (setOpen) => {
    setNewZoneName("")
    setNewZoneLoading(false)
    setNewZoneError("")
    setOpen(false)
  }

  const modelAddSubmit = async (setOpen) => {
    setNewZoneLoading(true)
    console.log(newZoneName)
    if (newZoneName != "") {
      try {
        const response = await axios.post(
          '/api/v1/zones/new',
          JSON.stringify({ name: newZoneName }),
          {
            headers: { 'Content-Type': 'application/json' }
          },
        );
        setNewZoneError("");
        handleCloseModal(setOpen);
      } catch (error) {
        console.error(error);
        setNewZoneError(error.response.data.error);
      }
    }
    setNewZoneLoading(false)
    refresh()
  }

  const modalDeleteSubmit = (id) => {
    const response = axios.delete(`/api/v1/zones/${id}`)
    console.log(response)
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
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid>
      <Column lg={16}>
        <Row>
          <TableContainer
            title='Zones'
          >
            <TableToolbar aria-label='data table toolbar'>
              {loading && <InlineLoading />}
              <TableToolbarContent>
                <Search
                  label="Search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <Button renderIcon={Renew} hasIconOnly kind='secondary' iconDescription='Refresh' onClick={refresh}>Refresh Zones</Button>
                <StateManager
                  renderLauncher={({ setOpen }) => (
                    <Button renderIcon={Add} kind="primary" iconDescription="New Zone" onClick={() => setOpen(true)}>New Zone</Button>)}>
                  {({ open, setOpen }) => (
                    <Modal
                      modalLabel="DNS/Zones"
                      modalHeading="New Zone"
                      primaryButtonText={newZoneLoading ? "Creating" : "Create"}
                      secondaryButtonText="Cancel"
                      open={open}
                      shouldSubmitOnEnter
                      onRequestSubmit={() => modelAddSubmit(setOpen)}
                      onRequestClose={() => handleCloseModal(setOpen)}>
                      <p style={{ marginBottom: '1rem' }}>
                        Create a new Zone to be managed by Connect
                      </p>
                      <TextInput
                        data-modal-primary-focus
                        id="zoneName"
                        labelText="Zone name"
                        placeholder="zone.vx0"
                        style={{ marginBottom: '1rem' }}
                        value={newZoneName}
                        onChange={(event) => setNewZoneName(event.target.value)}
                      />
                      {/* TODO: IMPLEMENT ALLOCATION TO USER */}
                      {/* <Select id="select-1" labelText="User">
                      <SelectItem value="all" text="All" /> 
                    </Select> */}
                      {newZoneError && (
                        <InlineNotification
                          title={newZoneError}
                          kind="error"
                          lowContrast
                        />
                      )}
                      <br />

                    </Modal>
                  )}
                </StateManager>
              </TableToolbarContent>
            </TableToolbar>
            <Table size="lg" useZebraStyles={false}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      id={header.key}
                      key={header}
                      isSortable={header.sortable}
                      onClick={() => handleSort(header.key)}
                    >
                      {header.label}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>{zone.name}</TableCell>
                      <TableCell>{zone.created_at}</TableCell>
                      <TableCell>
                        <StateManager
                          renderLauncher={({ setOpen }) => (
                            <Button
                              renderIcon={TrashCan}
                              iconDescription="Delete"
                              hasIconOnly
                              kind='ghost'
                              onClick={() => setOpen(true)}
                            />
                          )}>
                          {({ open, setOpen }) => (
                            <Modal
                              open={open}
                              onRequestClose={() => {
                                setOpen(false);
                                setDeleteConfirmed(false)
                              }}
                              onRequestSubmit={() => {
                                if (deleteConfirmed) {
                                  modalDeleteSubmit(zone.id);
                                  setTimeout(() => {
                                    refresh();
                                    setOpen(false);
                                    setDeleteConfirmed(false);
                                  }, 500);
                                }
                              }}
                              danger
                              modalHeading={`Are you sure you want to delete zone ${zone.name}?`}
                              modalLabel="DNS/Zones"
                              primaryButtonText="Delete"
                              secondaryButtonText="Cancel"
                              primaryButtonDisabled={!deleteConfirmed}
                            >
                              <Checkbox
                                labelText="I confirm that I want to delete this zone and understand it cannot be recreated."
                                id="deleteConfirmCheckbox"
                                checked={deleteConfirmed}
                                onChange={(event) =>
                                  setDeleteConfirmed(event.target.checked)
                                }
                              />
                            </Modal>

                          )}
                        </StateManager>
                        <Button
                          renderIcon={QueryQueue}
                          iconDescription="Records"
                          hasIconOnly
                          kind='ghost'
                          onClick={() => navigate(`/dns/zones/${zone.id}/records`)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TableToolbar
              aria-label='data table toolbar'>
              {loading && <InlineLoading />}
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
                  totalItems={data.results.length}
                />
              </TableToolbarContent>
            </TableToolbar>
          </TableContainer>
        </Row>
      </Column>
    </Grid>
  )
}

export default Zones