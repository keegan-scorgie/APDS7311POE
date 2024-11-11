import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
    name: { type: String, required: true }, 
    bankReferenceNumber: { type: String, required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;