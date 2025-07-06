-- Large dataset of saved properties for the property marketplace
-- This creates realistic saved properties for users across different price ranges and preferences

INSERT INTO saved_properties (user_email, property_uid, created_at) VALUES

-- Tech professionals saving high-end properties
('investor.james@email.com', 'sf_vic_001', NOW() - INTERVAL '1 day'),
('investor.james@email.com', 'sf_loft_004', NOW() - INTERVAL '3 days'),
('investor.james@email.com', 'ny_loft_162', NOW() - INTERVAL '5 days'),
('investor.james@email.com', 'chi_loft_242', NOW() - INTERVAL '7 days'),
('investor.james@email.com', 'bos_loft_284', NOW() - INTERVAL '10 days'),

-- Family buyers looking at family-friendly properties
('buyer.susan@email.com', 'sf_house_003', NOW() - INTERVAL '2 days'),
('buyer.susan@email.com', 'la_house_013', NOW() - INTERVAL '4 days'),
('buyer.susan@email.com', 'bos_house_289', NOW() - INTERVAL '6 days'),
('buyer.susan@email.com', 'chi_house_253', NOW() - INTERVAL '8 days'),
('buyer.susan@email.com', 'mia_house_210', NOW() - INTERVAL '12 days'),

-- Young professionals saving modern condos
('family.mike@email.com', 'sf_condo_002', NOW() - INTERVAL '1 day'),
('family.mike@email.com', 'ny_apt_169', NOW() - INTERVAL '3 days'),
('family.mike@email.com', 'mia_condo_202', NOW() - INTERVAL '5 days'),
('family.mike@email.com', 'chi_condo_247', NOW() - INTERVAL '7 days'),
('family.mike@email.com', 'bos_condo_288', NOW() - INTERVAL '9 days'),

-- Artist community saving creative spaces
('artist.emily@email.com', 'sf_loft_004', NOW() - INTERVAL '2 days'),
('artist.emily@email.com', 'ny_loft_162', NOW() - INTERVAL '4 days'),
('artist.emily@email.com', 'chi_house_243', NOW() - INTERVAL '6 days'),
('artist.emily@email.com', 'mia_condo_206', NOW() - INTERVAL '8 days'),
('artist.emily@email.com', 'bos_house_287', NOW() - INTERVAL '11 days'),

-- Luxury buyers saving premium properties
('tech.exec@email.com', 'sf_house_005', NOW() - INTERVAL '3 days'),
('tech.exec@email.com', 'ny_apt_165', NOW() - INTERVAL '5 days'),
('tech.exec@email.com', 'la_house_011', NOW() - INTERVAL '7 days'),
('tech.exec@email.com', 'mia_house_205', NOW() - INTERVAL '9 days'),
('tech.exec@email.com', 'bos_apt_281', NOW() - INTERVAL '13 days'),

-- International buyers exploring different markets
('celebrity.agent@email.com', 'la_house_017', NOW() - INTERVAL '1 day'),
('celebrity.agent@email.com', 'ny_apt_176', NOW() - INTERVAL '3 days'),
('celebrity.agent@email.com', 'mia_condo_211', NOW() - INTERVAL '5 days'),
('celebrity.agent@email.com', 'sf_penthouse_008', NOW() - INTERVAL '7 days'),
('celebrity.agent@email.com', 'chi_condo_244', NOW() - INTERVAL '10 days'),

-- Budget-conscious buyers saving affordable options
('downtown.pro@email.com', 'bos_apt_294', NOW() - INTERVAL '2 days'),
('downtown.pro@email.com', 'chi_house_260', NOW() - INTERVAL '4 days'),
('downtown.pro@email.com', 'mia_house_226', NOW() - INTERVAL '6 days'),
('downtown.pro@email.com', 'ny_apt_170', NOW() - INTERVAL '8 days'),
('downtown.pro@email.com', 'sf_house_007', NOW() - INTERVAL '12 days'),

