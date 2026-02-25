import mongoose from "mongoose"



const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description : {type: Array, required: true },
    price: {type: Number, required: true},
    offerPrice: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    inStock: {type: Boolean, default: true },
    countInStock: {type: Number, default: 100},

    // Advanced product info
    weight: {type: String, default: ''},           // e.g. "500g", "1kg", "250ml"
    unit: {type: String, default: 'piece'},         // kg, g, L, ml, piece, packet, bottle, dozen
    brand: {type: String, default: ''},
    sku: {type: String, default: ''},
    tags: {type: [String], default: []},            // e.g. ["organic", "fresh", "local"]
    origin: {type: String, default: ''},            // e.g. "Nepal", "India", "Local Farm"
    shelfLife: {type: String, default: ''},          // e.g. "7 days", "6 months"
    isOrganic: {type: Boolean, default: false},
    isFeatured: {type: Boolean, default: false},
    nutritionalInfo: {
        calories: {type: String, default: ''},
        protein: {type: String, default: ''},
        carbs: {type: String, default: ''},
        fat: {type: String, default: ''},
        fiber: {type: String, default: ''},
    },
    minimumOrderQty: {type: Number, default: 1},
    maxOrderQty: {type: Number, default: 50},

},{timestamps: true})

const Product = mongoose.models.product || mongoose.model('product', productSchema )

export default Product