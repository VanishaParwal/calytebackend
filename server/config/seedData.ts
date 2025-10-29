// Define the structure for Helpline data (matches the model)
type HelplineScope = 'India' | 'Other'; // Simplified scope

interface HelplineSeedData {
  name: string;
  phone: string;
  description: string;
  scope: HelplineScope;
}

// Your helpline data - Simplified to India-wide for now
export const helplinesData: HelplineSeedData[] = [
  // --- National Helplines (Always Include) ---
  { name: 'Vandrevala Foundation', phone: '1860-2662-345 / 1800-2333-330', description: 'Mental health and crisis intervention helpline', scope: 'India' },
  { name: 'KIRAN Helpline (Govt of India)', phone: '1800-599-0019', description: 'Mental health rehabilitation helpline', scope: 'India' },
  { name: 'AASRA', phone: '09820466726', description: 'Suicide prevention and emotional distress helpline', scope: 'India' },
];

// Your quote data (consider adding more for variety)
export const motivationalQuotesData: string[] = [
  'Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.',
  'The goal isn\'t to be sober. The goal is to love yourself so much you don\'t need to drink.',
  'One day you will tell your story of how you overcame what you went through and it will be someone else\'s survival guide.',
  'Recovery is about progress, not perfection.',
  'Your best days are ahead of you.',
  'Believe you can and you\'re halfway there.',
  'The only way out is through.',
  'Small steps every day lead to big changes.',
  'You are stronger than you think.',
  'Don\'t let yesterday take up too much of today.',
  "Fall seven times, stand up eight.",
  "The best way to predict the future is to create it.",
  "You don't have to be perfect to start, but you have to start to be perfect.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "It does not matter how slowly you go as long as you do not stop.",
];

