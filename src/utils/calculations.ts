import {TaxBracketData} from '../types';

/**
 * Utility functions for tax calculations used throughout the application
 */

/**
 * Calculates the total tax revenue from all tax brackets
 * @param brackets - Array of tax bracket data
 * @returns Total tax revenue
 */
export const calculateTotalTax = (brackets: TaxBracketData[]): number => {
    return brackets.reduce((total, bracket) => {
        const bracketTax = bracket.population * bracket.incomeThreshold * bracket.taxRate;
        return total + bracketTax;
    }, 0);
};

/**
 * Calculates per capita tax burden
 * @param totalTax - Total tax revenue
 * @param population - Total population
 * @returns Per capita tax amount
 */
export const calculatePerCapitaTax = (totalTax: number, population: number): number => {
    if (population <= 0) return 0;
    return totalTax / population;
};

/**
 * Calculates tax burden as percentage of money supply
 * @param totalTax - Total tax revenue
 * @param moneySupply - Total money supply
 * @returns Percentage of money supply
 */
export const calculateTaxPercentage = (totalTax: number, moneySupply: number): number => {
    if (moneySupply <= 0) return 0;
    return (totalTax / moneySupply) * 100;
};

/**
 * Calculates the population balance
 * @param totalPopulation - Total population
 * @param brackets - Array of tax bracket data
 * @returns Population balance
 */
export const calculatePopulationBalance = (
    totalPopulation: number,
    brackets: TaxBracketData[]
): number => {
    const bracketPopulation = brackets.reduce((sum, bracket) => sum + bracket.population, 0);
    return totalPopulation - bracketPopulation;
};

/**
 * Calculates the effective tax rate for a bracket
 * @param bracket - Tax bracket data
 * @returns Effective tax rate
 */
export const calculateEffectiveTaxRate = (bracket: TaxBracketData): number => {
    return bracket.taxRate;
};

/**
 * Calculates the total income for a bracket
 * @param bracket - Tax bracket data
 * @returns Total income
 */
export const calculateTotalIncome = (bracket: TaxBracketData): number => {
    return bracket.population * bracket.incomeThreshold;
};

/**
 * Calculates the total tax for a bracket
 * @param bracket - Tax bracket data
 * @returns Total tax
 */
export const calculateBracketTax = (bracket: TaxBracketData): number => {
    return bracket.population * bracket.incomeThreshold * bracket.taxRate;
};

/**
 * Updates the total tax field for each bracket
 * @param brackets - Array of tax bracket data
 * @returns Updated brackets with total tax calculated
 */
export const updateBracketTaxes = (brackets: TaxBracketData[]): TaxBracketData[] => {
    return brackets.map(bracket => ({
        ...bracket,
        totalTax: calculateBracketTax(bracket)
    }));
};
