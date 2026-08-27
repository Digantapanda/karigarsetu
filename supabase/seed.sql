-- Seeds craft_categories so the registration form's dropdowns work immediately
-- after migrations run. Matches lib/domain/craft-categories.ts.

insert into craft_categories (id, name, slug) values
  ('handloom', 'Handloom', 'handloom'),
  ('pottery', 'Pottery', 'pottery'),
  ('dokra', 'Dokra', 'dokra'),
  ('wood-craft', 'Wood Craft', 'wood-craft'),
  ('bamboo-craft', 'Bamboo Craft', 'bamboo-craft'),
  ('metal-craft', 'Metal Craft', 'metal-craft'),
  ('textile', 'Textile', 'textile'),
  ('embroidery', 'Embroidery', 'embroidery'),
  ('jewellery', 'Jewellery', 'jewellery'),
  ('painting', 'Painting', 'painting'),
  ('leather-craft', 'Leather Craft', 'leather-craft'),
  ('stone-craft', 'Stone Craft', 'stone-craft'),
  ('terracotta', 'Terracotta', 'terracotta'),
  ('cane-craft', 'Cane Craft', 'cane-craft'),
  ('other', 'Other', 'other')
on conflict (id) do nothing;
