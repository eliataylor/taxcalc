import React, {useEffect, useRef, useState} from 'react';
import {Box, InputAdornment, TextField, Typography, TypographyProps} from '@mui/material';

interface ClickToEditProps {
    value: number | string;
    onCommit: (value: number | string) => void;
    type?: 'text' | 'number' | 'money' | 'percent';
    /** Display formatter — called with the raw value to produce the label shown in read mode */
    format?: (value: number | string) => string;
    typographyProps?: TypographyProps;
    /** Width of the inline input when editing */
    inputWidth?: number | string;
}

/**
 * Displays a value as styled text; clicking it reveals a compact inline input.
 * Commits on Enter or blur, reverts on Escape.
 */
const ClickToEdit: React.FC<ClickToEditProps> = ({
    value,
    onCommit,
    type = 'number',
    format,
    typographyProps,
    inputWidth = 100,
}) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(String(value));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) {
            setDraft(type === 'percent' ? String(Math.round(Number(value) * 100)) : String(value));
            setTimeout(() => inputRef.current?.select(), 0);
        }
    }, [editing, value, type]);

    const commit = () => {
        setEditing(false);
        if (type === 'text') {
            if (draft.trim() && draft.trim() !== value) onCommit(draft.trim());
        } else {
            const num = parseFloat(draft) || 0;
            const final = type === 'percent' ? num / 100 : num;
            if (final !== value) onCommit(final);
        }
    };

    const cancel = () => setEditing(false);

    if (editing) {
        return (
            <TextField
                inputRef={inputRef}
                variant="standard"
                size="small"
                value={draft}
                type={type === 'text' ? 'text' : 'number'}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={e => {
                    if (e.key === 'Enter') commit();
                    if (e.key === 'Escape') cancel();
                }}
                slotProps={{
                    input: {
                        sx: {fontSize: 'inherit', py: 0, px: 0.5},
                        ...(type === 'money'
                            ? {startAdornment: <InputAdornment position="start">$</InputAdornment>}
                            : type === 'percent'
                              ? {endAdornment: <InputAdornment position="end">%</InputAdornment>}
                              : {}),
                    },
                }}
                sx={{width: inputWidth}}
            />
        );
    }

    const displayValue = format ? format(value) : String(value);

    return (
        <Box
            component="span"
            onClick={() => setEditing(true)}
            sx={{
                cursor: 'pointer',
                borderBottom: '1px dashed',
                borderColor: 'action.disabled',
                '&:hover': {borderColor: 'primary.main', color: 'primary.main'},
                transition: 'color 0.15s, border-color 0.15s',
            }}
        >
            <Typography component="span" {...typographyProps}>
                {displayValue}
            </Typography>
        </Box>
    );
};

export default ClickToEdit;
