import React, { useMemo } from 'react';
import StyledLootProperty from './LootProperty.styled';

interface LootPropertyProps {
  property: string | number;
}

const LootProperty: React.FunctionComponent<LootPropertyProps> = (props): React.ReactElement => {
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
