/**
 * Migration: fix books where coverImage was stored as "[object Object]"
 * because the old schema had coverImage: { type: String }
 * 
 * This script finds all books, checks if coverImage is a bad string,
 * and either clears it or sets a proper Unsplash placeholder.
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/srishtipadam';

// Raw schema to bypass Mongoose casting - work directly with the collection
async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const collection = db.collection('books');

  const books = await collection.find({}).toArray();
  console.log(`Found ${books.length} books`);

  const placeholders = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop',
  ];

  let fixed = 0;
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const ci = book.coverImage;

    // If coverImage is missing, null, or "[object Object]" (bad string)
    const isBad = !ci || 
      (typeof ci === 'string' && (!ci.startsWith('http') || ci === '[object Object]')) ||
      (typeof ci === 'object' && !ci.url);

    if (isBad) {
      const newUrl = placeholders[i % placeholders.length];
      await collection.updateOne(
        { _id: book._id },
        { $set: { coverImage: { url: newUrl, publicId: null } } }
      );
      console.log(`Fixed: "${book.name?.en || book.name?.ml || book._id}" → ${newUrl}`);
      fixed++;
    } else if (typeof ci === 'string' && ci.startsWith('http')) {
      // Old plain string URL — convert to object
      await collection.updateOne(
        { _id: book._id },
        { $set: { coverImage: { url: ci, publicId: null } } }
      );
      console.log(`Converted string→obj: "${book.name?.en || book.name?.ml}" → ${ci}`);
      fixed++;
    } else {
      console.log(`OK: "${book.name?.en || book.name?.ml || book._id}" has ${ci.url}`);
    }
  }

  console.log(`\nMigration complete. Fixed ${fixed}/${books.length} books.`);
  await mongoose.disconnect();
}

migrate().catch(e => { console.error(e); process.exit(1); });
