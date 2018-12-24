import React from "react"; // eslint-disable-line
import isToday from "date-fns/is_today";
import Button from "react-bootstrap/lib/Button"; // eslint-disable-line
import Well from "react-bootstrap/lib/Well"; // eslint-disable-line

export const Layout = () => {
  return (
    <div>
      Hello React {isToday(new Date()) ? "yes" : "no"}
      <Button bsStyle="success">Success</Button>
      <div>
        <Well bsSize="large">Look I'm in a large well!</Well>
        <Well bsSize="small">Look I'm in a small well!</Well>
      </div>
    </div>
  );
};
