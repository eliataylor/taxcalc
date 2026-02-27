import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CodeIcon from '@mui/icons-material/Code';
import { AccountBalance, Functions } from '@mui/icons-material';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

/**
 * Homepage describing the Net Worth tax calculator project.
 */
const HomePage: React.FC = () => {
    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: 'auto',
                px: 1,
                py: 2,
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{ mb: 1, fontWeight: 600 }}
            >
                Net Worth Tax Lab
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    mb: 4,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component="p"
                    sx={{ fontStyle: 'italic', textAlign: 'center', mb: 2 }}
                >
                    What if taxes were based on <strong>Net Worth</strong> instead of Annual Income?
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                    This is an experimental thought exercise and tool to find a formula that feels fair and balances our federal budget. The current
                    U.S. tax code is roughly 7,000 pages long. This is a tool searching for a simpler formula that can balance the federal budget
                    against the total Money Supply rather how much people made last year.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                    <Button
                        component={RouterLink}
                        to="/calculator"
                        variant="contained"
                        size="large"
                        color="primary"
                        startIcon={<AccountBalance />}
                        sx={{ textTransform: 'none' }}
                    >
                        Explore Tax Model
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/calculator?view=edit"
                        variant="contained"
                        size="large"
                        color="secondary"
                        startIcon={<CalculateIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Customize Tax Model
                    </Button>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                            <Typography variant="overline" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ThumbUpIcon fontSize="small" /> PROS
                            </Typography>
                            <List dense disablePadding>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Encourages circulation of wealth." />
                                </ListItem>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Restores the best aspects of Capitalism." />
                                </ListItem>

                            </List>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                            <Typography variant="overline" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ThumbDownIcon fontSize="small" /> CONS
                            </Typography>
                            <List dense disablePadding>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Incentivize Consumerism." />
                                </ListItem>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="A bit harder to audit than our current system." />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Stack>
            </Paper>

            {/* --- Defining Net Worth --- */}
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Functions fontSize="small" /> Defining Net Worth
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600, mb: 1.5 }}>
                <em>Net Worth</em> = Liquid Capital + Reserved Capital + Idle Property &minus; Debts & Interests Owed
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
                The goal is to tax who ever is hording money instead of circulating it. That has to include every corporation and individual &mdash; including minors, who would file through a legal guardian.
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Disagree? The whole point of this site is to offer tools for you can <RouterLink to="/calculator?view=edit">create your own</RouterLink> rules and tax brackets that balance our federal budget. The tool provides warnings when Tax Brackets do not sum to your target Population or Total Net Worth.
            </Typography>

            <Button
                component={RouterLink}
                to="/variables"
                variant="outlined"
                size="small"
                startIcon={<MenuBookIcon />}
                sx={{ textTransform: 'none', mb: 4 }}
            >
                Read all all variables and defintions
            </Button>


            {/* --- Open Questions --- */}
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HelpOutlineIcon fontSize="small" />

                Open Questions</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                This idea raises more questions than it answers. Some of the harder ones we need your help with:
            </Typography>
            <List dense disablePadding sx={{ mb: 3 }}>
                <Typography variant="body1" >

                </Typography>

                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Foreign Assets, Debts and Entities"
                        secondary="How would we appraise and attribute capital parked overseas that was clearly earned from US spending? Don't give up because of this. Capital Flight is a constant threat in our current tax system too."
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Date to File"
                        secondary="Everyone's Net Worth changes dialy, so when do we file?"
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Equity"
                        secondary="Is there any reason to tax equity at all until it's sold or borrowed against?"
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Debt Depreciation"
                        secondary="How do we prevent repeat deductions of the same debt?"
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Transition"
                        secondary="Can we switch to this systems overnight, or do we need a multi year / phase rollout?"
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Banking"
                        secondary="How do we tax Banks in this system? Maybe the one place we use the current annual earnings system."
                    />
                </ListItem>

                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Enforcement and Privacy"
                        secondary="I imagine no formal disclosure is required unless audited with severe penalties for fraud. All said, how do you balance enforcement with civil liberties? This is even harder for offshore assets. All said, our current system has most of these same problems."
                    />
                </ListItem>

            </List>

            {/* --- The Capital Flight Problem --- */}
            <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderColor: 'warning.main', borderWidth: 2 }}>
                <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WarningAmberIcon fontSize="small" color="warning" /> The Threat of Capital Flight and Foreign Spending.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Capital Flight is a constant threat in any tax system, but especially hard for this one.
                    Foreign Spending is probably a bigger issue in on our current system where it's often tax deductible.
                </Typography>
                <List dense disablePadding sx={{ mb: 2 }}>
                    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary="Capital Flight"
                            secondary="How can we appraise and attribute large losses of the Money Supply to foreign banks."
                        />
                    </ListItem>
                    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary="Foreign Spending"
                            secondary="How can we incentivize more domestic?"
                        />
                    </ListItem>
                </List>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Possible safeguards worth exploring:
                </Typography>
                <List dense disablePadding>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                            primary="Implement new SKU code system that identifies goods by countries of origin. This would ultimately help tax Walmart more on wealth earned in the US from products, but made abroad." />
                    </ListItem>
                </List>
            </Paper>

            {/* --- The Debt Problem --- */}
            <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderColor: 'warning.main', borderWidth: 2 }}>
                <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WarningAmberIcon fontSize="small" color="warning" /> The Debt Problem
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Debt deductions open a lot of loopholes. However, they're probably necessary when calculating Net Worth.
                </Typography>
                <List dense disablePadding sx={{ mb: 2 }}>
                    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary="Double Deducations"
                            secondary="If you never pay your budgets, you shoudl be able to deduct it forever. How do we track and depreciate dedt and it's interest?"
                        />
                    </ListItem>
                    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary="Strategic medical debt"
                            secondary="Elective procedures billed at inflated prices to a related-party provider. The &ldquo;debt&rdquo; is real on paper but engineered for deduction value."
                        />
                    </ListItem>
                </List>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Possible safeguards worth exploring:
                </Typography>
                <List dense disablePadding>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                            primary="Setup a depreciation formula for debt." />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                            primary="Net related-party debts (you can't owe yourself)." />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                            primary="Foreign debt is not deductible." />
                    </ListItem>
                </List>
            </Paper>


            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CodeIcon fontSize="small" /> Contribute
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                This is an open-source thought experiment. I'm looking for economists, tax attorneys,
                policy researchers, engineers &mdash; or anyone who finds this interesting and wants to
                poke holes in it.
            </Typography>
            <Typography variant="body1">
                Open Issues or Pull Requests on{' '}
                <a href="https://github.com/eliataylor/taxcalc" {...linkProps}>
                    <img src="/github-mark-white.svg" alt="" height={17} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    GitHub
                </a>
                . You can also contribute to this Google Doc of{' '}
                <a href="https://docs.google.com/document/d/1qCxG9i8CHDaBKULj7ITyCVCcWngkd6edAwGGiV1Z2Zo/edit?usp=sharing" {...linkProps}>
                    research
                </a>
                {' '}gathered by <img src="/gemini-logo.png" alt="Gemini" height={17} style={{ verticalAlign: 'middle' }} /> Gemini.

            </Typography>

            <Divider sx={{ my: 4 }} />

            <Box
                component="a"
                href="https://github.com/sponsors/eliataylor"
                {...linkProps}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    py: 2,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    opacity: 0.6,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1, color: '#db61a2' },
                }}
            >
                <img src="/github-mark-white.svg" alt="GitHub" height={36} />
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                    Sponsor this project
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;
