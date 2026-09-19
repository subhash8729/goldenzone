const db = require('../config/db');

// Format relative date
function getRelativeTimeString(date) {
  const now = new Date();
  const diffSec = Math.floor((now - new Date(date)) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffDays = Math.floor(diffSec / 86400);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
}

// 1. Admin: Get customers list with stats
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const countParams = [];

    let whereSql = '';
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      whereSql = `WHERE c.full_name LIKE ? OR c.mobile_number LIKE ? OR c.city LIKE ? OR c.state LIKE ?`;
      params.push(term, term, term, term);
      countParams.push(term, term, term, term);
    }

    const countRows = await db.query(`SELECT COUNT(*) as total FROM customers c ${whereSql}`, countParams);
    const totalItems = countRows[0].total;

    const customers = await db.query(
      `SELECT c.*,
              COUNT(o.id) as total_orders,
              COALESCE(SUM(CASE WHEN o.deleted_at IS NULL THEN o.total_amount ELSE 0 END), 0) as total_spent,
              MAX(o.created_at) as last_order_date
       FROM customers c
       LEFT JOIN orders o ON o.user_id = c.id
       ${whereSql}
       GROUP BY c.id
       ORDER BY c.id DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    const formatted = customers.map((c) => ({
      ...c,
      total_orders: parseInt(c.total_orders, 10),
      total_spent: parseFloat(c.total_spent),
      relative_registered: getRelativeTimeString(c.created_at)
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalItems,
        totalPages: Math.ceil(totalItems / parseInt(limit, 10))
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Admin: Get single customer detail and their complete order history
exports.getCustomerDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customers = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (customers.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const customer = customers[0];

    const orders = await db.query(
      `SELECT o.*,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.id DESC`,
      [id]
    );

    return res.status(200).json({
      success: true,
      customer: {
        ...customer,
        relative_registered: getRelativeTimeString(customer.created_at)
      },
      orders: orders.map((o) => ({
        ...o,
        subtotal: parseFloat(o.subtotal),
        total_amount: parseFloat(o.total_amount)
      }))
    });
  } catch (error) {
    next(error);
  }
};
