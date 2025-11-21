#!/bin/bash

# Script to update all image references to use Unsplash URLs via imageConfig

# Add import to files that need it
for file in components/AfrobeatsPage.tsx components/DanceClassesPage.tsx components/DancehallPage.tsx components/Classes.tsx components/Teachers.tsx components/Testimonials.tsx components/FinalCTA.tsx; do
  if [ -f "$file" ]; then
    # Check if imageConfig import exists
    if ! grep -q "imageUrls" "$file"; then
      # Add import after other imports
      sed -i "/import.*from.*types/a import { imageUrls } from '../utils/imageConfig';" "$file"
    fi
  fi
done

# Replace specific image paths with imageUrls references
# Testimonials
sed -i "s|'/images/testimonials/marco-v.jpg'|imageUrls.testimonials.marcoV|g" components/*.tsx
sed -i "s|'/images/testimonials/chloe-b.jpg'|imageUrls.testimonials.chloeB|g" components/*.tsx
sed -i "s|'/images/testimonials/fatou-d.jpg'|imageUrls.testimonials.fatouD|g" components/*.tsx
sed -i "s|'/images/testimonials/liam-s.jpg'|imageUrls.testimonials.liamS|g" components/*.tsx
sed -i "s|'/images/testimonials/sofia-r.jpg'|imageUrls.testimonials.sofiaR|g" components/*.tsx
sed -i "s|'/images/testimonials/miguel-a.jpg'|imageUrls.testimonials.miguelA|g" components/*.tsx

# Teachers
sed -i "s|'/images/teachers/isabella-king.jpg'|imageUrls.teachers.isabellaKing|g" components/*.tsx
sed -i "s|'/images/teachers/david-adeleke.jpg'|imageUrls.teachers.davidAdeleke|g" components/*.tsx
sed -i "s|'/images/teachers/carlos-rodriguez.jpg'|imageUrls.teachers.carlosRodriguez|g" components/*.tsx

# Classes
sed -i "s|'/images/classes/class-latin.jpg'|imageUrls.classes.latin|g" components/*.tsx
sed -i "s|'/images/classes/class-urban.jpg'|imageUrls.classes.urban|g" components/*.tsx
sed -i "s|'/images/classes/class-fitness.jpg'|imageUrls.classes.fitness|g" components/*.tsx
sed -i "s|'/images/classes/class-contemporary-jazz.jpg'|imageUrls.classes.contemporaryJazz|g" components/*.tsx
sed -i "s|'/images/classes/class-world.jpg'|imageUrls.classes.world|g" components/*.tsx
sed -i "s|'/images/classes/class-morning.jpg'|imageUrls.classes.morning|g" components/*.tsx

# Video posters
sed -i "s|src=\"/videos/|poster={imageUrls.videoPosters.dancehall}><source src=\"/videos/|g" components/DancehallPage.tsx
sed -i "s|src=\"/videos/afrobeats|poster={imageUrls.videoPosters.afrobeats}><source src=\"/videos/afrobeats|g" components/AfrobeatsPage.tsx
sed -i "s|src=\"/videos/final-cta|poster={imageUrls.videoPosters.finalCta}><source src=\"/videos/final-cta|g" components/FinalCTA.tsx

echo "Image references updated successfully!"
