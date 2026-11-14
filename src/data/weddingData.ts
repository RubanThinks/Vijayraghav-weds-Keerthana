export interface EventDetail {
  id: string;
  name: string;
  tamilName?: string;
  date: string; // e.g. "12 December 2026"
  formattedDate: string; // e.g. "Saturday, 12th December 2026"
  time: string; // e.g. "6:00 PM – 8:00 PM"
  venue: string;
  venueAddress: string;
  venueCity: string;
  description: string;
  attireSuggestion: string;
  accentColor: string;
  bgImage: string;
  calendarEvent: {
    title: string;
    description: string;
    location: string;
    startTime: string; // ISO or date format
    endTime: string;
  };
}

export interface WeddingData {
  couple: {
    groom: {
      name: string;
      tamilName?: string;
      title: string;
      photo: string;
      portraitPlaceholder: string;
      quote: string;
    };
    bride: {
      name: string;
      tamilName?: string;
      title: string;
      photo: string;
      portraitPlaceholder: string;
      quote: string;
    };
    hashtag: string;
    combinedName: string;
  };
  events: {
    reception: EventDetail;
    wedding: EventDetail;
  };
  venue: {
    name: string;
    fullAddress: string;
    locality: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    mapQuery: string; // Customizable Google Maps Search query
    mapEmbedUrl: string; // Safe embed or direct link query
    directionsUrl: string;
    contactNumber?: string;
    features: string[];
    photo: string;
  };
  countdown: {
    targetIsoDate: string; // '2026-12-13T04:30:00+05:30' (IST)
    weddingDateLabel: string;
    muhurthamTimeLabel: string;
  };
  blessings: {
    deityName: string;
    deityTitle: string;
    motto: string;
    invitationNote: string;
    closingNote: string;
    closingSubnote: string;
  };
}

export const weddingData: WeddingData = {
  couple: {
    groom: {
      name: "Vijayraghav",
      tamilName: "விஜய்ராகவ்",
      title: "Groom",
      photo: "/assets/couple/groom-portrait.jpg",
      portraitPlaceholder: "/assets/couple/groom-portrait.jpg",
      quote: "Blessed with love, honored by tradition, stepping into forever."
    },
    bride: {
      name: "Keerthana",
      tamilName: "கீர்த்தனா",
      title: "Bride",
      photo: "/assets/couple/bride-portrait.jpg",
      portraitPlaceholder: "/assets/couple/bride-portrait.jpg",
      quote: "Two hearts bound by grace, family blessings, and timeless promises."
    },
    hashtag: "#VijayraghavWedsKeerthana",
    combinedName: "Vijayraghav weds Keerthana",
  },
  events: {
    reception: {
      id: "reception",
      name: "Grand Reception",
      tamilName: "வரவேற்பு நிகழ்ச்சி",
      date: "12 December 2026",
      formattedDate: "Saturday, 12th December 2026",
      time: "6:00 PM – 8:00 PM",
      venue: "Shri Kamatchi Mahal",
      venueAddress: "Karur, Tamil Nadu",
      venueCity: "Karur",
      description: "Join us for an enchanting evening of music, warm congratulations, and celebratory dinner in honor of the couple.",
      attireSuggestion: "Traditional Silk / Elegant Evening Attire",
      accentColor: "#d4af37",
      bgImage: "/assets/backgrounds/reception-bg.svg",
      calendarEvent: {
        title: "Wedding Reception: Vijayraghav & Keerthana",
        description: "Wedding Reception of Vijayraghav & Keerthana at Shri Kamatchi Mahal, Karur.",
        location: "Shri Kamatchi Mahal, Karur, Tamil Nadu",
        startTime: "20261212T180000",
        endTime: "20261212T200000",
      }
    },
    wedding: {
      id: "wedding",
      name: "Sacred Muhurtham & Wedding Ceremony",
      tamilName: "திருமண முகூர்த்தம்",
      date: "13 December 2026",
      formattedDate: "Sunday, 13th December 2026",
      time: "4:30 AM – 6:00 AM (Brahma Muhurtham)",
      venue: "Shri Kamatchi Mahal",
      venueAddress: "Karur, Tamil Nadu",
      venueCity: "Karur",
      description: "The auspicious knot is tied in the sacred presence of Agni, surrounded by family blessings and traditional Vedic chants.",
      attireSuggestion: "Traditional South Indian Festive Attire",
      accentColor: "#deb853",
      bgImage: "/assets/backgrounds/wedding-bg.svg",
      calendarEvent: {
        title: "Sacred Muhurtham: Vijayraghav & Keerthana",
        description: "Holy Wedding Muhurtham of Vijayraghav & Keerthana at Shri Kamatchi Mahal, Karur.",
        location: "Shri Kamatchi Mahal, Karur, Tamil Nadu",
        startTime: "20261213T043000",
        endTime: "20261213T060000",
      }
    }
  },
  venue: {
    name: "Shri Kamatchi Mahal",
    fullAddress: "Shri Kamatchi Mahal, Karur, Tamil Nadu, India",
    locality: "Karur Town",
    city: "Karur",
    state: "Tamil Nadu",
    country: "India",
    pincode: "639001",
    mapQuery: "Shri Kamatchi Mahal, Karur, Tamil Nadu",
    // Configurable Google Maps embed
    mapEmbedUrl: "https://www.google.com/maps?q=Shri+Kamatchi+Mahal+Karur+Tamil+Nadu&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Shri+Kamatchi+Mahal,+Karur,+Tamil+Nadu",
    features: [
      "Both Reception & Muhurtham held here",
      "Ample Guest & Valet Parking",
      "Grand Air-Conditioned Dining Hall",
      "Prime Central Location in Karur"
    ],
    photo: "/assets/venue/kamatchi-mahal.svg"
  },
  countdown: {
    // 13 Dec 2026 04:30:00 IST (+05:30)
    targetIsoDate: "2026-12-13T04:30:00+05:30",
    weddingDateLabel: "13 December 2026",
    muhurthamTimeLabel: "4:30 AM – 6:00 AM IST",
  },
  blessings: {
    deityName: "Lord Murugan",
    deityTitle: "வெற்றிவேல் முருகனுக்கு அரோகரா",
    motto: "With the divine blessings of Lord Murugan",
    invitationNote: "Request the pleasure of your gracious company and heartfelt blessings as they embark on their sacred journey of love and togetherness.",
    closingNote: "Your presence will make our celebration even more special.",
    closingSubnote: "Thank you for being a part of our beginning."
  }
};