-- Beach lifestyle enthusiasts
('beach.lover@email.com', 'la_house_013', NOW() - INTERVAL '1 day'),
('beach.lover@email.com', 'mia_apt_201', NOW() - INTERVAL '3 days'),
('beach.lover@email.com', 'mia_condo_204', NOW() - INTERVAL '5 days'),
('beach.lover@email.com', 'bos_apt_306', NOW() - INTERVAL '7 days'),
('beach.lover@email.com', 'mia_condo_221', NOW() - INTERVAL '11 days'),

-- Urban lifestyle seekers
('hills.buyer@email.com', 'ny_apt_161', NOW() - INTERVAL '2 days'),
('hills.buyer@email.com', 'sf_condo_002', NOW() - INTERVAL '4 days'),
('hills.buyer@email.com', 'chi_loft_242', NOW() - INTERVAL '6 days'),
('hills.buyer@email.com', 'bos_condo_282', NOW() - INTERVAL '8 days'),
('hills.buyer@email.com', 'mia_condo_209', NOW() - INTERVAL '10 days'),

-- Investment property seekers
('westwood.family@email.com', 'la_condo_015', NOW() - INTERVAL '3 days'),
('westwood.family@email.com', 'ny_apt_180', NOW() - INTERVAL '5 days'),
('westwood.family@email.com', 'chi_loft_261', NOW() - INTERVAL '7 days'),
('westwood.family@email.com', 'bos_condo_295', NOW() - INTERVAL '9 days'),
('westwood.family@email.com', 'mia_condo_217', NOW() - INTERVAL '13 days'),

-- Historic property enthusiasts
('wall.street@email.com', 'bos_apt_281', NOW() - INTERVAL '1 day'),
('wall.street@email.com', 'ny_apt_164', NOW() - INTERVAL '3 days'),
('wall.street@email.com', 'sf_vic_001', NOW() - INTERVAL '5 days'),
('wall.street@email.com', 'chi_house_248', NOW() - INTERVAL '7 days'),
('wall.street@email.com', 'mia_house_208', NOW() - INTERVAL '11 days'),

-- Modern living enthusiasts
('soho.gallery@email.com', 'ny_loft_162', NOW() - INTERVAL '2 days'),
('soho.gallery@email.com', 'sf_loft_004', NOW() - INTERVAL '4 days'),
('soho.gallery@email.com', 'chi_loft_249', NOW() - INTERVAL '6 days'),
('soho.gallery@email.com', 'bos_loft_284', NOW() - INTERVAL '8 days'),
('soho.gallery@email.com', 'mia_condo_217', NOW() - INTERVAL '12 days'),

-- Waterfront property seekers
('brooklyn.young@email.com', 'ny_condo_163', NOW() - INTERVAL '3 days'),
('brooklyn.young@email.com', 'mia_house_205', NOW() - INTERVAL '5 days'),
('brooklyn.young@email.com', 'chi_condo_250', NOW() - INTERVAL '7 days'),
('brooklyn.young@email.com', 'bos_apt_290', NOW() - INTERVAL '9 days'),
('brooklyn.young@email.com', 'sf_condo_006', NOW() - INTERVAL '13 days'),

-- Suburban family seekers
('village.resident@email.com', 'bos_house_293', NOW() - INTERVAL '1 day'),
('village.resident@email.com', 'chi_house_253', NOW() - INTERVAL '3 days'),
('village.resident@email.com', 'mia_house_212', NOW() - INTERVAL '5 days'),
('village.resident@email.com', 'sf_house_003', NOW() - INTERVAL '7 days'),
('village.resident@email.com', 'ny_apt_181', NOW() - INTERVAL '10 days'),

-- Cultural district enthusiasts
('finance.exec@email.com', 'ny_apt_165', NOW() - INTERVAL '2 days'),
('finance.exec@email.com', 'bos_condo_282', NOW() - INTERVAL '4 days'),
('finance.exec@email.com', 'chi_apt_267', NOW() - INTERVAL '6 days'),
('finance.exec@email.com', 'mia_condo_225', NOW() - INTERVAL '8 days'),
('finance.exec@email.com', 'sf_house_007', NOW() - INTERVAL '12 days'),

