import React from 'react';

import {
  Grid,
  Row,
  Column,
  Button
} from 'carbon-components-react'

const NoRoute = function NoRoute() {
  return (
    <Grid>
      <Column lg={6}>
        <br/><br/><br/>
        <Row>
          <h2>404 Not Found</h2>
        </Row><br/>
        <Row>
          <p>This page does not exist.</p>
        </Row>
        <Row>
          <br />
          <Button href="/">Return to Dashboard</Button>
        </Row>
      </Column>
    </Grid>
  );
};

export default NoRoute;