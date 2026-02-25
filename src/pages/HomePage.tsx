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
import {DEFAULT_LEVY_TYPES} from '../data/definitions.ts';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

/**
 * Homepage describing the Net Worth tax calculator project.
 */
const HomePage: React.FC = () => {
    return (
        <Box
            sx={{
                maxWidth: 720,
                mx: 'auto',
                px: 2,
                py: 4,
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
                    p: 3,
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
                    This is an experimental thought exercise &mdash; not a policy proposal. The current
                    U.S. tax code is roughly 7,000 pages long. This calculator tries to explore whether
                    a simpler question could do most of the work: <em>how much do you have?</em>
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                    <Button
                        component={RouterLink}
                        to="/calculator"
                        variant="contained"
                        size="large"
                        startIcon={<CalculateIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Try the Calculator
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/variables"
                        variant="outlined"
                        size="large"
                        startIcon={<MenuBookIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Variables Reference
                    </Button>
                </Stack>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                            <Typography variant="overline" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ThumbUpIcon fontSize="small" /> What could go right
                            </Typography>
                            <List dense disablePadding>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Encourages circulation of wealth rather than accumulation." />
                                </ListItem>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Eliminates most deductions, credits, and loopholes by design." />
                                </ListItem>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Naturally progressive &mdash; those who hold more, contribute more." />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                            <Typography variant="overline" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ThumbDownIcon fontSize="small" /> What could go wrong
                            </Typography>
                            <List dense disablePadding>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="May discourage saving and incentivize spending." />
                                </ListItem>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Valuing illiquid assets (property, private equity) is hard." />
                                </ListItem>
                                <ListItem sx={{ py: 0, pl: 0 }}>
                                    <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                                        primary="Debt deductions create new avenues for manipulation." />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Stack>
            </Paper>

            {/* --- Defining Net Worth --- */}
            <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HelpOutlineIcon fontSize="small" /> Defining Net Worth
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                The central question is deceptively simple: <em>what counts?</em> Our working
                definition is <strong>Net Worth = Assets &minus; Debts</strong>, applied to individuals.
                Each side is broken into categories that can be taxed or deducted at independent rates.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                These categories are starting points &mdash; you can add, remove, or adjust them in the calculator.
                The goal is to find a minimal set that&rsquo;s both auditable and hard to game.
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>Assets (taxed)</Typography>
            <List dense disablePadding sx={{ mb: 2 }}>
                {DEFAULT_LEVY_TYPES.filter(lt => lt.category === 'asset').map(lt => (
                    <ListItem key={lt.key} alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary={lt.name}
                            secondary={lt.description}
                        />
                    </ListItem>
                ))}
            </List>

            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Debts (deducted)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Each debt category carries a deduction rate &mdash; the percentage of that debt that
                reduces your tax obligation. Rates decrease in the order listed, roughly reflecting
                how &ldquo;productive&rdquo; the debt is to the broader economy. This ranking is debatable and
                we&rsquo;d love to hear other arguments.
            </Typography>
            <List dense disablePadding sx={{ mb: 3 }}>
                {DEFAULT_LEVY_TYPES.filter(lt => lt.category === 'debt').map(lt => (
                    <ListItem key={lt.key} alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary={lt.name}
                            secondary={lt.description}
                        />
                    </ListItem>
                ))}
            </List>

            {/* --- The Debt Problem --- */}
            <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderColor: 'warning.main', borderWidth: 2 }}>
                <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WarningAmberIcon fontSize="small" color="warning" /> The Debt Problem
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Debt deductions are the most dangerous part of this model. Any system that reduces
                    your tax bill based on how much you owe creates an incentive to owe more &mdash;
                    or to <em>appear</em> to owe more. A few scenarios we&rsquo;re thinking about:
                </Typography>
                <List dense disablePadding sx={{ mb: 2 }}>
                    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary="Manufactured debt"
                            secondary="A wealthy individual takes a loan from a shell company they control offshore. On paper they have debt; in reality they have access to the same capital. The deduction would be free money."
                        />
                    </ListItem>
                    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary="Overseas creditor opacity"
                            secondary="If the creditor is a foreign entity, verifying that the debt is real and arm's-length becomes much harder. Cross-border lending could become the new tax shelter."
                        />
                    </ListItem>
                    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                            primary="Circular lending"
                            secondary='Two parties lend to each other. Both claim deductions. Neither has actually parted with any capital. Without netting rules, the system double-counts.'
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
                            primary="Require domestic, regulated creditors for deductions to apply." />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                            primary="Cap total debt deductions as a percentage of gross assets." />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                            primary="Net related-party debts (you can't owe yourself)." />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}
                            primary="Use declining deduction rates at higher net worth tiers &mdash; debt relief matters more to the lower brackets." />
                    </ListItem>
                </List>
            </Paper>

            {/* --- Open Questions --- */}
            <Typography variant="h6" sx={{ mb: 1.5 }}>Open Questions</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                This model raises more questions than it answers. That&rsquo;s the point &mdash; it&rsquo;s a
                thinking tool, not a finished product. Some of the harder ones:
            </Typography>
            <List dense disablePadding sx={{ mb: 3 }}>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Banks and Corporations"
                        secondary="Should entities be taxed on net worth too, or only individuals? Corporate balance sheets are structured very differently from personal ones."
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Transition"
                        secondary="You can't switch tax systems overnight. What does a 10-year phase-in look like? Would you run both systems in parallel?"
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Enforcement and Privacy"
                        secondary="A net worth tax requires knowing what people own. How do you balance enforcement with civil liberties? Could zero-knowledge proofs or privacy-preserving audits help?"
                    />
                </ListItem>
                <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
                    <ListItemText
                        primary="Capital Flight"
                        secondary="If only one country does this, wealth may simply leave. Is this viable without international coordination?"
                    />
                </ListItem>
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CodeIcon fontSize="small" /> Contribute
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                This is an open-source thought experiment. We&rsquo;re looking for economists, tax attorneys,
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
                {' '}gathered by Gemini{' '}
                <img src="/gemini-logo.png" alt="Gemini" height={17} style={{ verticalAlign: 'middle' }} />.
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
