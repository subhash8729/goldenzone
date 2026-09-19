-- =======================================================
-- Golden Zone — MySQL Seed Data
-- 1 Gram Gold-Plated Jewellery E-Commerce System
-- =======================================================

USE `kalyani_jewellers`;

-- 1. Seed Admin Account
-- Default Mobile: 7976580806
-- Default Password: Subhash29 (hashed with bcrypt 10 rounds)
INSERT INTO `admins` (`mobile_number`, `password_hash`, `full_name`)
VALUES (
  '7976580806',
  '$2a$10$KNyZ3oLFC//hn/R5cjsiC.v63NGbbQwJZTlY/.NXl8BpsS..rFmLu',
  'Subhash Dhaka (Admin)'
) ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- 2. Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `is_active`, `display_order`)
VALUES
  (1, 'Ring', 'ring', 'Premium 1 gram gold-plated rings for men', 'https://pashupati.co/cdn/shop/files/AABF7349-DF4A-401A-9286-C13FE4C790A4.jpg?v=1775994217&width=600', 1, 1),
  (2, 'Chain', 'chain', 'Heavy and sleek 1 gram gold-plated men\'s chains', 'https://pashupati.co/cdn/shop/files/528C0149-8522-4CAE-8A08-313DF350EA25.jpg?v=1786735225&width=600', 1, 2),
  (3, 'Bali', 'bali', 'Classic & modern men\'s gold-plated ear balis', 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600', 1, 3),
  (4, 'Kada', 'kada', 'Royal Rajputi & Punjabi 1 gram gold-plated kadas', 'https://pashupati.co/cdn/shop/files/47D1911A-421F-494C-BB77-72A38D9A850B.jpg?v=1779897918&width=600', 1, 4),
  (5, 'Bracelet', 'bracelet', 'Stylish linked & luxury finish men\'s bracelets', 'https://pashupati.co/cdn/shop/files/1411268E-6884-4954-B621-D33534F06B37.jpg?v=1767719486&width=300', 1, 5),
  (6, 'Other', 'other', 'Pendants, lockets and traditional accessory accents', 'https://pashupati.co/cdn/shop/files/0AA1548E-D731-4AB4-82B1-33CF24017298.jpg?v=1775372205&width=600', 1, 6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `image_url` = VALUES(`image_url`);

-- 3. Seed Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `description`)
VALUES
  ('hero_image', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop', 'Hero banner static image URL'),
  ('hero_title', 'Golden Zone', 'Homepage hero banner main heading'),
  ('hero_subtitle', 'Discover premium 1 gram gold-plated jewellery crafted to complement your style with timeless elegance.', 'Hero banner descriptive subheading'),
  ('announcement_bar', 'PREMIUM 1 GRAM GOLD-PLATED JEWELLERY | SAME DAY DISPATCH | FREE SHIPPING ON PREPAID', 'Header announcement strip text'),
  ('brand_description', 'Golden Zone brings thoughtfully designed 1 gram gold-plated jewellery for everyday and occasion wear. Timeless styling, rich aesthetics, and trustworthy craftsmanship.', 'Brand about snippet in footer and about page'),
  ('instagram_url', 'https://instagram.com/goldenzone_official', 'Instagram profile URL'),
  ('instagram_username', '@goldenzone_official', 'Instagram handle display'),
  ('whatsapp_number', '+917976580806', 'WhatsApp support mobile number'),
  ('whatsapp_contact_name', 'Rakesh Kumar', 'WhatsApp support contact person name'),
  ('whatsapp_chat_url', 'https://wa.me/917976580806?text=Hello,%20I%20want%20to%20know%20more%20about%20Golden%20Zone%20jewellery.', 'Direct WhatsApp chat link with prefilled text'),
  ('whatsapp_group_url', 'https://chat.whatsapp.com/invite/goldenzone', 'Official WhatsApp community / VIP customer group link'),
  ('contact_phone', '+917976580806', 'Main telephone contact number'),
  ('contact_email', 'support@goldenzone.com', 'Official support email address'),
  ('footer_text', '© 2026 Golden Zone. All rights reserved. Specializing exclusively in 1 Gram Gold-Plated Jewellery.', 'Footer copyright line')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- 4. Seed Demo Customer
INSERT INTO `customers` (`id`, `mobile_number`, `secondary_mobile`, `full_name`, `address`, `state`, `district`, `city`, `village`, `pincode`, `latitude`, `longitude`)
VALUES (
  1,
  '9876543210',
  '9829012345',
  'Ramesh Verma',
  'House 42, Civil Lines, Near Railway Station',
  'Rajasthan',
  'Jaipur',
  'Jaipur',
  'Civil Lines',
  '302001',
  26.91243400,
  75.78727100
) ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- 5. Seed 26 Demo Products
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `description`, `regular_price`, `discounted_price`, `is_recommended`, `is_bestseller`, `is_new_arrival`, `is_out_of_stock`, `is_active`, `tags`)
VALUES
(1, 'KAL-BAL-001', 'Signature Royal Men\'s Bali', 'signature-royal-mens-bali', 3, 'Designed for everyday styling, this 1 gram gold-plated piece combines a classic look with a lightweight and versatile design. Polished finish suitable for daily wear.', 1200.00, 900.00, 1, 1, 0, 0, 1, 'bali,mens,earring,1gram'),
(2, 'KAL-CHA-002', 'Imperial Rope Textured Men\'s Chain', 'imperial-rope-textured-mens-chain', 2, 'Crafted with precision, this 1 gram gold-plated rope chain offers a bold, masculine presence without excessive weight. Ideal for festivals and gatherings.', 1800.00, 1350.00, 1, 1, 1, 0, 1, 'chain,mens,rope,heavy'),
(3, 'KAL-BAL-003', 'Classic Micro-Cut Huggie Bali', 'classic-micro-cut-huggie-bali', 3, 'A sleek everyday 1 gram gold-plated huggie bali featuring refined micro-cut edges for a subtle gleam. Comfortable spring clasp mechanism.', 1000.00, 750.00, 1, 0, 0, 0, 1, 'bali,huggie,daily-wear'),
(4, 'KAL-RNG-004', 'Crown Signet 1 Gram Gold-Plated Ring', 'crown-signet-1-gram-gold-plated-ring', 1, 'Elevate your finger style with this sophisticated signet ring. 1 gram gold-plated alloy base with hand-buffed mirror polish.', 1100.00, 850.00, 1, 1, 0, 0, 1, 'ring,signet,crown'),
(5, 'KAL-KAD-005', 'Maharaja Chiseled Royal Kada', 'maharaja-chiseled-royal-kada', 4, 'Bold traditional wrist kada adorned with subtle geometric engravings. Superior 1 gram gold-plated finish designed for lasting charm.', 2400.00, 1800.00, 1, 1, 1, 0, 1, 'kada,heavy,maharaja'),
(6, 'KAL-BAL-006', 'Duo Grooved Contemporary Bali', 'duo-grooved-contemporary-bali', 3, 'Modern dual-groove aesthetic ear piece. Premium 1 gram gold-plating ensures an attractive hue that pairs naturally with ethnic or casual attire.', 950.00, 720.00, 0, 0, 1, 0, 1, 'bali,contemporary,groove'),
(7, 'KAL-CHA-007', 'Cuban Link Heavy Statement Chain', 'cuban-link-heavy-statement-chain', 2, 'Broad interlocking curb links with 1 gram gold-plated coating. Sturdy S-hook closure for dependable durability during festive occasions.', 2200.00, 1650.00, 1, 1, 0, 0, 1, 'chain,cuban,statement'),
(8, 'KAL-BAL-008', 'Beaded Ridge Men\'s Bali', 'beaded-ridge-mens-bali', 3, 'Traditional beaded pattern along the outer circumference. Lightweight 1 gram gold-plated build engineered for day-long ear comfort.', 1050.00, 790.00, 0, 1, 0, 0, 1, 'bali,beaded,traditional'),
(9, 'KAL-CHA-009', 'Equestrian Figaro Pattern Chain', 'equestrian-figaro-pattern-chain', 2, 'Classic Italian-inspired 3+1 Figaro chain with rich 1 gram gold-plated sheen. Versatile design suitable for open collars or shirts.', 1600.00, 1200.00, 1, 0, 0, 0, 1, 'chain,figaro,italian'),
(10, 'KAL-BAL-010', 'Sunburst Textured Men\'s Bali', 'sunburst-textured-mens-bali', 3, 'Subtle ray textured exterior with polished inner surface. 1 gram gold-plated imitation jewellery made for modern men.', 900.00, 690.00, 0, 0, 1, 0, 1, 'bali,sunburst,earring'),
(11, 'KAL-RNG-011', 'Emperor Solid Band Ring', 'emperor-solid-band-ring', 1, 'Clean, minimalist solid band ring with rounded comfort-fit edges. Finished with long-lasting 1 gram gold-plating.', 800.00, 600.00, 0, 0, 0, 0, 1, 'ring,band,minimal'),
(12, 'KAL-BAL-012', 'Hexagonal Facet Men\'s Bali', 'hexagonal-facet-mens-bali', 3, 'Distinctive multifaceted geometry that reflects light from every angle. Premium 1 gram gold-plated imitation piece.', 1150.00, 890.00, 0, 1, 0, 0, 1, 'bali,facet,modern'),
(13, 'KAL-BAL-013', 'Twisted Wire Classic Bali', 'twisted-wire-classic-bali', 3, 'Intricately twisted dual-strand wire pattern. Timeless heritage aesthetic with 1 gram gold-plated finish.', 980.00, 740.00, 1, 0, 0, 0, 1, 'bali,twisted,heritage'),
(14, 'KAL-CHA-014', 'Box Weave Dense Men\'s Chain', 'box-weave-dense-mens-chain', 2, 'Four-sided geometric box links providing uniform lustre and smooth glide over clothing. 1 gram gold-plated construction.', 1950.00, 1490.00, 1, 1, 0, 0, 1, 'chain,box-weave,dense'),
(15, 'KAL-CHA-015', 'Wheat Braid Intricate Chain', 'wheat-braid-intricate-chain', 2, 'Interwoven circular links creating a flexible wheat braid chain. Coated in radiant 1 gram gold-plated tone.', 2100.00, 1590.00, 0, 1, 1, 0, 1, 'chain,wheat,braid'),
(16, 'KAL-CHA-016', 'Snake Skin Smooth Men\'s Chain', 'snake-skin-smooth-mens-chain', 2, 'Ultra-smooth tubular flexible chain that rests naturally against the collarbone. 1 gram gold-plated finish.', 1750.00, 1320.00, 0, 0, 0, 0, 1, 'chain,snake,smooth'),
(17, 'KAL-KAD-017', 'Sardar Flat Engraved Kada', 'sardar-flat-engraved-kada', 4, 'Flat edge cylindrical kada with hand-engraved border lines. Resilient brass base with 1 gram gold-plated micro-plating.', 2500.00, 1890.00, 1, 1, 0, 0, 1, 'kada,sardar,punjabi'),
(18, 'KAL-CHA-018', 'Anchor Marine Linked Chain', 'anchor-marine-linked-chain', 2, 'Maritime anchor links featuring center support bars for extra resilience and iconic visual character. 1 gram gold-plated.', 1650.00, 1250.00, 0, 0, 1, 0, 1, 'chain,anchor,mariner'),
(19, 'KAL-RNG-019', 'Nawabi Octagonal Stone-Accent Ring', 'nawabi-octagonal-stone-accent-ring', 1, 'Regal octagonal silhouette crowned with an imitation zircon centerpiece. 1 gram gold-plated frame crafted for parties.', 1300.00, 990.00, 1, 0, 1, 0, 1, 'ring,nawabi,stone'),
(20, 'KAL-KAD-020', 'Bahubali Textured Heavy Kada', 'bahubali-textured-heavy-kada', 4, 'Weighty statement wrist ornament with deep diamond knurling. Supreme 1 gram gold-plated appearance.', 2800.00, 2100.00, 1, 1, 0, 0, 1, 'kada,heavy,bahubali'),
(21, 'KAL-RNG-021', 'Lion Crest Braided Edge Ring', 'lion-crest-braided-edge-ring', 1, 'Embossed lion face motif symbolizing power and courage, bounded by micro braided borders. 1 gram gold-plated.', 1250.00, 950.00, 0, 1, 0, 0, 1, 'ring,lion,braided'),
(22, 'KAL-BRC-022', 'Presidential Link Men\'s Bracelet', 'presidential-link-mens-bracelet', 5, 'Structured three-piece link bracelet with a fold-over safety latch. Gleaming 1 gram gold-plated polish.', 1800.00, 1390.00, 1, 1, 1, 0, 1, 'bracelet,presidential,luxury'),
(23, 'KAL-RNG-023', 'Sun Crest Textured Vintage Ring', 'sun-crest-textured-vintage-ring', 1, 'Vintage-inspired sunbeam engraving over a solid contoured dome. 1 gram gold-plated imitation piece.', 1050.00, 790.00, 0, 0, 0, 0, 1, 'ring,sun,vintage'),
(24, 'KAL-KAD-024', 'Royal Trishul Engraved Kada', 'royal-trishul-engraved-kada', 4, 'Openable cuff kada featuring symbolic auspicious engraving. Rich 1 gram gold-plated luster.', 2600.00, 1990.00, 0, 1, 0, 0, 1, 'kada,trishul,cuff'),
(25, 'KAL-BRC-025', 'Panther Mesh Flexible Bracelet', 'panther-mesh-flexible-bracelet', 5, 'Supple interwoven mesh that drapes fluidly on the wrist. 1 gram gold-plated imitation jewellery for formal evening wear.', 1950.00, 1480.00, 1, 0, 1, 0, 1, 'bracelet,panther,mesh'),
(26, 'KAL-BRC-026', 'Cuban ID Plate Men\'s Bracelet', 'cuban-id-plate-mens-bracelet', 5, 'Polished rectangular plate centered between hefty curb links. Superior 1 gram gold-plated shine.', 1700.00, 1290.00, 0, 1, 0, 0, 1, 'bracelet,cuban,id-plate')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `regular_price` = VALUES(`regular_price`), `discounted_price` = VALUES(`discounted_price`);

-- 6. Seed Product Images (up to 5 images per product for demo gallery)
-- Product 1 to 26 images using the 26 provided URLs
INSERT INTO `product_images` (`product_id`, `image_url`, `image_order`) VALUES
(1, 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600', 1),
(1, 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600', 2),
(1, 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600', 3),
(1, 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600', 4),
(1, 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600', 5),

(2, 'https://pashupati.co/cdn/shop/files/528C0149-8522-4CAE-8A08-313DF350EA25.jpg?v=1786735225&width=600', 1),
(2, 'https://pashupati.co/cdn/shop/files/528C0149-8522-4CAE-8A08-313DF350EA25.jpg?v=1786735225&width=600', 2),
(2, 'https://pashupati.co/cdn/shop/files/528C0149-8522-4CAE-8A08-313DF350EA25.jpg?v=1786735225&width=600', 3),
(2, 'https://pashupati.co/cdn/shop/files/528C0149-8522-4CAE-8A08-313DF350EA25.jpg?v=1786735225&width=600', 4),

(3, 'https://pashupati.co/cdn/shop/files/863F9661-D3A8-4320-9519-3D7160027FB0.jpg?v=1786261783&width=600', 1),
(3, 'https://pashupati.co/cdn/shop/files/863F9661-D3A8-4320-9519-3D7160027FB0.jpg?v=1786261783&width=600', 2),
(3, 'https://pashupati.co/cdn/shop/files/863F9661-D3A8-4320-9519-3D7160027FB0.jpg?v=1786261783&width=600', 3),

(4, 'https://pashupati.co/cdn/shop/files/AABF7349-DF4A-401A-9286-C13FE4C790A4.jpg?v=1775994217&width=600', 1),
(4, 'https://pashupati.co/cdn/shop/files/AABF7349-DF4A-401A-9286-C13FE4C790A4.jpg?v=1775994217&width=600', 2),
(4, 'https://pashupati.co/cdn/shop/files/AABF7349-DF4A-401A-9286-C13FE4C790A4.jpg?v=1775994217&width=600', 3),

(5, 'https://pashupati.co/cdn/shop/files/47D1911A-421F-494C-BB77-72A38D9A850B.jpg?v=1779897918&width=600', 1),
(5, 'https://pashupati.co/cdn/shop/files/47D1911A-421F-494C-BB77-72A38D9A850B.jpg?v=1779897918&width=600', 2),
(5, 'https://pashupati.co/cdn/shop/files/47D1911A-421F-494C-BB77-72A38D9A850B.jpg?v=1779897918&width=600', 3),

(6, 'https://pashupati.co/cdn/shop/files/0AA1548E-D731-4AB4-82B1-33CF24017298.jpg?v=1775372205&width=600', 1),
(6, 'https://pashupati.co/cdn/shop/files/0AA1548E-D731-4AB4-82B1-33CF24017298.jpg?v=1775372205&width=600', 2),

(7, 'https://pashupati.co/cdn/shop/files/A4424170-FA13-4BC2-BEAD-9FE372583A6C.jpg?v=1783531252&width=600', 1),
(7, 'https://pashupati.co/cdn/shop/files/A4424170-FA13-4BC2-BEAD-9FE372583A6C.jpg?v=1783531252&width=600', 2),
(7, 'https://pashupati.co/cdn/shop/files/A4424170-FA13-4BC2-BEAD-9FE372583A6C.jpg?v=1783531252&width=600', 3),

(8, 'https://pashupati.co/cdn/shop/files/87533577-963A-416F-B869-94B7F8A20D46.jpg?v=1774814082&width=600', 1),
(8, 'https://pashupati.co/cdn/shop/files/87533577-963A-416F-B869-94B7F8A20D46.jpg?v=1774814082&width=600', 2),

(9, 'https://pashupati.co/cdn/shop/files/A9F1159A-BCE1-4DCE-86A7-150706703DA7.jpg?v=1782913450&width=600', 1),
(9, 'https://pashupati.co/cdn/shop/files/A9F1159A-BCE1-4DCE-86A7-150706703DA7.jpg?v=1782913450&width=600', 2),

(10, 'https://pashupati.co/cdn/shop/files/D88419D4-B116-4CD0-9E8F-16AED344CEB0.jpg?v=1785156176&width=300', 1),
(10, 'https://pashupati.co/cdn/shop/files/D88419D4-B116-4CD0-9E8F-16AED344CEB0.jpg?v=1785156176&width=300', 2),

(11, 'https://pashupati.co/cdn/shop/files/E7B5D91E-5C71-4993-8F87-7EB2F07208BD.jpg?v=1784996113&width=300', 1),
(11, 'https://pashupati.co/cdn/shop/files/E7B5D91E-5C71-4993-8F87-7EB2F07208BD.jpg?v=1784996113&width=300', 2),

(12, 'https://pashupati.co/cdn/shop/files/F493006D-6ACE-4A67-B15C-929C51FD2F12.jpg?v=1785156690&width=300', 1),
(12, 'https://pashupati.co/cdn/shop/files/F493006D-6ACE-4A67-B15C-929C51FD2F12.jpg?v=1785156690&width=300', 2),

(13, 'https://pashupati.co/cdn/shop/files/50D36501-B59C-47B2-A5D4-C8D510E1EDA0.jpg?v=1785156869&width=300', 1),
(13, 'https://pashupati.co/cdn/shop/files/50D36501-B59C-47B2-A5D4-C8D510E1EDA0.jpg?v=1785156869&width=300', 2),

(14, 'https://pashupati.co/cdn/shop/files/5395B52F-0622-4445-B37B-74A174264323.jpg?v=1788340450&width=300', 1),
(14, 'https://pashupati.co/cdn/shop/files/5395B52F-0622-4445-B37B-74A174264323.jpg?v=1788340450&width=300', 2),

(15, 'https://pashupati.co/cdn/shop/files/8D66B0F0-2BA7-45FB-BF15-B64E3120D12E.jpg?v=1788337818&width=300', 1),
(15, 'https://pashupati.co/cdn/shop/files/8D66B0F0-2BA7-45FB-BF15-B64E3120D12E.jpg?v=1788337818&width=300', 2),

(16, 'https://pashupati.co/cdn/shop/files/7788C441-D99C-42C8-9E88-56321FE3E73B.jpg?v=1788376111&width=300', 1),
(16, 'https://pashupati.co/cdn/shop/files/7788C441-D99C-42C8-9E88-56321FE3E73B.jpg?v=1788376111&width=300', 2),

(17, 'https://pashupati.co/cdn/shop/files/BE301A7A-BFEA-426A-BBE4-84098B65FEB8.jpg?v=1767720184&width=300', 1),
(17, 'https://pashupati.co/cdn/shop/files/BE301A7A-BFEA-426A-BBE4-84098B65FEB8.jpg?v=1767720184&width=300', 2),

(18, 'https://pashupati.co/cdn/shop/files/87E9F89F-EDF7-45BC-942A-C2BE5B88D2EB.jpg?v=1774688493&width=300', 1),
(18, 'https://pashupati.co/cdn/shop/files/87E9F89F-EDF7-45BC-942A-C2BE5B88D2EB.jpg?v=1774688493&width=300', 2),

(19, 'https://pashupati.co/cdn/shop/files/FDFC3419-880D-4F26-858D-D9A5E6748ACE.jpg?v=1767719486&width=300', 1),
(19, 'https://pashupati.co/cdn/shop/files/FDFC3419-880D-4F26-858D-D9A5E6748ACE.jpg?v=1767719486&width=300', 2),

(20, 'https://pashupati.co/cdn/shop/files/2AD6E4D6-681D-497F-87CD-308262AA5453.jpg?v=1767720184&width=300', 1),
(20, 'https://pashupati.co/cdn/shop/files/2AD6E4D6-681D-497F-87CD-308262AA5453.jpg?v=1767720184&width=300', 2),

(21, 'https://pashupati.co/cdn/shop/files/C7FCF413-B61D-4CA7-B6AB-214C5939896E.jpg?v=1767795224&width=300', 1),
(21, 'https://pashupati.co/cdn/shop/files/C7FCF413-B61D-4CA7-B6AB-214C5939896E.jpg?v=1767795224&width=300', 2),

(22, 'https://pashupati.co/cdn/shop/files/1411268E-6884-4954-B621-D33534F06B37.jpg?v=1767719486&width=300', 1),
(22, 'https://pashupati.co/cdn/shop/files/1411268E-6884-4954-B621-D33534F06B37.jpg?v=1767719486&width=300', 2),

(23, 'https://pashupati.co/cdn/shop/files/3171DC67-50A5-43DF-9945-DE6987BE0C92.jpg?v=1767794623&width=300', 1),
(23, 'https://pashupati.co/cdn/shop/files/3171DC67-50A5-43DF-9945-DE6987BE0C92.jpg?v=1767794623&width=300', 2),

(24, 'https://pashupati.co/cdn/shop/files/42F7B8B2-195F-450D-BAF7-5B89C3C30656.jpg?v=1767719486&width=300', 1),
(24, 'https://pashupati.co/cdn/shop/files/42F7B8B2-195F-450D-BAF7-5B89C3C30656.jpg?v=1767719486&width=300', 2),

(25, 'https://pashupati.co/cdn/shop/files/2CEBA775-B0F0-4CF5-89AE-D381305A8AB7.jpg?v=1767794224&width=300', 1),
(25, 'https://pashupati.co/cdn/shop/files/2CEBA775-B0F0-4CF5-89AE-D381305A8AB7.jpg?v=1767794224&width=300', 2),

(26, 'https://pashupati.co/cdn/shop/files/749DDE54-E10E-405E-93B5-1D664059F8FC.jpg?v=1767793689&width=300', 1),
(26, 'https://pashupati.co/cdn/shop/files/749DDE54-E10E-405E-93B5-1D664059F8FC.jpg?v=1767793689&width=300', 2);

-- 7. Seed Reviews
INSERT INTO `reviews` (`product_id`, `customer_name`, `rating`, `review_text`, `image_url`, `is_approved`)
VALUES
(1, 'Vikram Rathore', 5, 'Superb finish! Looks very premium and feels like pure gold. Very comfortable for everyday wear.', 'https://pashupati.co/cdn/shop/files/B35A6888-45CE-4752-A4A2-7951A478EA61.jpg?v=1775994142&width=600', 1),
(1, 'Bansil Gadara', 5, 'Worth the price! Delivered in 2 days. The 1 gram gold plating finish is very neat and clean.', NULL, 1),
(2, 'Amit Sharma', 5, 'Heavy look chain! The rope design shines naturally under sunlight. Good packaging too.', 'https://pashupati.co/cdn/shop/files/528C0149-8522-4CAE-8A08-313DF350EA25.jpg?v=1786735225&width=600', 1),
(3, 'Naveen Kumar', 4, 'Nice compact bali. Lightweight and does not irritate skin.', NULL, 1),
(5, 'Suresh Choudhary', 5, 'The Maharaja kada is just fantastic. Heavy weight feel and the engraving looks royal.', 'https://pashupati.co/cdn/shop/files/47D1911A-421F-494C-BB77-72A38D9A850B.jpg?v=1779897918&width=600', 1),
(7, 'Deepak Soni', 5, 'Best 1 gram gold-plated Cuban chain I have bought online. Highly recommended!', NULL, 1);

