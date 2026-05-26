const mongoose = require('mongoose');
const Writer = require('./models/Writer');
const Product = require('./models/Product');
require('dotenv').config();

const famousWriters = [
  {
    name: 'Sudha Murthy',
    bio: 'Sudha Murthy is an Indian educator, author and philanthropist. She is chairperson of the Infosys Foundation and a prolific writer in English and Kannada. Her works are known for their simplicity and social relevance.',
    image: 'assets/images/writers/Sudha-Murthy.jpg',
    nationality: 'Indian',
    birthDate: new Date('1950-08-19'),
    genres: ['Fiction', 'Non-Fiction', 'Children\'s Literature', 'Social Issues'],
    socialMedia: {
      website: 'https://www.infosys.com/infosys-foundation',
      twitter: '@sudhamurty',
      instagram: '@sudhamurtyofficial'
    },
    awards: [
      { name: 'Padma Shri', year: 2006 },
      { name: 'Padma Bhushan', year: 2023 },
      { name: 'R.K. Narayan Award for Literature', year: 2011 }
    ],
    isActive: true,
    recentWorks: [
      {
        title: 'The Sage with Two Horns: Unusual Tales from Mythology',
        year: 2023,
        description: 'A collection of lesser-known mythological stories'
      },
      {
        title: 'The Daughter from a Wishing Tree',
        year: 2020,
        description: 'Unusual tales about women from Indian mythology'
      },
      {
        title: 'Three Thousand Stitches',
        year: 2017,
        description: 'Ordinary people, extraordinary lives'
      }
    ]
  },
  {
    name: 'Colleen Hoover',
    bio: 'Colleen Hoover is an American author who writes primarily romance and young adult fiction. She is best known for her novel "It Ends with Us" and has become one of the most popular contemporary romance authors.',
    image: 'assets/images/writers/Collen-hover.jpg',
    nationality: 'American',
    birthDate: new Date('1979-12-11'),
    genres: ['Romance', 'Contemporary Fiction', 'Young Adult', 'New Adult'],
    socialMedia: {
      website: 'https://colleenhoover.com',
      twitter: '@colleenhoover',
      instagram: '@colleenhoover',
      facebook: 'AuthorColleenHoover'
    },
    awards: [
      { name: 'Goodreads Choice Award for Romance', year: 2016 },
      { name: 'Goodreads Choice Award for Romance', year: 2022 },
      { name: 'Goodreads Choice Award for Fiction', year: 2022 }
    ],
    isActive: true,
    recentWorks: [
      {
        title: 'It Starts with Us',
        year: 2022,
        description: 'The sequel to the global phenomenon It Ends with Us'
      },
      {
        title: 'Reminders of Him',
        year: 2022,
        description: 'A heart-wrenching story of redemption and second chances'
      },
      {
        title: 'It Ends with Us',
        year: 2016,
        description: 'A powerful story about domestic violence and resilience'
      }
    ]
  },
  {
    name: 'Chetan Bhagat',
    bio: 'Chetan Bhagat is an Indian author, columnist, and screenwriter. Known for his English-language novels about young urban middle-class Indians, his books have sold millions of copies and several have been adapted into Bollywood films.',
    image: 'assets/images/writers/Chethan-Bhagat.jpg',
    nationality: 'Indian',
    birthDate: new Date('1974-04-22'),
    genres: ['Contemporary Fiction', 'Romance', 'Young Adult', 'Social Commentary'],
    socialMedia: {
      website: 'https://www.chetanbhagat.com',
      twitter: '@chetan_bhagat',
      instagram: '@chetan_bhagat',
      facebook: 'chetanbhagat'
    },
    awards: [
      { name: 'Society Young Achievers Award', year: 2004 },
      { name: 'Publisher\'s Recognition Award', year: 2005 }
    ],
    isActive: true,
    recentWorks: [
      {
        title: '400 Days',
        year: 2021,
        description: 'A gripping thriller about a mother\'s fight for justice'
      },
      {
        title: 'One Arranged Murder',
        year: 2020,
        description: 'A murder mystery set against the backdrop of an arranged marriage'
      },
      {
        title: 'The Girl in Room 105',
        year: 2018,
        description: 'A romantic thriller about love, loss, and redemption'
      }
    ]
  },
  {
    name: 'Ruskin Bond',
    bio: 'Ruskin Bond is an Indian author of British descent. He is known for his role in promoting children\'s literature in India and has written over 500 short stories, essays, and novels.',
    image: 'assets/images/writers/Ruskin-Bond.jpg',
    nationality: 'Indian',
    birthDate: new Date('1934-05-19'),
    genres: ['Children\'s Literature', 'Fiction', 'Short Stories', 'Nature Writing'],
    socialMedia: {
      website: 'https://www.ruskinbond.com',
      twitter: '@RuskinBond',
      instagram: '@ruskinbondofficial'
    },
    awards: [
      { name: 'Sahitya Akademi Award', year: 1992 },
      { name: 'Padma Shri', year: 1999 },
      { name: 'Padma Bhushan', year: 2014 }
    ],
    isActive: true,
    recentWorks: [
      {
        title: 'A Little Book of India',
        year: 2023,
        description: 'Stories celebrating the diversity of India'
      },
      {
        title: 'The Kashmiri Storyteller',
        year: 2022,
        description: 'Tales from the beautiful valley of Kashmir'
      },
      {
        title: 'The Cherry Tree',
        year: 2021,
        description: 'A timeless story about patience and nature'
      }
    ]
  },
  {
    name: 'Amish Tripathi',
    bio: 'Amish Tripathi is an Indian author known for his Shiva Trilogy and Ram Chandra Series. His books have sold over 6 million copies and have been translated into multiple languages.',
    image: 'assets/images/writers/amish-tripathi.jpg',
    nationality: 'Indian',
    birthDate: new Date('1974-10-18'),
    genres: ['Mythology', 'Fantasy', 'Historical Fiction', 'Adventure'],
    socialMedia: {
      website: 'https://www.amishtripathi.com',
      twitter: '@amishtweets',
      instagram: '@authoramish',
      facebook: 'authoramish'
    },
    awards: [
      { name: 'Raymond Crossword Book Award', year: 2011 },
      { name: 'Society Young Achievers Award', year: 2013 }
    ],
    isActive: true,
    recentWorks: [
      {
        title: 'War of Lanka',
        year: 2022,
        description: 'The final book in the Ram Chandra Series'
      },
      {
        title: 'Raavan: Enemy of Aryavarta',
        year: 2019,
        description: 'The story of Raavan from the Ram Chandra Series'
      },
      {
        title: 'Sita: Warrior of Mithila',
        year: 2017,
        description: 'The second book in the Ram Chandra Series'
      }
    ]
  },
  {
    name: 'Arundhati Roy',
    bio: 'Arundhati Roy is an Indian author best known for her novel "The God of Small Things", which won the Booker Prize. She is also a political activist and has written extensively on contemporary issues.',
    image: 'assets/images/writers/Arundhathi-Roy.jpg',
    nationality: 'Indian',
    birthDate: new Date('1961-11-24'),
    genres: ['Literary Fiction', 'Political Writing', 'Essays', 'Social Commentary'],
    socialMedia: {
      website: 'https://www.arundhatiroy.in',
      twitter: '@arundhatiroy'
    },
    awards: [
      { name: 'Booker Prize', year: 1997 },
      { name: 'Sydney Peace Prize', year: 2004 },
      { name: 'Norman Mailer Prize', year: 2011 }
    ],
    isActive: true,
    recentWorks: [
      {
        title: 'Azadi: Freedom. Fascism. Fiction.',
        year: 2020,
        description: 'Essays on contemporary India'
      },
      {
        title: 'The Ministry of Utmost Happiness',
        year: 2017,
        description: 'A novel about love and loss in modern India'
      },
      {
        title: 'Capitalism: A Ghost Story',
        year: 2014,
        description: 'A critique of contemporary capitalism'
      }
    ]
  }
];

