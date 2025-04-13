/**
 * Type definitions for the Tax Calculator application
 */

export interface LevyTypes {
    name: string;
    dollars: number;
    taxRate: number
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
}

/**
 * Represents a money supply option
 */
export interface MoneySupplyOption {
    id: string;
    name: string;
    value: number;
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
 * Props for the ExportScenario component
 */
export interface ExportScenarioProps {
    population: number;
    moneySupply: number;
    brackets: TaxBracketData[];
    totalTaxRevenue: number;
    taxBalancePercentage: number;
}

/**
 * Data structure for exporting/importing scenarios
 */
export interface ScenarioData {
    name: string;
    date: string;
    population: number;
    moneySupply: number;
    brackets: TaxBracketData[];
    totalTaxRevenue: number;
    taxBalancePercentage: number;
}

/**
 * Props for the ImportScenario component
 */
export interface ImportScenarioProps {
    onImport: (data: ImportData) => void;
}

/**
 * Data structure for importing scenarios
 */
export interface ImportData {
    population: number;
    moneySupply: number;
    brackets: TaxBracketData[];
}

/**
 * Props for the TabPanel component
 */
export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
