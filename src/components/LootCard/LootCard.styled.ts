import styled from "styled-components";

export const StyledLootCard = styled.div`
  border: 1px solid #8e8e8e;
  border-radius: 3px;
  cursor: pointer;
  padding: 1em;
  margin: 2em 2em 0 0;
  display: inline-grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 2em;
  &:hover {
    border: 1px solid #aeaeae;
  }
`;
