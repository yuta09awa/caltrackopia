import { Market } from "../types";

// Mock market data (this would come from an API in a real app)
export const mockMarkets: Record<string, Market> = {
  "6": {
    id: "6",
    name: "Downtown Farmers Market",
    type: "Grocery",
    subType: "Farmers Market",
    rating: 4.9,
    distance: "0.7 mi",
    address: "300 Market Square, San Francisco, CA",
    phone: "(415) 555-8765",
    website: "https://downtownfarmersmarket.example.com",
    openNow: true,
    hours: [
      { day: "Monday", hours: "Closed" },
      { day: "Tuesday", hours: "Closed" },
      { day: "Wednesday", hours: "Closed" },
      { day: "Thursday", hours: "Closed" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "8:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "8:00 AM - 2:00 PM" }
    ],
    price: "$$",
    dietaryOptions: ["Organic", "Local", "Seasonal"],
    cuisine: "Various",
    description: "A vibrant farmers market offering fresh, locally-grown produce, artisanal foods, and handcrafted goods from over 35 local vendors.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    seasonality: "Year-round, weekends only",
    vendorCount: 35,
    schedule: "Saturday & Sunday: 8AM - 2PM",
    vendors: [
      {
        id: "v1",
        name: "Green Valley Farms",
        type: "Produce",
        description: "Organic vegetables and fruits from our family farm.",
        popular: ["Heirloom Tomatoes", "Organic Kale", "Seasonal Berries"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v2",
        name: "Artisan Bread Co.",
        type: "Bakery",
        description: "Freshly baked sourdough, whole grain breads and pastries.",
        popular: ["Sourdough Loaf", "Seeded Rye", "Croissants"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v3",
        name: "Happy Hen Eggs",
        type: "Dairy & Eggs",
        description: "Free-range eggs and artisanal cheeses from our local farm.",
        popular: ["Free-range Eggs", "Feta Cheese", "Goat Cheese"],
        images: ["/placeholder.svg"]
      }
    ],
    events: [
      {
        id: "e1",
        name: "Cooking Demonstration",
        date: "June 5, 2024",
        time: "10:00 AM - 11:30 AM",
        description: "Learn to cook seasonal recipes with Chef Maria."
      },
      {
        id: "e2",
        name: "Kids Gardening Workshop",
        date: "June 12, 2024",
        time: "9:00 AM - 10:30 AM",
        description: "Hands-on gardening activities for children ages 5-12."
      }
    ],
    features: ["Public Restrooms", "Parking Available", "Pet Friendly", "Credit Cards Accepted"],
    highlights: [
      {
        id: "h1",
        name: "Organic Strawberries",
        type: "seasonal",
        description: "Just harvested organic strawberries, perfect for summer desserts.",
        vendor: "Green Valley Farms"
      },
      {
        id: "h2",
        name: "Artisanal Sourdough",
        type: "popular",
        description: "Our most requested bread, featuring a 100-year-old starter.",
        vendor: "Artisan Bread Co."
      },
      {
        id: "h3",
        name: "Honey Lavender Ice Cream",
        type: "new",
        description: "Made with local honey and fresh lavender.",
        vendor: "Sweet Treats"
      }
    ]
  },
  "7": {
    id: "7",
    name: "Quick Stop Convenience",
    type: "Grocery",
    subType: "Convenience Store",
    rating: 3.8,
    distance: "0.2 mi",
    address: "505 Corner St, San Francisco, CA",
    phone: "(415) 555-3456",
    website: "https://quickstop.example.com",
    openNow: true,
    hours: [
      { day: "Monday", hours: "24 hours" },
      { day: "Tuesday", hours: "24 hours" },
      { day: "Wednesday", hours: "24 hours" },
      { day: "Thursday", hours: "24 hours" },
      { day: "Friday", hours: "24 hours" },
      { day: "Saturday", hours: "24 hours" },
      { day: "Sunday", hours: "24 hours" }
    ],
    price: "$$",
    dietaryOptions: ["Quick Meals", "Snacks"],
    cuisine: "Various",
    description: "A convenient neighborhood store offering everyday essentials, quick meals, and snacks 24/7.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    sections: [
      {
        name: "Fresh Food",
        description: "Grab-and-go meals and fresh sandwiches",
        popular: ["Turkey Sandwich", "Greek Yogurt", "Fruit Cups"]
      },
      {
        name: "Snacks & Beverages",
        description: "Wide variety of drinks and snacks",
        popular: ["Energy Drinks", "Protein Bars", "Trail Mix"]
      },
      {
        name: "Essentials",
        description: "Everyday household items",
        popular: ["Paper Towels", "Cleaning Supplies", "First Aid"]
      }
    ],
    features: ["ATM", "Lottery", "Self-Checkout", "Coffee Station"],
    highlights: [
      {
        id: "h4",
        name: "Protein Energy Drink",
        type: "popular",
        description: "Customer favorite with 20g of protein per bottle."
      },
      {
        id: "h5",
        name: "Cold Brew Coffee",
        type: "new",
        description: "Freshly made in-house, available in regular and vanilla."
      }
    ]
  },
  "8": {
    id: "8",
    name: "Annual Food & Wine Festival",
    type: "Grocery",
    subType: "Food Festival",
    rating: 4.8,
    distance: "3.5 mi",
    address: "Riverfront Park, San Francisco, CA",
    phone: "(415) 555-9876",
    website: "https://foodwinefest.example.com",
    openNow: false,
    hours: [
      { day: "Festival Days", hours: "May 15-17: 11:00 AM - 8:00 PM" }
    ],
    price: "$$$",
    dietaryOptions: ["Gourmet", "Artisanal", "Vegan Options"],
    cuisine: "Various",
    description: "A three-day celebration of culinary excellence featuring local chefs, wineries, breweries, and food artisans.",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    seasonality: "Annual, May 15-17",
    vendorCount: 75,
    schedule: "May 15-17: 11AM - 8PM",
    vendors: [
      {
        id: "v4",
        name: "Bella Vineyards",
        type: "Winery",
        description: "Award-winning local wines from our family vineyard.",
        popular: ["Cabernet Sauvignon", "Chardonnay", "Rosé"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v5",
        name: "Pacific Coast Seafood",
        type: "Seafood",
        description: "Fresh, sustainable seafood dishes prepared by Chef James.",
        popular: ["Grilled Octopus", "Oysters", "Fish Tacos"],
        images: ["/placeholder.svg"]
      },
      {
        id: "v6",
        name: "Sweet Dreams Bakery",
        type: "Desserts",
        description: "Artisanal desserts, pastries and chocolates.",
        popular: ["Chocolate Truffles", "Macarons", "Fruit Tarts"],
        images: ["/placeholder.svg"]
      }
    ],
    events: [
      {
        id: "e3",
        name: "Chef Showdown",
        date: "May 15, 2024",
        time: "3:00 PM - 5:00 PM",
        description: "Watch local chefs compete in a live cooking competition."
      },
      {
        id: "e4",
        name: "Wine Tasting Masterclass",
        date: "May 16, 2024",
        time: "2:00 PM - 3:30 PM",
        description: "Learn about wine pairing and tasting techniques from sommeliers."
      },
      {
        id: "e5",
        name: "Farm to Table Talk",
        date: "May 17, 2024",
        time: "1:00 PM - 2:00 PM",
        description: "Panel discussion on sustainable farming and food practices."
      }
    ],
    features: ["Tickets Required", "Live Music", "Cooking Demonstrations", "VIP Areas"],
    highlights: [
      {
        id: "h6",
        name: "Spring Wine Collection",
        type: "seasonal",
        description: "Limited edition wines featuring spring botanicals.",
        vendor: "Bella Vineyards"
      },
      {
        id: "h7",
        name: "Truffle Tasting Experience",
        type: "new",
        description: "Sample rare seasonal truffles prepared by Chef James.",
        vendor: "Pacific Coast Seafood"
      }
    ]
  }
};
