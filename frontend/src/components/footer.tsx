import React from "react";
import { Grid, Column } from "carbon-components-react";

const Footer = () => {
  return (
    <Grid className="footer" fullWidth>
      <Column sm={4} md={4} lg={4}>
        <p>
          © Copyright 2021-{new Date().getFullYear()}{" "}
          <h5 className="h5-inline">VX0, VXConnect</h5>
        </p>
      </Column>
      <Column sm={4} md={4} lg={4}>
        <p>Privacy</p>
      </Column>
      <Column sm={4} md={4} lg={4}>
        <p>Terms of Use</p>
      </Column>
    </Grid>
  );
};
export default Footer;
