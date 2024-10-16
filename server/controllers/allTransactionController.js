const axios = require('axios');
const Product = require('../models/Product');

// Seed database with data from third-party API
exports.seedDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    
    // Basic validation (you can enhance this as needed)
    const products = response.data.map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      dateOfSale: product.dateOfSale,
      sold: product.sold,
      imageUrl: product.image,
    })); 

    //console.log('Product model:', Product);


    await Product.insertMany(products);
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Error seeding the database' });
  }
};

exports.getTransactions = async (req, res) => {
    try {
      const { page = 1, perPage = 10, search = '' } = req.query;
      const skip = (page - 1) * parseInt(perPage);
  
      const searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
          // Removed price from search query, as it should be a number
        ]
      };
  
      // Count total records matching the search query
      let totalRecords;
      try {
        totalRecords = await Product.countDocuments(searchQuery);
      } catch (error) {
        console.error('Error counting documents:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Error counting documents' });
      }
  
      // Fetch transactions from the database
      let transactions;
      try {
        transactions = await Product.find(searchQuery)
          .skip(skip)
          .limit(parseInt(perPage));
      } catch (error) {
        console.error('Error fetching transactions:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Error fetching transactions' });
      }
  
      const totalPages = Math.ceil(totalRecords / perPage);
      res.json({ page: parseInt(page), perPage: parseInt(perPage), totalRecords, totalPages, transactions });
    } catch (error) {
      console.error('General error fetching transactions:', error); // Log the error for debugging
      res.status(500).json({ error: 'Error fetching transactions' });
    }
};

exports.getStatistics = async (req, res) => {
    try {
      const { month } = req.params;
      
      // Extract month (1-12) from the dateOfSale without restricting the year
      const totalSaleAmount = await Product.aggregate([
        { 
          $match: { 
            sold: true, 
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);
  
      // Count total sold and not sold items for the specified month in any year
      const totalSoldItems = await Product.countDocuments({
        sold: true,
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
      });
  
      const totalNotSoldItems = await Product.countDocuments({
        sold: false,
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
      });
  
      res.json({
        totalSaleAmount: totalSaleAmount[0]?.total || 0,
        totalSoldItems,
        totalNotSoldItems
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching statistics' });
    }
};

exports.getBarChart = async (req, res) => {
    try {
      const { month } = req.params; // expecting '01', '02', etc.
      const numericMonth = parseInt(month, 10); // convert month to a number (1-12)
  
      const priceRanges = await Product.aggregate([
        {
          $addFields: {
            saleMonth: { $month: "$dateOfSale" } // extract month from the dateOfSale field
          }
        },
        {
          $match: { saleMonth: numericMonth } // match the extracted month to the provided month
        },
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
            default: '901+',
            output: { count: { $sum: 1 } }
          }
        }
      ]);
  
      res.json(priceRanges);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bar chart data' });
    }
  };

  exports.getPieChart = async (req, res) => {
    try {
      const { month } = req.params;
  
      const categoryData = await Product.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $month: '$dateOfSale' }, parseInt(month)] // Match the month regardless of year
            }
          }
        },
        {
          $group: {
            _id: '$category', // Group by product category
            count: { $sum: 1 } // Count occurrences in each category
          }
        }
      ]);
  
      res.json(categoryData);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching pie chart data' });
    }
  };

  exports.getCombinedData = async (req, res) => {
    try {
      const { month } = req.params;
  
      const [statistics, barChart, pieChart] = await Promise.all([
        // Statistics (Total Sale, Sold Items, Not Sold Items)
        Product.aggregate([
          {
            $match: {
              $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] } // Match by month regardless of year
            }
          },
          {
            $group: {
              _id: null,
              totalSaleAmount: { $sum: '$price' },
              totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
              totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } }
            }
          }
        ]),
  
        // Bar Chart (Price Ranges)
        Product.aggregate([
          {
            $match: {
              $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
            }
          },
          {
            $bucket: {
              groupBy: '$price',
              boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
              output: { count: { $sum: 1 } }
            }
          }
        ]),
  
        // Pie Chart (Category-wise distribution)
        Product.aggregate([
          {
            $match: {
              $expr: { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] }
            }
          },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ])
      ]);
  
      res.json({ statistics, barChart, pieChart });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching combined data' });
    }
  };
  
  
  
  
  