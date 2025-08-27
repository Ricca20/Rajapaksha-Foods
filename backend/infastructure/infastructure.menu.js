import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
    menuItems: [
        {
            type: String,
            required: true
        }
    ],
    priceFull: {
        type: Number,
        required: true
    },
    priceHalf: {
        type: Number,
        required: true
    },
    addOns: {
        isChicken: {
            type: Boolean,
            default: false
        },
        isEgg: {
            type: Boolean,
            default: false
        },
        isFish: {
            type: Boolean,
            default: false
        },
        isSausage: {
            type: Boolean,
            default: false
        }
    }
}, {timestamps: true});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;