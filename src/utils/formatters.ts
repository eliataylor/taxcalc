/**
 * Utility functions for formatting values consistently throughout the application
 */

/**
 * Formats a number as USD currency
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatMoney = (
    value: number,
    options: {
        notation?: 'standard' | 'compact',
        maximumFractionDigits?: number,
        minimumFractionDigits?: number
    } = {}
): string => {
    const {
        notation = 'standard',
        maximumFractionDigits = 2,
        minimumFractionDigits = 0
    } = options;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation,
        maximumFractionDigits,
        minimumFractionDigits,
    }).format(value);
};

/**
 * Formats a number as a human-readable population figure
 * @param value - The numeric value to format
 * @param includeRaw - Whether to include the raw number with commas
 * @returns Formatted population string
 */
export const formatPopulation = (
    value: number,
    includeRaw: boolean = false
): string => {
    const formatted = value.toLocaleString();

    let humanReadable = '';
    if (value >= 1_000_000_000_000) {
        humanReadable = `${(value / 1_000_000_000_000).toFixed(2)} trillion`;
    } else if (value >= 1_000_000_000) {
        humanReadable = `${(value / 1_000_000_000).toFixed(2)} billion`;
    } else if (value >= 1_000_000) {
        humanReadable = `${(value / 1_000_000).toFixed(2)} million`;
    } else if (value >= 1_000) {
        humanReadable = `${formatNumber(value)}`;
    }

    if (humanReadable && includeRaw) {
        return `${formatted} (${humanReadable})`;
    } else if (humanReadable) {
        return humanReadable;
    } else {
        return formatted;
    }
};

/**
 * Formats a decimal as a percentage
 * @param value - The decimal value to format (e.g., 0.25 for 25%)
 * @param decimalPlaces - Number of decimal places to show
 * @returns Formatted percentage string
 */
export const formatPercentage = (
    value: number,
    decimalPlaces: number = 2
): string => {
    return `${(value * 100).toFixed(decimalPlaces)}%`;
};

/**
 * Formats a number with appropriate separators (commas, etc.)
 * @param value - The numeric value to format
 * @returns Formatted number string
 */
export const formatNumber = (
    value: number,
    options: {
        notation?: 'standard' | 'compact',
        maximumFractionDigits?: number
    } = {}
): string => {
    const {
        notation = 'standard',
        maximumFractionDigits = 0
    } = options;

    return new Intl.NumberFormat('en-US', {
        notation,
        maximumFractionDigits
    }).format(value);
};
