import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function secondsToDuration(seconds) {
    const days = Math.floor(seconds / (60 * 60 * 24));
    seconds %= 60 * 60 * 24;
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
  
    const formattedDays = days > 0 ? `${days} days` : '';
    const formattedHours = `${hours}`.padStart(2, '0');
    const formattedMinutes = `${minutes}`.padStart(2, '0');
    const formattedSeconds = `${seconds}`.padStart(2, '0');
  
    const timePart = [formattedHours, formattedMinutes, formattedSeconds].join(':');
    const parts = [formattedDays, timePart].filter(Boolean);
  
    return parts.join(' ');
  }

function Duration({ durationInSeconds }) {
  const formattedDuration = secondsToDuration(durationInSeconds)
  
  return <span>{formattedDuration}</span>;
}

export default Duration;
