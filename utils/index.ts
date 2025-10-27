export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;

  if (diffInSeconds < minute) {
    return "Just now";
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes}m ago`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours}h ago`;
  } else if (diffInSeconds < year) {
    const days = Math.floor(diffInSeconds / day);
    return `${days}d ago`;
  } else {
    const years = Math.floor(diffInSeconds / year);
    return `${years}y ago`;
  }
};
