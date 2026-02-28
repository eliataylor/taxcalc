import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    InputAdornment,
    MenuItem,
    TextField,
    Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {NetWorthTargetProps} from '../../types';
import {formatPopulation} from '../../utils/formatters.ts';
import {MONEY_SUPPLY_REFS} from '../../data/definitions.ts';

const CUSTOM_ID = '__custom__';

const NetWorthTarget: React.FC<NetWorthTargetProps> = ({val, name, description, onValueChange, onMetaChange}) => {
    const matchedPreset = MONEY_SUPPLY_REFS.find(r => r.value === val);
    const [selectedId, setSelectedId] = useState(matchedPreset?.id ?? CUSTOM_ID);
    const [modalOpen, setModalOpen] = useState(false);
    const [customName, setCustomName] = useState(name ?? '');
    const [customDescription, setCustomDescription] = useState(description ?? '');
    const [customValue, setCustomValue] = useState<string>(val.toString());

    useEffect(() => {
        const preset = MONEY_SUPPLY_REFS.find(r => r.value === val);
        if (preset) {
            setSelectedId(preset.id);
        }
    }, [val]);

    const handlePresetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.value;
        setSelectedId(id);
        if (id === CUSTOM_ID) {
            setCustomValue(val.toString());
            setCustomName(name ?? '');
            setCustomDescription(description ?? '');
            setModalOpen(true);
        } else {
            const ref = MONEY_SUPPLY_REFS.find(r => r.id === id);
            if (ref) {
                onValueChange?.(ref.value);
                onMetaChange?.(ref.name, ref.description ?? '');
            }
        }
    };

    const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setCustomValue(raw);
    };

    const handleSaveCustom = () => {
        const parsed = Number(customValue);
        if (!isNaN(parsed) && parsed > 0) {
            onValueChange?.(parsed);
            onMetaChange?.(customName || 'Custom', customDescription);
        }
        setModalOpen(false);
    };

    const handleCancelCustom = () => {
        if (matchedPreset) {
            setSelectedId(matchedPreset.id);
        }
        setModalOpen(false);
    };

    const isCustom = selectedId === CUSTOM_ID;
    const displayDescription = isCustom ? description : matchedPreset?.description;

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            <TextField
                label="Maximum Net Wealth To Tax"
                select
                id="net-worth-target"
                value={selectedId}
                onChange={handlePresetChange}
                fullWidth
                size="small"
                helperText={displayDescription}
            >
                {MONEY_SUPPLY_REFS.map(ref => (
                    <MenuItem key={ref.id} value={ref.id}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, width: '100%'}}>
                            {ref.name} <Typography variant="caption" color="primary">(${formatPopulation(ref.value)})</Typography>
                            {ref.description && (
                                <Tooltip title={ref.description} placement="right" arrow>
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

            <Dialog open={modalOpen} onClose={handleCancelCustom} maxWidth="xs" fullWidth>
                <DialogTitle>Custom Net Wealth Target</DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important'}}>
                    <TextField
                        label="Name"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g. Household Net Wealth Only"
                    />
                    <TextField
                        label="Description"
                        value={customDescription}
                        onChange={e => setCustomDescription(e.target.value)}
                        fullWidth
                        size="small"
                        multiline
                        minRows={2}
                        placeholder="Explain what this figure represents"
                    />
                    <TextField
                        label="Amount"
                        value={Number(customValue).toLocaleString()}
                        onChange={handleCustomValueChange}
                        fullWidth
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            },
                        }}
                        helperText={`$${formatPopulation(Number(customValue) || 0)}`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelCustom}>Cancel</Button>
                    <Button
                        onClick={handleSaveCustom}
                        variant="contained"
                        disabled={!customValue || Number(customValue) <= 0}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NetWorthTarget;
