import {LevyCategory, LevyTypeDefinition, LevyTypes, CensusFigure, MoneySupplyOption, TaxBracketData} from '../types';

function levy(key: string, category: LevyCategory, dollars: number, taxRate: number): LevyTypes {
    return {key, category, dollars, taxRate};
}

export const DEFAULT_LEVY_TYPES: LevyTypeDefinition[] = [
    // --- Assets ---
    {
        key: 'checking',
        name: 'Checking Account Balance',
        category: 'asset',
        description: 'Easily accessible liquid capital only.',
        rationale: 'Taxed at a moderate rate since these funds circulate actively in the economy.',
        defaultRate: 0.05,
    },
    {
        key: 'savings',
        name: 'Savings Account Balance',
        category: 'asset',
        description: 'Long-term accounts with early withdrawal penalties (e.g. IRAs, CDs).',
        rationale: 'Slightly higher base rate to discourage excessive hoarding while respecting long-term planning.',
        defaultRate: 0.07,
    },
    {
        key: 'overseas',
        name: 'Overseas Balance',
        category: 'asset',
        description: 'Capital held in foreign accounts or institutions.',
        rationale: 'Higher default rate to discourage offshoring money to avoid domestic taxation.',
        defaultRate: 0.10,
    },
    {
        key: 'occupied_property',
        name: 'Occupied Property',
        category: 'asset',
        description: 'Real estate in active use where occupancy matches area density (e.g. agriculture, industry, housing).',
        rationale: 'Lower rate recognizes productive use of land and property.',
        defaultRate: 0.05,
    },
    {
        key: 'vacant_property',
        name: 'Vacant Property',
        category: 'asset',
        description: 'Idle land or property not in active use.',
        rationale: 'Higher rate to discourage parking large capital in vacant land and incentivize productive use.',
        defaultRate: 0.30,
    },
    // --- Debts (reduce taxable net worth; rate = deduction percentage) ---
    {
        key: 'business_debt',
        name: 'Business Debt',
        category: 'debt',
        description: 'Outstanding loans, credit lines, or bonds held for business operations.',
        rationale: 'Highest deduction rate -- business debt fuels economic activity and job creation.',
        defaultRate: 0.15,
    },
    {
        key: 'personal_debt',
        name: 'Personal Debt',
        category: 'debt',
        description: 'Consumer credit card balances, auto loans, and other personal liabilities.',
        rationale: 'Moderate deduction for general consumer obligations.',
        defaultRate: 0.10,
    },
    {
        key: 'student_debt',
        name: 'Student Debt',
        category: 'debt',
        description: 'Outstanding educational loans (federal and private).',
        rationale: 'Lower deduction rate since education loans are already subsidized and partially forgiven in some programs.',
        defaultRate: 0.07,
    },
    {
        key: 'health_debt',
        name: 'Health Debt',
        category: 'debt',
        description: 'Unpaid medical bills, hospital balances, and health-related loans.',
        rationale: 'Lowest deduction rate; health costs are increasingly addressed through insurance mandates and public programs.',
        defaultRate: 0.05,
    },
];

export const CENSUS_FIGURES: CensusFigure[] = [
    {
        id: 'total',
        name: 'Total Population',
        value: 331_900_000,
        description: 'Total U.S. population including all ages.',
    },
    {
        id: 'adult',
        name: 'Adult Population (18+)',
        value: 258_300_000,
        description: 'All U.S. residents aged 18 and older.',
    },
    {
        id: 'workforce',
        name: 'Workforce',
        value: 164_000_000,
        description: 'Civilian labor force -- employed and actively seeking employment.',
    },
    {
        id: 'taxpayers',
        name: 'Taxpayers',
        value: 144_500_000,
        description: 'Individuals who filed a federal tax return.',
    },
    {
        id: 'high_holders',
        name: 'High Holders',
        value: 11_200_000,
        description: 'Individuals with significant net worth holdings.',
    },
];

export const MONEY_SUPPLY_TYPES: MoneySupplyOption[] = [
    {
        id: 'm2',
        name: 'M2 (Broad Money)',
        value: 31_800_000_000_000,
        description: 'M2 includes cash, checking deposits, savings, money market funds, and small time deposits.',
    },
    {
        id: 'm1',
        name: 'M1 (Narrow Money)',
        value: 21_100_000_000_000,
        description: 'M1 includes physical currency in circulation plus demand deposits and other liquid deposits.',
    },
    {
        id: 'federal_budget',
        name: 'Federal Budget',
        value: 6_300_000_000_000,
        description: 'Total annual U.S. federal government budget (spending).',
    },
    {
        id: 'tax_revenue',
        name: 'Federal Tax Revenue',
        value: 4_800_000_000_000,
        description: 'Total annual federal tax revenue collected from all sources.',
    },
    {
        id: 'discretionary',
        name: 'Discretionary Spending',
        value: 1_700_000_000_000,
        description: 'Annual discretionary portion of the federal budget set by Congress.',
    },
];

