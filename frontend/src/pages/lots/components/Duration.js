import React from 'react';
import { secondsToDuration } from 'utils/helper';

function Duration({ durationInSeconds }) {
  const formattedDuration = secondsToDuration(durationInSeconds || 0)
  
  return <span>{formattedDuration}</span>;
}

export default Duration;
