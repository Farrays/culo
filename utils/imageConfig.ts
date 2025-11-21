// Temporary Unsplash image URLs - Replace with real images before production
// All images are optimized with WebP auto-format and proper dimensions

export const imageUrls = {
  classes: {
    latin:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop&q=80&auto=format',
    urban:
      'https://images.unsplash.com/photo-1547153760-18fc9c88c1c8?w=800&h=600&fit=crop&q=80&auto=format',
    fitness:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80&auto=format',
    contemporaryJazz:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=600&fit=crop&q=80&auto=format',
    world:
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop&q=80&auto=format',
    morning:
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop&q=80&auto=format',
  },
  teachers: {
    isabellaKing:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&q=80&auto=format',
    davidAdeleke:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80&auto=format',
    carlosRodriguez:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80&auto=format',
  },
  testimonials: {
    marcoV:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80&auto=format',
    chloeB:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80&auto=format',
    fatouD:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80&auto=format',
    liamS:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80&auto=format',
    sofiaR:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&q=80&auto=format',
    miguelA:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&q=80&auto=format',
  },
  videoPosters: {
    yunaisyPerformance:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&h=1080&fit=crop&q=80&auto=format',
    finalCta:
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1920&h=1080&fit=crop&q=80&auto=format',
    bachata:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&h=1080&fit=crop&q=80&auto=format',
    dancehall:
      'https://images.unsplash.com/photo-1547153760-18fc9c88c1c8?w=1920&h=1080&fit=crop&q=80&auto=format',
  },
};

// Helper function to get image URL with fallback
export const getImageUrl = (category: keyof typeof imageUrls, name: string): string => {
  const categoryObj = imageUrls[category] as Record<string, string>;
  return categoryObj[name] || '';
};
