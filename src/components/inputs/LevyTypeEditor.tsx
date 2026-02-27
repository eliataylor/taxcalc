import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import {LevyCategory, LevyTypeDefinition} from '../../types';

interface LevyTypeEditorProps {
    open: boolean;
    onClose: () => void;
    onSave: (def: LevyTypeDefinition) => void;
    /** When provided, the dialog is in "edit" mode for an existing levy type */
    existing?: LevyTypeDefinition | null;
}

const EMPTY: LevyTypeDefinition = {
    key: '',
    name: '',
    description: '',
    rationale: '',
    defaultRate: 0.05,
    category: 'asset',
};

const LevyTypeEditor: React.FC<LevyTypeEditorProps> = ({open, onClose, onSave, existing}) => {
    const isEdit = !!existing;
    const [form, setForm] = useState<LevyTypeDefinition>(EMPTY);
    const [keyTouched, setKeyTouched] = useState(false);

    useEffect(() => {
        if (open) {
            if (existing) {
                setForm(existing);
                setKeyTouched(true);
            } else {
                setForm(EMPTY);
                setKeyTouched(false);
            }
        }
    }, [open, existing]);

    const deriveKey = (name: string) =>
        name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const handleNameChange = (name: string) => {
        setForm(prev => ({
            ...prev,
            name,
            ...(keyTouched ? {} : {key: deriveKey(name)}),
        }));
    };

    const handleField = <K extends keyof LevyTypeDefinition>(field: K, value: LevyTypeDefinition[K]) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    const canSave = form.name.trim().length > 0 && form.key.trim().length > 0;

    const handleSave = () => {
        if (!canSave) return;
        onSave({
            ...form,
            name: form.name.trim(),
            key: form.key.trim(),
            description: form.description.trim(),
            rationale: (form.rationale ?? '').trim(),
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? `Edit ${existing!.category === 'debt' ? 'Debt' : 'Holding'}: ${existing!.name}` : 'New Holding or Debt'}</DialogTitle>
            <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important'}}>
                <TextField
                    label="Name"
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                    helperText="Human-readable label shown in brackets and charts"
                />
                <TextField
                    label="Key"
                    value={form.key}
                    onChange={e => {
                        setKeyTouched(true);
                        handleField('key', e.target.value.replace(/[^a-z0-9_]/g, ''));
                    }}
                    fullWidth
                    required
                    disabled={isEdit}
                    helperText={isEdit ? 'Key cannot be changed after creation' : 'Unique machine identifier (auto-derived from name)'}
                    slotProps={{input: {sx: {fontFamily: 'monospace'}}}}
                />

                <ToggleButtonGroup
                    value={form.category}
                    exclusive
                    onChange={(_e, val: LevyCategory | null) => val && handleField('category', val)}
                    size="small"
                    disabled={isEdit}
                    fullWidth
                >
                    <ToggleButton value="asset" color="success">Holding</ToggleButton>
                    <ToggleButton value="debt" color="warning">Debt</ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="caption" color="text.secondary" sx={{mt: -1.5}}>
                    {form.category === 'asset'
                        ? 'Holdings add to taxable net worth — the rate is a tax rate.'
                        : 'Debts reduce taxable net worth — the rate is a deduction percentage.'}
                </Typography>

                <TextField
                    label="Default Rate"
                    type="number"
                    value={Math.round(form.defaultRate * 100 * 100) / 100}
                    onChange={e => handleField('defaultRate', (parseFloat(e.target.value) || 0) / 100)}
                    slotProps={{
                        input: {endAdornment: <InputAdornment position="end">%</InputAdornment>},
                        htmlInput: {step: 0.1, min: 0, max: 100},
                    }}
                    helperText="Applied to new brackets by default; each bracket can override"
                />

                <TextField
                    label="Description"
                    value={form.description}
                    onChange={e => handleField('description', e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={5}
                    helperText="What this encompasses — shown in tooltips and on the Variables page"
                />

                <TextField
                    label="Rationale"
                    value={form.rationale ?? ''}
                    onChange={e => handleField('rationale', e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={5}
                    helperText="Why this rate and classification — defend your reasoning for contributors to evaluate"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={!canSave}>
                    {isEdit ? 'Save Changes' : `Add ${form.category === 'debt' ? 'Debt' : 'Holding'}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LevyTypeEditor;
