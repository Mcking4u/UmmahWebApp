import React, { useState, useEffect } from 'react';
import withNavUpdate from "../../wrappers/with_nav_update";
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Slide, CircularProgress } from '@mui/material';
import { Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NetworkHandler from '../../../network/network_handler';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const QnAComponent = () => {
    const [faqs, setFaqs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('');
    const [relatedLinks, setRelatedLinks] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        const data = await new NetworkHandler().getFaqs();
        setFaqs(data);

        // Extract categories from the response
        const categoryList = data.map(faqCategory => faqCategory.category);
        setCategories(categoryList);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const clearFields = () => {
        setQuestion("");
        setAnswer("");
        setRelatedLinks("");
        setCategory("");
    }

    const handleAddFaq = async () => {
        setLoading(true);
        await new NetworkHandler().addFaq({ question, answer, category, related_links: relatedLinks });
        setLoading(false);
        handleClose();
        clearFields();
        fetchFaqs();
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                  Add FAQ
                </Button>
            </div>
            <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                <DialogTitle>Add FAQ</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Question"
                        type="text"
                        fullWidth
                        sx={{mt:1}}
                        size="small"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Answer"
                        type="text"
                        fullWidth
                        size="small"
                        sx={{mt:1}}
                        multiline
                        rows={3}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Related Links"
                        type="text"
                        fullWidth
                        sx={{mt:1}}
                        size="small"
                        value={relatedLinks}
                        onChange={(e) => setRelatedLinks(e.target.value)}
                    />
                     <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option}
                        freeSolo
                        fullWidth
                        sx={{mt:1}}
                        renderInput={(params) => <TextField {...params} label="Select Category" margin="dense" size="small" />}
                        value={category}
                        onChange={(event, newValue) => setCategory(newValue || '')}
                        inputValue={category}
                        onInputChange={(event, newInputValue) => setCategory(newInputValue || '')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddFaq} color="primary" disabled={loading || !question || !answer || !category}>
                        {loading ? <CircularProgress size={24} /> : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
            {faqs.map((faqCategory, index) => (
                faqCategory.qanda.map((faq) => (
                    <Card key={faq.id} style={{ marginBottom: '20px', minHeight: '100px' }}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {faq.question}
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                                {faqCategory.category}
                            </Typography>
                            <Typography variant="body2" component="p" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4 }}>
                                {faq.answer}
                            </Typography>
                            {faq.related_links && (
                                <Typography variant="body2" component="p">
                                    <a href={faq.related_links} target="_blank" rel="noopener noreferrer">Related Link</a>
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                ))
            ))}
        </div>
    );
};

export default withNavUpdate(QnAComponent);
