import React from 'react';
import {Box, MenuItem, TextField, Tooltip} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {MoneySupplyProps} from '../../types';
import {formatPopulation} from '../../utils/formatters.ts';
import {MONEY_SUPPLY_TYPES} from '../../data/definitions.ts';

/**
 * A MoneyField with a Select box for various money supply formulations
 */
const MoneySupply: React.FC<MoneySupplyProps> = ({val, onValueChange}) => {
    const selectedSupply = MONEY_SUPPLY_TYPES.find(supply => supply.value === val) ||
        {id: 'custom', name: 'Custom', value: val, description: ''};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = e.target.value;
        const supply = MONEY_SUPPLY_TYPES.find(supply => supply.id === selectedId);
        if (supply && onValueChange) {
            onValueChange(supply.value);
        }
    };

    return (
        <TextField
            label="Money Supply"
            select={true}
            id="money-supply"
            value={selectedSupply.id}
            onChange={handleChange}
            fullWidth
            helperText={`$${formatPopulation(selectedSupply.value)}`}
        >
            {MONEY_SUPPLY_TYPES.map(supply => (
                <MenuItem key={supply.id} value={supply.id}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, width: '100%'}}>
                        {supply.name} (${formatPopulation(supply.value)})
                        {supply.description && (
                            <Tooltip title={supply.description} placement="right" arrow>
                                <InfoOutlinedIcon sx={{fontSize: 14, color: 'text.disabled', ml: 'auto', cursor: 'help'}}/>
                            </Tooltip>
                        )}
                    </Box>
                </MenuItem>
            ))}
        </TextField>
    );
};

export default MoneySupply;
