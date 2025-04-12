import React, {useRef, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Typography
} from '@mui/material';
import {ImportScenarioProps, ScenarioData} from '../../types';

/**
 * Component for importing a tax scenario from a file
 */
const ImportScenario: React.FC<ImportScenarioProps> = ({onImport}) => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('info');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpen = () => {
        setOpen(true);
        setFile(null);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImport = async () => {
        if (!file) {
            setAlertSeverity('error');
            setAlertMessage('Please select a file to import.');
            setAlertOpen(true);
            return;
        }

        try {
            // Read the file
            const text = await file.text();
            const data = JSON.parse(text) as ScenarioData;

            // Validate the data
            if (!data.brackets || !Array.isArray(data.brackets)) {
                throw new Error('Invalid scenario format: missing brackets array');
            }

            if (typeof data.population !== 'number' || typeof data.moneySupply !== 'number') {
                throw new Error('Invalid scenario format: population or moneySupply is not a number');
            }

            // Import the scenario
            onImport({
                population: data.population,
                moneySupply: data.moneySupply,
                brackets: data.brackets
            });

            // Show success message
            setAlertSeverity('success');
            setAlertMessage(`Scenario "${data.name}" imported successfully!`);
            setAlertOpen(true);

            // Close the dialog
            handleClose();
        } catch (error) {
            console.error('Error importing scenario:', error);
            setAlertSeverity('error');
            setAlertMessage(`Failed to import scenario: ${(error as Error).message}`);
            setAlertOpen(true);
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    return (
        <>
            <Button variant="outlined" onClick={handleOpen} sx={{ml: 2}}>
                Import Scenario
            </Button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{display: 'none'}}
                accept=".json"
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Import Tax Scenario</DialogTitle>
                <DialogContent>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, py: 2}}>
                        <Typography>
                            Select a previously exported tax scenario file (.json)
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={handleFileSelect}
                            sx={{alignSelf: 'center'}}
                        >
                            Select File
                        </Button>

                        {file && (
                            <Typography variant="body2" sx={{mt: 1}}>
                                Selected file: {file.name}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleImport}
                        variant="contained"
                        disabled={!file}
                    >
                        Import
                    </Button>
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

export default ImportScenario;
