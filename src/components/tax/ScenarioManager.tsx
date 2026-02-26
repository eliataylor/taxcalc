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
    population,
    budgetTarget,
    levyTypeDefs,
    brackets,
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
        showAlert(`Scenario "${scenarioName}" saved.`);
        setSaveOpen(false);
        setScenarioName('');
    };

    const handleLoad = (scenario: SavedScenario) => {
        onLoad(scenario);
        showAlert(`Scenario "${scenario.name}" loaded.`);
        setLoadOpen(false);
    };

    const handleDelete = (scenario: SavedScenario) => {
        onDelete(scenario.id);
        showAlert(`Scenario "${scenario.name}" deleted.`, 'info');
    };

    const handleExportFile = () => {
        try {
            const data: SavedScenario = {
                id: uuidv4(),
                name: scenarioName.trim() || `Export ${new Date().toLocaleDateString()}`,
                date: new Date().toISOString(),
                population,
                budgetTarget,
                levyTypeDefs,
                brackets,
                totalTaxRevenue,
                taxBalancePercentage,
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const filename = data.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            saveAs(blob, `${filename}.json`);
            showAlert('Scenario exported to file.');
        } catch {
            showAlert('Failed to export scenario.', 'error');
        }
    };

    const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text) as PersistedState;

            if (!data.brackets || !Array.isArray(data.brackets)) {
                throw new Error('Invalid scenario: missing brackets array');
            }
            if (typeof data.population !== 'number') {
                throw new Error('Invalid scenario: population is not a number');
            }
            if (typeof data.budgetTarget !== 'number' && typeof data.moneySupply !== 'number') {
                throw new Error('Invalid scenario: budgetTarget is not a number');
            }

            onLoad(data);
            const name = (data as SavedScenario).name || file.name;
            showAlert(`Scenario "${name}" imported from file.`);
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
                Scenarios
            </Button>
            <Button variant="outlined" size="small" onClick={() => {
                setScenarioName(`Tax Scenario ${new Date().toLocaleDateString()}`);
                setSaveOpen(true);
            }}>
                Save
            </Button>
            <Button variant="outlined" size="small" color="warning" onClick={onReset}>
                Reset
            </Button>

            {/* Save dialog */}
            <Dialog open={saveOpen} onClose={() => setSaveOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Save Scenario</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Scenario Name"
                        fullWidth
                        value={scenarioName}
                        onChange={e => setScenarioName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                    />
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
                <DialogTitle>Load Scenario</DialogTitle>
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
