import React, {useState} from 'react';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField} from '@mui/material';
import {saveAs} from 'file-saver';
import {ExportScenarioProps, ScenarioData} from '../../types';

/**
 * Component for exporting the current tax scenario to a file
 */
const ExportScenario: React.FC<ExportScenarioProps> = ({
                                                           population,
                                                           moneySupply,
                                                           brackets,
                                                           totalTaxRevenue,
                                                           taxBalancePercentage
                                                       }) => {
    const [open, setOpen] = useState(false);
    const [scenarioName, setScenarioName] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const handleOpen = () => {
        setOpen(true);
        // Generate a default name based on date
        const today = new Date();
        const defaultName = `Tax Scenario ${today.toLocaleDateString()}`;
        setScenarioName(defaultName);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleExport = () => {
        try {
            // Create the scenario data object
            const scenarioData: ScenarioData = {
                name: scenarioName,
                date: new Date().toISOString(),
                population,
                moneySupply,
                brackets,
                totalTaxRevenue,
                taxBalancePercentage
            };

            // Convert to JSON
            const jsonData = JSON.stringify(scenarioData, null, 2);

            // Create a blob and download
            const blob = new Blob([jsonData], {type: 'application/json'});
            saveAs(blob, `${scenarioName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);

            // Show success message
            setAlertSeverity('success');
            setAlertMessage('Scenario exported successfully!');
            setAlertOpen(true);

            // Close the dialog
            handleClose();
        } catch (error) {
            console.error('Error exporting scenario:', error);
            setAlertSeverity('error');
            setAlertMessage('Failed to export scenario. Please try again.');
            setAlertOpen(true);
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <>
            <Button variant="outlined" onClick={handleOpen} sx={{mt: 2}}>
                Export Scenario
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Export Tax Scenario</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Scenario Name"
                        type="text"
                        fullWidth
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleExport} variant="contained">Export</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleAlertClose}
                    severity={alertSeverity}
                    sx={{width: '100%'}}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ExportScenario;
