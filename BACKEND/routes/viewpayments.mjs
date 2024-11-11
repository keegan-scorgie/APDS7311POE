import express from 'express';
import db from '../db/conn.mjs';  
import { authenticateJWT } from '../middleware/authenticateJWT.mjs';
import { ObjectId } from 'mongodb';  

const router = express.Router();

router.get('/viewpayment', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;  
    const isAdmin = req.user.role === 'admin';  

    console.log('User ID from JWT:', userId);  
    console.log('Is Admin:', isAdmin);  

    const collection = await db.collection('payments');
    let results;

    if (isAdmin) {
      // only the admins can see all payments
      results = await collection.find({}).toArray();
    } else {
     return res.sendStatus(403);
    }

    console.log('Payments:', results);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Error fetching payments', error: err.message });
  }
});

router.put('/confirmPayment/:paymentId', authenticateJWT, async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { paymentStatus } = req.body;
      
      if (!paymentStatus) {
        return res.status(400).json({ message: 'Payment status is required' });
      }
  
      const paymentCollection = db.collection('payments');
      const result = await paymentCollection.updateOne(
        { _id: new ObjectId(paymentId) },
        { $set: { paymentStatus } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Payment not found or status is already up to date' });
      }
  
      res.status(200).json({ message: 'Payment status updated successfully' });
    } catch (err) {
      console.error('Error updating payment status:', err);
      res.status(500).json({ message: 'Error updating payment status', error: err.message });
    }
  });
export default router;
