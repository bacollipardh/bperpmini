CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE document_status AS ENUM (
      'DRAFT',
      'POSTED',
      'CANCELLED',
      'STORNO',
      'PARTIALLY_RETURNED',
      'FULLY_RETURNED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movement_type') THEN
    CREATE TYPE movement_type AS ENUM (
      'PURCHASE_IN',
      'SALE_OUT',
      'SALES_RETURN_IN',
      'ADJUSTMENT_PLUS',
      'ADJUSTMENT_MINUS'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(30) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id),
  full_name varchar(150) NOT NULL,
  email varchar(150) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE TABLE IF NOT EXISTS item_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(30) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  parent_id uuid NULL REFERENCES item_categories(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_item_categories_parent_id ON item_categories(parent_id);

CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tax_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  rate_percent numeric(5,2) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_tax_rates_rate_percent CHECK (rate_percent >= 0)
);

CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  address varchar(255),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(50) NOT NULL UNIQUE,
  barcode varchar(100) UNIQUE,
  name varchar(200) NOT NULL,
  description text,
  category_id uuid NOT NULL REFERENCES item_categories(id),
  unit_id uuid NOT NULL REFERENCES units(id),
  tax_rate_id uuid NOT NULL REFERENCES tax_rates(id),
  standard_purchase_price numeric(18,2) NOT NULL DEFAULT 0,
  standard_sales_price numeric(18,2) NOT NULL DEFAULT 0,
  min_sales_price numeric(18,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_items_standard_purchase_price CHECK (standard_purchase_price >= 0),
  CONSTRAINT chk_items_standard_sales_price CHECK (standard_sales_price >= 0),
  CONSTRAINT chk_items_min_sales_price CHECK (min_sales_price IS NULL OR min_sales_price >= 0)
);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_unit_id ON items(unit_id);
CREATE INDEX IF NOT EXISTS idx_items_tax_rate_id ON items(tax_rate_id);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_is_active ON items(is_active);

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(30) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  fiscal_no varchar(50),
  vat_no varchar(50),
  address varchar(255),
  city varchar(100),
  phone varchar(50),
  email varchar(150),
  payment_terms_days integer,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_suppliers_payment_terms_days CHECK (payment_terms_days IS NULL OR payment_terms_days >= 0)
);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_is_active ON suppliers(is_active);

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(30) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  fiscal_no varchar(50),
  vat_no varchar(50),
  address varchar(255),
  city varchar(100),
  phone varchar(50),
  email varchar(150),
  credit_limit numeric(18,2),
  default_discount_percent numeric(5,2),
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_customers_credit_limit CHECK (credit_limit IS NULL OR credit_limit >= 0),
  CONSTRAINT chk_customers_default_discount_percent CHECK (
    default_discount_percent IS NULL OR (default_discount_percent >= 0 AND default_discount_percent <= 100)
  )
);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_is_active ON customers(is_active);

CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(30) NOT NULL UNIQUE,
  document_type varchar(30) NOT NULL,
  prefix varchar(20) NOT NULL,
  next_number integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_document_series_next_number CHECK (next_number > 0)
);
CREATE INDEX IF NOT EXISTS idx_document_series_type ON document_series(document_type);
CREATE INDEX IF NOT EXISTS idx_document_series_active ON document_series(is_active);