-- Golf course and resort living
('beach.investor@email.com', 'mia_condo_213', NOW() - INTERVAL '3 days'),
('beach.investor@email.com', 'mia_house_212', NOW() - INTERVAL '5 days'),
('beach.investor@email.com', 'mia_condo_227', NOW() - INTERVAL '7 days'),
('beach.investor@email.com', 'mia_condo_235', NOW() - INTERVAL '9 days'),
('beach.investor@email.com', 'bos_house_305', NOW() - INTERVAL '13 days'),

-- Academic community seekers
('brickell.buyer@email.com', 'bos_house_283', NOW() - INTERVAL '1 day'),
('brickell.buyer@email.com', 'chi_house_248', NOW() - INTERVAL '3 days'),
('brickell.buyer@email.com', 'ny_apt_168', NOW() - INTERVAL '5 days'),
('brickell.buyer@email.com', 'la_condo_015', NOW() - INTERVAL '7 days'),
('brickell.buyer@email.com', 'bos_apt_294', NOW() - INTERVAL '11 days'),

-- Tech corridor seekers
('gables.family@email.com', 'bos_loft_303', NOW() - INTERVAL '2 days'),
('gables.family@email.com', 'sf_house_009', NOW() - INTERVAL '4 days'),
('gables.family@email.com', 'chi_loft_249', NOW() - INTERVAL '6 days'),
('gables.family@email.com', 'ny_apt_172', NOW() - INTERVAL '8 days'),
('gables.family@email.com', 'mia_condo_217', NOW() - INTERVAL '12 days'),

-- Diverse neighborhood explorers
('key.resident@email.com', 'chi_apt_264', NOW() - INTERVAL '3 days'),
('key.resident@email.com', 'ny_apt_179', NOW() - INTERVAL '5 days'),
('key.resident@email.com', 'bos_apt_286', NOW() - INTERVAL '7 days'),
('key.resident@email.com', 'sf_house_019', NOW() - INTERVAL '9 days'),
('key.resident@email.com', 'mia_house_224', NOW() - INTERVAL '13 days'),

-- Entertainment district seekers
('grove.buyer@email.com', 'ny_apt_174', NOW() - INTERVAL '1 day'),
('grove.buyer@email.com', 'la_house_016', NOW() - INTERVAL '3 days'),
('grove.buyer@email.com', 'chi_house_243', NOW() - INTERVAL '5 days'),
('grove.buyer@email.com', 'bos_condo_298', NOW() - INTERVAL '7 days'),
('grove.buyer@email.com', 'mia_condo_206', NOW() - INTERVAL '10 days'),

-- Heritage and cultural preservation enthusiasts
('lincoln.family@email.com', 'chi_condo_254', NOW() - INTERVAL '2 days'),
('lincoln.family@email.com', 'ny_apt_177', NOW() - INTERVAL '4 days'),
('lincoln.family@email.com', 'bos_house_317', NOW() - INTERVAL '6 days'),
('lincoln.family@email.com', 'sf_vic_001', NOW() - INTERVAL '8 days'),
('lincoln.family@email.com', 'mia_house_208', NOW() - INTERVAL '12 days'),

-- Additional users saving various properties based on preferences
('river.artist@email.com', 'chi_loft_242', NOW() - INTERVAL '15 days'),
('river.artist@email.com', 'ny_apt_189', NOW() - INTERVAL '17 days'),
('river.artist@email.com', 'sf_loft_004', NOW() - INTERVAL '19 days'),
('river.artist@email.com', 'mia_condo_206', NOW() - INTERVAL '21 days'),
('river.artist@email.com', 'bos_loft_297', NOW() - INTERVAL '25 days'),

('wicker.creative@email.com', 'chi_house_243', NOW() - INTERVAL '14 days'),
('wicker.creative@email.com', 'ny_apt_175', NOW() - INTERVAL '16 days'),
('wicker.creative@email.com', 'la_house_019', NOW() - INTERVAL '18 days'),
('wicker.creative@email.com', 'bos_house_287', NOW() - INTERVAL '20 days'),
('wicker.creative@email.com', 'mia_condo_217', NOW() - INTERVAL '24 days'),

('gold.exec@email.com', 'chi_condo_244', NOW() - INTERVAL '13 days'),
('gold.exec@email.com', 'ny_apt_165', NOW() - INTERVAL '15 days'),
('gold.exec@email.com', 'sf_penthouse_008', NOW() - INTERVAL '17 days'),
('gold.exec@email.com', 'mia_condo_211', NOW() - INTERVAL '19 days'),
('gold.exec@email.com', 'bos_apt_281', NOW() - INTERVAL '23 days'),

