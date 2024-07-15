const getFormattedDate = () => {
  return 'formatted date string';
};

/**
 *For instance. I have a store that closes at 12am across the nation. 
 I want this store to close at 12am regardless of timezone. What i mean by this is it 
 should close at 12am est in new york and close at 12am pst in california.
  I need to convert a 12am utc timestamp to its appropriate timezone value
 */
//TODO: replace timeZoneOffsets with enum values for each timezone.
function convertTimezoneTime(
  inputTime,
  sourceTimezoneOffset,
  targetTimezoneOffset,
) {
  // Calculate the offset difference between the source and target timezones
  const offsetDifference =
    (targetTimezoneOffset - sourceTimezoneOffset) * 60 * 60 * 1000;

  // Apply the offset difference to the input time
  const targetTime = new Date(inputTime.getTime() + offsetDifference);

  return targetTime;
}

// Example usage:
const pstTime = new Date(Date.UTC(2024, 3, 1, 7, 0, 0)); // 7:00 AM PST
const estTime = convertTimezoneTime(pstTime, -8, -5); // Convert to EST
console.log(
  'PST Time:',
  pstTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
);
console.log(
  'EST Time:',
  estTime.toLocaleString('en-US', { timeZone: 'America/New_York' }),
);
