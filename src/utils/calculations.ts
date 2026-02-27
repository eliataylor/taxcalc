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
        if (bracket.totalTax !== undefined) {
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
 * Calculates tax revenue as a percentage of the budget target
 * @param totalTax - Total tax revenue
 * @param budgetTarget - The spending target to measure coverage against
 * @returns Percentage of budget target covered
 */
export const calculateTaxPercentage = (totalTax: number, budgetTarget: number): number => {
    if (budgetTarget <= 0) return 0;
    return (totalTax / budgetTarget) * 100;
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
 * Calculates the gross asset holdings for a bracket (assets only, debts excluded).
 * @param bracket - Tax bracket data
 * @returns Total gross holdings across the bracket population
 */
export const calculateTotalHoldings = (bracket: TaxBracketData): number => {
    let sum = 0;
    bracket.levyTypes.forEach(levyType => {
        if (levyType.category !== 'debt') {
            sum += levyType.dollars;
        }
    });
    return sum * bracket.population;
};

/**
 * Calculates total debt for a bracket.
 * @param bracket - Tax bracket data
 * @returns Total debt across the bracket population
 */
export const calculateTotalDebt = (bracket: TaxBracketData): number => {
    let sum = 0;
    bracket.levyTypes.forEach(levyType => {
        if (levyType.category === 'debt') {
            sum += levyType.dollars;
        }
    });
    return sum * bracket.population;
};

/**
 * Calculates the net worth for a bracket (assets minus debts).
 * @param bracket - Tax bracket data
 * @returns Net worth across the bracket population
 */
export const calculateNetWorth = (bracket: TaxBracketData): number => {
    let sum = 0;
    bracket.levyTypes.forEach(levyType => {
        if (levyType.category === 'debt') {
            sum -= levyType.dollars;
        } else {
            sum += levyType.dollars;
        }
    });
    return sum * bracket.population;
};

/**
 * Calculates the total net worth across all brackets.
 * @param brackets - Array of tax bracket data
 * @returns Combined net worth of all brackets
 */
export const calculateTotalNetWorth = (brackets: TaxBracketData[]): number => {
    return brackets.reduce((sum, bracket) => sum + calculateNetWorth(bracket), 0);
};

/**
 * Calculates the total tax for a bracket.
 * Asset levies contribute tax; debt levies provide deductions (reduce tax).
 * @param bracket - Tax bracket data
 * @returns Total tax (after debt deductions) for the bracket
 */
export const calculateBracketTax = (bracket: TaxBracketData): number => {
    let sum = 0;
    bracket.levyTypes.forEach(levyType => {
        if (levyType.category === 'debt') {
            sum -= levyType.taxRate * levyType.dollars;
        } else {
            sum += levyType.taxRate * levyType.dollars;
        }
    });
    return Math.max(0, sum * bracket.population);
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
