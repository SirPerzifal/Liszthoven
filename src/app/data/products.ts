export interface Review {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  inStock: boolean;
  brand: string;
  sku: string;
  description: string;
  specifications: Record<string, string>;
  reviewList: Review[];
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Premium Acoustic Guitar",
    category: "Guitars",
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1556379118-7034d926d258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1556379118-7034d926d258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1558098329-a11cff621064?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Harmony Pro",
    sku: "GT-001-PA",
    description: "Experience the rich, warm tones of our Premium Acoustic Guitar. Handcrafted with a solid Sitka spruce top and rosewood back and sides, this guitar delivers exceptional resonance and projection. Perfect for both advancing students and professional musicians seeking studio-quality sound.",
    specifications: {
      "Body Style": "Dreadnought",
      "Top Wood": "Solid Sitka Spruce",
      "Back & Sides": "Rosewood",
      "Neck": "Mahogany",
      "Scale Length": '25.4"',
      "Strings": "Steel",
      "Finish": "Gloss Natural",
      "Includes": "Hard Case, Picks, Strap"
    },
    reviewList: [
      { author: "James R.", rating: 5, date: "2024-03-15", comment: "Incredible sound quality for the price. The spruce top has excellent resonance and the neck action is perfect right out of the box." },
      { author: "Sarah M.", rating: 5, date: "2024-02-28", comment: "My students love practicing on this guitar. Very well made, the finish is flawless." },
      { author: "David L.", rating: 4, date: "2024-01-10", comment: "Great instrument, setup was perfect. The tone is warm and balanced across all strings." }
    ]
  },
  {
    id: 2,
    name: "88-Key Digital Piano",
    category: "Keyboards",
    price: 1299,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Yamaha",
    sku: "KB-002-88",
    description: "The ultimate 88-key digital piano featuring weighted hammer action keys that replicate the feel of an acoustic grand piano. With 256-note polyphony and premium stereo sound samples, this piano is perfect for serious students and professional performers alike.",
    specifications: {
      "Keys": "88 Weighted Hammer Action",
      "Polyphony": "256 Notes",
      "Voices": "128 Built-in",
      "Connectivity": "USB, MIDI, Aux",
      "Pedals": "3 Included",
      "Dimensions": '52" x 15" x 30"',
      "Weight": "68 lbs",
      "Includes": "Bench, Sustain Pedal, Music Stand"
    },
    reviewList: [
      { author: "Elena V.", rating: 5, date: "2024-04-01", comment: "The weighted keys feel almost identical to an acoustic grand. Highly recommend for serious students." },
      { author: "Thomas K.", rating: 5, date: "2024-03-20", comment: "Outstanding build quality. The sound samples are incredibly realistic." },
      { author: "Maria C.", rating: 4, date: "2024-02-15", comment: "Beautiful piano, my daughter uses it daily for practice. Great purchase!" }
    ]
  },
  {
    id: 3,
    name: "Professional Violin Set",
    category: "Strings",
    price: 749,
    originalPrice: 899,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1624367171718-14026220ee35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1624367171718-14026220ee35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Cremona",
    sku: "VN-003-PRO",
    description: "A handcrafted professional violin featuring a carved spruce top and maple back and sides, aged for optimal tonal quality. This complete set includes everything a violinist needs to perform at the highest level, from conservatory to concert hall.",
    specifications: {
      "Size": "4/4 Full Size",
      "Top": "Carved Spruce",
      "Back & Sides": "Flamed Maple",
      "Bow": "Pernambuco Wood",
      "Strings": "Dominant Strings",
      "Finish": "Oil Varnish",
      "Bridge": "Aubert Fitted",
      "Includes": "Case, Bow, Rosin, Shoulder Rest"
    },
    reviewList: [
      { author: "Alexis N.", rating: 5, date: "2024-03-10", comment: "Exceptional tone for this price range. The oil varnish finish is gorgeous." },
      { author: "Prof. Lee", rating: 4, date: "2024-01-25", comment: "I recommend this to my intermediate students. Good projection and warm sound." },
      { author: "Sophia B.", rating: 5, date: "2023-12-05", comment: "Upgraded from a student violin and the difference is night and day. Wonderful instrument." }
    ]
  },
  {
    id: 4,
    name: "5-Piece Drum Kit",
    category: "Percussion",
    price: 1599,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1519508234439-4f23643125c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Pearl",
    sku: "DR-004-5PC",
    description: "Professional 5-piece drum kit built for serious drummers. Featuring birch shells for a bright, punchy attack, this kit delivers the cutting tone needed for live performances and studio recordings. Includes all hardware and cymbals needed to start playing immediately.",
    specifications: {
      "Configuration": "5-Piece",
      "Shell Material": "Birch",
      "Bass Drum": '22" x 18"',
      "Snare": '14" x 5.5"',
      "Tom Toms": '10", 12", 16"',
      "Cymbals": "14\" Hi-Hat, 16\" Crash, 20\" Ride",
      "Hardware": "Full Hardware Pack",
      "Includes": "Throne, Sticks, Pedal"
    },
    reviewList: [
      { author: "Marcus J.", rating: 5, date: "2024-04-10", comment: "Perfect kit for rehearsals and gigs. The birch shells have amazing projection." },
      { author: "Chris T.", rating: 5, date: "2024-03-05", comment: "Assembled in 2 hours, sounds incredible. The hardware is solid and sturdy." },
      { author: "Drum Teacher", rating: 4, date: "2024-02-20", comment: "I bought three of these for our practice rooms. Great value for the money." }
    ]
  },
  {
    id: 5,
    name: "Electric Guitar - Stratocaster Style",
    category: "Guitars",
    price: 699,
    rating: 4.6,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1563357989-f6cdbbae76cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1563357989-f6cdbbae76cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Fender",
    sku: "GT-005-ES",
    description: "An iconic Stratocaster-style electric guitar with a classic alder body and maple neck. Featuring three single-coil pickups and a synchronized tremolo bridge, this guitar delivers the legendary bright, cutting tones that have defined decades of popular music.",
    specifications: {
      "Body": "Alder",
      "Neck": "Maple C-Shape",
      "Fretboard": "Rosewood, 9.5\" Radius",
      "Frets": "21 Medium Jumbo",
      "Pickups": "3 Single-Coil",
      "Controls": "Volume, 2x Tone, 5-Way Switch",
      "Bridge": "Synchronized Tremolo",
      "Color Options": "Sunburst, Black, White, Blue"
    },
    reviewList: [
      { author: "Rock Player", rating: 5, date: "2024-04-15", comment: "Versatile guitar that sounds great clean or with distortion. The neck feels amazing." },
      { author: "Jake W.", rating: 4, date: "2024-03-28", comment: "Good setup from the factory. Plays well and looks stunning in sunburst." },
      { author: "Instructor A.", rating: 5, date: "2024-02-10", comment: "Recommended for intermediate students. Great value and excellent playability." }
    ]
  },
  {
    id: 6,
    name: "Classical Guitar",
    category: "Guitars",
    price: 549,
    rating: 4.5,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1571992164651-76489ce4ae35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1571992164651-76489ce4ae35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: false,
    brand: "Alhambra",
    sku: "GT-006-CL",
    description: "A beautifully crafted classical guitar with a cedar top and rosewood back and sides. Featuring nylon strings and a traditional fan bracing pattern, this guitar produces the warm, mellow tones essential for classical and flamenco repertoire.",
    specifications: {
      "Body Style": "Classical",
      "Top": "Cedar",
      "Back & Sides": "Rosewood",
      "Neck": "Cedar/Mahogany",
      "Strings": "Nylon",
      "Nut Width": '52mm',
      "Scale Length": '650mm',
      "Includes": "Gig Bag"
    },
    reviewList: [
      { author: "Classical Purist", rating: 5, date: "2024-01-20", comment: "The cedar top produces a wonderfully warm and resonant sound. Perfect for classical repertoire." },
      { author: "Flamenco Player", rating: 4, date: "2023-11-15", comment: "Excellent projection and bright treble response. Well worth the investment." },
      { author: "Music Teacher", rating: 4, date: "2023-10-08", comment: "A solid choice for students transitioning to classical guitar. Good intonation." }
    ]
  },
  {
    id: 7,
    name: "MIDI Keyboard Controller",
    category: "Keyboards",
    price: 399,
    rating: 4.7,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Arturia",
    sku: "KB-007-MIDI",
    description: "A professional 49-key MIDI keyboard controller designed for producers and performers. Featuring semi-weighted keys, 16 performance pads, 8 encoders, and seamless DAW integration, this controller unlocks endless creative possibilities in the studio or on stage.",
    specifications: {
      "Keys": "49 Semi-Weighted",
      "Pads": "16 RGB Velocity-Sensitive",
      "Encoders": "8 Endless",
      "Connectivity": "USB-C, MIDI In/Out",
      "Software Included": "Arturia Analog Lab",
      "DAW Support": "All Major DAWs",
      "Power": "USB Bus Powered",
      "Dimensions": '33" x 10" x 3"'
    },
    reviewList: [
      { author: "Producer X", rating: 5, date: "2024-04-20", comment: "Best MIDI controller at this price point. The pads are responsive and the encoders feel great." },
      { author: "Studio Engineer", rating: 5, date: "2024-03-15", comment: "Use it daily in my studio. The Arturia software bundle alone is worth the price." },
      { author: "Beat Maker", rating: 4, date: "2024-02-28", comment: "Solid build quality and excellent key action. Plug and play with no drivers needed." }
    ]
  },
  {
    id: 8,
    name: "Professional Cello",
    category: "Strings",
    price: 2199,
    rating: 4.9,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Eastman",
    sku: "VC-008-PRO",
    description: "A premium handcrafted cello with a carved spruce top and flamed maple back and sides. Aged with a rich amber oil varnish, this instrument produces a deep, singing tone with exceptional dynamic range — ideal for conservatory students and professional cellists.",
    specifications: {
      "Size": "4/4 Full Size",
      "Top": "Carved Spruce",
      "Back & Sides": "Flamed Maple",
      "Bow": "Brazilwood",
      "Strings": "Larsen",
      "Varnish": "Amber Oil",
      "Endpin": "Adjustable",
      "Includes": "Hard Case, Bow, Rosin"
    },
    reviewList: [
      { author: "Concert Cellist", rating: 5, date: "2024-03-01", comment: "Exceptional projection and warmth. The flamed maple is absolutely stunning." },
      { author: "Orchestra Member", rating: 5, date: "2024-01-14", comment: "I played many cellos before choosing this one. It sings beautifully in every register." },
      { author: "Cello Teacher", rating: 5, date: "2023-12-20", comment: "Recommended for advanced students. Excellent value for a professional-quality instrument." }
    ]
  },
  {
    id: 9,
    name: "Bass Guitar - 4-String",
    category: "Guitars",
    price: 649,
    rating: 4.6,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1506972563ebb-4cfe77baf572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1506972563ebb-4cfe77baf572?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Fender",
    sku: "BG-009-4S",
    description: "A classic 4-string bass guitar with an alder body and jazz bass-style dual pickups. Delivering deep, punchy lows and a versatile mid-range character, this bass cuts through any mix and handles everything from R&B to rock to jazz with equal authority.",
    specifications: {
      "Body": "Alder",
      "Neck": "Maple",
      "Fretboard": "Rosewood",
      "Frets": "20",
      "Pickups": "2x Jazz Single-Coil",
      "Controls": "Volume, Volume, Tone",
      "Scale Length": '34"',
      "Includes": "Gig Bag, Strap, Cable"
    },
    reviewList: [
      { author: "Groove Master", rating: 5, date: "2024-04-05", comment: "Perfect bass for any style. The dual pickups give so much tonal versatility." },
      { author: "Band Bassist", rating: 4, date: "2024-02-22", comment: "Solid and reliable. Great neck feel and cuts through the mix easily." },
      { author: "Bass Instructor", rating: 5, date: "2024-01-18", comment: "Recommend to all my students. Excellent playability and build quality." }
    ]
  },
  {
    id: 10,
    name: "Electronic Drum Set",
    category: "Percussion",
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 103,
    image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1571327073757-71d13c24de30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Roland",
    sku: "DR-010-EDRM",
    description: "A complete electronic drum kit perfect for home practice and apartment drummers. Featuring mesh-head pads for a realistic and near-silent playing experience, with hundreds of built-in sounds and patterns to keep practice sessions engaging and productive.",
    specifications: {
      "Pads": "9 Mesh-Head Pads",
      "Cymbals": "3 Cymbal Pads + Hi-Hat",
      "Module": "Roland TD-07",
      "Sounds": "650+ Preset Sounds",
      "Patterns": "60 Training Patterns",
      "Connectivity": "USB, Aux In/Out",
      "Headphone Jack": "Yes",
      "Includes": "Module, Hardware, Sticks"
    },
    reviewList: [
      { author: "Apartment Drummer", rating: 5, date: "2024-04-18", comment: "My neighbors can barely hear me! The mesh pads feel very natural to play." },
      { author: "Practice Drummer", rating: 5, date: "2024-03-10", comment: "Outstanding module with great sounds. The training features are super helpful." },
      { author: "Home Studio", rating: 4, date: "2024-02-05", comment: "Great for recording. Connects easily to my DAW via USB. Highly recommended." }
    ]
  },
  {
    id: 11,
    name: "Upright Piano",
    category: "Keyboards",
    price: 3999,
    rating: 5.0,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Steinway",
    sku: "UP-011-VERT",
    description: "A masterpiece of German craftsmanship, this upright piano features a spruce soundboard and hand-wound bass strings for a rich, resonant tone that fills any room. With decades of potential playing life and beautiful polished ebony finish, this is a true heirloom instrument.",
    specifications: {
      "Type": "Vertical/Upright",
      "Keys": "88",
      "Height": '50"',
      "Soundboard": "Solid Spruce",
      "Strings": "Hand-Wound Bass",
      "Action": "Hammered Felt",
      "Finish": "Polished Ebony",
      "Includes": "Bench, Tuning, White Glove Delivery"
    },
    reviewList: [
      { author: "Concert Pianist", rating: 5, date: "2024-02-28", comment: "The touch is exquisite and the tone is rich and full. A true instrument of distinction." },
      { author: "Music Professor", rating: 5, date: "2024-01-20", comment: "Purchased for our studio. Students immediately notice the difference in touch and tone." },
      { author: "Home Musician", rating: 5, date: "2023-12-15", comment: "Worth every penny. It's become the centerpiece of our home and sounds magnificent." }
    ]
  },
  {
    id: 12,
    name: "Student Violin Outfit",
    category: "Strings",
    price: 299,
    rating: 4.4,
    reviews: 176,
    image: "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    inStock: true,
    brand: "Cecilio",
    sku: "VN-012-STU",
    description: "The perfect starter violin outfit for young and adult beginners. This complete package includes a quality student violin with a spruce top, a lightweight brazilwood bow, rosin, and a durable foam-lined case — everything needed to begin the journey into string music.",
    specifications: {
      "Sizes Available": "1/4, 1/2, 3/4, 4/4",
      "Top": "Spruce",
      "Back & Sides": "Maple",
      "Bow": "Brazilwood",
      "Strings": "D'Addario Prelude",
      "Finish": "Gloss Varnish",
      "Age Range": "4 years and up",
      "Includes": "Case, Bow, Rosin, Shoulder Rest, Extra Strings"
    },
    reviewList: [
      { author: "New Parent", rating: 4, date: "2024-04-22", comment: "Perfect starter for my 7-year-old. The teacher said setup was good and it sounds nice for a beginner." },
      { author: "Adult Beginner", rating: 5, date: "2024-03-30", comment: "Started lessons last month with this violin. Very happy with the quality for the price." },
      { author: "Music Teacher", rating: 4, date: "2024-02-14", comment: "I recommend this to all my beginner students. Reliable, well-made, and affordable." }
    ]
  }
];
