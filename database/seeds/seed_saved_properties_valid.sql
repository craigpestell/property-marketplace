-- Valid saved properties using actual property UIDs from our dataset

INSERT INTO saved_properties (user_email, property_uid, created_at) VALUES
-- Users saving New York properties
('alexandra.chen@email.com', 'ny_loft_162', NOW() - INTERVAL '5 days'),
('marcus.wright@email.com', 'ny_apt_161', NOW() - INTERVAL '3 days'),
('sofia.rivera@email.com', 'ny_apt_165', NOW() - INTERVAL '7 days'),
('jonathan.kim@email.com', 'ny_apt_168', NOW() - INTERVAL '2 days'),
('carlos.mendez@email.com', 'ny_apt_171', NOW() - INTERVAL '8 days'),
('elena.vasquez@email.com', 'ny_apt_175', NOW() - INTERVAL '1 day'),
('dmitri.volkov@email.com', 'ny_apt_169', NOW() - INTERVAL '4 days'),
('isabelle.laurent@email.com', 'ny_apt_178', NOW() - INTERVAL '6 days'),
('pierre.dubois@email.com', 'ny_apt_177', NOW() - INTERVAL '9 days'),
('anastasia.petrov@email.com', 'ny_apt_180', NOW() - INTERVAL '3 days'),

-- Users saving Miami properties  
('carlos.santos@email.com', 'mia_apt_201', NOW() - INTERVAL '4 days'),
('maria.rodriguez@email.com', 'mia_condo_202', NOW() - INTERVAL '2 days'),
('jose.fernandez@email.com', 'mia_house_203', NOW() - INTERVAL '7 days'),
('ana.lopez@email.com', 'mia_condo_206', NOW() - INTERVAL '5 days'),
('ricardo.morales@email.com', 'mia_house_205', NOW() - INTERVAL '3 days'),
('diego.herrera@email.com', 'mia_condo_207', NOW() - INTERVAL '8 days'),
('fernanda.silva@email.com', 'mia_house_208', NOW() - INTERVAL '1 day'),
('pablo.gutierrez@email.com', 'mia_condo_209', NOW() - INTERVAL '6 days'),
('valentina.castro@email.com', 'mia_house_210', NOW() - INTERVAL '4 days'),
('gabriel.mendoza@email.com', 'mia_condo_211', NOW() - INTERVAL '9 days'),

-- Cross-interest saves (NY users saving Miami properties)
('jonathan.kim@email.com', 'mia_house_203', NOW() - INTERVAL '5 days'),
('elena.vasquez@email.com', 'mia_condo_202', NOW() - INTERVAL '3 days'),
('dmitri.volkov@email.com', 'mia_apt_201', NOW() - INTERVAL '7 days'),
('pierre.dubois@email.com', 'mia_house_205', NOW() - INTERVAL '2 days'),

-- Cross-interest saves (Miami users saving NY properties)
('carlos.santos@email.com', 'ny_apt_176', NOW() - INTERVAL '4 days'),
('maria.rodriguez@email.com', 'ny_apt_165', NOW() - INTERVAL '6 days'),
('jose.fernandez@email.com', 'ny_apt_161', NOW() - INTERVAL '8 days'),
('ana.lopez@email.com', 'ny_apt_171', NOW() - INTERVAL '1 day'),

-- More diverse saving patterns
('alexandra.chen@email.com', 'mia_condo_206', NOW() - INTERVAL '10 days'),
('marcus.wright@email.com', 'mia_house_208', NOW() - INTERVAL '12 days'),
('sofia.rivera@email.com', 'ny_apt_180', NOW() - INTERVAL '15 days'),
('carlos.mendez@email.com', 'mia_condo_209', NOW() - INTERVAL '11 days'),
('isabelle.laurent@email.com', 'mia_house_210', NOW() - INTERVAL '13 days'),
('ricardo.morales@email.com', 'ny_apt_177', NOW() - INTERVAL '14 days'),
('diego.herrera@email.com', 'ny_apt_169', NOW() - INTERVAL '16 days'),
('fernanda.silva@email.com', 'ny_apt_175', NOW() - INTERVAL '17 days'),
('pablo.gutierrez@email.com', 'ny_apt_168', NOW() - INTERVAL '18 days'),
('valentina.castro@email.com', 'ny_apt_178', NOW() - INTERVAL '19 days');
