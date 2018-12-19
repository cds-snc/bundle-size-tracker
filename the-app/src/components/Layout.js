import moment from "moment";
import React from "react"; // eslint-disable-line

export const Layout = () => {
  return <div>Hello React {moment().format()}</div>;
};
