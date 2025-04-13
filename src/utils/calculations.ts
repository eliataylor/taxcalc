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
        if (bracket.totalTax) {
            return total + bracket.totalTax;
        } else {
            return calculateBracketTax(bracket) + total;
        }
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
 * Calculates the total holdings for a bracket (WARN: probably not a misleading figure)
 * @param bracket - Tax bracket data
 * @returns Total Holdings
 */
export const calculateTotalHoldings = (bracket: TaxBracketData): number => {
    let sum = 0;
    bracket.levyTypes.forEach(levyType => {
        sum += levyType.taxRate * levyType.dollars
    })
    return sum
};


/**
 * Calculates the total tax revenue from all tax brackets
 * @param brackets - Array of tax bracket data
 * @returns Total tax revenue
 */
export const calculateNetWorth = (bracket: TaxBracketData): number => {
    let sum = 0;
    bracket.levyTypes.forEach(levyType => {
        sum += levyType.dollars
    })
    return sum * bracket.population;
};


/**
 * Calculates the total tax for a bracket
 * @param bracket - Tax bracket data
 * @returns Total tax
 */
export const calculateBracketTax = (bracket: TaxBracketData): number => {
    let sum = 0;
    bracket.levyTypes.forEach(levyType => {
        sum += levyType.taxRate * levyType.dollars
    })
    return sum * bracket.population;
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
