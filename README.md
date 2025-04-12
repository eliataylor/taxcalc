# Tax Calculator React Application

A comprehensive React application built with TypeScript and Material UI 6 for calculating and visualizing tax scenarios across different population brackets. This application allows users to model different tax structures, analyze their impacts, and export/import scenarios for future reference.

![Tax Calculator Screenshot](https://via.placeholder.com/800x450.png?text=Tax+Calculator+Screenshot)

## Features

- **Dynamic Tax Bracket Management**
  - Create, edit, and remove tax brackets
  - Adjust population counts, income thresholds, and tax rates
  - Real-time validation of population distribution

- **Global Settings**
  - Select from predefined population categories (Total Population, Workforce, Taxpayers, etc.)
  - Choose different money supply formulations (M1, M2, Federal Budget, etc.)

- **Real-time Calculations**
  - Total tax revenue calculation
  - Population balance tracking
  - Tax balance percentage relative to the selected money supply
  - Per capita tax burden analysis

- **Rich Visualizations**
  - Tax distribution pie chart
  - Per capita tax burden bar chart
  - Income vs. tax comparison with stacked bars

- **Import/Export Functionality**
  - Save scenarios as JSON files
  - Import previously saved scenarios

## Components Overview

### Core Components

- **Calculator.tsx**: The main container component that manages the state and orchestrates all the other components.

- **Tax Bracket Components**:
  - `TaxBracket.tsx`: Individual tax bracket component with inputs for name, population, income threshold, and tax rate
  
- **Field Components**:
  - `MoneyField.tsx`: Displays monetary values with formatted dollar strings
  - `PopulationField.tsx`: Displays population values with human-readable formatting
  - `PayingPopulation.tsx`: Population selection with predefined census figures
  - `MoneySupply.tsx`: Money supply selection with predefined options (M1, M2, etc.)

- **Visualization Components**:
  - `TaxDistributionChart.tsx`: Pie chart showing tax distribution by bracket
  - `PerCapitaTaxChart.tsx`: Bar chart showing per capita tax by bracket
  - `IncomeTaxComparisonChart.tsx`: Stacked bar chart comparing income and tax

- **Utility Components**:
  - `ExportScenario.tsx`: Allows saving the current tax scenario to a JSON file
  - `ImportScenario.tsx`: Allows loading a previously saved tax scenario

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tax-calculator-app.git
   cd tax-calculator-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage Guide

### Setting Up a Basic Scenario

1. **Set the Global Parameters**:
   - Choose the appropriate paying population from the dropdown (e.g., "Taxpayers")
   - Select the money supply formulation (e.g., "Federal Tax Revenue")

2. **Configure Tax Brackets**:
   - Use the default brackets or add new ones with the "Add Bracket" button
   - For each bracket, set:
     - Bracket name (e.g., "Lower Income", "Middle Income", "Upper Income")
     - Population count
     - Income threshold (average income for the bracket)
     - Tax rate (using the slider)

3. **Review the Results**:
   - Check the "Tax Scenario Results" section for total tax revenue, percentage of money supply covered, and per capita tax burden
   - Navigate through the visualization tabs to view different aspects of your tax scenario

### Saving and Loading Scenarios

1. **To Save a Scenario**:
   - Click the "Export Scenario" button in the results section
   - Provide a name for your scenario
   - The scenario will download as a JSON file

2. **To Load a Scenario**:
   - Click the "Import Scenario" button
   - Select a previously saved scenario file
   - The application state will update to reflect the imported scenario

## Advanced Features

### Population Balance Validation

The application continuously monitors the sum of populations across all tax brackets, comparing it with the selected total population. If there's a mismatch:

- A warning appears if some population is not included in any bracket
- An error appears if the sum of bracket populations exceeds the total population

### Effective Tax Rate Analysis

For each bracket, you can see not only the nominal tax rate but also analyze:

- The total tax contribution from each bracket
- The per capita tax burden for members of each bracket
- The percentage of total tax revenue contributed by each bracket

## Dependencies

- React 18.x
- TypeScript 5.x
- Material UI 6.x
- Recharts for data visualization
- UUID for generating unique identifiers

## Browser Compatibility

The application is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data defaults for US population and economic figures are based on 2023 estimates
- Inspired by various tax policy visualization tools and calculators
