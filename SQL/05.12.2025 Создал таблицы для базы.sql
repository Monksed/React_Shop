-- ======================
--  TABLE: Brand
-- ======================
CREATE TABLE "Brand" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR,
    image VARCHAR,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ======================
--  TABLE: Product
-- ======================
CREATE TABLE "Product" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR,
    description VARCHAR,
    price BIGINT,
    image VARCHAR,
    bonus BIGINT,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    brand_id UUID
);

-- ======================
--  TABLE: User
-- ======================
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR,
    telegram_id BIGINT DEFAULT 0,
    score BIGINT DEFAULT 0,
    image VARCHAR,
    fio VARCHAR,
    adress VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ======================
--  FOREIGN KEYS
-- ======================
ALTER TABLE "Product"
    ADD CONSTRAINT fk_product_brand
    FOREIGN KEY (brand_id) REFERENCES "Brand"(id)