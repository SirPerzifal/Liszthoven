export interface Branch {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  image: string;
  description: string;
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
}

export const companies = [
  {
    id: "company-1",
    name: "Harmony Academy - Metropolitan",
    description: "Our flagship music education network serving the greater metropolitan area"
  },
  {
    id: "company-2",
    name: "Harmony Academy - Elite",
    description: "Premium music education center specializing in advanced instruction"
  }
];

export const branches: Branch[] = [
  // Company 1 Branches
  {
    id: "branch-1",
    name: "Downtown Campus",
    companyId: "company-1",
    companyName: "Harmony Academy - Metropolitan",
    address: "123 Music Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "(555) 123-4567",
    email: "downtown@harmonyacademy.com",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "Our flagship campus in the heart of downtown, featuring state-of-the-art facilities and performance halls.",
    operatingHours: {
      weekdays: "9:00 AM - 9:00 PM",
      weekends: "10:00 AM - 6:00 PM"
    },
    coordinates: { lat: 40.7580, lng: -73.9855 },
    facilities: ["Concert Hall", "Recording Studio", "20+ Practice Rooms", "Music Library"]
  },
  {
    id: "branch-2",
    name: "Uptown Center",
    companyId: "company-1",
    companyName: "Harmony Academy - Metropolitan",
    address: "456 Harmony Boulevard",
    city: "New York",
    state: "NY",
    zipCode: "10028",
    phone: "(555) 234-5678",
    email: "uptown@harmonyacademy.com",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "Modern facility with spacious classrooms and ensemble rehearsal spaces in the uptown district.",
    operatingHours: {
      weekdays: "9:00 AM - 8:00 PM",
      weekends: "10:00 AM - 5:00 PM"
    },
    coordinates: { lat: 40.7789, lng: -73.9675 },
    facilities: ["Ensemble Room", "Digital Lab", "15 Practice Rooms", "Student Lounge"]
  },
  {
    id: "branch-3",
    name: "Brooklyn Arts Campus",
    companyId: "company-1",
    companyName: "Harmony Academy - Metropolitan",
    address: "789 Creative Street",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    phone: "(555) 345-6789",
    email: "brooklyn@harmonyacademy.com",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "Contemporary space in Brooklyn's vibrant arts district, perfect for creative musicians.",
    operatingHours: {
      weekdays: "10:00 AM - 9:00 PM",
      weekends: "11:00 AM - 7:00 PM"
    },
    coordinates: { lat: 40.6943, lng: -73.9249 },
    facilities: ["Performance Stage", "Jazz Studio", "12 Practice Rooms", "Café"]
  },
  {
    id: "branch-4",
    name: "Queens Music Hub",
    companyId: "company-1",
    companyName: "Harmony Academy - Metropolitan",
    address: "321 Symphony Lane",
    city: "Queens",
    state: "NY",
    zipCode: "11354",
    phone: "(555) 456-7890",
    email: "queens@harmonyacademy.com",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "Family-friendly location with dedicated spaces for all age groups and skill levels.",
    operatingHours: {
      weekdays: "9:00 AM - 8:00 PM",
      weekends: "9:00 AM - 6:00 PM"
    },
    coordinates: { lat: 40.7282, lng: -73.7949 },
    facilities: ["Kids Studio", "Group Rooms", "18 Practice Rooms", "Parent Lounge"]
  },
  // Company 2 Branch
  {
    id: "branch-5",
    name: "Elite Conservatory",
    companyId: "company-2",
    companyName: "Harmony Academy - Elite",
    address: "555 Prestige Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10065",
    phone: "(555) 567-8901",
    email: "elite@harmonyacademy.com",
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "Our premium conservatory offering world-class instruction in an exclusive setting with master teachers.",
    operatingHours: {
      weekdays: "8:00 AM - 10:00 PM",
      weekends: "10:00 AM - 8:00 PM"
    },
    coordinates: { lat: 40.7648, lng: -73.9653 },
    facilities: ["Grand Concert Hall", "Professional Recording Studio", "Master Class Rooms", "VIP Lounge", "Music Library"]
  }
];

export const getBranchesByCompany = (companyId: string) => {
  return branches.filter(branch => branch.companyId === companyId);
};

export const getCompanyById = (companyId: string) => {
  return companies.find(company => company.id === companyId);
};
