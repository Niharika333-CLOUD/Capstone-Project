const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

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

// Book templates for each category (20 per category)
const bookTemplates = {
  "Fiction": [
    "The Great Gatsby|F. Scott Fitzgerald|Scribner|299",
    "To Kill a Mockingbird|Harper Lee|Harper Perennial|350",
    "The Catcher in the Rye|J.D. Salinger|Little, Brown|290",
    "The Alchemist|Paulo Coelho|HarperOne|325",
    "The Kite Runner|Khaled Hosseini|Riverhead Books|375",
    "Where the Crawdads Sing|Delia Owens|G.P. Putnam's Sons|450",
    "The Book Thief|Markus Zusak|Knopf Books|375",
    "Life of Pi|Yann Martel|Harcourt|340",
    "The Road|Cormac McCarthy|Vintage|360",
    "Beloved|Toni Morrison|Vintage|385",
    "The Color Purple|Alice Walker|Mariner Books|330",
    "One Hundred Years of Solitude|Gabriel García Márquez|Harper Perennial|395",
    "The Handmaid's Tale|Margaret Atwood|Anchor|370",
    "Brave New World|Aldous Huxley|Harper Perennial|310",
    "The Grapes of Wrath|John Steinbeck|Penguin|355",
    "Catch-22|Joseph Heller|Simon & Schuster|345",
    "The Bell Jar|Sylvia Plath|Harper Perennial|315",
    "Slaughterhouse-Five|Kurt Vonnegut|Dell|335",
    "The Sun Also Rises|Ernest Hemingway|Scribner|325",
    "A Farewell to Arms|Ernest Hemingway|Scribner|340"
  ],
  "Romance": [
    "Pride and Prejudice|Jane Austen|Penguin Classics|320",
    "The Fault in Our Stars|John Green|Penguin Books|325",
    "Me Before You|Jojo Moyes|Penguin Books|350",
    "The Notebook|Nicholas Sparks|Grand Central|295",
    "Outlander|Diana Gabaldon|Dell|425",
    "The Time Traveler's Wife|Audrey Niffenegger|Mariner Books|380",
    "Eleanor & Park|Rainbow Rowell|St. Martin's Griffin|310",
    "The Rosie Project|Graeme Simsion|Simon & Schuster|330",
    "Anna Karenina|Leo Tolstoy|Penguin Classics|450",
    "Wuthering Heights|Emily Brontë|Penguin Classics|305",
    "Jane Eyre|Charlotte Brontë|Penguin Classics|315",
    "Sense and Sensibility|Jane Austen|Penguin Classics|310",
    "Emma|Jane Austen|Penguin Classics|305",
    "Persuasion|Jane Austen|Penguin Classics|300",
    "The Hating Game|Sally Thorne|William Morrow|340",
    "Red, White & Royal Blue|Casey McQuiston|St. Martin's Griffin|360",
    "Beach Read|Emily Henry|Berkley|345",
    "People We Meet on Vacation|Emily Henry|Berkley|355",
    "The Kiss Quotient|Helen Hoang|Berkley|350",
    "It Ends with Us|Colleen Hoover|Atria Books|365"
  ],
  "Science Fiction": [
    "1984|George Orwell|Signet Classic|275",
    "The Hunger Games|Suzanne Collins|Scholastic Press|375",
    "The Martian|Andy Weir|Broadway Books|425",
    "Dune|Frank Herbert|Ace|499",
    "Ender's Game|Orson Scott Card|Tor Books|380",
    "Foundation|Isaac Asimov|Spectra|395",
    "Neuromancer|William Gibson|Ace|410",
    "Snow Crash|Neal Stephenson|Bantam|420",
    "The Left Hand of Darkness|Ursula K. Le Guin|Ace|365",
    "Fahrenheit 451|Ray Bradbury|Simon & Schuster|295",
    "The Time Machine|H.G. Wells|Dover|250",
    "Do Androids Dream of Electric Sheep?|Philip K. Dick|Del Rey|340",
    "The War of the Worlds|H.G. Wells|Dover|265",
    "Starship Troopers|Robert A. Heinlein|Ace|355",
    "The Hitchhiker's Guide to the Galaxy|Douglas Adams|Del Rey|320",
    "Ready Player One|Ernest Cline|Broadway Books|390",
    "The Three-Body Problem|Liu Cixin|Tor Books|415",
    "Hyperion|Dan Simmons|Spectra|430",
    "The Forever War|Joe Haldeman|St. Martin's Griffin|370",
    "Childhood's End|Arthur C. Clarke|Del Rey|345"
  ],
  "Fantasy": [
    "Harry Potter and the Philosopher's Stone|J.K. Rowling|Scholastic|450",
    "The Hobbit|J.R.R. Tolkien|Mariner Books|380",
    "The Lord of the Rings|J.R.R. Tolkien|Mariner Books|899",
    "A Game of Thrones|George R.R. Martin|Bantam|495",
    "The Name of the Wind|Patrick Rothfuss|DAW|425",
    "The Way of Kings|Brandon Sanderson|Tor Books|550",
    "Mistborn|Brandon Sanderson|Tor Books|420",
    "The Eye of the World|Robert Jordan|Tor Books|445",
    "The Chronicles of Narnia|C.S. Lewis|HarperCollins|525",
    "American Gods|Neil Gaiman|William Morrow|465",
    "The Night Circus|Erin Morgenstern|Anchor|395",
    "The Lies of Locke Lamora|Scott Lynch|Bantam|410",
    "The Fifth Season|N.K. Jemisin|Orbit|385",
    "Assassin's Apprentice|Robin Hobb|Spectra|375",
    "The Blade Itself|Joe Abercrombie|Orbit|390",
    "Gardens of the Moon|Steven Erikson|Tor Books|435",
    "The Priory of the Orange Tree|Samantha Shannon|Bloomsbury|525",
    "Circe|Madeline Miller|Back Bay Books|405",
    "The Bear and the Nightingale|Katherine Arden|Del Rey|380",
    "Uprooted|Naomi Novik|Del Rey|395"
  ],
  "Mystery": [
    "The Da Vinci Code|Dan Brown|Anchor|399",
    "The Girl with the Dragon Tattoo|Stieg Larsson|Vintage Crime|425",
    "Gone Girl|Gillian Flynn|Broadway Books|399",
    "The Silent Patient|Alex Michaelides|Celadon Books|399",
    "Big Little Lies|Liane Moriarty|Berkley|375",
    "The Woman in the Window|A.J. Finn|William Morrow|385",
    "Sharp Objects|Gillian Flynn|Broadway Books|365",
    "The Guest List|Lucy Foley|William Morrow|380",
    "In the Woods|Tana French|Penguin Books|390",
    "The Cuckoo's Calling|Robert Galbraith|Mulholland Books|395",
    "The Hound of the Baskervilles|Arthur Conan Doyle|Penguin Classics|285",
    "And Then There Were None|Agatha Christie|William Morrow|295",
    "Murder on the Orient Express|Agatha Christie|William Morrow|305",
    "The Girl on the Train|Paula Hawkins|Riverhead Books|375",
    "Before I Go to Sleep|S.J. Watson|Harper|355",
    "The Reversal|Michael Connelly|Little, Brown|385",
    "The Snowman|Jo Nesbø|Vintage Crime|395",
    "The Dry|Jane Harper|Flatiron Books|370",
    "The Seven Deaths of Evelyn Hardcastle|Stuart Turton|Sourcebooks|410",
    "The Thursday Murder Club|Richard Osman|Pamela Dorman Books|390"
  ],
  "Self-Help": [
    "Atomic Habits|James Clear|Avery|499",
    "Think and Grow Rich|Napoleon Hill|TarcherPerigee|299",
    "The 7 Habits of Highly Effective People|Stephen R. Covey|Simon & Schuster|475",
    "The Subtle Art of Not Giving a F*ck|Mark Manson|HarperOne|450",
    "The Power of Now|Eckhart Tolle|New World Library|399",
    "The Four Agreements|Don Miguel Ruiz|Amber-Allen|299",
    "How to Win Friends and Influence People|Dale Carnegie|Pocket Books|325",
    "The Power of Habit|Charles Duhigg|Random House|425",
    "Mindset|Carol S. Dweck|Ballantine Books|395",
    "Daring Greatly|Brené Brown|Avery|410",
    "The Gifts of Imperfection|Brené Brown|Hazelden|385",
    "You Are a Badass|Jen Sincero|Running Press|375",
    "The Miracle Morning|Hal Elrod|Hal Elrod|350",
    "Grit|Angela Duckworth|Scribner|420",
    "Deep Work|Cal Newport|Grand Central|435",
    "Essentialism|Greg McKeown|Crown Business|395",
    "The 5 AM Club|Robin Sharma|HarperCollins|425",
    "Can't Hurt Me|David Goggins|Lioncrest|465",
    "The Compound Effect|Darren Hardy|Vanguard Press|365",
    "Start with Why|Simon Sinek|Portfolio|415"
  ],
  "Non-Fiction": [
    "Sapiens|Yuval Noah Harari|Harper Perennial|550",
    "Educated|Tara Westover|Random House|425",
    "Becoming|Michelle Obama|Crown|650",
    "The Immortal Life of Henrietta Lacks|Rebecca Skloot|Broadway Books|395",
    "Thinking, Fast and Slow|Daniel Kahneman|Farrar, Straus and Giroux|525",
    "Quiet|Susan Cain|Broadway Books|445",
    "The Wright Brothers|David McCullough|Simon & Schuster|475",
    "Unbroken|Laura Hillenbrand|Random House|455",
    "The Devil in the White City|Erik Larson|Vintage|425",
    "Into the Wild|Jon Krakauer|Anchor|385",
    "Born a Crime|Trevor Noah|Spiegel & Grau|415",
    "When Breath Becomes Air|Paul Kalanithi|Random House|395",
    "The Glass Castle|Jeannette Walls|Scribner|375",
    "Bad Blood|John Carreyrou|Knopf|435",
    "The Sixth Extinction|Elizabeth Kolbert|Picador|405",
    "Guns, Germs, and Steel|Jared Diamond|W. W. Norton|495",
    "A Short History of Nearly Everything|Bill Bryson|Broadway Books|465",
    "The Emperor of All Maladies|Siddhartha Mukherjee|Scribner|525",
    "The Warmth of Other Suns|Isabel Wilkerson|Vintage|485",
    "Team of Rivals|Doris Kearns Goodwin|Simon & Schuster|575"
  ],
  "Biography": [
    "Steve Jobs|Walter Isaacson|Simon & Schuster|599",
    "Leonardo da Vinci|Walter Isaacson|Simon & Schuster|625",
    "Einstein|Walter Isaacson|Simon & Schuster|595",
    "The Diary of a Young Girl|Anne Frank|Bantam|325",
    "Long Walk to Freedom|Nelson Mandela|Back Bay Books|525",
    "I Am Malala|Malala Yousafzai|Little, Brown|395",
    "The Autobiography of Malcolm X|Malcolm X|Ballantine Books|425",
    "Benjamin Franklin|Walter Isaacson|Simon & Schuster|575",
    "Alexander Hamilton|Ron Chernow|Penguin Books|595",
    "Churchill|Andrew Roberts|Viking|625",
    "The Wright Brothers|David McCullough|Simon & Schuster|475",
    "John Adams|David McCullough|Simon & Schuster|565",
    "Truman|David McCullough|Simon & Schuster|585",
    "Grant|Ron Chernow|Penguin Press|625",
    "Washington|Ron Chernow|Penguin Books|645",
    "The Immortal Life of Henrietta Lacks|Rebecca Skloot|Broadway Books|395",
    "Unbroken|Laura Hillenbrand|Random House|455",
    "Into Thin Air|Jon Krakauer|Anchor|395",
    "The Glass Castle|Jeannette Walls|Scribner|375",
    "Wild|Cheryl Strayed|Vintage|385"
  ]
};

