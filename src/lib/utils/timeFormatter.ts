import moment from 'moment';

/**
 * Formats time with shorter versions for small devices
 * @param dateTime - The date/time to format
 * @param isSmallDevice - Whether the device is small (mobile/tablet)
 * @returns Formatted time string
 */
export const formatTimeResponsive = (dateTime: string | Date, isSmallDevice: boolean = false): string => {
  if (!dateTime) return '';
  const now = moment();
  const time = moment(dateTime);
  const diffInMinutes = now.diff(time, 'minutes');
  const diffInHours = now.diff(time, 'hours');
  const diffInDays = now.diff(time, 'days');
  const diffInWeeks = now.diff(time, 'weeks');
  const diffInMonths = now.diff(time, 'months');
  const diffInYears = now.diff(time, 'years');

  if (isSmallDevice) {
    // Short format for small devices
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}min ago`;
    if (diffInHours < 24) return `${diffInHours}hr ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${diffInYears}y ago`;
  } else {
    // Standard format for larger devices
    return time.fromNow();
  }
};

/**
 * Hook to detect if the current device is small
 * @returns boolean indicating if device is small
 */
export const useIsSmallDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // md breakpoint
};