export const DEFAULT_BRACKETS: TaxBracketData[] = [
    {
        id: '75ece48e-5aac-4da5-942f-0bf5c3e4c4dd',
        name: 'Not Holding',
        population: 82975000,
        popPercent: 0.25,
        color: '#0088FE',
        levyTypes: [
            levy('checking', 'asset', 500, 0.05),
            levy('savings', 'asset', 0, 0.1),
            levy('overseas', 'asset', 0, 0.1),
            levy('occupied_property', 'asset', 0, 0.05),
            levy('vacant_property', 'asset', 0, 0.3),
            levy('business_debt', 'debt', 0, 0.15),
            levy('personal_debt', 'debt', 5000, 0.10),
            levy('student_debt', 'debt', 12000, 0.07),
            levy('health_debt', 'debt', 3000, 0.05),
        ],
    },
    {
        id: '6eef75e3-3296-4930-8913-3ab2ad9e325b',
        name: 'Lower Holders',
        population: 116165000,
        popPercent: 0.35,
        color: '#8884D8',
        levyTypes: [
            levy('checking', 'asset', 2000, 0.07),
            levy('savings', 'asset', 5000, 0.07),
            levy('overseas', 'asset', 0, 0.1),
            levy('occupied_property', 'asset', 0, 0.05),
            levy('vacant_property', 'asset', 0, 0.3),
            levy('business_debt', 'debt', 0, 0.15),
            levy('personal_debt', 'debt', 8000, 0.10),
            levy('student_debt', 'debt', 18000, 0.07),
            levy('health_debt', 'debt', 4000, 0.05),
        ],
    },
    {
        id: 'e09b9289-735f-40cf-a278-6133e3c6d308',
        name: 'Mid Holders',
        population: 99570000,
        popPercent: 0.3,
        color: '#00C49F',
        levyTypes: [
            levy('checking', 'asset', 20000, 0.07),
            levy('savings', 'asset', 50000, 0.07),
            levy('overseas', 'asset', 5000, 0.1),
            levy('occupied_property', 'asset', 200000, 0.05),
            levy('vacant_property', 'asset', 0, 0.3),
            levy('business_debt', 'debt', 15000, 0.15),
            levy('personal_debt', 'debt', 12000, 0.10),
            levy('student_debt', 'debt', 25000, 0.07),
            levy('health_debt', 'debt', 3000, 0.05),
        ],
    },
    {
        id: '32a6f43d-ed64-4c27-a479-26dc43e01ac9',
        name: 'High Holders',
        population: 33189200,
        popPercent: 0.1,
        color: '#FFBB28',
        levyTypes: [
            levy('checking', 'asset', 200000, 0.1),
            levy('savings', 'asset', 200000, 0.1),
            levy('overseas', 'asset', 20000, 0.1),
            levy('occupied_property', 'asset', 500000, 0.05),
            levy('vacant_property', 'asset', 400000, 0.3),
            levy('business_debt', 'debt', 100000, 0.15),
            levy('personal_debt', 'debt', 15000, 0.10),
            levy('student_debt', 'debt', 0, 0.07),
            levy('health_debt', 'debt', 2000, 0.05),
        ],
    },
    {
        id: 'ed04e7d9-99fe-4a0b-aeb4-c22dd0b03347',
        name: 'Top 1%',
        population: 800,
        popPercent: 0.0000024103645676408555,
        color: '#FF8042',
        levyTypes: [
            levy('checking', 'asset', 50000000, 0.15),
            levy('savings', 'asset', 1000000000, 0.15),
            levy('overseas', 'asset', 100000000, 0.1),
            levy('occupied_property', 'asset', 100000000, 0.05),
            levy('vacant_property', 'asset', 10000000, 0.3),
            levy('business_debt', 'debt', 5000000, 0.15),
            levy('personal_debt', 'debt', 0, 0.10),
            levy('student_debt', 'debt', 0, 0.07),
            levy('health_debt', 'debt', 0, 0.05),
        ],
    },
].sort((a, b) => a.population - b.population);

export const DEFAULT_POPULATION = 331_900_000;
export const DEFAULT_MONEY_SUPPLY = 6_300_000_000_000;
