export type ViewType = 'home' | 'analytics' | 'inventory' | 'orders' | 'profile';

export interface Transaction {
  id: number;
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  type: 'income' | 'expense';
  status: 'Pending' | 'Completed' | 'Paid';
  icon: string;
  iconBg: string;
  iconColor: string;
}