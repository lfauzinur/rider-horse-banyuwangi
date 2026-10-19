begin;

alter table public.articles
  add column if not exists title_en text,
  add column if not exists excerpt_en text,
  add column if not exists content_en text;

update public.articles
set
  title_en = 'A First-Time Rider’s Guide',
  excerpt_en = 'Simple preparation for a safe, comfortable, and enjoyable first riding experience.',
  content_en = E'Your first ride does not have to feel intimidating. Arrive 20–30 minutes early so you have enough time to meet your instructor, become familiar with the equipment, and get to know the horse that will accompany you.\n\nWear flexible long trousers, closed shoes with a low heel, and avoid accessories that could catch on equipment. A riding helmet must be worn throughout the session, even when you are only practising in the arena.\n\nMost importantly, stay calm and follow your instructor’s guidance. Horses are highly sensitive to body language. Steady breathing, gentle movements, and consistent communication help build trust from the very beginning.'
where id = 'article-1';

update public.articles
set
  title_en = 'Preparing for a Sunset Beach Ride',
  excerpt_en = 'An equipment checklist and the best timing for a horseback journey along the Banyuwangi coast.',
  content_en = E'A Sunset Beach Ride combines horseback riding with the rapidly changing light of the coast. Choose neutral-coloured clothing, apply sunscreen, and bring a light outer layer because the sea breeze can feel cooler toward evening.\n\nKeep personal items in a small, secure bag. Your phone should have a safety strap and only be used when the instructor confirms that conditions are safe for photos.\n\nOur team monitors the weather, tides, and temperament of every horse before departure. Schedules may therefore be adjusted to protect every rider and preserve the quality of the experience.'
where id = 'article-2';

update public.articles
set
  title_en = 'How to Build Trust with a Horse',
  excerpt_en = 'Learn to read equine body language and communicate calmly before getting into the saddle.',
  content_en = E'A strong relationship with a horse begins before you are in the saddle. Approach from a direction the horse can see, allow it to recognise your presence, then follow the handler’s guidance when touching its neck or shoulder.\n\nNotice the position of the ears and head, as well as tension in the body. Ears that move actively usually mean the horse is observing its surroundings, while a relaxed body shows that it feels safe.\n\nConsistency is essential. Give clear cues, allow time for the horse to respond, and avoid sudden movements. Trust grows through small, positive interactions repeated over time.'
where id = 'article-3';

commit;
