import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Paper,
    Typography,
    useTheme,
    Container,
    Grid,
    Stack,
    IconButton,
    Tooltip,
    LinearProgress,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    Download as DownloadIcon,
    CheckCircle as CheckIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    Psychology as PlannerIcon,
    Share as ShareIcon,
    Print as PrintIcon,
    Lightbulb as InsightIcon,
    Star as StarIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    School as SchoolIcon
} from '@mui/icons-material';

interface GradingResultsProps {
    data: any;
}

export default function GradingResults({ data }: GradingResultsProps) {
    const theme = useTheme();
    const [latestTasks, setLatestTasks] = useState<any>(null);

    // Parse the data
    let parsedData = data;
    if (typeof data === 'string') {
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            return (
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ borderRadius: 3 }}>
                        <AlertTitle>Parsing Error</AlertTitle>
                        Failed to parse the results data. Please try again.
                    </Alert>
                </Container>
            );
        }
    }

    // Handle nested description (for planner)
    if (parsedData.description) {
        try {
            parsedData = JSON.parse(parsedData.description);
        } catch (e) {
            return (
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ borderRadius: 3 }}>
                        <AlertTitle>Parsing Error</AlertTitle>
                        Failed to parse the description data. Please try again.
                    </Alert>
                </Container>
            );
        }
    }

    // Helper function to get performance color and icon
    const getPerformanceDetails = (percentage: number) => {
        if (percentage >= 90) return { color: 'success', icon: StarIcon, label: 'Excellent', bgColor: 'var(--success-50)' };
        if (percentage >= 75) return { color: 'success', icon: TrendingUpIcon, label: 'Good', bgColor: 'var(--success-50)' };
        if (percentage >= 50) return { color: 'warning', icon: WarningIcon, label: 'Fair', bgColor: 'var(--warning-50)' };
        return { color: 'error', icon: ErrorIcon, label: 'Needs Improvement', bgColor: 'var(--error-50)' };
    };

    // Helper function to export grading results as CSV
    const exportToCSV = () => {
        if (!latestTasks) {
            alert('No data to export yet.');
            return;
        }

        const csv = [
            ['Question', 'Max Marks', 'Awarded Marks', 'Percentage', 'Feedback'],
            ...Object.entries(latestTasks).map(([qid, [max, awarded, feedback]]: [string, any]) =>
                [qid, max, awarded, `${((awarded / max) * 100).toFixed(1)}%`, `"${feedback.replace(/"/g, '""')}"`]
            )
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'grading_results.csv');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Check if we have grading tasks
    if (parsedData.tasks && typeof parsedData.tasks === 'object') {
        // Store tasks for export
        if (!latestTasks) {
            setLatestTasks(parsedData.tasks);
        }

        // Calculate overall statistics
        const taskEntries = Object.entries(parsedData.tasks);
        const totalPossible = taskEntries.reduce((sum, [, values]: [string, any]) => sum + values[0], 0);
        const totalAwarded = taskEntries.reduce((sum, [, values]: [string, any]) => sum + values[1], 0);
        const overallPercentage = (totalAwarded / totalPossible) * 100;
        const performanceDetails = getPerformanceDetails(overallPercentage);

        // Render grading results
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card
                    elevation={0}
                    className="fade-in"
                    sx={{
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, var(--surface) 0%, var(--background-secondary) 100%)',
                        border: '1px solid var(--border-light)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: 'linear-gradient(90deg, var(--success-500) 0%, var(--primary-500) 100%)',
                        },
                        '&:hover': {
                            boxShadow: 'var(--shadow-xl)',
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Header Section */}
                    <Box sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
                        <Stack spacing={4}>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, var(--success-500) 0%, var(--primary-500) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CheckIcon sx={{ color: 'white', fontSize: 32 }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            fontWeight={700}
                                            sx={{
                                                background: 'linear-gradient(135deg, var(--success-600) 0%, var(--primary-600) 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            Grading Results
                                        </Typography>
                                        <Typography variant="body1" color="var(--text-secondary)" sx={{ mt: 0.5 }}>
                                            Comprehensive AI-powered assessment feedback
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Action Buttons */}
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="Share Results">
                                        <IconButton
                                            sx={{
                                                backgroundColor: 'var(--primary-50)',
                                                '&:hover': { backgroundColor: 'var(--primary-100)' },
                                            }}
                                        >
                                            <ShareIcon sx={{ color: 'var(--primary-600)' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Print Results">
                                        <IconButton
                                            sx={{
                                                backgroundColor: 'var(--secondary-50)',
                                                '&:hover': { backgroundColor: 'var(--secondary-100)' },
                                            }}
                                        >
                                            <PrintIcon sx={{ color: 'var(--secondary-600)' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Button
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        onClick={exportToCSV}
                                        sx={{
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                                            boxShadow: 'var(--shadow-md)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                                                boxShadow: 'var(--shadow-lg)',
                                            },
                                        }}
                                    >
                                        Export CSV
                                    </Button>
                                </Stack>
                            </Stack>

                            {/* Overall Performance Card */}
                            <Paper
                                elevation={0}
                                className="performance-card"
                                sx={{
                                    p: 4,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${performanceDetails.bgColor} 0%, var(--surface) 100%)`,
                                    border: `2px solid var(--${performanceDetails.color}-200)`,
                                }}
                            >
                                <Grid container spacing={3} alignItems="center">
                                    <Grid item xs={12} md={8}>
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        backgroundColor: `var(--${performanceDetails.color}-100)`,
                                                    }}
                                                >
                                                    <performanceDetails.icon sx={{ color: `var(--${performanceDetails.color}-600)`, fontSize: 24 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" fontWeight={700} color="var(--text-primary)">
                                                        {parsedData.total_score || `${totalAwarded}/${totalPossible}`}
                                                    </Typography>
                                                    <Typography variant="body1" color="var(--text-secondary)">
                                                        Overall Score • {performanceDetails.label}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Typography variant="body2" color="var(--text-secondary)">
                                                        Performance
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600} color="var(--text-primary)">
                                                        {overallPercentage.toFixed(1)}%
                                                    </Typography>
                                                </Stack>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={overallPercentage}
                                                    sx={{
                                                        height: 12,
                                                        borderRadius: 6,
                                                        backgroundColor: `var(--${performanceDetails.color}-100)`,
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: `var(--${performanceDetails.color}-500)`,
                                                            borderRadius: 6,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                                            <Chip
                                                label={`${taskEntries.length} Questions Graded`}
                                                sx={{
                                                    backgroundColor: 'var(--primary-100)',
                                                    color: 'var(--primary-700)',
                                                    fontWeight: 600
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="var(--text-secondary)"
                                                sx={{ textAlign: { xs: 'left', md: 'right' } }}
                                            >
                                                AI Analysis Complete
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>
                    </Box>

                    {/* Questions Section */}
                    <Box sx={{ px: { xs: 3, sm: 4, md: 6 }, pb: { xs: 3, sm: 4, md: 6 } }}>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <InsightIcon sx={{ color: 'var(--primary-600)' }} />
                                <Typography variant="h5" fontWeight={600}>
                                    Detailed Feedback
                                </Typography>
                            </Stack>

                            <Grid container spacing={3}>
                                {Object.entries(parsedData.tasks).map(([qid, values]: [string, any]) => {
                                    const [max, awarded, feedback] = values;
                                    const percentage = (awarded / max) * 100;
                                    const questionPerformance = getPerformanceDetails(percentage);

                                    return (
                                        <Grid item xs={12} lg={6} key={qid}>
                                            <Paper
                                                elevation={0}
                                                className="performance-card"
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 3,
                                                    border: `2px solid var(--${questionPerformance.color}-200)`,
                                                    background: `linear-gradient(135deg, ${questionPerformance.bgColor} 0%, var(--surface) 100%)`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: 'var(--shadow-lg)',
                                                    },
                                                }}
                                            >
                                                <Stack spacing={3}>
                                                    {/* Question Header */}
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="h6" fontWeight={600} color="var(--text-primary)">
                                                            {qid}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip
                                                                icon={<questionPerformance.icon fontSize="small" />}
                                                                label={`${awarded}/${max}`}
                                                                color={questionPerformance.color as any}
                                                                size="small"
                                                                sx={{ fontWeight: 600 }}
                                                            />
                                                        </Stack>
                                                    </Stack>

                                                    {/* Performance Bar */}
                                                    <Box>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                            <Typography variant="body2" color="var(--text-secondary)">
                                                                Score
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {percentage.toFixed(1)}%
                                                            </Typography>
                                                        </Stack>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={percentage}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                backgroundColor: `var(--${questionPerformance.color}-100)`,
                                                                '& .MuiLinearProgress-bar': {
                                                                    backgroundColor: `var(--${questionPerformance.color}-500)`,
                                                                    borderRadius: 4,
                                                                },
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Feedback */}
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            backgroundColor: 'var(--background-secondary)',
                                                            border: '1px solid var(--border-light)',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="var(--text-secondary)"
                                                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                                                        >
                                                            {feedback}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Stack>
                    </Box>
                </Card>
            </Container>
        );
    }
    // Check if we have project planner tasks
    else if (parsedData.tasks && Array.isArray(parsedData.tasks)) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card
                    elevation={0}
                    className="fade-in"
                    sx={{
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, var(--surface) 0%, var(--background-secondary) 100%)',
                        border: '1px solid var(--border-light)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: 'linear-gradient(90deg, var(--secondary-500) 0%, var(--primary-500) 100%)',
                        },
                        '&:hover': {
                            boxShadow: 'var(--shadow-xl)',
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Header Section */}
                    <Box sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
                        <Stack spacing={4}>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--primary-500) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PlannerIcon sx={{ color: 'white', fontSize: 32 }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            fontWeight={700}
                                            sx={{
                                                background: 'linear-gradient(135deg, var(--secondary-600) 0%, var(--primary-600) 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            Assignment Plan
                                        </Typography>
                                        <Typography variant="body1" color="var(--text-secondary)" sx={{ mt: 0.5 }}>
                                            AI-generated comprehensive assignment structure
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Action Buttons */}
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="Share Plan">
                                        <IconButton
                                            sx={{
                                                backgroundColor: 'var(--secondary-50)',
                                                '&:hover': { backgroundColor: 'var(--secondary-100)' },
                                            }}
                                        >
                                            <ShareIcon sx={{ color: 'var(--secondary-600)' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Print Plan">
                                        <IconButton
                                            sx={{
                                                backgroundColor: 'var(--primary-50)',
                                                '&:hover': { backgroundColor: 'var(--primary-100)' },
                                            }}
                                        >
                                            <PrintIcon sx={{ color: 'var(--primary-600)' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>

                            {/* Summary Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, var(--secondary-50) 0%, var(--surface) 100%)',
                                    border: '2px solid var(--secondary-200)',
                                }}
                            >
                                <Grid container spacing={3} alignItems="center">
                                    <Grid item xs={12} md={8}>
                                        <Stack direction="row" spacing={3} alignItems="center">
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    backgroundColor: 'var(--secondary-100)',
                                                }}
                                            >
                                                <AssignmentIcon sx={{ color: 'var(--secondary-600)', fontSize: 24 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" fontWeight={700} color="var(--text-primary)">
                                                    {parsedData.tasks.length} Tasks
                                                </Typography>
                                                <Typography variant="body1" color="var(--text-secondary)">
                                                    Total: {parsedData.tasks.reduce((sum: number, task: any) => sum + task.efforts, 0)} hours estimated
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                                            <Chip
                                                label="AI Generated Plan"
                                                sx={{
                                                    backgroundColor: 'var(--secondary-100)',
                                                    color: 'var(--secondary-700)',
                                                    fontWeight: 600
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="var(--text-secondary)"
                                                sx={{ textAlign: { xs: 'left', md: 'right' } }}
                                            >
                                                Ready to execute
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>
                    </Box>

                    {/* Tasks Section */}
                    <Box sx={{ px: { xs: 3, sm: 4, md: 6 }, pb: { xs: 3, sm: 4, md: 6 } }}>
                        <Grid container spacing={3}>
                            {parsedData.tasks.map((task: any, index: number) => (
                                <Grid item xs={12} key={task.task_id}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border: '2px solid var(--secondary-200)',
                                            background: 'linear-gradient(135deg, var(--secondary-50) 0%, var(--surface) 100%)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 'var(--shadow-lg)',
                                            },
                                        }}
                                    >
                                        <Stack spacing={3}>
                                            {/* Task Header */}
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Box
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            backgroundColor: 'var(--secondary-500)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="body2" fontWeight={700} color="white">
                                                            {index + 1}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="h6" fontWeight={600} color="var(--text-primary)">
                                                        {task.task_name}
                                                    </Typography>
                                                </Stack>

                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                    <Chip
                                                        icon={<ScheduleIcon fontSize="small" />}
                                                        label={`${task.efforts} ${task.efforts === 1 ? 'hour' : 'hours'}`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'var(--primary-100)',
                                                            color: 'var(--primary-700)',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                    <Chip
                                                        label={`Due: ${task.deadline}`}
                                                        color="secondary"
                                                        size="small"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </Stack>
                                            </Stack>

                                            {/* Steps Section */}
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 2,
                                                    backgroundColor: 'var(--background-tertiary)',
                                                    border: '1px solid var(--border-light)',
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <InsightIcon sx={{ mr: 1, color: 'var(--secondary-600)', fontSize: 20 }} />
                                                    Implementation Steps
                                                </Typography>

                                                <Stack spacing={2}>
                                                    {task.steps.map((step: any, stepIndex: number) => (
                                                        <Stack key={stepIndex} direction="row" spacing={2} alignItems="flex-start">
                                                            <Box
                                                                sx={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'var(--secondary-100)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                    mt: 0.25,
                                                                }}
                                                            >
                                                                <Typography variant="caption" fontWeight={600} color="var(--secondary-600)">
                                                                    {stepIndex + 1}
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                                                {step.step_description}
                                                            </Typography>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Card>
            </Container>
        );
    }

    // Fallback for other data formats
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 4, md: 6 },
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, var(--surface) 0%, var(--background-secondary) 100%)',
                    border: '1px solid var(--border-light)',
                }}
            >
                <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <SchoolIcon sx={{ color: 'var(--primary-600)', fontSize: 32 }} />
                        <Typography variant="h4" fontWeight={600}>
                            Processing Results
                        </Typography>
                    </Stack>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: 'var(--background-tertiary)',
                            border: '1px solid var(--border-light)',
                        }}
                    >
                        <pre style={{
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            fontSize: '0.9rem',
                            margin: 0,
                            fontFamily: 'monospace',
                        }}>
                            {JSON.stringify(parsedData, null, 2)}
                        </pre>
                    </Paper>
                </Stack>
            </Card>
        </Container>
    );
}