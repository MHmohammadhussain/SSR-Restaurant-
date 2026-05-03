import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    pinCode: { type: String, required: true },
    orderDescription: { type: String, required: true },
    paymentMethod: { type: String, enum: ['credit_card', 'upi', 'cash'], default: 'cash' },
    preferredTime: { type: String, required: true },
    specialInstructions: { type: String },
    amount: { type: Number },
    stripePaymentId: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'on_way', 'delivered', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
