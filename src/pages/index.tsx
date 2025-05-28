import React from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    Typography,
    useTheme,
    alpha,
    Fade,
    Slide,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper
} from '@mui/material';
import {
    School as SchoolIcon,
    Psychology as PsychologyIcon,
    AutoGraph as AutoGraphIcon,
    CheckCircle as CheckIcon,
    TrendingUp as TrendingUpIcon,
    Speed as SpeedIcon,
    Assessment as AssessmentIcon,
    Groups as GroupsIcon
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
    const theme = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const benefits = [
        { icon: <SpeedIcon />, text: 'Save time on grading and administrative tasks' },
        { icon: <AssessmentIcon />, text: 'Provide consistent, detailed feedback to all students' },
        { icon: <SchoolIcon />, text: 'Focus more on teaching and less on paperwork' },
        { icon: <TrendingUpIcon />, text: 'Access analytics to identify common student challenges' },
    ];

    const studentBenefits = [
        { icon: <CheckIcon />, text: 'Receive detailed, constructive feedback' },
        { icon: <PsychologyIcon />, text: 'Break down complex assignments into manageable tasks' },
        { icon: <TrendingUpIcon />, text: 'Track progress and meet deadlines effectively' },
        { icon: <GroupsIcon />, text: 'Improve academic performance through targeted guidance' },
    ];

    if (!mounted) {
        return null;
    }

    return (
        <Layout>
            <Head>
                <title>Ingeno | Education with Gen AI</title>
                <meta name="description" content="Ingeno - Where cutting-edge AI meets modern education. Intelligent tools for assignment planning, grading, and academic support." />
                <meta name="keywords" content="AI education, automatic grading, assignment planning, academic support, university tools" />
                <meta name="theme-color" content={theme.palette.mode === 'light' ? '#ffffff' : '#0f1419'} />
            </Head>

            <Container maxWidth="lg">
                {/* Hero Section */}
                <Fade in={mounted} timeout={800}>
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Chip
                            label="✨ Powered by Advanced AI"
                            sx={{
                                mb: 3,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                px: 2,
                                py: 0.5,
                                fontSize: '0.875rem',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                        />

                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                mb: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center'
                            }}
                        >
                            Education with Gen AI
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                mb: 4,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                }
                            }}
                        >
                            <Typography
                                variant="body1"
                                paragraph
                                sx={{
                                    fontSize: '1.125rem',
                                    lineHeight: 1.7,
                                    color: theme.palette.text.secondary,
                                    maxWidth: '800px',
                                    mx: 'auto',
                                    mb: 3
                                }}
                            >
                                Welcome to <Typography component="span" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Ingeno</Typography>, where cutting-edge AI meets modern education. We empower learners and educators with intelligent tools for assignment planning, grading, and academic support — all aligned with the future of learning.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    component={Link}
                                    href="/tools"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                    startIcon={<AutoGraphIcon />}
                                >
                                    Explore Assignment Tools
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    component={Link}
                                    href="/register"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        borderRadius: 2,
                                        borderColor: theme.palette.secondary.main,
                                        color: theme.palette.secondary.main,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                                            borderColor: theme.palette.secondary.dark,
                                            color: theme.palette.secondary.dark,
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                >
                                    Register for Access
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Fade>

                {/* Our Services Section */}
                <Slide direction="up" in={mounted} timeout={800}>
                    <Typography variant="h2" sx={{ mb: 4, textAlign: 'center' }}>
                        Our Services
                    </Typography>
                </Slide>

                <Grid container spacing={4} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={4}>
                        <Fade in={mounted} timeout={1000}>
                            <Card
                                className="card"
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 3, // Add padding inside the card
                                    gap: 2, // Add spacing between child elements
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        color: theme.palette.primary.main,
                                    }}
                                >
                                    <AutoGraphIcon sx={{ fontSize: 32, mr: 1.5 }} />
                                    <Typography variant="h5" fontWeight={600}>
                                        Auto Grading
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    paragraph
                                    sx={{
                                        flexGrow: 1,
                                        color: theme.palette.text.secondary,
                                        mb: 2, // Add margin below the text
                                    }}
                                >
                                    Our AI-powered grading system analyzes student submissions against rubrics and sample solutions to provide fair, consistent, and detailed feedback.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component={Link}
                                    href="/tools#auto-grading"
                                    sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                                >
                                    Learn More
                                </Button>
                            </Card>
                        </Fade>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Fade in={mounted} timeout={1200}>
                            <Card
                                className="card"
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 3,
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        color: theme.palette.secondary.main,
                                    }}
                                >
                                    <PsychologyIcon sx={{ fontSize: 32, mr: 1.5 }} />
                                    <Typography variant="h5" fontWeight={600}>
                                        Assignment Planning
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    paragraph
                                    sx={{
                                        flexGrow: 1,
                                        color: theme.palette.text.secondary,
                                        mb: 2,
                                    }}
                                >
                                    Help students break down complex assignments into manageable tasks with our AI planner. Set deadlines, estimate effort, and create a roadmap for success.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    component={Link}
                                    href="/tools#assignment-planning"
                                    sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                                >
                                    Explore Planner
                                </Button>
                            </Card>
                        </Fade>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Fade in={mounted} timeout={1400}>
                            <Card
                                className="card"
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 3,
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        color: theme.palette.primary.dark,
                                    }}
                                >
                                    <SchoolIcon sx={{ fontSize: 32, mr: 1.5 }} />
                                    <Typography variant="h5" fontWeight={600}>
                                        Academic Support
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    paragraph
                                    sx={{
                                        flexGrow: 1,
                                        color: theme.palette.text.secondary,
                                        mb: 2,
                                    }}
                                >
                                    Enhance learning outcomes with personalized feedback and guidance. Our tools help educators provide detailed, constructive comments that help students improve.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component={Link}
                                    href="/features#feedback"
                                    sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                                >
                                    Discover Feedback Tools
                                </Button>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>

                {/* Why Choose Ingeno? Section */}
                <Slide direction="up" in={mounted} timeout={1000}>
                    <Typography variant="h2" sx={{ mb: 4, textAlign: 'center' }}>
                        Why Choose Ingeno?
                    </Typography>
                </Slide>

                <Fade in={mounted} timeout={1200}>
                    <Card className="card" sx={{ p: 4, mb: 8 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom fontWeight={600} color={theme.palette.primary.main}>
                                    For Educators
                                </Typography>
                                <List dense>
                                    {benefits.map((benefit, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                                {benefit.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={benefit.text} primaryTypographyProps={{ color: theme.palette.text.secondary }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom fontWeight={600} color={theme.palette.secondary.main}>
                                    For Students
                                </Typography>
                                <List dense>
                                    {studentBenefits.map((benefit, index) => (
                                        <ListItem key={index} disablePadding>
                                            <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                                                {benefit.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={benefit.text} primaryTypographyProps={{ color: theme.palette.text.secondary }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </Card>
                </Fade>

                {/* Call to Action */}
                <Fade in={mounted} timeout={1400}>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            component={Link}
                            href="/register"
                            sx={{
                                px: 5,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                borderRadius: 3,
                                boxShadow: theme.shadows[3],
                                '&:hover': {
                                    boxShadow: theme.shadows[5],
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            Get Started with Ingeno
                        </Button>
                        <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                            Unlock the future of education. Try Ingeno today!
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        </Layout>
    );
}