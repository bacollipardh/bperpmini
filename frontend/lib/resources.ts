export type ResourceField =
  | { name: string; label: string; type: 'text' | 'email' | 'textarea' | 'number' | 'checkbox' | 'date' }
  | {
      name: string;
      label: string;
      type: 'select';
      optionsEndpoint: string;
      valueKey?: string;
      labelKey?: string;
      labelTemplate?: string;
    };

export type ResourceConfig = {
  title: string;
  description: string;
  endpoint: string;
  fields: ResourceField[];
  listColumns: { key: string; title: string; path?: string; renderType?: 'boolean' | 'status' }[];
};

export const resources: Record<string, ResourceConfig> = {
  roles: {
    title: 'Roles',
    description: 'Manage roles.',
    endpoint: 'roles',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  users: {
    title: 'Users',
    description: 'Manage users and role assignment.',
    endpoint: 'users',
    fields: [
      { name: 'roleId', label: 'Role', type: 'select', optionsEndpoint: 'roles', labelKey: 'name' },
      { name: 'fullName', label: 'Full Name', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password (leave blank to keep)', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'fullName', title: 'Name' },
      { key: 'email', title: 'Email' },
      { key: 'role.name', title: 'Role' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  'item-categories': {
    title: 'Item Categories',
    description: 'Manage item categories.',
    endpoint: 'item-categories',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'parentId', label: 'Parent Category', type: 'select', optionsEndpoint: 'item-categories', labelKey: 'name' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'parent.name', title: 'Parent' },
    ],
  },
  units: {
    title: 'Units',
    description: 'Manage units of measure.',
    endpoint: 'units',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
    ],
  },
  'tax-rates': {
    title: 'Tax Rates',
    description: 'Manage tax rates for Kosovo VAT logic.',
    endpoint: 'tax-rates',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'ratePercent', label: 'Rate %', type: 'number' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'ratePercent', title: 'Rate %' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  warehouses: {
    title: 'Warehouses',
    description: 'Manage storage locations.',
    endpoint: 'warehouses',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'address', title: 'Address' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  'payment-methods': {
    title: 'Payment Methods',
    description: 'Manage cash/bank/credit methods.',
    endpoint: 'payment-methods',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  'document-series': {
    title: 'Document Series',
    description: 'Manage purchase/sales/return numbering.',
    endpoint: 'document-series',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'documentType', label: 'Document Type', type: 'text' },
      { name: 'prefix', label: 'Prefix', type: 'text' },
      { name: 'nextNumber', label: 'Next Number', type: 'number' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'documentType', title: 'Type' },
      { key: 'prefix', title: 'Prefix' },
      { key: 'nextNumber', title: 'Next' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  items: {
    title: 'Items',
    description: 'Manage articles with category, unit and tax.',
    endpoint: 'items',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'barcode', label: 'Barcode', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'categoryId', label: 'Category', type: 'select', optionsEndpoint: 'item-categories', labelKey: 'name' },
      { name: 'unitId', label: 'Unit', type: 'select', optionsEndpoint: 'units', labelKey: 'name' },
      { name: 'taxRateId', label: 'Tax Rate', type: 'select', optionsEndpoint: 'tax-rates', labelTemplate: 'name' },
      { name: 'standardPurchasePrice', label: 'Purchase Price', type: 'number' },
      { name: 'standardSalesPrice', label: 'Sales Price', type: 'number' },
      { name: 'minSalesPrice', label: 'Min Sales Price', type: 'number' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'category.name', title: 'Category' },
      { key: 'unit.name', title: 'Unit' },
      { key: 'taxRate.name', title: 'Tax' },
      { key: 'standardSalesPrice', title: 'Sales Price' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  suppliers: {
    title: 'Suppliers',
    description: 'Manage suppliers and purchase context.',
    endpoint: 'suppliers',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'fiscalNo', label: 'Fiscal No', type: 'text' },
      { name: 'vatNo', label: 'VAT No', type: 'text' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'paymentTermsDays', label: 'Payment Terms (Days)', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'fiscalNo', title: 'Fiscal No' },
      { key: 'city', title: 'City' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
  customers: {
    title: 'Customers',
    description: 'Manage customers, credit and discounts.',
    endpoint: 'customers',
    fields: [
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'fiscalNo', label: 'Fiscal No', type: 'text' },
      { name: 'vatNo', label: 'VAT No', type: 'text' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'creditLimit', label: 'Credit Limit', type: 'number' },
      { name: 'defaultDiscountPercent', label: 'Default Discount %', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'isActive', label: 'Active', type: 'checkbox' },
    ],
    listColumns: [
      { key: 'code', title: 'Code' },
      { key: 'name', title: 'Name' },
      { key: 'city', title: 'City' },
      { key: 'creditLimit', title: 'Credit Limit' },
      { key: 'defaultDiscountPercent', title: 'Default Discount %' },
      { key: 'isActive', title: 'Active', renderType: 'boolean' },
    ],
  },
};

export function getValueByPath(row: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), row);
}
