-- Update posts with actual working images from placeholder service
UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop'
WHERE content LIKE '%hackathon%' OR content LIKE '%Hackathon%';

UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop'
WHERE content LIKE '%conference%' OR content LIKE '%tech talk%';

UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop'
WHERE content LIKE '%workshop%' OR content LIKE '%Workshop%';

UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop'
WHERE content LIKE '%graduation%' OR content LIKE '%ceremony%';

UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'
WHERE content LIKE '%team%' OR content LIKE '%group%';

UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop'
WHERE content LIKE '%startup%' OR content LIKE '%business%';

UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop'
WHERE content LIKE '%coding%' OR content LIKE '%programming%' OR content LIKE '%project%';

UPDATE posts 
SET image_url = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop'
WHERE content LIKE '%internship%' OR content LIKE '%career%';

-- For any remaining posts without images, add diverse student/campus images
UPDATE posts 
SET image_url = CASE 
  WHEN RANDOM() < 0.2 THEN 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop'
  WHEN RANDOM() < 0.4 THEN 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop'
  WHEN RANDOM() < 0.6 THEN 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&h=600&fit=crop'
  WHEN RANDOM() < 0.8 THEN 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&h=600&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop'
END
WHERE image_url IS NULL AND RANDOM() < 0.7;
