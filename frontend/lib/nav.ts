export const navSections = [
  {
    title: 'Dashboard',
    items: [{ label: 'Overview', href: '/dashboard' }],
  },
  {
    title: 'Master Data',
    items: [
      { label: 'Roles', href: '/roles' },
      { label: 'Users', href: '/users' },
      { label: 'Item Categories', href: '/item-categories' },
      { label: 'Units', href: '/units' },
      { label: 'Tax Rates', href: '/tax-rates' },
      { label: 'Warehouses', href: '/warehouses' },
      { label: 'Payment Methods', href: '/payment-methods' },
      { label: 'Document Series', href: '/document-series' },
      { label: 'Items', href: '/items' },
      { label: 'Suppliers', href: '/suppliers' },
      { label: 'Customers', href: '/customers' }
    ],
  },
  {
    title: 'Documents',
    items: [
      { label: 'Purchase Invoices', href: '/purchase-invoices' },
      { label: 'Sales Invoices', href: '/sales-invoices' },
      { label: 'Sales Returns', href: '/sales-returns' },
    ],
  },
  {
    title: 'Stock',
    items: [
      { label: 'Balances', href: '/stock/balances' },
      { label: 'Movements', href: '/stock/movements' },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Audit Logs', href: '/audit-logs' }],
  },
];
