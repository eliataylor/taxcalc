/**
 * Type definitions for the Tax Calculator application
 */

/**
 * Represents a tax bracket with its properties
 */
export interface TaxBracketData {
    id: string;
    name: string;
    population: number;
    incomeThreshold: number;
    taxRate: number;
    totalTax: number;
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
}

/**
 * Props for the PerCapitaTaxChart component
 */
export interface PerCapitaTaxChartProps {
    brackets: TaxBracketData[];
}

/**
 * Props for the IncomeTaxComparisonChart component
 */
export interface IncomeTaxComparisonChartProps {
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
