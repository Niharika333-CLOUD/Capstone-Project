const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Load env vars
dotenv.config();

// Sample books data
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    price: 299,
    category: "Fiction",
    brand: "Scribner",
    stock: 50,
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", alt: "The Great Gatsby" }],
    isbn: "9780743273565",
    publisher: "Scribner",
    language: "English",
    pages: 180,
    format: "Paperback"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    price: 350,
    category: "Fiction",
    stock: 45,
    images: [{ url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", alt: "To Kill a Mockingbird" }],
    isbn: "9780061120084",
    publisher: "Harper Perennial",
    language: "English",
    pages: 324,
    format: "Paperback"
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian masterpiece about totalitarianism and surveillance in a future society.",
    price: 275,
    category: "Science Fiction",
    stock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", alt: "1984" }],
    isbn: "9780451524935",
    publisher: "Signet Classic",
    language: "English",
    pages: 328,
    format: "Paperback"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that critiques the British landed gentry at the end of the 18th century.",
    price: 320,
    category: "Romance",
    stock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", alt: "Pride and Prejudice" }],
    isbn: "9780141439518",
    publisher: "Penguin Classics",
    language: "English",
    pages: 432,
    format: "Paperback"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A story about teenage rebellion and alienation that has become an icon of youth culture.",
    price: 290,
    category: "Fiction",
    stock: 35,
    images: [{ url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400", alt: "The Catcher in the Rye" }],
    isbn: "9780316769174",
    publisher: "Little, Brown and Company",
    language: "English",
    pages: 277,
    format: "Paperback"
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    description: "The magical beginning of Harry Potter's journey at Hogwarts School of Witchcraft and Wizardry.",
    price: 450,
    category: "Fantasy",
    stock: 100,
    images: [{ url: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400", alt: "Harry Potter" }],
    isbn: "9780439708180",
    publisher: "Scholastic",
    language: "English",
    pages: 309,
    format: "Hardcover"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy adventure about Bilbo Baggins' unexpected journey to reclaim treasure from a dragon.",
    price: 380,
    category: "Fantasy",
    stock: 55,
    images: [{ url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400", alt: "The Hobbit" }],
    isbn: "9780547928227",
    publisher: "Mariner Books",
    language: "English",
    pages: 366,
    format: "Paperback"
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    description: "A thrilling mystery involving secret societies, religious history, and a race against time.",
    price: 399,
    category: "Mystery",
    stock: 70,
    images: [{ url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", alt: "The Da Vinci Code" }],
    isbn: "9780307474278",
    publisher: "Anchor",
    language: "English",
    pages: 597,
    format: "Paperback"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones through tiny changes.",
    price: 499,
    category: "Self-Help",
    stock: 80,
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", alt: "Atomic Habits" }],
    isbn: "9780735211292",
    publisher: "Avery",
    language: "English",
    pages: 320,
    format: "Hardcover"
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "A brief history of humankind from the Stone Age to the modern age.",
    price: 550,
    category: "Non-Fiction",
    stock: 65,
    images: [{ url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400", alt: "Sapiens" }],
    isbn: "9780062316110",
    publisher: "Harper Perennial",
    language: "English",
    pages: 464,
    format: "Paperback"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A mystical story about following your dreams and listening to your heart.",
    price: 325,
    category: "Fiction",
    stock: 90,
    images: [{ url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400", alt: "The Alchemist" }],
    isbn: "9780062315007",
    publisher: "HarperOne",
    language: "English",
    pages: 208,
    format: "Paperback"
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    description: "The classic guide to achieving success and wealth through positive thinking.",
    price: 299,
    category: "Self-Help",
    stock: 75,
    images: [{ url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400", alt: "Think and Grow Rich" }],
    isbn: "9781585424337",
    publisher: "TarcherPerigee",
    language: "English",
    pages: 320,
    format: "Paperback"
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    description: "A dystopian thriller about a televised fight to the death in a post-apocalyptic world.",
    price: 375,
    category: "Science Fiction",
    stock: 85,
    images: [{ url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", alt: "The Hunger Games" }],
    isbn: "9780439023481",
    publisher: "Scholastic Press",
    language: "English",
    pages: 374,
    format: "Paperback"
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    description: "A gripping mystery thriller involving murder, family secrets, and corruption.",
    price: 425,
    category: "Mystery",
    stock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", alt: "The Girl with the Dragon Tattoo" }],
    isbn: "9780307949486",
    publisher: "Vintage Crime",
    language: "English",
    pages: 590,
    format: "Paperback"
  },
  {
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    description: "A powerful guide to personal and professional effectiveness.",
    price: 475,
    category: "Self-Help",
    stock: 70,
    images: [{ url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400", alt: "7 Habits" }],
    isbn: "9781982137274",
    publisher: "Simon & Schuster",
    language: "English",
    pages: 464,
    format: "Paperback"
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description: "An epic fantasy trilogy about the quest to destroy the One Ring.",
    price: 899,
    category: "Fantasy",
    stock: 45,
    images: [{ url: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400", alt: "Lord of the Rings" }],
    isbn: "9780544003415",
    publisher: "Mariner Books",
    language: "English",
    pages: 1216,
    format: "Paperback"
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    description: "A psychological thriller about a marriage gone terribly wrong.",
    price: 399,
    category: "Mystery",
    stock: 55,
    images: [{ url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", alt: "Gone Girl" }],
    isbn: "9780307588371",
    publisher: "Broadway Books",
    language: "English",
    pages: 432,
    format: "Paperback"
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    description: "A counterintuitive approach to living a good life by caring less.",
    price: 450,
    category: "Self-Help",
    stock: 95,
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", alt: "Subtle Art" }],
    isbn: "9780062457714",
    publisher: "HarperOne",
    language: "English",
    pages: 224,
    format: "Hardcover"
  },
  {
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a woman who grows up in a survivalist family and eventually escapes to learn.",
    price: 425,
    category: "Biography",
    stock: 50,
    images: [{ url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400", alt: "Educated" }],
    isbn: "9780399590504",
    publisher: "Random House",
    language: "English",
    pages: 352,
    format: "Hardcover"
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description: "A powerful story of friendship, betrayal, and redemption set in Afghanistan.",
    price: 375,
    category: "Fiction",
    stock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400", alt: "The Kite Runner" }],
    isbn: "9781594631931",
    publisher: "Riverhead Books",
    language: "English",
    pages: 371,
    format: "Paperback"
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    description: "A heart-wrenching love story between two teenagers with cancer.",
    price: 325,
    category: "Romance",
    stock: 70,
    images: [{ url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", alt: "The Fault in Our Stars" }],
    isbn: "9780142424179",
    publisher: "Penguin Books",
    language: "English",
    pages: 318,
    format: "Paperback"
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    description: "The exclusive biography of the Apple co-founder and tech visionary.",
    price: 599,
    category: "Biography",
    stock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400", alt: "Steve Jobs" }],
    isbn: "9781451648539",
    publisher: "Simon & Schuster",
    language: "English",
    pages: 656,
    format: "Hardcover"
  },
  {
    title: "The Power of Now",
    author: "Eckhart Tolle",
    description: "A guide to spiritual enlightenment and living in the present moment.",
    price: 399,
    category: "Self-Help",
    stock: 65,
    images: [{ url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400", alt: "The Power of Now" }],
    isbn: "9781577314806",
    publisher: "New World Library",
    language: "English",
    pages: 236,
    format: "Paperback"
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    description: "A gripping tale of survival on Mars after an astronaut is left behind.",
    price: 425,
    category: "Science Fiction",
    stock: 75,
    images: [{ url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", alt: "The Martian" }],
    isbn: "9780553418026",
    publisher: "Broadway Books",
    language: "English",
    pages: 384,
    format: "Paperback"
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    description: "The memoir of the former First Lady of the United States.",
    price: 650,
    category: "Biography",
    stock: 55,
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", alt: "Becoming" }],
    isbn: "9781524763138",
    publisher: "Crown",
    language: "English",
    pages: 448,
    format: "Hardcover"
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman who stops speaking after allegedly killing her husband.",
    price: 399,
    category: "Mystery",
    stock: 80,
    images: [{ url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", alt: "The Silent Patient" }],
    isbn: "9781250301697",
    publisher: "Celadon Books",
    language: "English",
    pages: 336,
    format: "Hardcover"
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description: "A mystery and coming-of-age story set in the marshes of North Carolina.",
    price: 450,
    category: "Fiction",
    stock: 90,
    images: [{ url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", alt: "Where the Crawdads Sing" }],
    isbn: "9780735219090",
    publisher: "G.P. Putnam's Sons",
    language: "English",
    pages: 384,
    format: "Hardcover"
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "A science fiction masterpiece about politics, religion, and ecology on a desert planet.",
    price: 499,
    category: "Science Fiction",
    stock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400", alt: "Dune" }],
    isbn: "9780441172719",
    publisher: "Ace",
    language: "English",
    pages: 688,
    format: "Paperback"
  },
  {
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    description: "A practical guide to personal freedom based on ancient Toltec wisdom.",
    price: 299,
    category: "Self-Help",
    stock: 70,
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", alt: "The Four Agreements" }],
    isbn: "9781878424310",
    publisher: "Amber-Allen Publishing",
    language: "English",
    pages: 160,
    format: "Paperback"
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    description: "A story about a young girl living in Nazi Germany who steals books and shares them.",
    price: 375,
    category: "Fiction",
    stock: 55,
    images: [{ url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400", alt: "The Book Thief" }],
    isbn: "9780375842207",
    publisher: "Knopf Books",
    language: "English",
    pages: 552,
    format: "Hardcover"
  },
  {
    title: "Homo Deus",
    author: "Yuval Noah Harari",
    description: "A brief history of tomorrow, exploring the future of humanity and technology.",
    price: 575,
    category: "Non-Fiction",
    stock: 60,
    images: [{ url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400", alt: "Homo Deus" }],
    isbn: "9780062464347",
    publisher: "Harper Perennial",
    language: "English",
    pages: 464,
    format: "Paperback"
  }
];

// Categories to create
const categories = [
  { name: "Fiction", description: "Literary fiction and novels" },
  { name: "Non-Fiction", description: "Real-world topics and true stories" },
  { name: "Science Fiction", description: "Futuristic and speculative fiction" },
  { name: "Fantasy", description: "Magical and imaginary worlds" },
  { name: "Mystery", description: "Suspense and detective stories" },
  { name: "Romance", description: "Love stories and relationships" },
  { name: "Self-Help", description: "Personal development and improvement" },
  { name: "Biography", description: "Life stories of notable people" }
];

// Connect to database and seed
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories one by one to trigger pre-save hooks
    const createdCategories = [];
    for (const category of categories) {
      const cat = await Category.create(category);
      createdCategories.push(cat);
    }
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create a map of category names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Update books with category IDs and brand field
    const booksWithCategoryIds = books.map(book => ({
      ...book,
      brand: book.publisher || book.brand, // Use publisher as brand
      category: categoryMap[book.category]
    }));

    // Insert books
    const createdBooks = await Product.insertMany(booksWithCategoryIds);
    console.log(`✅ Created ${createdBooks.length} books`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📚 Summary:`);
    console.log(`   - ${createdCategories.length} categories`);
    console.log(`   - ${createdBooks.length} books`);
    console.log(`\n🚀 You can now view the books at http://localhost:4200\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

// Made with Bob
