export type Milestone = { title: string; due?: string; amount?: string; status?: string };

export const mockMilestones: Milestone[] = [
  { title: 'Design & Prototyping', due: 'Jan 10 2024', amount: '500', status: 'done' },
  { title: 'Development Phase 1', due: 'Feb 14 2024', amount: '1200', status: 'inprogress' },
  { title: 'Testing & Launch', due: 'Mar 20 2024', amount: '2000', status: 'pending' },
];

export default mockMilestones;
