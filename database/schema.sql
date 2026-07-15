-- =========================================================================
-- Florida Service Areas Database Schema DDL
-- Enforces hierarchy: States -> Counties -> Cities -> ZIPs
-- Enforces automatic slugification and no spaces via database triggers.
-- =========================================================================

-- 1. States Table
CREATE TABLE IF NOT EXISTS public.states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE CHECK (slug !~ '\s')
);

-- 2. Counties Table
CREATE TABLE IF NOT EXISTS public.counties (
    id SERIAL PRIMARY KEY,
    state_id INT NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL CHECK (slug !~ '\s'),
    UNIQUE (state_id, slug)
);

-- 3. Cities Table
CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    county_id INT NOT NULL REFERENCES public.counties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL CHECK (slug !~ '\s'),
    UNIQUE (county_id, slug)
);

-- 4. ZIPs Table
-- The zip_code column is the PRIMARY KEY, which naturally enforces uniqueness database-wide.
-- This ensures no duplicate URL generations exist for the same ZIP code.
CREATE TABLE IF NOT EXISTS public.zips (
    zip_code VARCHAR(10) PRIMARY KEY CHECK (zip_code ~ '^[0-9]+$'),
    city_id INT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE
);

-- 5. Helper function to slugify text in PostgreSQL
CREATE OR REPLACE FUNCTION public.slugify(text_to_slugify TEXT)
RETURNS TEXT AS $$
DECLARE
    cleaned_text TEXT;
END;
$$ (see implementation in body);
-- Wait, let's keep the full body of function and triggers here:
CREATE OR REPLACE FUNCTION public.slugify(text_to_slugify TEXT)
RETURNS TEXT AS $$
DECLARE
    cleaned_text TEXT;
BEGIN
    IF text_to_slugify IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Lowercase the text
    cleaned_text := LOWER(text_to_slugify);
    
    -- Replace spaces and underscores with hyphens
    cleaned_text := REGEXP_REPLACE(cleaned_text, '[\s_]+', '-', 'g');
    
    -- Remove non-alphanumeric/non-hyphen characters
    cleaned_text := REGEXP_REPLACE(cleaned_text, '[^a-z0-9\-]', '', 'g');
    
    -- Remove leading and trailing hyphens
    cleaned_text := REGEXP_REPLACE(cleaned_text, '^-+|-+$', '', 'g');
    
    -- Collapse multiple consecutive hyphens
    cleaned_text := REGEXP_REPLACE(cleaned_text, '-+', '-', 'g');
    
    RETURN cleaned_text;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Trigger function to clean and slugify names before storing
CREATE OR REPLACE FUNCTION public.clean_and_slugify_location()
RETURNS TRIGGER AS $$
BEGIN
    -- Force name to be slugified (lowercase, hyphens instead of spaces)
    NEW.name := public.slugify(NEW.name);
    
    -- Force slug to match name
    NEW.slug := NEW.name;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Attach Triggers to Tables
DROP TRIGGER IF EXISTS trg_states_slugify ON public.states;
CREATE TRIGGER trg_states_slugify
BEFORE INSERT OR UPDATE ON public.states
FOR EACH ROW EXECUTE FUNCTION public.clean_and_slugify_location();

DROP TRIGGER IF EXISTS trg_counties_slugify ON public.counties;
CREATE TRIGGER trg_counties_slugify
BEFORE INSERT OR UPDATE ON public.counties
FOR EACH ROW EXECUTE FUNCTION public.clean_and_slugify_location();

DROP TRIGGER IF EXISTS trg_cities_slugify ON public.cities;
CREATE TRIGGER trg_cities_slugify
BEFORE INSERT OR UPDATE ON public.cities
FOR EACH ROW EXECUTE FUNCTION public.clean_and_slugify_location();

-- 8. VIEW for strict SEO URL Output Generation
-- URL format: .../city/florida/[county]/[city]/[zip]
CREATE OR REPLACE VIEW public.florida_service_urls AS
SELECT 
    z.zip_code,
    c.name AS city,
    co.name AS county,
    s.name AS state,
    '/city/' || s.slug || '/' || co.slug || '/' || c.slug || '/' || z.zip_code AS url_path
FROM public.zips z
JOIN public.cities c ON z.city_id = c.id
JOIN public.counties co ON c.county_id = co.id
JOIN public.states s ON co.state_id = s.id
WHERE s.slug = 'florida';
