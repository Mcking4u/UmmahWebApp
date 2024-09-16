import React from 'react';
import withNavUpdate from '../../wrappers/with_nav_update';
import { useNavigate, useParams } from 'react-router-dom';
import NetworkHandler from '../../../network/network_handler';
import { Card, CardContent, CardMedia, Typography, Container, Box, Grid, IconButton } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';

const ViewIssues = () => {
    const { id } = useParams();
    const [issues, setIssues] = React.useState([]);
    const navigate = useNavigate();

    const fetchIssues = async () => {
        try {
            const response = await new NetworkHandler().getIssues(id);
            setIssues(response);
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
    };

    React.useEffect(() => {
        fetchIssues();
    }, []);

    return (
        <Box>
            {issues.length === 0 ? (
                <Typography variant="h6" component="p" style={{ textAlign: 'center', marginTop: '20px' }}>
                    No issues found
                </Typography>
            ) : (
                <Box>

                    <IconButton
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIos />
                    </IconButton>
                    <Typography variant="h6" component="p" style={{ marginTop: '20px' }}>
                        Issues
                    </Typography>

                    <Grid container>

                        {
                            issues.map(issue => (
                                <Grid item key={issue.id} xs={12} sm={12} md={3} lg={3}>
                                    <Card style={{ margin: '20px 0' }}>
                                        {issue.image && (
                                            <CardMedia
                                                component="img"
                                                image={issue.image}
                                                alt="Issue"
                                                style={{ height: '200px', maxHeight: '200px', objectFit: 'contain' }}
                                            />

                                        )}
                                        <CardContent>
                                            <Typography variant="h6" component="h4">
                                                Reported by: {issue.reported_by.profile.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {issue.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }

                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default withNavUpdate(ViewIssues);
