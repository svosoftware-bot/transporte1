
export interface Expense {
  id: string;
  category: 'Combustível' | 'Pedágio' | 'Alimentação' | 'Manutenção' | 'Outros';
  amount: number;
  date: string;
  description: string;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  freightValue: number;
  
  // New specific fields
  driverCommission: number;
  fuelCost: number;
  tollCost: number;
  otherExpenses: number;
  advanceAmount: number;

  // Step 1 Details
  cargo?: string;
  weight?: number;
  plate?: string;
  
  expenses: Expense[];
  status: 'Em andamento' | 'Concluído';
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  tripCount: number;
}