const seedWriters = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Get or create a default category
    const Category = require('./models/Category');
    let defaultCategory = await Category.findOne({ name: 'Fiction' });
    if (!defaultCategory) {
      defaultCategory = await Category.create({
        name: 'Fiction',
        description: 'Fiction books and novels',
        slug: 'fiction',
        isActive: true
      });
      console.log('Created default Fiction category');
    }

    // Clear existing writers
    await Writer.deleteMany({});
    console.log('Cleared existing writers');

    // Insert famous writers
    const insertedWriters = await Writer.insertMany(famousWriters);
    console.log(`Inserted ${insertedWriters.length} famous writers`);

    // Create sample books for each writer
    for (const writer of insertedWriters) {
      const books = [];
      
      // Create books from recent works
      if (writer.recentWorks && writer.recentWorks.length > 0) {
        for (const work of writer.recentWorks) {
          const book = new Product({
            title: work.title,
            author: writer.name,
            description: work.description || `A captivating work by ${writer.name}`,
            price: Math.floor(Math.random() * (800 - 200 + 1)) + 200, // Random price between 200-800
            category: defaultCategory._id,
            brand: 'Penguin Random House',
            stock: Math.floor(Math.random() * 50) + 10,
            images: [
              {
                url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
                alt: work.title
              },
              {
                url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                alt: `${work.title} - Back Cover`
              }
            ],
            specifications: {
              publisher: 'Penguin Random House',
              publicationDate: new Date(work.year, 0, 1),
              language: 'English',
              pages: Math.floor(Math.random() * (500 - 200 + 1)) + 200
            },
            isbn: `978-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            ratings: {
              average: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
              count: Math.floor(Math.random() * 5000) + 100
            },
            isFeatured: Math.random() > 0.5,
            isActive: true
          });

          const savedBook = await book.save();
          books.push(savedBook._id);
        }

        // Update writer with book references
        writer.books = books;
        await writer.save();
        console.log(`Added ${books.length} books for ${writer.name}`);
      }
    }

    console.log('\n✅ Writers seeding completed successfully!');
    console.log('\nSeeded Writers:');
    insertedWriters.forEach((writer, index) => {
      console.log(`${index + 1}. ${writer.name} - ${writer.books.length} books`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding writers:', error);
    process.exit(1);
  }
};

// Run the seed function
seedWriters();

// Made with Bob