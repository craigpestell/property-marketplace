-- Large dataset of offers for the property marketplace
-- This creates realistic offers for the large property dataset

INSERT INTO offers (offer_uid, property_uid, buyer_email, seller_email, amount, status, message, created_at, updated_at) VALUES

-- Recent offers (last 30 days)
('OFFER-001-sf-vic', 'sf_vic_001', 'investor.james@email.com', 'john.smith@email.com', 1200000, 'pending', 'Very interested in this Victorian home. Can close quickly with cash.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('OFFER-002-sf-condo', 'sf_condo_002', 'buyer.susan@email.com', 'sarah.johnson@email.com', 2050000, 'accepted', 'Love the SOMA location and city views. Ready to proceed.', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
('OFFER-003-sf-house', 'sf_house_003', 'family.mike@email.com', 'mike.brown@email.com', 1400000, 'rejected', 'Great neighborhood for families. Hope we can work something out.', NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days'),
('OFFER-004-sf-loft', 'sf_loft_004', 'artist.emily@email.com', 'emily.davis@email.com', 1750000, 'counter_offered', 'Perfect space for my art studio. Industrial character is amazing.', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),
('OFFER-005-sf-mansion', 'sf_house_005', 'tech.exec@email.com', 'david.wilson@email.com', 4200000, 'pending', 'Exceptional property with incredible views. Would love to schedule a second viewing.', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),

-- Los Angeles offers
('OFFER-006-la-estate', 'la_house_011', 'celebrity.agent@email.com', 'james.jackson@email.com', 5200000, 'accepted', 'Client loves the Beverly Hills location and privacy. Ready to close immediately.', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days'),
('OFFER-007-la-loft', 'la_condo_012', 'downtown.pro@email.com', 'nicole.white@email.com', 820000, 'pending', 'Great location for work downtown. Love the urban lifestyle.', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('OFFER-008-la-beach', 'la_house_013', 'beach.lover@email.com', 'kevin.harris@email.com', 3100000, 'rejected', 'Dream home by the beach. Ocean views are spectacular.', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'),
('OFFER-009-la-modern', 'la_house_014', 'hills.buyer@email.com', 'michelle.martin@email.com', 2350000, 'counter_offered', 'Love the modern design and Hollywood Hills location.', NOW() - INTERVAL '22 days', NOW() - INTERVAL '20 days'),
('OFFER-010-la-westwood', 'la_condo_015', 'westwood.family@email.com', 'brandon.garcia@email.com', 1050000, 'accepted', 'Perfect for our family near UCLA. Great building amenities.', NOW() - INTERVAL '25 days', NOW() - INTERVAL '22 days'),

-- New York offers
('OFFER-011-ny-penthouse', 'ny_apt_161', 'wall.street@email.com', 'alexandra.chen@email.com', 4000000, 'pending', 'Stunning penthouse with Central Park views. Perfect for entertaining clients.', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
('OFFER-012-ny-soho', 'ny_loft_162', 'soho.gallery@email.com', 'marcus.wright@email.com', 2700000, 'accepted', 'Incredible space for my gallery. The cast-iron architecture is perfect.', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
('OFFER-013-ny-brooklyn', 'ny_condo_163', 'brooklyn.young@email.com', 'sofia.rivera@email.com', 1800000, 'rejected', 'Love Brooklyn Heights and the Manhattan views. Hope to find something similar.', NOW() - INTERVAL '32 days', NOW() - INTERVAL '30 days'),
('OFFER-014-ny-village', 'ny_apt_164', 'village.resident@email.com', 'jonathan.kim@email.com', 3400000, 'counter_offered', 'Greenwich Village is my dream neighborhood. Historic charm is unmatched.', NOW() - INTERVAL '35 days', NOW() - INTERVAL '33 days'),
('OFFER-015-ny-tribeca', 'ny_apt_165', 'finance.exec@email.com', 'natasha.petrov@email.com', 5000000, 'pending', 'Premium Tribeca location with world-class amenities. Ready to move quickly.', NOW() - INTERVAL '37 days', NOW() - INTERVAL '37 days'),

-- Miami offers
('OFFER-016-mia-beach', 'mia_apt_201', 'beach.investor@email.com', 'carlos.santos@email.com', 3100000, 'accepted', 'Art Deco penthouse on Ocean Drive is a dream investment. Beach lifestyle at its finest.', NOW() - INTERVAL '40 days', NOW() - INTERVAL '35 days'),
('OFFER-017-mia-brickell', 'mia_condo_202', 'brickell.buyer@email.com', 'maria.rodriguez@email.com', 820000, 'pending', 'Love the Brickell location and modern amenities. Great for city living.', NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days'),
('OFFER-018-mia-gables', 'mia_house_203', 'gables.family@email.com', 'jose.fernandez@email.com', 2300000, 'rejected', 'Beautiful Mediterranean style in prestigious Coral Gables. Perfect for our family.', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days'),
('OFFER-019-mia-key', 'mia_condo_204', 'key.resident@email.com', 'ana.lopez@email.com', 1900000, 'counter_offered', 'Key Biscayne oceanfront living is exactly what we'''re looking for.', NOW() - INTERVAL '47 days', NOW() - INTERVAL '45 days'),
('OFFER-020-mia-grove', 'mia_house_205', 'grove.buyer@email.com', 'ricardo.morales@email.com', 4300000, 'accepted', 'Magnificent bayfront estate in Coconut Grove. The dock access is perfect for our yacht.', NOW() - INTERVAL '50 days', NOW() - INTERVAL '47 days'),

-- Chicago offers
('OFFER-021-chi-lincoln', 'chi_apt_241', 'lincoln.family@email.com', 'thomas.kowalski@email.com', 1400000, 'pending', 'Victorian conversion in Lincoln Park is exactly what we'''ve been searching for.', NOW() - INTERVAL '52 days', NOW() - INTERVAL '52 days'),
('OFFER-022-chi-river', 'chi_loft_242', 'river.artist@email.com', 'anna.novak@email.com', 920000, 'accepted', 'River North loft perfect for my studio and gallery space. Industrial character is amazing.', NOW() - INTERVAL '55 days', NOW() - INTERVAL '50 days'),
('OFFER-023-chi-wicker', 'chi_house_243', 'wicker.creative@email.com', 'peter.jankowski@email.com', 730000, 'rejected', 'Love the artistic community in Wicker Park. This house has great creative potential.', NOW() - INTERVAL '57 days', NOW() - INTERVAL '55 days'),
('OFFER-024-chi-gold', 'chi_condo_244', 'gold.exec@email.com', 'maria.kowalczyk@email.com', 2100000, 'counter_offered', 'Gold Coast luxury with Lake Michigan views. Perfect for entertaining.', NOW() - INTERVAL '60 days', NOW() - INTERVAL '57 days'),
('OFFER-025-chi-logan', 'chi_house_245', 'logan.buyer@email.com', 'jan.wisniewski@email.com', 630000, 'pending', 'Classic Chicago bungalow in trendy Logan Square. Love the neighborhood character.', NOW() - INTERVAL '62 days', NOW() - INTERVAL '62 days'),

-- Boston offers
('OFFER-026-bos-back', 'bos_apt_281', 'back.bay@email.com', 'patrick.sullivan@email.com', 2750000, 'accepted', 'Victorian brownstone in Back Bay is the epitome of Boston elegance. Historic charm unmatched.', NOW() - INTERVAL '65 days', NOW() - INTERVAL '60 days'),
('OFFER-027-bos-north', 'bos_condo_282', 'north.end@email.com', 'mary.obrien@email.com', 1400000, 'pending', 'North End historic condo with Italian heritage. Love the Freedom Trail location.', NOW() - INTERVAL '67 days', NOW() - INTERVAL '67 days'),
('OFFER-028-bos-cambridge', 'bos_house_283', 'harvard.prof@email.com', 'james.fitzgerald@email.com', 3100000, 'rejected', 'Harvard Square location perfect for academic lifestyle. Historic home with character.', NOW() - INTERVAL '70 days', NOW() - INTERVAL '65 days'),
('OFFER-029-bos-south', 'bos_loft_284', 'south.end@email.com', 'sarah.murphy@email.com', 1800000, 'counter_offered', 'South End warehouse conversion is exactly the modern space we need.', NOW() - INTERVAL '72 days', NOW() - INTERVAL '70 days'),
('OFFER-030-bos-beacon', 'bos_condo_285', 'beacon.resident@email.com', 'michael.kelly@email.com', 2150000, 'accepted', 'Beacon Hill historic district with cobblestone charm. Dream Boston location.', NOW() - INTERVAL '75 days', NOW() - INTERVAL '72 days'),

-- Additional older offers (60-365 days ago)
('OFFER-031-sf-marina', 'sf_condo_006', 'marina.sailor@email.com', 'jessica.miller@email.com', 1600000, 'accepted', 'Marina District condo with bay views perfect for sailing lifestyle.', NOW() - INTERVAL '80 days', NOW() - INTERVAL '75 days'),
('OFFER-032-sf-castro', 'sf_house_007', 'castro.couple@email.com', 'chris.moore@email.com', 1320000, 'rejected', 'Love the Castro District community and this charming cottage.', NOW() - INTERVAL '85 days', NOW() - INTERVAL '80 days'),
('OFFER-033-sf-nob', 'sf_penthouse_008', 'nob.hill@email.com', 'amanda.taylor@email.com', 3100000, 'accepted', 'Nob Hill penthouse with 360-degree views is a once-in-a-lifetime opportunity.', NOW() - INTERVAL '90 days', NOW() - INTERVAL '85 days'),
('OFFER-034-la-venice', 'la_house_016', 'venice.artist@email.com', 'stephanie.rodriguez@email.com', 1600000, 'pending', 'Venice Beach bungalow on Abbot Kinney is perfect for my artistic lifestyle.', NOW() - INTERVAL '95 days', NOW() - INTERVAL '95 days'),
('OFFER-035-la-malibu', 'la_house_017', 'malibu.family@email.com', 'tyler.lee@email.com', 7500000, 'accepted', 'Malibu oceanfront estate with private beach is our dream home. Ready to close immediately.', NOW() - INTERVAL '100 days', NOW() - INTERVAL '95 days'),

('OFFER-036-ny-lower', 'ny_apt_166', 'les.hipster@email.com', 'carlos.mendez@email.com', 1220000, 'rejected', 'Lower East Side modern condo in vibrant neighborhood. Love the energy here.', NOW() - INTERVAL '105 days', NOW() - INTERVAL '100 days'),
('OFFER-037-ny-williamsburg', 'ny_apt_167', 'wburg.creative@email.com', 'elena.vasquez@email.com', 1620000, 'accepted', 'Williamsburg warehouse conversion with Manhattan views. Perfect for creative work.', NOW() - INTERVAL '110 days', NOW() - INTERVAL '105 days'),
('OFFER-038-ny-uws', 'ny_apt_168', 'uws.family@email.com', 'dmitri.volkov@email.com', 2850000, 'counter_offered', 'Upper West Side classic six near Central Park. Perfect for raising children.', NOW() - INTERVAL '115 days', NOW() - INTERVAL '110 days'),
('OFFER-039-mia-wynwood', 'mia_condo_206', 'wynwood.collector@email.com', 'diego.herrera@email.com', 630000, 'accepted', 'Wynwood Arts District loft surrounded by incredible street art and galleries.', NOW() - INTERVAL '120 days', NOW() - INTERVAL '115 days'),
('OFFER-040-mia-aventura', 'mia_condo_207', 'aventura.shopper@email.com', 'fernanda.silva@email.com', 1320000, 'pending', 'Aventura luxury tower near world-class shopping. Perfect location for our lifestyle.', NOW() - INTERVAL '125 days', NOW() - INTERVAL '125 days'),

('OFFER-041-chi-bucktown', 'chi_apt_246', 'bucktown.young@email.com', 'katarzyna.zielinska@email.com', 830000, 'rejected', 'Bucktown modern townhouse in trendy neighborhood. Love the rooftop deck.', NOW() - INTERVAL '130 days', NOW() - INTERVAL '125 days'),
('OFFER-042-chi-south', 'chi_condo_247', 'south.loop@email.com', 'andrzej.kowalski@email.com', 530000, 'accepted', 'South Loop high-rise with skyline views. Perfect downtown living.', NOW() - INTERVAL '135 days', NOW() - INTERVAL '130 days'),
('OFFER-043-chi-hyde', 'chi_house_248', 'hyde.professor@email.com', 'magdalena.nowak@email.com', 1600000, 'counter_offered', 'Hyde Park historic mansion near University of Chicago. Academic dream home.', NOW() - INTERVAL '140 days', NOW() - INTERVAL '135 days'),
('OFFER-044-bos-somerville', 'bos_apt_286', 'porter.commuter@email.com', 'jennifer.ryan@email.com', 730000, 'accepted', 'Somerville Porter Square location perfect for T commute. Diverse neighborhood.', NOW() - INTERVAL '145 days', NOW() - INTERVAL '140 days'),
('OFFER-045-bos-jamaica', 'bos_house_287', 'jp.artist@email.com', 'david.mccarthy@email.com', 920000, 'pending', 'Jamaica Plain Victorian in eclectic artist community. Love the local culture.', NOW() - INTERVAL '150 days', NOW() - INTERVAL '150 days'),

-- Multiple offers on same property (competitive situations)
('OFFER-046-sf-vic-alt', 'sf_vic_001', 'competitive.buyer1@email.com', 'john.smith@email.com', 1280000, 'rejected', 'Willing to go above asking for this beautiful Victorian. No contingencies.', NOW() - INTERVAL '155 days', NOW() - INTERVAL '150 days'),
('OFFER-047-sf-vic-alt2', 'sf_vic_001', 'competitive.buyer2@email.com', 'john.smith@email.com', 1300000, 'rejected', 'Dream home in Mission District. Can close in 15 days cash.', NOW() - INTERVAL '155 days', NOW() - INTERVAL '152 days'),
('OFFER-048-la-estate-alt', 'la_house_011', 'beverly.buyer2@email.com', 'james.jackson@email.com', 5300000, 'rejected', 'Beverly Hills estate perfect for entertaining. Ready to exceed asking price.', NOW() - INTERVAL '160 days', NOW() - INTERVAL '155 days'),
('OFFER-049-ny-tribeca-alt', 'ny_apt_165', 'tribeca.buyer2@email.com', 'natasha.petrov@email.com', 5100000, 'rejected', 'Luxury Tribeca condo with world-class amenities. All cash offer.', NOW() - INTERVAL '165 days', NOW() - INTERVAL '160 days'),
('OFFER-050-mia-beach-alt', 'mia_apt_201', 'ocean.buyer2@email.com', 'carlos.santos@email.com', 3150000, 'rejected', 'Art Deco penthouse on Ocean Drive. Investment opportunity of a lifetime.', NOW() - INTERVAL '170 days', NOW() - INTERVAL '165 days'),

-- Older accepted offers (now closed)
('OFFER-051-closed1', 'sf_house_009', 'hayes.buyer@email.com', 'ryan.anderson@email.com', 1520000, 'accepted', 'Hayes Valley modern home with smart features. Perfect for tech lifestyle.', NOW() - INTERVAL '200 days', NOW() - INTERVAL '180 days'),
('OFFER-052-closed2', 'la_condo_018', 'century.exec@email.com', 'rachel.gonzalez@email.com', 1330000, 'accepted', 'Century City tower with city views. Convenient for business meetings.', NOW() - INTERVAL '210 days', NOW() - INTERVAL '190 days'),
('OFFER-053-closed3', 'ny_apt_169', 'chelsea.young@email.com', 'isabelle.laurent@email.com', 920000, 'accepted', 'Chelsea modern studio perfect for young professional. Great building amenities.', NOW() - INTERVAL '220 days', NOW() - INTERVAL '200 days'),
('OFFER-054-closed4', 'mia_house_208', 'beach.family@email.com', 'pablo.gutierrez@email.com', 2150000, 'accepted', 'Miami Beach historic home with modern updates. Perfect family location.', NOW() - INTERVAL '230 days', NOW() - INTERVAL '210 days'),
('OFFER-055-closed5', 'chi_loft_249', 'west.loop@email.com', 'pawel.krawczyk@email.com', 1220000, 'accepted', 'West Loop warehouse conversion with high ceilings. Industrial character perfect.', NOW() - INTERVAL '240 days', NOW() - INTERVAL '220 days'),

-- Long-term rejected offers
('OFFER-056-old-reject1', 'bos_condo_288', 'seaport.lowball@email.com', 'lisa.connor@email.com', 1400000, 'rejected', 'Seaport District modern condo. Hope we can negotiate on price.', NOW() - INTERVAL '250 days', NOW() - INTERVAL '240 days'),
('OFFER-057-old-reject2', 'sf_condo_010', 'russian.hill@email.com', 'lisa.thomas@email.com', 1650000, 'rejected', 'Russian Hill views are spectacular. Would love to find middle ground on price.', NOW() - INTERVAL '260 days', NOW() - INTERVAL '250 days'),
('OFFER-058-old-reject3', 'la_house_019', 'silver.lake@email.com', 'daniel.lopez@email.com', 1180000, 'rejected', 'Silver Lake Craftsman with original details. Perfect for our restoration project.', NOW() - INTERVAL '270 days', NOW() - INTERVAL '260 days'),
('OFFER-059-old-reject4', 'ny_apt_170', 'east.village@email.com', 'pierre.dubois@email.com', 850000, 'rejected', 'East Village walkup charm in vibrant neighborhood. Love the exposed brick.', NOW() - INTERVAL '280 days', NOW() - INTERVAL '270 days'),
('OFFER-060-old-reject5', 'mia_condo_209', 'downtown.mia@email.com', 'valentina.castro@email.com', 720000, 'rejected', 'Downtown Miami skyline views perfect for young professional lifestyle.', NOW() - INTERVAL '290 days', NOW() - INTERVAL '280 days'),

-- Additional diverse offers across all cities and price ranges
('OFFER-061-affordable1', 'chi_house_260', 'bridgeport.worker@email.com', 'ryszard.nowicki@email.com', 310000, 'accepted', 'Working-class home in historic Bridgeport. Perfect starter home for our family.', NOW() - INTERVAL '300 days', NOW() - INTERVAL '290 days'),
('OFFER-062-affordable2', 'bos_apt_294', 'allston.student@email.com', 'stephanie.mcgrath@email.com', 400000, 'pending', 'Student-friendly apartment near BU. Great investment for college rental.', NOW() - INTERVAL '310 days', NOW() - INTERVAL '310 days'),
('OFFER-063-luxury1', 'ny_apt_176', 'meatpacking.luxury@email.com', 'alessandro.conti@email.com', 6500000, 'counter_offered', 'Ultra-luxury penthouse in Meatpacking District. Ready for immediate occupancy.', NOW() - INTERVAL '320 days', NOW() - INTERVAL '315 days'),
('OFFER-064-luxury2', 'mia_condo_211', 'bal.harbour@email.com', 'isabella.vargas@email.com', 5300000, 'accepted', 'Bal Harbour oceanfront luxury beyond compare. Private beach access is perfect.', NOW() - INTERVAL '330 days', NOW() - INTERVAL '320 days'),
('OFFER-065-family1', 'bos_house_289', 'coolidge.family@email.com', 'kevin.donovan@email.com', 1320000, 'rejected', 'Brookline Coolidge Corner perfect for families. Great schools nearby.', NOW() - INTERVAL '340 days', NOW() - INTERVAL '330 days'),

-- Recent competitive market offers
('OFFER-066-recent1', 'chi_condo_250', 'streeterville.prof@email.com', 'agnieszka.lewandowska@email.com', 1820000, 'pending', 'Streeterville marina views for lake lifestyle. Perfect for sailing enthusiast.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('OFFER-067-recent2', 'bos_loft_284', 'south.end.couple@email.com', 'sarah.murphy@email.com', 1820000, 'counter_offered', 'South End warehouse conversion perfect for our modern lifestyle.', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
('OFFER-068-recent3', 'mia_house_210', 'pinecrest.schools@email.com', 'gabriel.mendoza@email.com', 1620000, 'accepted', 'Pinecrest family estate with top schools. Perfect for our growing family.', NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'),
('OFFER-069-recent4', 'ny_apt_171', 'flatiron.startup@email.com', 'anastasia.petrov@email.com', 2150000, 'pending', 'Flatiron District loft perfect for startup headquarters. Historic tin ceilings amazing.', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('OFFER-070-recent5', 'sf_hayes_009', 'hayes.tech@email.com', 'ryan.anderson@email.com', 1520000, 'rejected', 'Hayes Valley modern with smart features perfect for tech professional.', NOW() - INTERVAL '9 days', NOW() - INTERVAL '6 days'),

-- International buyers
('OFFER-071-intl1', 'ny_apt_161', 'london.investor@email.com', 'alexandra.chen@email.com', 4100000, 'pending', 'Manhattan penthouse for London client. Central Park views essential for investment.', NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
('OFFER-072-intl2', 'mia_apt_201', 'brazil.buyer@email.com', 'carlos.santos@email.com', 3050000, 'counter_offered', 'South Beach Art Deco for Brazilian family. Ocean Drive location perfect.', NOW() - INTERVAL '13 days', NOW() - INTERVAL '10 days'),
('OFFER-073-intl3', 'la_house_017', 'tokyo.exec@email.com', 'tyler.lee@email.com', 7600000, 'accepted', 'Malibu oceanfront for Tokyo executive. Private beach access essential.', NOW() - INTERVAL '16 days', NOW() - INTERVAL '13 days'),
('OFFER-074-intl4', 'sf_penthouse_008', 'singapore.fund@email.com', 'amanda.taylor@email.com', 3150000, 'rejected', 'Nob Hill penthouse for Singapore investment fund. 360-degree views appealing.', NOW() - INTERVAL '19 days', NOW() - INTERVAL '16 days'),
('OFFER-075-intl5', 'bos_apt_281', 'paris.collector@email.com', 'patrick.sullivan@email.com', 2800000, 'pending', 'Back Bay brownstone for Parisian art collector. Victorian charm irresistible.', NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),

-- Investment offers
('OFFER-076-invest1', 'chi_loft_261', 'chicago.reit@email.com', 'halina.zyskowska@email.com', 520000, 'accepted', 'Noble Square artist loft for REIT portfolio. Strong rental potential.', NOW() - INTERVAL '23 days', NOW() - INTERVAL '18 days'),
('OFFER-077-invest2', 'bos_condo_295', 'boston.fund@email.com', 'christopher.oneill@email.com', 530000, 'pending', 'Dorchester triple-decker for investment fund. Multi-unit income potential.', NOW() - INTERVAL '26 days', NOW() - INTERVAL '26 days'),
('OFFER-078-invest3', 'mia_condo_217', 'miami.investor@email.com', 'sofia.delgado@email.com', 630000, 'rejected', 'Midtown Miami loft for rental investment. Design District proximity valuable.', NOW() - INTERVAL '29 days', NOW() - INTERVAL '24 days'),
('OFFER-079-invest4', 'ny_apt_180', 'lic.developer@email.com', 'olaf.peterson@email.com', 1220000, 'counter_offered', 'LIC waterfront for development company. Manhattan skyline views marketable.', NOW() - INTERVAL '31 days', NOW() - INTERVAL '28 days'),
('OFFER-080-invest5', 'la_condo_015', 'westwood.reit@email.com', 'brandon.garcia@email.com', 1080000, 'accepted', 'Westwood high-rise for REIT expansion. UCLA proximity ensures rental demand.', NOW() - INTERVAL '34 days', NOW() - INTERVAL '31 days');
