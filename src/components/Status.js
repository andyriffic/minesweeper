import React from 'react';
import { Fieldset } from '@react95/core';

export const Status = ({ numberOfMinesLeft }) => {
  return <Fieldset legend="Status">
    <p>{numberOfMinesLeft}</p>
  </Fieldset>
}