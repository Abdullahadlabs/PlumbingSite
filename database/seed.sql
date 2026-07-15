-- Seed State

INSERT INTO public.states (name, slug) VALUES ('Florida', 'florida') ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug RETURNING id;


-- Seed Counties, Cities, and Zips

-- Processing ZIP 33301 (Fort Lauderdale, Broward)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Broward', 
    'broward'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'broward' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Fort Lauderdale', 
    'fort-lauderdale'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33301', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'fort-lauderdale' AND co.slug = 'broward' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33311 (Fort Lauderdale, Broward)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Broward', 
    'broward'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'broward' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Fort Lauderdale', 
    'fort-lauderdale'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33311', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'fort-lauderdale' AND co.slug = 'broward' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33312 (Fort Lauderdale, Broward)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Broward', 
    'broward'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'broward' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Fort Lauderdale', 
    'fort-lauderdale'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33312', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'fort-lauderdale' AND co.slug = 'broward' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33304 (Fort Lauderdale, Broward)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Broward', 
    'broward'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'broward' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Fort Lauderdale', 
    'fort-lauderdale'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33304', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'fort-lauderdale' AND co.slug = 'broward' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33020 (Hollywood, Broward)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Broward', 
    'broward'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'broward' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Hollywood', 
    'hollywood'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33020', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'hollywood' AND co.slug = 'broward' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33021 (Hollywood, Broward)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Broward', 
    'broward'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'broward' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Hollywood', 
    'hollywood'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33021', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'hollywood' AND co.slug = 'broward' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33060 (Pompano Beach, Broward)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Broward', 
    'broward'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'broward' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Pompano Beach', 
    'pompano-beach'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33060', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'pompano-beach' AND co.slug = 'broward' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33101 (Miami, Miami Dade)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Miami Dade', 
    'miami-dade'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'miami-dade' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Miami', 
    'miami'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33101', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'miami' AND co.slug = 'miami-dade' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33139 (Miami Beach, Miami Dade)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Miami Dade', 
    'miami-dade'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'miami-dade' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Miami Beach', 
    'miami-beach'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33139', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'miami-beach' AND co.slug = 'miami-dade' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33145 (Miami, Miami Dade)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Miami Dade', 
    'miami-dade'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'miami-dade' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Miami', 
    'miami'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33145', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'miami' AND co.slug = 'miami-dade' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33010 (Hialeah, Miami Dade)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Miami Dade', 
    'miami-dade'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'miami-dade' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Hialeah', 
    'hialeah'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33010', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'hialeah' AND co.slug = 'miami-dade' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33602 (Tampa, Hillsborough)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Hillsborough', 
    'hillsborough'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'hillsborough' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Tampa', 
    'tampa'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33602', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'tampa' AND co.slug = 'hillsborough' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33606 (Tampa, Hillsborough)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Hillsborough', 
    'hillsborough'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'hillsborough' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Tampa', 
    'tampa'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33606', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'tampa' AND co.slug = 'hillsborough' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 33607 (Tampa, Hillsborough)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Hillsborough', 
    'hillsborough'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'hillsborough' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Tampa', 
    'tampa'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '33607', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'tampa' AND co.slug = 'hillsborough' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 32801 (Orlando, Orange)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Orange', 
    'orange'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'orange' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Orlando', 
    'orlando'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '32801', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'orlando' AND co.slug = 'orange' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 32803 (Orlando, Orange)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Orange', 
    'orange'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'orange' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Orlando', 
    'orlando'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '32803', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'orlando' AND co.slug = 'orange' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 32806 (Orlando, Orange)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Orange', 
    'orange'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'orange' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Orlando', 
    'orlando'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '32806', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'orlando' AND co.slug = 'orange' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 32202 (Jacksonville, Duval)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Duval', 
    'duval'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'duval' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Jacksonville', 
    'jacksonville'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '32202', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'jacksonville' AND co.slug = 'duval' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;

-- Processing ZIP 32204 (Jacksonville, Duval)

INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    'Duval', 
    'duval'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = 'duval' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    'Jacksonville', 
    'jacksonville'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '32204', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = 'jacksonville' AND co.slug = 'duval' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;