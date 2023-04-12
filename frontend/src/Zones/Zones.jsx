import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';

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
  TableToolbarContent
} from '@carbon/react'

import {
  Renew,
} from '@carbon/icons-react'

const headers = [
  'ID',
  'Name',
  'Created',
  'Last Modified',
];

const Zones = function Zones() {
  const [{ data, loading, error }, refresh] = useAxiosPrivate()(
    '/api/v1/zones'
  )

  if (error) return error.Message
  if (loading & !data) return <InlineLoading />

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
              <Button renderIcon={Renew} hasIconOnly kind='secondary' iconDescription='Refresh' onClick={refresh}>Refresh Zones</Button>
              {/* TODO ADD CREATE BUTTON */}
            </TableToolbarContent>
          </TableToolbar>
          <Table size="lg" useZebraStyles={false}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader id={header.key} key={header}>
                    {header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.results.sort((a, b) => a.id.localeCompare(b.id)).map((zone) => 
                <TableRow key={zone.id}>
                  <TableCell>{zone.name}</TableCell>
                  <TableCell>{zone.created_at}</TableCell>
                  <TableCell>{zone.updated_at}</TableCell>
                  {/* ADD DELETE */}
                </TableRow>
              )}
            </TableBody>
            </Table>
          </TableContainer>
        </Row>
      </Column>
    </Grid>
  )
}

export default Zones