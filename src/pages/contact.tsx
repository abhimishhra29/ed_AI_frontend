import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  Grid, 
  TextField, 
  Typography, 
  useTheme,
  Paper,
  Divider
} from '@mui/material';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';

export default function Contact() {
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    alert('Thank you for your message. We will get back to you soon!');
  };

  return (
    <Layout>
      <Head>
        <title>Contact Us | Ingeno</title>
        <meta name="description" content="Get in touch with the Ingeno team for inquiries about our AI-powered educational tools" />
      </Head>

      <Container maxWidth="lg">
        <Typography variant="h1" component="h1" gutterBottom>
          Contact Us
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h2" gutterBottom>
                Get in Touch
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Have questions about our services or want to schedule a demo? Our team is here to help. Reach out to us using the contact information below or fill out the form.
              </Typography>
              
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Email
                  </Typography>
                  <Typography variant="body1">
                    hello@ingeno.ac.edu
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    +61 415149669
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Address
                  </Typography>
                  <Typography variant="body1">
                    28 Bouverie St
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h2" gutterBottom>
                Send a Message
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="organization"
                      label="Organization"
                      name="organization"
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="subject"
                      label="Subject"
                      name="subject"
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="message"
                      label="Message"
                      name="message"
                      multiline
                      rows={4}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SendIcon />}
                  sx={{ mt: 3 }}
                >
                  Send Message
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50] }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  How does the auto-grading system work?
                </Typography>
                <Typography variant="body1">
                  Our auto-grading system uses advanced AI to analyze student submissions against rubrics and sample solutions. It identifies key concepts, evaluates the quality of responses, and provides detailed feedback based on the marking criteria.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50] }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Is my data secure with Ingeno?
                </Typography>
                <Typography variant="body1">
                  Yes, we take data security very seriously. All data is encrypted in transit and at rest, and we comply with educational data privacy standards. We do not share your data with third parties without explicit permission.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50] }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Can I integrate Ingeno with my existing LMS?
                </Typography>
                <Typography variant="body1">
                  Yes, Ingeno is designed to integrate with popular Learning Management Systems. We offer API access and custom integration solutions for institutions with specific requirements.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50] }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  How accurate is the auto-grading?
                </Typography>
                <Typography variant="body1">
                  Our system achieves high accuracy rates, typically within 5-10% of human graders. The accuracy improves over time as the system learns from more examples and feedback from educators.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/*<Box sx={{ textAlign: 'center', color: theme.palette.text.secondary, mb: 4 }}>*/}
        {/*  <Typography variant="body2">*/}
        {/*    © 2025 Ingeno Academic Tools*/}
        {/*  </Typography>*/}
        {/*</Box>*/}
      </Container>
    </Layout>
  );
}