// Generate books from templates
function generateBooks() {
  const allBooks = [];
  
  for (const [category, templates] of Object.entries(bookTemplates)) {
    templates.forEach((template, index) => {
      const [title, author, publisher, price] = template.split('|');
      allBooks.push({
        title,
        author,
        description: `${title} by ${author} - A must-read ${category.toLowerCase()} book.`,
        price: parseInt(price),
        category,
        brand: publisher,
        publisher,
        stock: Math.floor(Math.random() * 50) + 30,
        images: [{ 
          url: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(7)}?w=400`, 
          alt: title 
        }],
        isbn: `978${Math.floor(Math.random() * 1000000000)}`,
        language: "English",
        pages: Math.floor(Math.random() * 400) + 200,
        format: Math.random() > 0.5 ? "Paperback" : "Hardcover"
      });
    });
  }
  
  return allBooks;
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const createdCategories = [];
    for (const category of categories) {
      const cat = await Category.create(category);
      createdCategories.push(cat);
    }
    console.log(`✅ Created ${createdCategories.length} categories`);

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const books = generateBooks();
    const booksWithCategoryIds = books.map(book => ({
      ...book,
      category: categoryMap[book.category]
    }));

    const createdBooks = await Product.insertMany(booksWithCategoryIds);
    console.log(`✅ Created ${createdBooks.length} books`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📚 Summary:`);
    console.log(`   - ${createdCategories.length} categories`);
    console.log(`   - ${createdBooks.length} books total (20 per category)`);
    categories.forEach(cat => {
      const count = booksWithCategoryIds.filter(b => b.category.equals(categoryMap[cat.name])).length;
      console.log(`   - ${cat.name}: ${count} books`);
    });
    console.log(`\n🚀 You can now view the books at http://localhost:4200\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

// Made with Bob
