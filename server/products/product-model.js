import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  currency: {
    type: String,
    enum: ['USD', 'ZWL'],
    default: 'USD'
  }
});

export default mongoose.model('Product', productSchema);
