CREATE TABLE IF NOT EXISTS "company_profile" (
    "id"           UUID         NOT NULL DEFAULT gen_random_uuid(),
    "name"         VARCHAR(200) NOT NULL,
    "fiscal_no"    VARCHAR(50),
    "vat_no"       VARCHAR(50),
    "business_no"  VARCHAR(50),
    "address"      VARCHAR(255),
    "city"         VARCHAR(100),
    "phone"        VARCHAR(50),
    "email"        VARCHAR(150),
    "website"      VARCHAR(200),
    "bank_name"    VARCHAR(100),
    "bank_account" VARCHAR(50),
    "created_at"   TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "updated_at"   TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    CONSTRAINT "company_profile_pkey" PRIMARY KEY ("id")
);
