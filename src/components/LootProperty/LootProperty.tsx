import React, { useMemo } from 'react';
import StyledLootProperty from './LootProperty.styled';

interface ILootPropertyProps {
  property: string | number;
}

const LootProperty: React.FunctionComponent<ILootPropertyProps> = props => {
  const { children, property } = props;

  const memoLootProperty = useMemo(() => {
    return (
      <StyledLootProperty>
        <div className="loot-property">{children}</div>
        <div className="loot-property">{property}</div>
      </StyledLootProperty>
    );
  }, [props]);

  return memoLootProperty;
};

export default LootProperty;
