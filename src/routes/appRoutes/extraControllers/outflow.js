const Expense = require('@/models/appModels/Expense');

const calculate = async (req, res) => {
  const expensesResult = await Expense.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$total' },
      },
    },
  ]);

  let totalOutflowAmount = 0;

  if (expensesResult[0] && expensesResult[0]?.total) {
    totalOutflowAmount += expensesResult[0].total;
  }

  return res.status(200).json({
    success: true,
    result: totalOutflowAmount,
    message: 'Successfully found all documents',
  });
};

const filterExpensesByDate = async (req, res) => {
  try {
    const { from, to } = req.body; // Using req.body

    // Convert to Date objects
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Fetch expenses in the date range
    const expenses = await Expense.find({
      date: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while filtering expenses.',
      error: error.message,
    });
  }
};

module.exports = {
  calculate,
  filterExpensesByDate, // Corrected function name here
};