CREATE TABLE IF NOT EXISTS purchase_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES document_series(id),
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id),
  doc_no varchar(50) NOT NULL UNIQUE,
  supplier_invoice_no varchar(100),
  doc_date date NOT NULL,
  status document_status NOT NULL DEFAULT 'DRAFT',
  subtotal numeric(18,2) NOT NULL DEFAULT 0,
  discount_total numeric(18,2) NOT NULL DEFAULT 0,
  tax_total numeric(18,2) NOT NULL DEFAULT 0,
  grand_total numeric(18,2) NOT NULL DEFAULT 0,
  notes text,
  created_by uuid NOT NULL REFERENCES users(id),
  posted_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  posted_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_purchase_invoices_subtotal CHECK (subtotal >= 0),
  CONSTRAINT chk_purchase_invoices_discount_total CHECK (discount_total >= 0),
  CONSTRAINT chk_purchase_invoices_tax_total CHECK (tax_total >= 0),
  CONSTRAINT chk_purchase_invoices_grand_total CHECK (grand_total >= 0)
);
CREATE INDEX IF NOT EXISTS idx_purchase_invoices_series_id ON purchase_invoices(series_id);
CREATE INDEX IF NOT EXISTS idx_purchase_invoices_supplier_id ON purchase_invoices(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_invoices_warehouse_id ON purchase_invoices(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_purchase_invoices_created_by ON purchase_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_purchase_invoices_posted_by ON purchase_invoices(posted_by);
CREATE INDEX IF NOT EXISTS idx_purchase_invoices_doc_date ON purchase_invoices(doc_date);
CREATE INDEX IF NOT EXISTS idx_purchase_invoices_status ON purchase_invoices(status);

CREATE TABLE IF NOT EXISTS purchase_invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_invoice_id uuid NOT NULL REFERENCES purchase_invoices(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES items(id),
  line_no integer NOT NULL,
  description varchar(255),
  qty numeric(18,3) NOT NULL,
  unit_price numeric(18,2) NOT NULL,
  discount_percent numeric(5,2) NOT NULL DEFAULT 0,
  discount_amount numeric(18,2) NOT NULL DEFAULT 0,
  tax_percent numeric(5,2) NOT NULL DEFAULT 0,
  net_amount numeric(18,2) NOT NULL,
  tax_amount numeric(18,2) NOT NULL,
  gross_amount numeric(18,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_purchase_invoice_lines_doc_line UNIQUE (purchase_invoice_id, line_no),
  CONSTRAINT chk_purchase_invoice_lines_qty CHECK (qty > 0),
  CONSTRAINT chk_purchase_invoice_lines_unit_price CHECK (unit_price >= 0),
  CONSTRAINT chk_purchase_invoice_lines_discount_percent CHECK (discount_percent >= 0 AND discount_percent <= 100),
  CONSTRAINT chk_purchase_invoice_lines_discount_amount CHECK (discount_amount >= 0),
  CONSTRAINT chk_purchase_invoice_lines_tax_percent CHECK (tax_percent >= 0 AND tax_percent <= 100),
  CONSTRAINT chk_purchase_invoice_lines_net_amount CHECK (net_amount >= 0),
  CONSTRAINT chk_purchase_invoice_lines_tax_amount CHECK (tax_amount >= 0),
  CONSTRAINT chk_purchase_invoice_lines_gross_amount CHECK (gross_amount >= 0)
);
CREATE INDEX IF NOT EXISTS idx_purchase_invoice_lines_item_id ON purchase_invoice_lines(item_id);
CREATE INDEX IF NOT EXISTS idx_purchase_invoice_lines_purchase_invoice_id ON purchase_invoice_lines(purchase_invoice_id);

CREATE TABLE IF NOT EXISTS sales_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES document_series(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id),
  payment_method_id uuid REFERENCES payment_methods(id),
  doc_no varchar(50) NOT NULL UNIQUE,
  doc_date date NOT NULL,
  status document_status NOT NULL DEFAULT 'DRAFT',
  subtotal numeric(18,2) NOT NULL DEFAULT 0,
  discount_total numeric(18,2) NOT NULL DEFAULT 0,
  tax_total numeric(18,2) NOT NULL DEFAULT 0,
  grand_total numeric(18,2) NOT NULL DEFAULT 0,
  fiscal_reference varchar(150),
  notes text,
  created_by uuid NOT NULL REFERENCES users(id),
  posted_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  posted_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_sales_invoices_subtotal CHECK (subtotal >= 0),
  CONSTRAINT chk_sales_invoices_discount_total CHECK (discount_total >= 0),
  CONSTRAINT chk_sales_invoices_tax_total CHECK (tax_total >= 0),
  CONSTRAINT chk_sales_invoices_grand_total CHECK (grand_total >= 0)
);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_series_id ON sales_invoices(series_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_customer_id ON sales_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_warehouse_id ON sales_invoices(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_payment_method_id ON sales_invoices(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_created_by ON sales_invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_posted_by ON sales_invoices(posted_by);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_doc_date ON sales_invoices(doc_date);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_status ON sales_invoices(status);

CREATE TABLE IF NOT EXISTS sales_invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_invoice_id uuid NOT NULL REFERENCES sales_invoices(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES items(id),
  line_no integer NOT NULL,
  description varchar(255),
  qty numeric(18,3) NOT NULL,
  unit_price numeric(18,2) NOT NULL,
  discount_percent numeric(5,2) NOT NULL DEFAULT 0,
  discount_amount numeric(18,2) NOT NULL DEFAULT 0,
  tax_percent numeric(5,2) NOT NULL DEFAULT 0,
  net_amount numeric(18,2) NOT NULL,
  tax_amount numeric(18,2) NOT NULL,
  gross_amount numeric(18,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_sales_invoice_lines_doc_line UNIQUE (sales_invoice_id, line_no),
  CONSTRAINT chk_sales_invoice_lines_qty CHECK (qty > 0),
  CONSTRAINT chk_sales_invoice_lines_unit_price CHECK (unit_price >= 0),
  CONSTRAINT chk_sales_invoice_lines_discount_percent CHECK (discount_percent >= 0 AND discount_percent <= 100),
  CONSTRAINT chk_sales_invoice_lines_discount_amount CHECK (discount_amount >= 0),
  CONSTRAINT chk_sales_invoice_lines_tax_percent CHECK (tax_percent >= 0 AND tax_percent <= 100),
  CONSTRAINT chk_sales_invoice_lines_net_amount CHECK (net_amount >= 0),
  CONSTRAINT chk_sales_invoice_lines_tax_amount CHECK (tax_amount >= 0),
  CONSTRAINT chk_sales_invoice_lines_gross_amount CHECK (gross_amount >= 0)
);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_lines_item_id ON sales_invoice_lines(item_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_lines_sales_invoice_id ON sales_invoice_lines(sales_invoice_id);

CREATE TABLE IF NOT EXISTS sales_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id uuid NOT NULL REFERENCES document_series(id),
  sales_invoice_id uuid NOT NULL REFERENCES sales_invoices(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  doc_no varchar(50) NOT NULL UNIQUE,
  doc_date date NOT NULL,
  reason varchar(255),
  status document_status NOT NULL DEFAULT 'DRAFT',
  subtotal numeric(18,2) NOT NULL DEFAULT 0,
  tax_total numeric(18,2) NOT NULL DEFAULT 0,
  grand_total numeric(18,2) NOT NULL DEFAULT 0,
  notes text,
  created_by uuid NOT NULL REFERENCES users(id),
  posted_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  posted_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_sales_returns_subtotal CHECK (subtotal >= 0),
  CONSTRAINT chk_sales_returns_tax_total CHECK (tax_total >= 0),
  CONSTRAINT chk_sales_returns_grand_total CHECK (grand_total >= 0)
);
CREATE INDEX IF NOT EXISTS idx_sales_returns_series_id ON sales_returns(series_id);
CREATE INDEX IF NOT EXISTS idx_sales_returns_sales_invoice_id ON sales_returns(sales_invoice_id);
CREATE INDEX IF NOT EXISTS idx_sales_returns_customer_id ON sales_returns(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_returns_created_by ON sales_returns(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_returns_posted_by ON sales_returns(posted_by);
CREATE INDEX IF NOT EXISTS idx_sales_returns_doc_date ON sales_returns(doc_date);
CREATE INDEX IF NOT EXISTS idx_sales_returns_status ON sales_returns(status);

CREATE TABLE IF NOT EXISTS sales_return_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_return_id uuid NOT NULL REFERENCES sales_returns(id) ON DELETE CASCADE,
  sales_invoice_line_id uuid NOT NULL REFERENCES sales_invoice_lines(id),
  item_id uuid NOT NULL REFERENCES items(id),
  line_no integer NOT NULL,
  qty numeric(18,3) NOT NULL,
  unit_price numeric(18,2) NOT NULL,
  tax_percent numeric(5,2) NOT NULL DEFAULT 0,
  net_amount numeric(18,2) NOT NULL,
  tax_amount numeric(18,2) NOT NULL,
  gross_amount numeric(18,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_sales_return_lines_doc_line UNIQUE (sales_return_id, line_no),
  CONSTRAINT chk_sales_return_lines_qty CHECK (qty > 0),
  CONSTRAINT chk_sales_return_lines_unit_price CHECK (unit_price >= 0),
  CONSTRAINT chk_sales_return_lines_tax_percent CHECK (tax_percent >= 0 AND tax_percent <= 100),
  CONSTRAINT chk_sales_return_lines_net_amount CHECK (net_amount >= 0),
  CONSTRAINT chk_sales_return_lines_tax_amount CHECK (tax_amount >= 0),
  CONSTRAINT chk_sales_return_lines_gross_amount CHECK (gross_amount >= 0)
);
CREATE INDEX IF NOT EXISTS idx_sales_return_lines_item_id ON sales_return_lines(item_id);
CREATE INDEX IF NOT EXISTS idx_sales_return_lines_sales_return_id ON sales_return_lines(sales_return_id);
CREATE INDEX IF NOT EXISTS idx_sales_return_lines_sales_invoice_line_id ON sales_return_lines(sales_invoice_line_id);

CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id),
  item_id uuid NOT NULL REFERENCES items(id),
  movement_type movement_type NOT NULL,
  qty_in numeric(18,3) NOT NULL DEFAULT 0,
  qty_out numeric(18,3) NOT NULL DEFAULT 0,
  unit_cost numeric(18,2),
  purchase_invoice_id uuid REFERENCES purchase_invoices(id),
  sales_invoice_id uuid REFERENCES sales_invoices(id),
  sales_return_id uuid REFERENCES sales_returns(id),
  reference_no varchar(50),
  movement_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_stock_movement_direction CHECK (
    (qty_in > 0 AND qty_out = 0) OR
    (qty_out > 0 AND qty_in = 0)
  ),
  CONSTRAINT chk_stock_movement_ref_count CHECK (
    ((purchase_invoice_id IS NOT NULL)::int + (sales_invoice_id IS NOT NULL)::int + (sales_return_id IS NOT NULL)::int) <= 1
  )
);
CREATE INDEX IF NOT EXISTS idx_stock_movements_wh_item ON stock_movements(warehouse_id, item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_at ON stock_movements(movement_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_purchase_invoice_id ON stock_movements(purchase_invoice_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_sales_invoice_id ON stock_movements(sales_invoice_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_sales_return_id ON stock_movements(sales_return_id);

CREATE TABLE IF NOT EXISTS stock_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id),
  item_id uuid NOT NULL REFERENCES items(id),
  qty_on_hand numeric(18,3) NOT NULL DEFAULT 0,
  avg_cost numeric(18,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_stock_balances_wh_item UNIQUE (warehouse_id, item_id)
);
CREATE INDEX IF NOT EXISTS idx_stock_balances_item_id ON stock_balances(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_balances_warehouse_id ON stock_balances(warehouse_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  entity_type varchar(50) NOT NULL,
  entity_id uuid NOT NULL,
  action varchar(50) NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_roles_set_updated_at ON roles;
CREATE TRIGGER trg_roles_set_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_users_set_updated_at ON users;
CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_item_categories_set_updated_at ON item_categories;
CREATE TRIGGER trg_item_categories_set_updated_at
BEFORE UPDATE ON item_categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_units_set_updated_at ON units;
CREATE TRIGGER trg_units_set_updated_at
BEFORE UPDATE ON units
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tax_rates_set_updated_at ON tax_rates;
CREATE TRIGGER trg_tax_rates_set_updated_at
BEFORE UPDATE ON tax_rates
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_warehouses_set_updated_at ON warehouses;
CREATE TRIGGER trg_warehouses_set_updated_at
BEFORE UPDATE ON warehouses
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_items_set_updated_at ON items;
CREATE TRIGGER trg_items_set_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_suppliers_set_updated_at ON suppliers;
CREATE TRIGGER trg_suppliers_set_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_customers_set_updated_at ON customers;
CREATE TRIGGER trg_customers_set_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_payment_methods_set_updated_at ON payment_methods;
CREATE TRIGGER trg_payment_methods_set_updated_at
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_document_series_set_updated_at ON document_series;
CREATE TRIGGER trg_document_series_set_updated_at
BEFORE UPDATE ON document_series
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_purchase_invoices_set_updated_at ON purchase_invoices;
CREATE TRIGGER trg_purchase_invoices_set_updated_at
BEFORE UPDATE ON purchase_invoices
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_purchase_invoice_lines_set_updated_at ON purchase_invoice_lines;
CREATE TRIGGER trg_purchase_invoice_lines_set_updated_at
BEFORE UPDATE ON purchase_invoice_lines
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_sales_invoices_set_updated_at ON sales_invoices;
CREATE TRIGGER trg_sales_invoices_set_updated_at
BEFORE UPDATE ON sales_invoices
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_sales_invoice_lines_set_updated_at ON sales_invoice_lines;
CREATE TRIGGER trg_sales_invoice_lines_set_updated_at
BEFORE UPDATE ON sales_invoice_lines
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_sales_returns_set_updated_at ON sales_returns;
CREATE TRIGGER trg_sales_returns_set_updated_at
BEFORE UPDATE ON sales_returns
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_sales_return_lines_set_updated_at ON sales_return_lines;
CREATE TRIGGER trg_sales_return_lines_set_updated_at
BEFORE UPDATE ON sales_return_lines
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_stock_balances_set_updated_at ON stock_balances;
CREATE TRIGGER trg_stock_balances_set_updated_at
BEFORE UPDATE ON stock_balances
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO roles (code, name)
VALUES
  ('ADMIN', 'Administrator'),
  ('SALES', 'Sales Operator'),
  ('PURCHASE', 'Purchase Operator'),
  ('MANAGER', 'Manager')
ON CONFLICT (code) DO NOTHING;

INSERT INTO tax_rates (code, name, rate_percent)
VALUES
  ('VAT0', 'VAT 0%', 0.00),
  ('VAT8', 'VAT 8%', 8.00),
  ('VAT18', 'VAT 18%', 18.00)
ON CONFLICT (code) DO NOTHING;

INSERT INTO units (code, name)
VALUES
  ('COP', 'Copë'),
  ('KG', 'Kilogram'),
  ('L', 'Litër')
ON CONFLICT (code) DO NOTHING;

INSERT INTO payment_methods (code, name)
VALUES
  ('CASH', 'Cash'),
  ('BANK', 'Bank'),
  ('CREDIT', 'Credit')
ON CONFLICT (code) DO NOTHING;

INSERT INTO warehouses (code, name)
VALUES
  ('MAIN', 'Magazina Kryesore')
ON CONFLICT (code) DO NOTHING;

INSERT INTO document_series (code, document_type, prefix, next_number)
VALUES
  ('FB', 'PURCHASE_INVOICE', 'FB-2026-', 1),
  ('FS', 'SALES_INVOICE', 'FS-2026-', 1),
  ('KS', 'SALES_RETURN', 'KS-2026-', 1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (id, role_id, full_name, email, password_hash, is_active)
SELECT
  '11111111-1111-1111-1111-111111111111'::uuid,
  r.id,
  'System Admin',
  'admin@example.local',
  '$2b$10$1KbjC1Z8Iky3Uczdlz7SoO9J7sGzGWx/89ZbduCMsZ/HXXIQK5vCq',
  true
FROM roles r
WHERE r.code = 'ADMIN'
ON CONFLICT (email) DO NOTHING;
