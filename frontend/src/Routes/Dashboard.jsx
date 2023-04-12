/* eslint-disable import/extensions */
// General Imports
import React from 'react';
import {useNavigate } from 'react-router-dom'

import {
  Grid,
  Row,
  Column
} from 'carbon-components-react'

const Dashboard = function Dashboard() {
  return (
    <Grid>
      <Column lg={6}>
        <br/><br/><br/>
        <Row>
          <h2>Your vx0 Network Dashboard</h2>
        </Row><br/>
        <Row>
          <p>Put Things Here</p>
        </Row>
      </Column>
    </Grid>
  );
};

export default Dashboard;