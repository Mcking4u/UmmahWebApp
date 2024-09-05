import React, { useState, useEffect } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, Select, MenuItem, Grid, IconButton, CircularProgress, Box
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import withNavUpdate from '../../wrappers/with_nav_update';
import NetworkHandler from '../../../network/network_handler';
import { Cancel, Check } from '@mui/icons-material';
import { host } from '../../../network/network_handler';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const HalalProducts = () => {
    const [products, setProducts] = useState({ approved: [], pending: [] });
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [fallbackImage, setFallbackImage] = useState('');
    const [nutritionGrade, setNutritionGrade] = useState('');
    const [barcode, setBarcode] = useState('');

    const [halalStatus, setHalalStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const xlsSampleDownloadUrl = host + "/halal/api/download-sample-xlsx";

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const data = await new NetworkHandler().getHalalProducts();
        setProducts(data);
    };

    const validateForm = () => {
        let formErrors = {};
        if (!barcode.trim()) formErrors.barcode = "Barcode is required";
        if (!productName.trim()) formErrors.productName = "Product name is required";
        if (!fallbackImage.trim()) formErrors.fallbackImage = "Image URL is required";
        if (!nutritionGrade) formErrors.nutritionGrade = "Nutrition grade is required";
        if (!halalStatus) formErrors.halalStatus = "Halal status is required";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleOpenDialog = (product = null) => {
        setEditMode(!!product);
        setCurrentProduct(product);
        if (product) {
            setProductName(product.product_name || '');
            setFallbackImage(product.fallback_image || product.product_image || '');
            setNutritionGrade(product.nutrition_grade || 'unknown');
            setHalalStatus(product.halal_status || 'halal');
            setBarcode(product.barcode || '');
        } else {
            setProductName('');
            setFallbackImage('');
            setNutritionGrade('unknown');
            setHalalStatus('halal');
            setBarcode('');
        }
        setErrors({});
        setOpenDialog(true);
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProduct(null);
    };

    const handleSaveProduct = async () => {
        if (!validateForm()) return;

        if (editMode) {
            await new NetworkHandler().editHalalProduct(currentProduct.id, currentProduct.isapproved, productName, halalStatus, fallbackImage, nutritionGrade);
        } else {
            await new NetworkHandler().addHalalProduct(productName, halalStatus, nutritionGrade, fallbackImage, barcode);
        }
        handleCloseDialog();
        fetchProducts();
    };


    const handleApproveReject = async (productId, isApproved) => {
        await new NetworkHandler().markHalalProducts(productId, isApproved);
        fetchProducts();
    };

    const handleDownloadSample = () => {
        window.location.href = xlsSampleDownloadUrl;
    };

    const handleOpenUploadDialog = () => {
        setSelectedFile(null);
        setOpenUploadDialog(true);
    };

    const handleCloseUploadDialog = () => {
        setOpenUploadDialog(false);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUploadFile = async () => {
        if (!selectedFile) return;

        setLoading(true);
        await new NetworkHandler().uploadHalalProducts(selectedFile);
        setLoading(false);
        handleCloseUploadDialog();
        fetchProducts();
    };

    const columns = (isPending) => [
        {
            field: 'image',
            headerName: 'Image',
            width: 100,
            renderCell: (params) => (
                <img src={params.row.fallback_image || params.row.product_image || ''} alt="product" style={{ width: 50, height: 50 }} />
            ),
        },
        { field: 'product_name', headerName: 'Product Name', width: 200 },
        { field: 'barcode', headerName: 'Barcode', width: 150 },
        { field: 'nutrition_grade', headerName: 'Nutrition Grade', width: 150 },
        { field: 'halal_status', headerName: 'Halal Status', width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <IconButton sx={{ marginRight: 2 }} color='primary' onClick={() => handleOpenDialog(params.row)}>
                        <EditIcon />
                    </IconButton>
                    {isPending ? (
                        <IconButton color="primary" onClick={() => handleApproveReject(params.row.id, true)}>
                            <Check />
                        </IconButton>
                    ) : (
                        <IconButton color="secondary" onClick={() => handleApproveReject(params.row.id, false)}>
                            <Cancel />
                        </IconButton>
                    )}
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                    <Button variant="contained"
                        size="small"
                        startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                        Add Product
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenUploadDialog}
                    >
                        Bulk Add
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleDownloadSample}
                    >
                        Download Sample XLS
                    </Button>
                </Grid>
            </Grid>

            <h2>Pending</h2>
            <div style={{ height: 400, marginBottom: 20 }}>
                <DataGrid rows={products.pending} columns={columns(true)} pageSize={5} />
            </div>

            <h2>Approved</h2>
            <div style={{ height: 400 }}>
                <DataGrid rows={products.approved} columns={columns(false)} pageSize={5} />
            </div>

            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Barcode"
                        type="text"
                        disabled={editMode}
                        fullWidth
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        error={!!errors.barcode}
                        helperText={errors.barcode}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Product Name"
                        type="text"
                        fullWidth
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        error={!!errors.productName}
                        helperText={errors.productName}
                    />
                    <TextField
                        margin="dense"
                        label="Image URL"
                        type="text"
                        fullWidth
                        value={fallbackImage}
                        onChange={(e) => setFallbackImage(e.target.value)}
                        error={!!errors.fallbackImage}
                        helperText={errors.fallbackImage}
                    />
                    <Select
                        fullWidth
                        sx={{ mt: 1 }}
                        margin="dense"
                        value={nutritionGrade}
                        onChange={(e) => setNutritionGrade(e.target.value)}
                        error={!!errors.nutritionGrade}
                    >
                        <MenuItem value="unknown">Unknown</MenuItem>
                        <MenuItem value="a">A</MenuItem>
                        <MenuItem value="b">B</MenuItem>
                        <MenuItem value="c">C</MenuItem>
                        <MenuItem value="d">D</MenuItem>
                        <MenuItem value="e">E</MenuItem>
                    </Select>
                    {errors.nutritionGrade && <p style={{ color: 'red', marginTop: '8px' }}>{errors.nutritionGrade}</p>}
                    <Select
                        sx={{ mt: 2 }}
                        fullWidth
                        margin="dense"
                        value={halalStatus}
                        onChange={(e) => setHalalStatus(e.target.value)}
                        error={!!errors.halalStatus}
                    >
                        <MenuItem value="halal">Halal</MenuItem>
                        <MenuItem value="haram">Haram</MenuItem>
                        <MenuItem value="mushbooh">Mushbooh</MenuItem>
                    </Select>
                    {errors.halalStatus && <p style={{ color: 'red', marginTop: '8px' }}>{errors.halalStatus}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveProduct}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openUploadDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseUploadDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Upload Halal Products</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        style={{ marginTop: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUploadDialog}>Cancel</Button>
                    <Button onClick={handleUploadFile} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>

            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress size={60} />
                </Box>
            )}
        </div>
    );
};

export default withNavUpdate(HalalProducts);