('logan.buyer@email.com', 'chi_house_245', NOW() - INTERVAL '12 days'),
('logan.buyer@email.com', 'ny_apt_184', NOW() - INTERVAL '14 days'),
('logan.buyer@email.com', 'sf_house_007', NOW() - INTERVAL '16 days'),
('logan.buyer@email.com', 'bos_house_296', NOW() - INTERVAL '18 days'),
('logan.buyer@email.com', 'mia_house_224', NOW() - INTERVAL '22 days'),

-- Long-term savers (properties saved months ago)
('back.bay@email.com', 'bos_apt_281', NOW() - INTERVAL '45 days'),
('back.bay@email.com', 'bos_condo_285', NOW() - INTERVAL '47 days'),
('back.bay@email.com', 'ny_apt_161', NOW() - INTERVAL '49 days'),
('back.bay@email.com', 'sf_house_005', NOW() - INTERVAL '51 days'),
('back.bay@email.com', 'chi_condo_244', NOW() - INTERVAL '55 days'),

('north.end@email.com', 'bos_condo_282', NOW() - INTERVAL '44 days'),
('north.end@email.com', 'ny_apt_174', NOW() - INTERVAL '46 days'),
('north.end@email.com', 'chi_condo_268', NOW() - INTERVAL '48 days'),
('north.end@email.com', 'mia_house_208', NOW() - INTERVAL '50 days'),
('north.end@email.com', 'sf_vic_001', NOW() - INTERVAL '54 days'),

('harvard.prof@email.com', 'bos_house_283', NOW() - INTERVAL '43 days'),
('harvard.prof@email.com', 'chi_house_248', NOW() - INTERVAL '45 days'),
('harvard.prof@email.com', 'ny_apt_168', NOW() - INTERVAL '47 days'),
('harvard.prof@email.com', 'la_condo_015', NOW() - INTERVAL '49 days'),
('harvard.prof@email.com', 'sf_house_003', NOW() - INTERVAL '53 days'),

-- Recent active savers (last week)
('john.smith@email.com', 'sf_house_003', NOW() - INTERVAL '1 day'),
('john.smith@email.com', 'sf_condo_006', NOW() - INTERVAL '2 days'),
('john.smith@email.com', 'sf_penthouse_008', NOW() - INTERVAL '4 days'),
('john.smith@email.com', 'ny_loft_162', NOW() - INTERVAL '6 days'),

('sarah.johnson@email.com', 'sf_condo_002', NOW() - INTERVAL '1 day'),
('sarah.johnson@email.com', 'ny_apt_165', NOW() - INTERVAL '3 days'),
('sarah.johnson@email.com', 'chi_condo_244', NOW() - INTERVAL '5 days'),
('sarah.johnson@email.com', 'mia_condo_202', NOW() - INTERVAL '7 days'),

('mike.brown@email.com', 'sf_house_005', NOW() - INTERVAL '2 days'),
('mike.brown@email.com', 'la_house_011', NOW() - INTERVAL '4 days'),
('mike.brown@email.com', 'chi_house_248', NOW() - INTERVAL '6 days'),
('mike.brown@email.com', 'bos_house_283', NOW() - INTERVAL '8 days'),

('emily.davis@email.com', 'sf_loft_004', NOW() - INTERVAL '1 day'),
('emily.davis@email.com', 'ny_loft_162', NOW() - INTERVAL '3 days'),
('emily.davis@email.com', 'chi_loft_242', NOW() - INTERVAL '5 days'),
('emily.davis@email.com', 'bos_loft_284', NOW() - INTERVAL '7 days'),

('david.wilson@email.com', 'sf_house_005', NOW() - INTERVAL '2 days'),
('david.wilson@email.com', 'ny_apt_176', NOW() - INTERVAL '4 days'),
('david.wilson@email.com', 'la_house_017', NOW() - INTERVAL '6 days'),
('david.wilson@email.com', 'mia_house_205', NOW() - INTERVAL '8 days');
