// Define the structure for a milestone
interface Milestone {
  days: number;
  name: string;
}

// Define the milestones
const milestones: Milestone[] = [
  { days: 1, name: 'First Day' },
  { days: 7, name: 'One Week' },
  { days: 30, name: 'One Month' },
  { days: 90, name: 'Three Months' },
  { days: 180, name: 'Six Months' },
  { days: 365, name: 'One Year' },
  // Add more milestones as needed
];

/**
 * Calculates the difference between two dates in whole days.
 * @param sobrietyStartDate The date the user started sobriety.
 * @returns The number of full sober days. Returns 0 if start date is in the future.
 */
export const calculateSoberDays = (sobrietyStartDate: Date): number => {
  if (!sobrietyStartDate) return 0;

  const today = new Date();
  // Ensure we compare dates only, setting time to midnight UTC
  const startUTC = new Date(Date.UTC(sobrietyStartDate.getFullYear(), sobrietyStartDate.getMonth(), sobrietyStartDate.getDate()));
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  // If sobriety started in the future, streak is 0
  if (startUTC > todayUTC) {
    return 0;
  }

  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffTime = Math.abs(todayUTC.getTime() - startUTC.getTime());
  const diffDays = Math.floor(diffTime / oneDay);

  // We usually count the first day as day 1, hence +1 if the start date is today or in the past
  // Let's refine: difference in days *is* the number of completed days. Day 1 starts after 0 days.
  return diffDays;
};


/**
 * Determines which milestones have been achieved based on the number of sober days.
 * @param soberDays The number of consecutive sober days.
 * @returns An array of achieved milestone objects.
 */
export const getMilestones = (soberDays: number): Milestone[] => {
  return milestones.filter(milestone => soberDays >= milestone.days);
};
