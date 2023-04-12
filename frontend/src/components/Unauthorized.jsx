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
          <h2>You don't have permission to access this page</h2>
        </Row><br/>
        <Row>
          <p>Contact an Administrator if you think you should</p>
        </Row>
      </Column>
    </Grid>
  );
};

export default NoRoute;