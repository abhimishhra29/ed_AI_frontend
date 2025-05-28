import React, { useState } from 'react';
import { 
  Alert,
  AlertTitle,
  Box, 
  Button, 
  Card, 
  Checkbox,
  CircularProgress,
  Container, 
  FormControlLabel,
  Grid, 
  TextField, 
  Typography, 
  useTheme
} from '@mui/material';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { 
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

export default function Register() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    role: '',
    updates: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'updates' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        organization: '',
        phone: '',
        role: '',
        updates: true
      });
    }, 1500);
  };

  return (
    <Layout>
      <Head>
        <title>Register for Trial Access | Ingeno</title>
        <meta name="description" content="Register for trial access to Ingeno's AI-powered educational tools" />
      </Head>

      <Container maxWidth="lg">
        <Typography variant="h1" component="h1" gutterBottom>
          Register for Trial Access
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              {success ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h4" gutterBottom>
                    Registration Successful!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Thank you for registering for trial access to Ingeno. We've sent a confirmation email to your inbox with further instructions.
                  </Typography>
                  <Typography variant="body1">
                    Our team will contact you shortly to set up your trial account and provide personalized onboarding.
                  </Typography>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Typography variant="h2" gutterBottom>
                    Your Information
                  </Typography>
                  
                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    Register for a trial access to our assignment tools before official release. Experience the future of education with Ingeno.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="organization"
                        label="Organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="phone"
                        label="Phone Number (optional)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="role"
                        label="Role / Position"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            name="updates" 
                            color="primary" 
                            checked={formData.updates}
                            onChange={handleChange}
                          />
                        }
                        label="I'd like to receive updates about new features and educational resources"
                      />
                    </Grid>
                  </Grid>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 3 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Registration'}
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: 28 }} />
                <Typography variant="h2" gutterBottom={false}>
                  Trial Benefits
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                As a trial user, you'll get exclusive access to:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2, mb: 4 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  Full access to our auto-grading system
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Assignment planning tools for students
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Analytics dashboard for educators
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Priority support from our team
                </Typography>
                <Typography component="li">
                  Early access to new features
                </Typography>
              </Box>
              
              <Alert severity="info" sx={{ mb: 4 }}>
                <AlertTitle>Limited Availability</AlertTitle>
                Trial access is currently limited to educational institutions. We're prioritising universities and colleges for our initial release.
              </Alert>
              
              <Typography variant="h6" gutterBottom>
                What Our Trial Users Say
              </Typography>

              <Box sx={{
                p: 2,
                borderLeft: `4px solid ${theme.palette.secondary.main}`,
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
                borderRadius: 1,
                mb: 2
              }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: theme.palette.text.primary }}>
                  "Ingeno has transformed how we grade assignments in our computer science department. What used to take hours now takes minutes, and the feedback is consistently high quality."
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                  — Dr. Sarah Chen, Associate Professor, University of Technology
                </Typography>
              </Box>

              <Box sx={{
                p: 2,
                borderLeft: `4px solid ${theme.palette.secondary.main}`,
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
                borderRadius: 1,
                mb: 2
              }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: theme.palette.text.primary }}>
                  "The assignment planning tool has been a game-changer for our students. They're better organized, meet deadlines more consistently, and produce higher quality work."
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                  — Prof. Michael Rodriguez, Dean of Students, Westfield College
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}