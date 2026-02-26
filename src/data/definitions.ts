import {CensusFigure, BudgetTargetOption, LevyTypeDefinition, TaxBracketData} from '../types';
import defaultScenario from './default_scenario.json';

export const DEFAULT_LEVY_TYPES: LevyTypeDefinition[] = defaultScenario.levyTypeDefs as LevyTypeDefinition[];

export const CENSUS_FIGURES: CensusFigure[] = [
    {
        id: 'total_plus_corps',
        name: 'All Individuals and Corporations',
        value: 347_300_000,
        description: 'Total U.S. population (331.9M) plus registered corporate entities (15.4M).',
    },
    {
        id: 'total',
        name: 'All Individuals',
        value: 331_900_000,
        description: 'Total U.S. population including all ages.',
    },
];

export const BUDGET_TARGETS: BudgetTargetOption[] = [
    {
        id: 'federal_budget',
        name: 'Current federal budget',
        value: 6_300_000_000_000,
        description: 'Total annual U.S. federal government budget (spending). Includes mandatory, discretionary, and interest.',
    },
    {
        id: 'tax_revenue',
        name: 'Current federal tax revenue',
        value: 4_800_000_000_000,
        description: 'Total annual federal tax revenue collected from all sources (income, payroll, corporate, excise, etc.).',
    }
];

export const MONEY_SUPPLY_REFS = {
    m1: {
        name: 'M1 (Narrow Money)',
        value: 21_100_000_000_000,
        description: 'M1 includes physical currency in circulation plus demand deposits and other liquid deposits.',
    },
    m2: {
        name: 'M2 (Broad Money)',
        value: 31_800_000_000_000,
        description: 'M2 includes cash, checking deposits, savings, money market funds, and small time deposits.',
    },
};

export const DEFAULT_BRACKETS: TaxBracketData[] = (defaultScenario.brackets as TaxBracketData[])
    .sort((a, b) => a.population - b.population);

export const DEFAULT_POPULATION = defaultScenario.population;
export const DEFAULT_BUDGET_TARGET = defaultScenario.budgetTarget;
