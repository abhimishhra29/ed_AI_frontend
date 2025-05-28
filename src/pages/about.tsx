import React from 'react';
import { 
  Box, 
  Card, 
  Container, 
  Grid, 
  Typography, 
  useTheme,
  Avatar,
  Divider
} from '@mui/material';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { 
  Lightbulb as LightbulbIcon, 
  Psychology as PsychologyIcon, 
  School as SchoolIcon 
} from '@mui/icons-material';

export default function About() {
  const theme = useTheme();

  return (
    <Layout>
      <Head>
        <title>About Us | Ingeno</title>
        <meta name="description" content="Learn about Ingeno's mission to create a smarter educational ecosystem powered by Generative AI" />
      </Head>

      <Container maxWidth="lg">
        <Typography variant="h1" component="h1" gutterBottom>
          About Us
        </Typography>

        <Card sx={{ p: 4, mb: 6 }}>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
            Our mission is to create a smarter educational ecosystem powered by Generative AI. At Ingeno, we are a team of researchers and engineers building tools that make learning scalable, accessible, and accurate.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
            We believe that AI can transform education by automating routine tasks, providing personalized feedback, and helping educators focus on what matters most: inspiring and guiding students. Our tools are designed to enhance human capabilities, not replace them.
          </Typography>
        </Card>

        <Typography variant="h2" gutterBottom>
          Our Vision
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
            >
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main, 
                width: 70, 
                height: 70, 
                mb: 2 
              }}>
                <LightbulbIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
                Innovation
              </Typography>
              <Typography variant="body1" align="center">
                We're at the forefront of applying generative AI to educational challenges, constantly exploring new ways to enhance learning and teaching.
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
            >
              <Avatar sx={{ 
                bgcolor: theme.palette.secondary.main, 
                width: 70, 
                height: 70, 
                mb: 2 
              }}>
                <PsychologyIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
                Intelligence
              </Typography>
              <Typography variant="body1" align="center">
                Our AI systems are designed to understand educational content deeply, providing insights and feedback that are contextually relevant and pedagogically sound.
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
            >
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.dark, 
                width: 70, 
                height: 70, 
                mb: 2 
              }}>
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
                Accessibility
              </Typography>
              <Typography variant="body1" align="center">
                We're committed to making advanced educational tools accessible to all institutions, regardless of size or resources, democratizing access to AI-powered education.
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h2" gutterBottom>
          Our Team
        </Typography>

        <Card sx={{ p: 4, mb: 6 }}>
          <Typography variant="body1" paragraph>
            Ingeno was founded by a team of educators, AI researchers, and software engineers who saw the potential of generative AI to transform education. Our diverse team brings together expertise from leading universities and technology companies, united by a passion for improving educational outcomes.
          </Typography>
          
          <Typography variant="body1" paragraph>
            We work closely with educational institutions to ensure our tools meet real-world needs and integrate seamlessly into existing workflows. Our advisory board includes experienced educators, administrators, and learning scientists who guide our product development.
          </Typography>
        </Card>

        <Typography variant="h2" gutterBottom>
          Our Approach
        </Typography>

        <Card sx={{ p: 4, mb: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Research-Backed
              </Typography>
              <Typography variant="body1" paragraph>
                Our tools are built on the latest research in AI, education, and learning science. We continuously refine our algorithms based on new findings and user feedback.
              </Typography>
              
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 3 }}>
                Privacy-Focused
              </Typography>
              <Typography variant="body1" paragraph>
                We prioritize data privacy and security, ensuring that all student and institutional data is protected according to the highest standards.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Human-Centered
              </Typography>
              <Typography variant="body1" paragraph>
                We design our tools to enhance human capabilities, not replace them. Our goal is to free educators from routine tasks so they can focus on meaningful interactions with students.
              </Typography>
              
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 3 }}>
                Continuously Improving
              </Typography>
              <Typography variant="body1" paragraph>
                Our AI systems learn and improve over time, adapting to the specific needs and contexts of different educational environments.
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Layout>
  );
}