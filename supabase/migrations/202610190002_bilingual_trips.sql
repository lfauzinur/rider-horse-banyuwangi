begin;

alter table public.trips
  add column if not exists title_en text,
  add column if not exists description_en text,
  add column if not exists short_description_en text,
  add column if not exists highlights_en text[] not null default '{}';

update public.trips set title_en = 'Sunset Beach Ride', description_en = 'Experience the magic of riding along Banyuwangi’s pristine coastline while the sunset paints the sky in golden colours. This journey follows five kilometres of beautiful shoreline with the sound of the waves beside you.', short_description_en = 'Ride along the Banyuwangi coast beneath a spectacular sunset.', highlights_en = array['Five-kilometre beach trail','Professional photos included','Light refreshments','Safety briefing'] where id = '1';
update public.trips set title_en = 'Forest Mountain Trail', description_en = 'Venture into Banyuwangi’s lush tropical forest and climb mountain trails with spectacular views. The route passes ancient banyan trees, river crossings, and striking hillside viewpoints.', short_description_en = 'Explore lush forest and beautiful mountain trails in Banyuwangi.', highlights_en = array['Mountain views','River crossings','Tropical flora and fauna','Lunch included'] where id = '2';
update public.trips set title_en = 'Golden Hour Sunset Ride', description_en = 'Our most romantic and popular ride. Cross open grassland as golden hour fills the landscape with warm light, including a celebratory drink at a Banyuwangi sunset viewpoint.', short_description_en = 'Ride across Banyuwangi grassland in the glow of golden hour.', highlights_en = array['Celebratory sunset drink','Grassland gallop','Professional drone footage','Romantic atmosphere'] where id = '3';
update public.trips set title_en = 'Private Riding Lesson', description_en = 'One-to-one instruction with a certified riding coach. Learn correct riding posture, communication with the horse, and basic dressage movements in a lesson tailored to your level and goals.', short_description_en = 'Private instruction with one of our certified riding coaches.', highlights_en = array['Certified instructor','All equipment provided','Personalised curriculum','Video analysis'] where id = '4';
update public.trips set title_en = 'Group Riding Class', description_en = 'Join fellow riders in a group class that combines guided learning with a social experience. The class covers riding fundamentals, horse care, and grooming techniques, making it ideal for team building.', short_description_en = 'An engaging and memorable group riding class.', highlights_en = array['Social atmosphere','Horse grooming basics','Group discount available','Completion certificate'] where id = '5';
update public.trips set title_en = 'Mountain Summit Trail', description_en = 'Our most challenging trip takes experienced riders toward a Banyuwangi mountain summit with panoramic 360-degree views across steep trails, dense forest, and rocky terrain.', short_description_en = 'A challenging mountain journey with panoramic 360-degree views of Banyuwangi.', highlights_en = array['Summit panorama','Full-day adventure','Gourmet lunch','Experienced guide'] where id = '6';

commit;
