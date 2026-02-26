import React from 'react';
import {Box, MenuItem, TextField, Tooltip} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {PayingPopulationProps} from '../../types';
import {formatPopulation} from '../../utils/formatters.ts';
import {CENSUS_FIGURES} from '../../data/definitions.ts';

/**
 * A PopulationField with a Select box for various census figures
 */
const PayingPopulation: React.FC<PayingPopulationProps> = ({val, onValueChange}) => {
    const selectedFigure = CENSUS_FIGURES.find(fig => fig.value === val) ||
        {id: 'custom', name: 'Custom', value: val, description: ''};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = e.target.value;
        const figure = CENSUS_FIGURES.find(fig => fig.id === selectedId);
        if (figure && onValueChange) {
            onValueChange(figure.value);
        }
    };

    return (
        <TextField
            label="Paying Population"
            select={true}
            id="paying-population"
            value={selectedFigure.id}
            onChange={handleChange}
            fullWidth
            helperText={CENSUS_FIGURES.find(fig => fig.id === selectedFigure.id)?.description}
        >
            {CENSUS_FIGURES.map(figure => (
                <MenuItem key={figure.id} value={figure.id}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, width: '100%'}}>
                        {figure.name} <small>({formatPopulation(figure.value)})</small>
                        {figure.description && (
                            <Tooltip title={figure.description} placement="right" arrow>
                                <InfoOutlinedIcon sx={{fontSize: 14, color: 'text.disabled', ml: 'auto', cursor: 'help'}}/>
                            </Tooltip>
                        )}
                    </Box>
                </MenuItem>
            ))}
        </TextField>
    );
};

export default PayingPopulation;
