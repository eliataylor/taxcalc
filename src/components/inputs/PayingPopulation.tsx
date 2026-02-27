import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Typography,
    MenuItem,
    TextField,
    Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {PayingPopulationProps} from '../../types';
import {formatPopulation} from '../../utils/formatters.ts';
import {CENSUS_FIGURES} from '../../data/definitions.ts';

const CUSTOM_ID = '__custom__';

const PayingPopulation: React.FC<PayingPopulationProps> = ({val, name, description, onValueChange, onMetaChange}) => {
    const matchedPreset = CENSUS_FIGURES.find(f => f.value === val);
    const [selectedId, setSelectedId] = useState(matchedPreset?.id ?? CUSTOM_ID);
    const [modalOpen, setModalOpen] = useState(false);
    const [customName, setCustomName] = useState(name ?? '');
    const [customDescription, setCustomDescription] = useState(description ?? '');
    const [customValue, setCustomValue] = useState<string>(val.toString());

    useEffect(() => {
        const preset = CENSUS_FIGURES.find(f => f.value === val);
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
            const figure = CENSUS_FIGURES.find(f => f.id === id);
            if (figure) {
                onValueChange?.(figure.value);
                onMetaChange?.(figure.name, figure.description ?? '');
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
                label="Paying Population"
                select
                id="paying-population"
                value={selectedId}
                onChange={handlePresetChange}
                fullWidth
                size="small"
                helperText={displayDescription}
            >
                {CENSUS_FIGURES.map(figure => (
                    <MenuItem key={figure.id} value={figure.id}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, width: '100%'}}>
                            {figure.name} <Typography variant="caption" color="primary">({formatPopulation(figure.value)})</Typography>
                            {figure.description && (
                                <Tooltip title={figure.description} placement="right" arrow>
                                    <InfoOutlinedIcon sx={{fontSize: 14, color: 'text.disabled', ml: 'auto', cursor: 'help'}}/>
                                </Tooltip>
                            )}
                        </Box>
                    </MenuItem>
                ))}
                <MenuItem value={CUSTOM_ID}>
                    Custom population...
                </MenuItem>
            </TextField>

            <Dialog open={modalOpen} onClose={handleCancelCustom} maxWidth="xs" fullWidth>
                <DialogTitle>Custom Paying Population</DialogTitle>
                <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important'}}>
                    <TextField
                        label="Name"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g. Adults Only"
                    />
                    <TextField
                        label="Description"
                        value={customDescription}
                        onChange={e => setCustomDescription(e.target.value)}
                        fullWidth
                        size="small"
                        multiline
                        minRows={2}
                        placeholder="Explain who is included in this figure"
                    />
                    <TextField
                        label="Population"
                        value={Number(customValue).toLocaleString()}
                        onChange={handleCustomValueChange}
                        fullWidth
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">#</InputAdornment>,
                            },
                        }}
                        helperText={`${formatPopulation(Number(customValue) || 0)} people`}
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

export default PayingPopulation;
