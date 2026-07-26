const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Book = require('../src/models/Book');
const Event = require('../src/models/Event');
const Magazine = require('../src/models/Magazine');
const CommitteeMember = require('../src/models/CommitteeMember');
const Admin = require('../src/models/Admin');
require('dotenv').config({ path: __dirname + '/../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/srishtipadam';

const DUMMY_BOOKS = [
  { name: "ആടുജീവിതം (Aadujeevitham)", writer: "Benyamin", price: 250, category: "Novel", coverImage: { url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" }, pages: 300, description: { ml: "നജീബ് എന്ന വ്യക്തിയുടെ ജീവിതം...", en: "The life of Najeeb..." } },
  { name: "രണ്ടാമൂഴം (Randamoozham)", writer: "M.T. Vasudevan Nair", price: 300, category: "Classic", coverImage: { url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop" }, pages: 450, description: { en: "Mahabharata from Bhima's perspective." } },
  { name: "ഖസാക്കിന്റെ ഇതിഹാസം (Khasakkinte Itihasam)", writer: "O.V. Vijayan", price: 200, category: "Novel", description: { en: "The legend of Khasak." } },
  { name: "ബാല്യകാലസഖി (Balyakalasakhi)", writer: "Vaikom Muhammad Basheer", price: 150, category: "Romance", coverImage: { url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" }, description: { en: "A tragic romantic story." } },
  { name: "ഒരു ദേശത്തിന്റെ കഥ (Oru Desathinte Katha)", writer: "S.K. Pottekkatt", price: 350, category: "Novel", description: { en: "The story of a locale." } }
];

const DUMMY_EVENTS = [
  { name: { en: "Annual Literary Fest 2026", ml: "വാർഷിക സാഹിത്യോത്സവം 2026" }, place: { en: "Town Hall, Kochi", ml: "ടൗൺ ഹാൾ, കൊച്ചി" }, date: new Date("2026-08-15T10:00:00Z"), time: "10:00 AM", description: { en: "A day long celebration of words, featuring eminent writers and panel discussions." }, isUpcoming: true, images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" }] },
  { name: { en: "Book Launch: New Voices", ml: "പുസ്തക പ്രകാശനം: പുതിയ ശബ്ദങ്ങൾ" }, place: { en: "Public Library Hall", ml: "പബ്ലിക് ലൈബ്രറി ഹാൾ" }, date: new Date("2026-05-10T16:00:00Z"), time: "04:00 PM", description: { en: "Unveiling the latest anthology of short stories by upcoming young writers from Srishtipadam." }, isUpcoming: false, images: [{ url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop" }] },
  { name: { en: "Poetry Reading Evening", ml: "കവിയരങ്ങ്" }, place: { en: "Open Air Theatre", ml: "ഓപ്പൺ എയർ തീയറ്റർ" }, date: new Date("2026-03-22T17:30:00Z"), time: "05:30 PM", description: { en: "An evening dedicated to contemporary and classic Malayalam poetry." }, isUpcoming: false, images: [] }
];

const DUMMY_MAGAZINES = [
  { title: { ml: "സൃഷ്ടിപഥം ഏപ്രിൽ 2026", en: "Srishtipadam April 2026" }, issueNumber: "42", description: { en: "A deep dive into modern Malayalam poetry and its cultural roots." }, coverImage: { url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" }, publishedDate: new Date("2026-04-01") },
  { title: { ml: "സൃഷ്ടിപഥം ജനുവരി 2026", en: "Srishtipadam Jan 2026" }, issueNumber: "41", description: { en: "Special edition on classical literature and changing perspectives." }, coverImage: { url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop" }, publishedDate: new Date("2026-01-01") },
  { title: { ml: "സൃഷ്ടിപഥം ഒക്ടോബർ 2025", en: "Srishtipadam Oct 2025" }, issueNumber: "40", description: { en: "Annual festival edition featuring short stories by renowned writers." }, coverImage: { url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" }, publishedDate: new Date("2025-10-01") }
];

const DUMMY_COMMITTEE = [
  { name: "Dr. K. S. Ravikumar", role: { en: "President", ml: "പ്രസിഡന്റ്" }, description: { en: "Renowned literary critic and professor with over 30 years of experience in Malayalam literature." }, photo: { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" }, order: 1 },
  { name: "Anil Kumar P.", role: { en: "Secretary", ml: "സെക്രട്ടറി" }, description: { en: "Author and social activist, leading the collective's publishing initiatives since its inception." }, photo: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" }, order: 2 },
  { name: "Sujatha Nair", role: { en: "Editor-in-Chief", ml: "ചീഫ് എഡിറ്റർ" }, description: { en: "Award-winning poet and the driving force behind the Srishtipadam Magazine." }, photo: { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop" }, order: 3 },
  { name: "Ramesh M.", role: { en: "Treasurer", ml: "ട്രഷറർ" }, description: { en: "Ensuring the collective's operations run smoothly and transparently." }, photo: {}, order: 4 }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    console.log('Clearing old data...');
    await Book.deleteMany({});
    await Event.deleteMany({});
    await Magazine.deleteMany({});
    await CommitteeMember.deleteMany({});
    await Admin.deleteMany({});

    console.log('Inserting admin...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', passwordHash });

    console.log('Inserting books...');
    await Book.insertMany(DUMMY_BOOKS);

    console.log('Inserting events...');
    await Event.insertMany(DUMMY_EVENTS);

    console.log('Inserting magazines...');
    await Magazine.insertMany(DUMMY_MAGAZINES);

    console.log('Inserting committee...');
    await CommitteeMember.insertMany(DUMMY_COMMITTEE);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
