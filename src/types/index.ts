/**
 * Type definitions for the Tax Calculator application
 */

export type LevyCategory = 'asset' | 'debt';

export interface LevyTypes {
    key: string;
    category: LevyCategory;
    dollars: number;
    taxRate: number;
}

export interface LevyTypeDefinition {
    key: string;
    name: string;
    description: string;
    rationale?: string;
    defaultRate: number;
    category: LevyCategory;
}

/**
 * Represents a tax bracket with its properties
 */
export interface TaxBracketData {
    id: string;
    name: string;
    color: string;
    population: number;
    popPercent: number;
    levyTypes: LevyTypes[];
    totalTax?: number;
}

/**
 * Represents a census figure option
 */
export interface CensusFigure {
    id: string;
    name: string;
    value: number;
    description?: string;
}

/**
 * Represents a money supply option
 */
export interface MoneySupplyOption {
    id: string;
    name: string;
    value: number;
    description?: string;
}

/**
 * Props for the MoneyField component
 */
export interface MoneyFieldProps {
    val: number;
    levy?: number;
}

/**
 * Props for the PopulationField component
 */
export interface PopulationFieldProps {
    val: number;
}

/**
 * Props for the PayingPopulation component
 */
export interface PayingPopulationProps {
    val: number;
    onValueChange?: (newValue: number) => void;
}

/**
 * Props for the MoneySupply component
 */
export interface MoneySupplyProps {
    val: number;
    onValueChange?: (newValue: number) => void;
}

/**
 * Props for the TaxBracket component
 */
export interface TaxBracketProps {
    bracket: TaxBracketData;
    totalPopulation: number;
    levyTypeDefs: LevyTypeDefinition[];
    onChange: (id: string, changes: Partial<TaxBracketData>) => void;
}

/**
 * Props for the TaxDistributionChart component
 */
export interface TaxDistributionChartProps {
    brackets: TaxBracketData[];
    moneySupply: number;
}

/**
 * Props for the PerCapitaTaxChart component
 */
export interface PerCapitaTaxChartProps {
    brackets: TaxBracketData[];
}

/**
 * Props for the HoldingsTaxComparisonChart component
 */
export interface HoldingsTaxComparisonChartProps {
    brackets: TaxBracketData[];
}

/**
 * Full persisted state of the calculator
 */
export interface PersistedState {
    population: number;
    moneySupply: number;
    levyTypeDefs: LevyTypeDefinition[];
    brackets: TaxBracketData[];
}

/**
 * A named saved scenario
 */
export interface SavedScenario extends PersistedState {
    id: string;
    name: string;
    date: string;
    totalTaxRevenue?: number;
    taxBalancePercentage?: number;
}

/**
 * Props for the ScenarioManager component
 */
export interface ScenarioManagerProps {
    population: number;
    moneySupply: number;
    levyTypeDefs: LevyTypeDefinition[];
    brackets: TaxBracketData[];
    totalTaxRevenue: number;
    taxBalancePercentage: number;
    scenarios: SavedScenario[];
    onSave: (name: string) => void;
    onLoad: (scenario: PersistedState) => void;
    onDelete: (id: string) => void;
    onReset: () => void;
}

/**
 * Props for the TabPanel component
 */
export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
