import React from 'react';
import { secondsToDuration } from 'utils/helper';

function Duration({ durationInSeconds }) {
  const formattedDuration = secondsToDuration(durationInSeconds)
  
  return <span>{formattedDuration}</span>;
}

export default Duration;
