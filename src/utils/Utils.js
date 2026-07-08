export const getStatusStyles = status => {
  switch (status) {
    case 'inprogress':
      return {
        bg: '#D1FAE5',
        color: '#065F46',
        text: 'In Progress',
      };
    case 'delayed':
      return {
        bg: '#FEF3C7',
        color: '#D97706',
        text: 'Delayed',
      };
    case 'completed':
      return {
        bg: '#E6F4EA',
        color: '#10B981',
        text: 'Completed',
      };
    default:
      return {
        bg: '#E2E8F0',
        color: '#475569',
        text: 'Waiting',
      };
  }
};

export const getRemainingDelayTime = delayTimeStr => {
  if (!delayTimeStr) return '00:00';
  const delayTime = new Date(delayTimeStr).getTime();
  const now = Date.now();
  const diffMs = delayTime - now;
  if (diffMs <= 0) return '00:00';

  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);

  const paddedMins = String(diffMins).padStart(2, '0');
  const paddedSecs = String(diffSecs).padStart(2, '0');

  return `${paddedMins}:${paddedSecs}`;
};

export const getElapsedTime = startTimeStr => {
  if (!startTimeStr) return '0s';
  const startTime = new Date(startTimeStr).getTime();
  const now = Date.now();
  const diffMs = now - startTime;
  if (diffMs <= 0) return '0s';

  const diffSecs = Math.floor(diffMs / 1000);
  const secs = diffSecs % 60;
  const diffMins = Math.floor(diffSecs / 60);
  const mins = diffMins % 60;
  const diffHours = Math.floor(diffMins / 60);
  const hours = diffHours;

  let timeString = '';
  if (hours > 0) {
    timeString += `${hours}h `;
  }
  if (mins > 0 || hours > 0) {
    timeString += `${mins}m `;
  }
  timeString += `${secs}s`;

  return timeString;
};

export const getAvatarProps = index => {
  const props = [
    { bg: '#E0E7FF', color: '#4F46E5', icon: 'tool' },
    { bg: '#FFE4E6', color: '#E11D48', icon: 'zap' },
    { bg: '#FEF3C7', color: '#D97706', icon: 'more-horizontal' },
  ];
  return props[index % props.length];
};
