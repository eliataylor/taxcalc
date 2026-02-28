import React, {useRef, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {saveAs} from 'file-saver';
import {v4 as uuidv4} from 'uuid';
import {PersistedState, SavedScenario, ScenarioManagerProps} from '../../types';

const ScenarioManager: React.FC<ScenarioManagerProps> = ({
    currentState,
    totalTaxRevenue,
    taxBalancePercentage,
    scenarios,
    onSave,
    onLoad,
    onDelete,
    onReset,
}) => {
    const [saveOpen, setSaveOpen] = useState(false);
    const [loadOpen, setLoadOpen] = useState(false);
    const [scenarioName, setScenarioName] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('success');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showAlert = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleSave = () => {
        if (!scenarioName.trim()) return;
        onSave(scenarioName.trim());
        showAlert(`Model "${scenarioName}" saved.`);
        setSaveOpen(false);
        setScenarioName('');
    };

    const handleLoad = (scenario: SavedScenario) => {
        onLoad(scenario);
        showAlert(`Model "${scenario.name}" loaded.`);
        setLoadOpen(false);
    };

    const handleDelete = (scenario: SavedScenario) => {
        onDelete(scenario.id);
        showAlert(`Model "${scenario.name}" deleted.`, 'info');
    };

    const handleExportFile = () => {
        try {
            const data: SavedScenario = {
                ...currentState,
                id: uuidv4(),
                name: scenarioName.trim() || `Export ${new Date().toLocaleDateString()}`,
                date: new Date().toISOString(),
                totalTaxRevenue,
                taxBalancePercentage,
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const filename = data.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            saveAs(blob, `${filename}.json`);
            showAlert('Model exported to file.');
        } catch {
            showAlert('Failed to export model.', 'error');
        }
    };

    const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text) as PersistedState;

            if (!data.brackets || !Array.isArray(data.brackets)) {
                throw new Error('Invalid model: missing brackets array');
            }
            if (typeof data.population !== 'number') {
                throw new Error('Invalid model: population is not a number');
            }
            if (typeof data.budgetTarget !== 'number' && typeof data.moneySupply !== 'number') {
                throw new Error('Invalid model: budgetTarget is not a number');
            }
            if (typeof data.netWorthTarget !== 'number' && data.netWorthTarget !== undefined) {
                throw new Error('Invalid model: netWorthTarget is not a number');
            }

            onLoad(data);
            const name = (data as SavedScenario).name || file.name;
            showAlert(`Model "${name}" imported from file.`);
        } catch (err) {
            showAlert(`Import failed: ${(err as Error).message}`, 'error');
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <Button variant="outlined" size="small" onClick={() => {
                setLoadOpen(true);
            }}>
                Import
            </Button>
            <Button variant="outlined" size="small" onClick={() => {
                setScenarioName(`Tax Model ${new Date().toLocaleDateString()}`);
                setSaveOpen(true);
            }}>
                Export
            </Button>
            <Button variant="outlined" size="small" color="secondary" sx={{ color: 'secondary.light' }} onClick={onReset}>
                Reset
            </Button>

            {/* Save dialog */}
            <Dialog open={saveOpen} onClose={() => setSaveOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Save Model</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Model Name"
                        fullWidth
                        value={scenarioName}
                        onChange={e => setScenarioName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                    />
                    <Box sx={{mt: 2}}>
                        Email eli@taylormadetraffic.com to add your model to this tool.
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save to Browser</Button>
                    <Button onClick={() => {
                        handleExportFile();
                        setSaveOpen(false);
                    }} variant="outlined">
                        Export to File
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Load dialog */}
            <Dialog open={loadOpen} onClose={() => setLoadOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Load Model</DialogTitle>
                <DialogContent>
                    {scenarios.length > 0 ? (
                        <List dense>
                            {scenarios.map(scenario => (
                                <ListItem
                                    key={scenario.id}
                                    component="div"
                                    onClick={() => handleLoad(scenario)}
                                    sx={{cursor: 'pointer', '&:hover': {bgcolor: 'action.hover'}, borderRadius: 1}}
                                >
                                    <ListItemText
                                        primary={scenario.name}
                                        secondary={`${new Date(scenario.date).toLocaleDateString()} · ${scenario.brackets.length} brackets`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" size="small" onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(scenario);
                                        }}>
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{py: 2}}>
                            No saved scenarios yet.
                        </Typography>
                    )}
                    <Box sx={{mt: 2}}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImportFile}
                            style={{display: 'none'}}
                            accept=".json"
                        />
                        <Button variant="outlined" size="small" onClick={() => fileInputRef.current?.click()}>
                            Import from File
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLoadOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alertOpen}
                autoHideDuration={4000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{width: '100%'}}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ScenarioManager;
