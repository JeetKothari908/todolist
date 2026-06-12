import React from "react";
import "./Logo.css";
import localflowLogo from "./localflow.svg";

const Logo: React.FC = () => (
  <h1 className="Logo">
    <i dangerouslySetInnerHTML={{ __html: localflowLogo }} />
  </h1>
);

export default Logo;
