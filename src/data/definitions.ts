import {CensusFigure, BudgetTargetOption, DataModel, LevyTypeDefinition, SavedScenario, TaxBracketData} from '../types';
import defaultScenario from './default_scenario.json';
import allUsNetworthScenario from './all_us_networth.json';
import taxableAssetBaseScenario from './36percent_usnetworth.json';

export const DATA_MODELS: DataModel[] = [
    {
        id: 'taxable_asset_base',
        name: 'All Cash On Hand',
        description: 'This is ~36% of U.S. Net Wealth that falls into four taxable asset categories: (Liquid Capital, Reserved Capital, Capital Flight, Idle Property). Equities, productive real estate, business equity, and other asset classes are intentionally excluded.',
        defaultNetWorthRefId: 'taxable_asset_base',
        scenario: taxableAssetBaseScenario as unknown as SavedScenario,
    },
    {
        id: 'all_us_networth',
        name: 'All U.S. Net Wealth',
        description: 'The full ~$170T of U.S. household and corporate net wealth, with bracket holdings scaled proportionally across all asset classes.',
        defaultNetWorthRefId: 'total_net_worth',
        scenario: allUsNetworthScenario as unknown as SavedScenario,
    },
];

export const DEFAULT_MODEL_ID = DATA_MODELS[0].id;

export const DEFAULT_LEVY_TYPES: LevyTypeDefinition[] = defaultScenario.levyTypeDefs as LevyTypeDefinition[];

export const CENSUS_FIGURES: CensusFigure[] = [
    {
        id: 'total_plus_corps',
        name: 'All Individuals and Corporations',
        value: 347_300_000,
        description: 'Total U.S. population (331.9M) plus registered corporate entities (15.4M)',
    }
];

export const BUDGET_TARGETS: BudgetTargetOption[] = [
    {
        id: 'federal_budget',
        name: 'Current federal budget',
        value: 6_300_000_000_000,
        description: 'Total annual U.S. federal government budget',
    },
    {
        id: 'tax_revenue',
        name: 'Current federal tax revenue',
        value: 4_800_000_000_000,
        description: 'Total annual federal tax revenue collected from all sources',
    }
];

export const MONEY_SUPPLY_REFS: BudgetTargetOption[] = [
    {
        id: 'taxable_asset_base',
        name: 'Taxable Asset Base',
        value: 61_200_000_000_000,
        description: 'Sum of all holdings that fall within our categories. Roughly 36% of total U.S. net wealth — the remainder sits in equities, productive real estate, business equity, and other intentionally untaxed asset classes. Derived from S&P 500 balance sheets (GuruFocus Q4 2024), Federal Reserve DFA Q4 2024, and SCF 2022.',
    },{
        id: 'total_net_worth',
        name: 'Total U.S. Net Wealth',
        value: 170_000_000_000_000,
        description: 'Estimated total U.S. household and corporate net wealth (Federal Reserve Z.1)',
    },
    {
        id: 'm1',
        name: 'M1 (Narrow Money)',
        value: 21_100_000_000_000,
        description: 'Physical currency in circulation plus demand deposits and other liquid deposits.',
    },
    {
        id: 'm2',
        name: 'M2 (Broad Money)',
        value: 31_800_000_000_000,
        description: 'Cash, checking deposits, savings, money market funds, and small time deposits.',
    },
];

export const DEFAULT_NET_WORTH_TARGET = MONEY_SUPPLY_REFS[0].value;

export const DEFAULT_BRACKETS: TaxBracketData[] = (defaultScenario.brackets as TaxBracketData[])
    .sort((a, b) => a.population - b.population);

export const DEFAULT_POPULATION = defaultScenario.population;
export const DEFAULT_POPULATION_NAME = CENSUS_FIGURES.find(f => f.value === DEFAULT_POPULATION)?.name ?? 'Custom';
export const DEFAULT_POPULATION_DESCRIPTION = CENSUS_FIGURES.find(f => f.value === DEFAULT_POPULATION)?.description ?? '';
export const DEFAULT_BUDGET_TARGET = defaultScenario.budgetTarget;
export const DEFAULT_BUDGET_TARGET_NAME = BUDGET_TARGETS.find(bt => bt.value === DEFAULT_BUDGET_TARGET)?.name ?? 'Custom';
export const DEFAULT_BUDGET_TARGET_DESCRIPTION = BUDGET_TARGETS.find(bt => bt.value === DEFAULT_BUDGET_TARGET)?.description ?? '';
export const DEFAULT_NET_WORTH_TARGET_NAME = MONEY_SUPPLY_REFS.find(r => r.value === DEFAULT_NET_WORTH_TARGET)?.name ?? 'Custom';
export const DEFAULT_NET_WORTH_TARGET_DESCRIPTION = MONEY_SUPPLY_REFS.find(r => r.value === DEFAULT_NET_WORTH_TARGET)?.description ?? '';
