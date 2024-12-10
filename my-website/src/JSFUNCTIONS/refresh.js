import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
export function RefreshButton({ handleRefresh, col, s }) {
  return (
    <FontAwesomeIcon
      icon={faSyncAlt}
      size="2x"
      color={col}
      onClick={handleRefresh}
      style={s}
    />
  );
}

export default RefreshButton;
