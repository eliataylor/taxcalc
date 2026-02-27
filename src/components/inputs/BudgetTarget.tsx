import React, {useEffect, useState} from 'react';
import {Box, InputAdornment, MenuItem, TextField, Tooltip} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {BudgetTargetProps} from '../../types';
import {formatPopulation} from '../../utils/formatters.ts';
import {BUDGET_TARGETS} from '../../data/definitions.ts';

const CUSTOM_ID = '__custom__';

const BudgetTarget: React.FC<BudgetTargetProps> = ({val, onValueChange}) => {
    const matchedPreset = BUDGET_TARGETS.find(t => t.value === val);
    const [selectedId, setSelectedId] = useState(matchedPreset?.id ?? CUSTOM_ID);
    const [customValue, setCustomValue] = useState<string>(val.toString());

    useEffect(() => {
        const preset = BUDGET_TARGETS.find(t => t.value === val);
        if (preset) {
            setSelectedId(preset.id);
        }
    }, [val]);

    const handlePresetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.value;
        setSelectedId(id);
        if (id === CUSTOM_ID) {
            setCustomValue(val.toString());
        } else {
            const target = BUDGET_TARGETS.find(t => t.id === id);
            if (target && onValueChange) {
                onValueChange(target.value);
            }
        }
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setCustomValue(raw);
        const parsed = Number(raw);
        if (!isNaN(parsed) && parsed > 0 && onValueChange) {
            onValueChange(parsed);
        }
    };

    const isCustom = selectedId === CUSTOM_ID;

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <TextField
                label="Budget Target"
                select
                id="budget-target"
                value={selectedId}
                onChange={handlePresetChange}
                fullWidth
                size="small"
                helperText={!isCustom && matchedPreset ? matchedPreset.description : undefined}
            >
                {BUDGET_TARGETS.map(target => (
                    <MenuItem key={target.id} value={target.id}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, width: '100%'}}>
                            {target.name} <small>(${formatPopulation(target.value)})</small>
                            {target.description && (
                                <Tooltip title={target.description} placement="right" arrow>
                                    <InfoOutlinedIcon sx={{fontSize: 14, color: 'text.disabled', ml: 'auto', cursor: 'help'}}/>
                                </Tooltip>
                            )}
                        </Box>
                    </MenuItem>
                ))}
                <MenuItem value={CUSTOM_ID}>
                    Custom amount...
                </MenuItem>
            </TextField>

            {isCustom ? (
                <TextField
                    label="Target Amount"
                    value={Number(customValue).toLocaleString()}
                    onChange={handleCustomChange}
                    fullWidth
                    size="small"
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        },
                    }}
                    helperText={`$${formatPopulation(Number(customValue) || 0)}`}
                />
            ) : (
                <Box sx={{textAlign: 'center'}}>
                    <Box component="span" sx={{fontFamily: 'monospace', fontWeight: 600, fontSize: '0.95rem'}}>
                        ${formatPopulation(val)}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default BudgetTarget;
