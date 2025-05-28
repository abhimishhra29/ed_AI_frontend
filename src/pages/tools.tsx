import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Layout from '@/components/Layout';
import GradingForm from '@/components/GradingForm';
import GradingResults from '@/components/GradingResults';
import Head from 'next/head';

export default function Tools() {
    const [result, setResult] = useState<any>(null);

    const handleSubmitSuccess = (data: any) => {
        setResult(data);
        setTimeout(() => {
            const resultsElement = document.getElementById('results');
            if (resultsElement) {
                resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const showDemoResults = () => {
        const mockData = {
            tasks: {
                "Q1": [10, 8, "Good attempt, but missed edge cases."],
                "Q2": [15, 12, "Solid explanation, minor calculation error."],
                "Q3": [5, 5, "Perfect answer!"]
            },
            total_score: "25/30"
        };
        setResult(JSON.stringify(mockData));
    };

    return (
        <Layout>
            <Head>
                <title>Assignment Tools | Ingeno</title>
                <meta name="description" content="AI-powered tools for assignment grading and planning" />
            </Head>

            <Container maxWidth="lg">
                <Button
                    variant="contained"
                    onClick={showDemoResults}
                    sx={{ mb: 2 }}
                >
                    Show Demo Results
                </Button>

                <GradingForm onSubmitSuccess={handleSubmitSuccess} />

                {result && (
                    <Box
                        id="results"
                        sx={{
                            opacity: 0,
                            animation: 'fadeIn 0.5s ease forwards',
                            '@keyframes fadeIn': {
                                from: { opacity: 0 },
                                to: { opacity: 1 },
                            },
                        }}
                    >
                        <GradingResults data={result} />
                    </Box>
                )}
            </Container>
        </Layout>
    );
}