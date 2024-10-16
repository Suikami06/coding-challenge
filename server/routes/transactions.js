const express = require("express");
const router = express.Router();

const {
    seedDatabase,
    getTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData,
} = require('../controllers/allTransactionController');

router.get('/seed', seedDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics/:month',getStatistics);
router.get('/barChart/:month', getBarChart);
router.get('/pieChart/:month', getPieChart);
router.get('/combinedData/:month', getCombinedData);   

module.exports = router;


