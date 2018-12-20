import React from "react"; // eslint-disable-line
import isToday from "date-fns/is_today";
import SimpleTween from "./Tween"; // eslint-disable-line

export const Layout = () => {
  return (
    <div>
      Hello React {isToday(new Date()) ? "yes" : "no"}
      <SimpleTween />
    </div>
  );
};
