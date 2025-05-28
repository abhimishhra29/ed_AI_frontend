import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  Paper,
  Divider,
  Container,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Speed as AutoGradeIcon,
  Psychology as PlannerIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface GradingFormProps {
  onSubmitSuccess: (result: any) => void;
}

export default function GradingForm({ onSubmitSuccess }: GradingFormProps) {
  const [formData, setFormData] = useState({
    graderName: '',
    workflow: 'internal_review',
  });

  const [files, setFiles] = useState<{
    assignmentFile: File | null;
    solutionFile: File | null;
    sampleFile: File | null;
    rubricsFile: File | null;
  }>({
    assignmentFile: null,
    solutionFile: null,
    sampleFile: null,
    rubricsFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear files when switching workflows
    if (e.target.name === 'workflow') {
      setFiles({
        assignmentFile: files.assignmentFile,
        solutionFile: null,
        sampleFile: null,
        rubricsFile: null,
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({
        ...files,
        [e.target.name]: e.target.files[0],
      });
    }
  };

  const handleFileRemove = (fileName: keyof typeof files) => {
    setFiles({
      ...files,
      [fileName]: null,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const submitData = new FormData();
    submitData.append('graderName', formData.graderName);
    submitData.append('workflow', formData.workflow);

    if (files.assignmentFile) {
      submitData.append('assignmentFile', files.assignmentFile);
    }

    if (formData.workflow === 'internal_review') {
      if (files.solutionFile) submitData.append('solutionFile', files.solutionFile);
      if (files.sampleFile) submitData.append('sampleFile', files.sampleFile);
      if (files.rubricsFile) submitData.append('rubricsFile', files.rubricsFile);
    }

    try {
      const response = await fetch('http://10.10.60.40:8080/api/grade/', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      setUploadProgress(100);
      setTimeout(() => {
        onSubmitSuccess(result);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setLoading(false);
        if (uploadProgress === 100) {
          setUploadProgress(0);
        }
      }, 500);
    }
  };

  const isAutoGrade = formData.workflow === 'internal_review';
  const nameLabel = isAutoGrade ? 'Grader Name' : 'Assignment Name';
  const namePlaceholder = isAutoGrade ? 'Enter your name' : 'e.g. BN104 - Operating Systems Assignment';

  const FileUploadButton = ({
                              name,
                              file,
                              label,
                              required = false,
                              description
                            }: {
    name: keyof typeof files;
    file: File | null;
    label: string;
    required?: boolean;
    description?: string;
  }) => (
      <Paper
          elevation={0}
          sx={{
              p: 3,
              border: `2px dashed ${file ? 'var(--success-300)' : 'var(--border-medium)'}`,
              borderRadius: 3,
              backgroundColor: file ? 'var(--background-tertiary)' : 'var(--surface)',
              transition: 'all 0.3s ease',
              position: 'relative',
              '&:hover': {
                  borderColor: file ? 'var(--success-400)' : 'var(--primary-400)',
                  backgroundColor: file ? 'var(--background-secondary)' : 'var(--surface-hover)',
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-md)',
              },
          }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: file ? 'var(--success-100)' : 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
            >
              {file ? (
                  <CheckIcon sx={{ color: 'var(--success-600)', fontSize: 24 }} />
              ) : (
                  <UploadIcon sx={{ color: 'var(--primary-600)', fontSize: 24 }} />
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} color="var(--text-primary)">
                {label}
                {required && (
                    <Chip
                        label="Required"
                        size="small"
                        color="error"
                        sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                    />
                )}
              </Typography>
              {description && (
                  <Typography variant="body2" color="var(--text-secondary)" sx={{ mt: 0.5 }}>
                    {description}
                  </Typography>
              )}
            </Box>
            {file && (
                <Tooltip title="Remove file">
                  <IconButton
                      size="small"
                      onClick={() => handleFileRemove(name)}
                      sx={{
                        color: 'var(--error-500)',
                        '&:hover': { backgroundColor: 'var(--error-50)' },
                      }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
            )}
          </Stack>

          {file ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <FileIcon sx={{ color: 'var(--success-600)', fontSize: 20 }} />
                <Typography variant="body2" color="var(--text-primary)" fontWeight={500}>
                  {file.name}
                </Typography>
                <Chip
                    label={`${(file.size / 1024 / 1024).toFixed(1)} MB`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                />
              </Stack>
          ) : (
              <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{
                      py: 1.5,
                      borderStyle: 'solid',
                      backgroundColor: 'transparent',
                      '&:hover': {
                          backgroundColor: 'var(--surface-hover)',
                          borderColor: 'var(--primary-500)',
                      },
                  }}
              >
                Choose PDF File
                <input
                    type="file"
                    name={name}
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf"
                    required={required}
                />
              </Button>
          )}
        </Stack>
      </Paper>
  );

  return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
            elevation={0}
            className="fade-in"
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
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
                background: 'linear-gradient(90deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
              },
              '&:hover': {
                boxShadow: 'var(--shadow-xl)',
                transform: 'translateY(-4px)',
              },
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
          {/* Header Section */}
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
              >
                <SchoolIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{
                      background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.02em',
                    }}
                >
                  Assignment Tools
                </Typography>
                <Typography variant="body1" color="var(--text-secondary)" sx={{ mt: 0.5 }}>
                  Advanced AI-powered grading and assignment planning for universities
                </Typography>
              </Box>
            </Stack>

            {/* Info Alert */}
              <Alert
                  severity="info"
                  icon={<InfoIcon />}
                  sx={{
                      backgroundColor: 'var(--surface-elevated)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      '& .MuiAlert-icon': { color: 'var(--primary-600)' },
                  }}
              >
              <AlertTitle sx={{ fontWeight: 600 }}>Getting Started</AlertTitle>
              Choose your workflow below and upload the required files. Our AI will process your assignment and provide detailed feedback.
            </Alert>
          </Stack>

          {error && (
              <Alert severity="error" sx={{ mb: 4 }} className="slide-up">
                <AlertTitle>Processing Error</AlertTitle>
                {error}
              </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={4}>
              {/* Left Column - Basic Information */}
              <Grid item xs={12} lg={6}>
                <Stack spacing={4}>
                  <Paper elevation={0} sx={{ p: 3, backgroundColor: 'var(--background-tertiary)', borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ mr: 1, color: 'var(--primary-600)' }} />
                      Basic Information
                    </Typography>

                    <Stack spacing={3}>
                      <FormControl fullWidth>
                        <FormLabel
                            htmlFor="graderName"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem'
                            }}
                        >
                          {nameLabel}
                        </FormLabel>
                        <TextField
                            id="graderName"
                            name="graderName"
                            value={formData.graderName}
                            onChange={handleTextChange}
                            placeholder={namePlaceholder}
                            required
                            fullWidth
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'var(--surface)',
                                '&:hover': {
                                  backgroundColor: 'var(--surface-hover)',
                                },
                              },
                            }}
                        />
                      </FormControl>

                      <FormControl fullWidth>
                        <FormLabel
                            htmlFor="workflow"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem'
                            }}
                        >
                          What would you like to do?
                        </FormLabel>
                          <Select
                              id="workflow"
                              name="workflow"
                              value={formData.workflow}
                              onChange={handleSelectChange}
                              required
                              MenuProps={{
                                  PaperProps: {
                                      sx: {
                                          minWidth: 340, // Adjust as needed
                                      },
                                  },
                              }}
                              sx={{
                                  borderRadius: 2,
                                  backgroundColor: 'var(--surface)',
                                  minWidth: 340, // Match dropdown width
                                  '&:hover': {
                                      backgroundColor: 'var(--surface-hover)',
                                  },
                              }}
                          >
                              <MenuItem value="internal_review" sx={{ whiteSpace: 'normal', alignItems: 'flex-start' }}>
                                  <Stack direction="row" spacing={2} alignItems="flex-start">
                                      <AutoGradeIcon sx={{ color: 'var(--primary-600)' }} />
                                      <Box>
                                          <Typography fontWeight={500}>AutoGrade</Typography>
                                          <Typography
                                              variant="body2"
                                              color="var(--text-secondary)"
                                              sx={{ whiteSpace: 'normal' }}
                                          >
                                              AI-powered assignment grading with detailed feedback
                                          </Typography>
                                      </Box>
                                  </Stack>
                              </MenuItem>
                              <MenuItem value="project_planner" sx={{ whiteSpace: 'normal', alignItems: 'flex-start' }}>
                                  <Stack direction="row" spacing={2} alignItems="flex-start">
                                      <PlannerIcon sx={{ color: 'var(--secondary-600)' }} />
                                      <Box>
                                          <Typography fontWeight={500}>Plan My Assignment</Typography>
                                          <Typography variant="body2" color="var(--text-secondary)" sx={{ whiteSpace: 'normal' }}>
                                              Generate comprehensive assignment planning and structure
                                          </Typography>
                                      </Box>
                                  </Stack>
                              </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>

              {/* Right Column - File Uploads */}
              <Grid item xs={12} lg={6}>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                    <UploadIcon sx={{ mr: 1, color: 'var(--primary-600)' }} />
                    File Uploads
                  </Typography>

                  <FileUploadButton
                      name="assignmentFile"
                      file={files.assignmentFile}
                      label="Assignment File"
                      required
                      description="Upload the main assignment document (PDF format)"
                  />

                  {isAutoGrade && (
                      <>
                        <Divider sx={{ my: 2 }}>
                          <Chip
                              label="AutoGrade Files"
                              sx={{
                                backgroundColor: 'var(--primary-100)',
                                color: 'var(--primary-700)',
                                fontWeight: 600
                              }}
                          />
                        </Divider>

                        <FileUploadButton
                            name="solutionFile"
                            file={files.solutionFile}
                            label="Student's Solution"
                            description="Upload the student's submission for grading"
                        />

                        <FileUploadButton
                            name="sampleFile"
                            file={files.sampleFile}
                            label="Sample Solution"
                            description="Reference solution for comparison (optional)"
                        />

                        <FileUploadButton
                            name="rubricsFile"
                            file={files.rubricsFile}
                            label="Marking Rubric"
                            description="Detailed marking criteria and guidelines"
                        />
                      </>
                  )}
                </Stack>
              </Grid>
            </Grid>

            {/* Progress Bar */}
            {loading && (
                <Box sx={{ mt: 4 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="var(--text-secondary)">
                        Processing your request...
                      </Typography>
                      <Typography variant="body2" color="var(--text-secondary)">
                        {uploadProgress}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'var(--primary-100)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'var(--primary-600)',
                            borderRadius: 4,
                          },
                        }}
                    />
                  </Stack>
                </Box>
            )}

            {/* Submit Button */}
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
              <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={
                    loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : isAutoGrade ? (
                        <AutoGradeIcon />
                    ) : (
                        <PlannerIcon />
                    )
                  }
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    background: isAutoGrade
                        ? 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)'
                        : 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%)',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'var(--shadow-xl)',
                      background: isAutoGrade
                          ? 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)'
                          : 'linear-gradient(135deg, var(--secondary-600) 0%, var(--secondary-700) 100%)',
                    },
                    '&:disabled': {
                      background: 'var(--neutral-300)',
                      color: 'var(--neutral-500)',
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
              >
                {loading
                    ? 'Processing...'
                    : isAutoGrade
                        ? 'Start AutoGrade'
                        : 'Generate Assignment Plan'
                }
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
  );
}