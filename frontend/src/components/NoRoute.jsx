import React from 'react';

import {
  Grid,
  Row,
  Column
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
      </Column>
    </Grid>
  );
};

export default NoRoute;