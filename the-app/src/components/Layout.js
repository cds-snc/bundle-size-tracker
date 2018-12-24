import React from "react"; // eslint-disable-line
import isToday from "date-fns/is_today";

export const Layout = () => {

  return <div>Hello React {isToday(new Date()) ? "yes" : "no"} </div>;

};
