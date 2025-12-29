import {v2 as cloudinary} from "cloudinary"
import Product from "../models/Product.js"
import fs from 'fs/promises'

//Add product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: 'Please upload at least one image' });
        }

        let productData = JSON.parse(req.body.productData);
        
        // Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            req.files.map(async (file) => {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'image'
                    });
                    // Delete the temporary file after upload
                    await fs.unlink(file.path);
                    return result.secure_url;
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    // Delete the temporary file if upload fails
                    await fs.unlink(file.path);
                    throw error;
                }
            })
        );

        // Create product with image URLs
        const product = await Product.create({
            ...productData,
            image: imagesUrl
        });

        res.json({ success: true, message: 'Product Added', product });
    } catch (error) {
        console.error('Error in addProduct:', error);
        res.json({ success: false, message: error.message });
    }
};

//get product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error in productList:', error);
        res.json({ success: false, message: error.message });
    }
};

//get single product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error in productById:', error);
        res.json({ success: false, message: error.message });
    }
};

//change product instock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(
            id,
            { inStock },
            { new: true }
        );
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: "Stock Updated", product });
    } catch (error) {
        console.error('Error in changeStock:', error);
        res.json({ success: false, message: error.message });
    }
};

//update product : /api/product/update
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let productData = JSON.parse(req.body.productData);
        let imagesUrl = productData.image; // Keep existing images by default

        // If new images are uploaded, process them
        if (req.files && req.files.length > 0) {
            imagesUrl = await Promise.all(
                req.files.map(async (file) => {
                    try {
                        const result = await cloudinary.uploader.upload(file.path, {
                            resource_type: 'image'
                        });
                        await fs.unlink(file.path);
                        return result.secure_url;
                    } catch (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        await fs.unlink(file.path);
                        throw error;
                    }
                })
            );
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                ...productData,
                image: imagesUrl
            },
            { new: true }
        );

        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product Updated', product });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        res.json({ success: false, message: error.message });
    }
};

//delete product : /api/product/delete
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product Deleted' });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.json({ success: false, message: error.message });
    }
};