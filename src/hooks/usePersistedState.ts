import {useCallback, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {LevyTypeDefinition, PersistedState, SavedScenario, TaxBracketData} from '../types';
import {
    DEFAULT_BRACKETS,
    DEFAULT_BUDGET_TARGET,
    DEFAULT_LEVY_TYPES,
    DEFAULT_POPULATION,
} from '../data/definitions.ts';

const STATE_KEY = 'taxcalc_state';
const SCENARIOS_KEY = 'taxcalc_scenarios';
const DEBOUNCE_MS = 300;
const CURRENT_BUILD = typeof __BUILD_NUMBER__ !== 'undefined' ? Number(__BUILD_NUMBER__) : 0;

function readState(): PersistedState | null {
    try {
        const raw = localStorage.getItem(STATE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeState(state: PersistedState): void {
    localStorage.setItem(STATE_KEY, JSON.stringify({...state, buildNumber: CURRENT_BUILD}));
}

function readScenarios(): SavedScenario[] {
    try {
        const raw = localStorage.getItem(SCENARIOS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeScenarios(scenarios: SavedScenario[]): void {
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
}

export function usePersistedState() {
    const [isLoading, setIsLoading] = useState(true);
    const [isStale, setIsStale] = useState(false);
    const [population, setPopulationRaw] = useState(DEFAULT_POPULATION);
    const [budgetTarget, setBudgetTargetRaw] = useState(DEFAULT_BUDGET_TARGET);
    const [levyTypeDefs, setLevyTypeDefsRaw] = useState<LevyTypeDefinition[]>(DEFAULT_LEVY_TYPES);
    const [brackets, setBracketsRaw] = useState<TaxBracketData[]>(DEFAULT_BRACKETS);
    const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleSave = useCallback((state: PersistedState) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => writeState(state), DEBOUNCE_MS);
    }, []);

    const stateRef = useRef<PersistedState>({
        population: DEFAULT_POPULATION,
        budgetTarget: DEFAULT_BUDGET_TARGET,
        levyTypeDefs: DEFAULT_LEVY_TYPES,
        brackets: DEFAULT_BRACKETS,
    });

    useEffect(() => {
        const saved = readState();
        if (saved) {
            const storedBuild = saved.buildNumber ?? 0;
            if (storedBuild < CURRENT_BUILD) {
                setIsStale(true);
            }
            const target = saved.budgetTarget ?? saved.moneySupply ?? DEFAULT_BUDGET_TARGET;
            setPopulationRaw(saved.population);
            setBudgetTargetRaw(target);
            setLevyTypeDefsRaw(saved.levyTypeDefs ?? DEFAULT_LEVY_TYPES);
            setBracketsRaw(saved.brackets);
            stateRef.current = {
                population: saved.population,
                budgetTarget: target,
                levyTypeDefs: saved.levyTypeDefs ?? DEFAULT_LEVY_TYPES,
                brackets: saved.brackets,
            };
        }
        setScenarios(readScenarios());
        setIsLoading(false);
    }, []);

    const setPopulation = useCallback((val: number) => {
        setPopulationRaw(val);
        stateRef.current = {...stateRef.current, population: val};
        scheduleSave(stateRef.current);
    }, [scheduleSave]);

    const setBudgetTarget = useCallback((val: number) => {
        setBudgetTargetRaw(val);
        stateRef.current = {...stateRef.current, budgetTarget: val};
        scheduleSave(stateRef.current);
    }, [scheduleSave]);

    const setLevyTypeDefs = useCallback((defs: LevyTypeDefinition[]) => {
        setLevyTypeDefsRaw(defs);
        stateRef.current = {...stateRef.current, levyTypeDefs: defs};
        scheduleSave(stateRef.current);
    }, [scheduleSave]);

    const setBrackets = useCallback((bkts: TaxBracketData[]) => {
        setBracketsRaw(bkts);
        stateRef.current = {...stateRef.current, brackets: bkts};
        scheduleSave(stateRef.current);
    }, [scheduleSave]);

    const saveScenario = useCallback((name: string, totalTaxRevenue?: number, taxBalancePercentage?: number) => {
        const scenario: SavedScenario = {
            id: uuidv4(),
            name,
            date: new Date().toISOString(),
            ...stateRef.current,
            totalTaxRevenue,
            taxBalancePercentage,
        };
        const updated = [...readScenarios(), scenario];
        writeScenarios(updated);
        setScenarios(updated);
    }, []);

    const loadScenario = useCallback((data: PersistedState) => {
        const target = data.budgetTarget ?? data.moneySupply ?? DEFAULT_BUDGET_TARGET;
        setPopulationRaw(data.population);
        setBudgetTargetRaw(target);
        setLevyTypeDefsRaw(data.levyTypeDefs ?? DEFAULT_LEVY_TYPES);
        setBracketsRaw(data.brackets);
        stateRef.current = {
            population: data.population,
            budgetTarget: target,
            levyTypeDefs: data.levyTypeDefs ?? DEFAULT_LEVY_TYPES,
            brackets: data.brackets,
        };
        writeState(stateRef.current);
    }, []);

    const deleteScenario = useCallback((id: string) => {
        const updated = readScenarios().filter(s => s.id !== id);
        writeScenarios(updated);
        setScenarios(updated);
    }, []);

    const resetToDefaults = useCallback(() => {
        const defaults: PersistedState = {
            population: DEFAULT_POPULATION,
            budgetTarget: DEFAULT_BUDGET_TARGET,
            levyTypeDefs: DEFAULT_LEVY_TYPES,
            brackets: DEFAULT_BRACKETS,
        };
        loadScenario(defaults);
        setIsStale(false);
    }, [loadScenario]);

    const dismissStale = useCallback(() => {
        setIsStale(false);
        scheduleSave(stateRef.current);
    }, [scheduleSave]);

    return {
        population,
        budgetTarget,
        levyTypeDefs,
        brackets,
        setPopulation,
        setBudgetTarget,
        setLevyTypeDefs,
        setBrackets,
        saveScenario,
        loadScenario,
        deleteScenario,
        resetToDefaults,
        dismissStale,
        scenarios,
        isLoading,
        isStale,
    };
}
