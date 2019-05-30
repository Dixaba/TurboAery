import React, { useMemo } from "react";
import StyledLootProperty from "./LootProperty.styled";

interface ILootPropertyProps {
  property: string | number;
}

const LootProperty: React.FunctionComponent<ILootPropertyProps> = props => {
  const memoLootProperty = useMemo(() => {
    return (
      <StyledLootProperty>
        <div className="loot-property">{props.children}:</div>
        <div className="loot-property">{props.property}</div>
      </StyledLootProperty>
    );
  }, [props]);

  return memoLootProperty;
};

export default LootProperty;
