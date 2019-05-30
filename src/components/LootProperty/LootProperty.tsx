import React, { useMemo } from 'react';
import StyledLootProperty from './LootProperty.styled';

interface ILootPropertyProps {
  property: string | number;
}

const LootProperty: React.FunctionComponent<ILootPropertyProps> = props => {
  const { children, property } = props;

  const memoLootProperty = useMemo(() => {
    return (
      <>
        <StyledLootProperty>{children}</StyledLootProperty>
        <StyledLootProperty>{property}</StyledLootProperty>
      </>
    );
  }, [children, property]);

  return memoLootProperty;
};

export default LootProperty;
