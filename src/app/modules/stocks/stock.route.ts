/* eslint-disable @typescript-eslint/no-unused-vars */
// modules/stocks/stock.route.ts

import { Router } from 'express';
import { Medicine } from '../medicine/medicine.model'; // Correct import path for your Medicine model

const router = Router();

// GET /api/stocks
router.get('/', async (req, res) => {
  try {
    // Fetch the total stock (sum of all quantities of medicines)
    const totalStockAggregation = await Medicine.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' }, // Sum all the 'quantity' values
        },
      },
    ]);

    // Count how many low-stock items are there (quantity < 10)
    const lowStockItems = await Medicine.countDocuments({
      quantity: { $lt: 10 },
    });

    // Extract total stock from the aggregation result
    const totalStock = totalStockAggregation[0]?.total || 0;

    // Send the stock data as a response
    res.json({
      totalStock,
      lowStockItems,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
