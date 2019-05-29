import React, { useMemo } from 'react';
import './LootProperty.css';

interface ILootPropertyProps {
  property: string | number;
}

const LootProperty: React.FunctionComponent<ILootPropertyProps> = (props) => {

  const memoLootProperty = useMemo(() => {
    return (
      <>
        <div className='loot-property'>{props.children}:</div>
        <div className='loot-property'>{props.property}</div>
      </>
    )
  }, [props])

  return memoLootProperty;
}

export default LootProperty;
