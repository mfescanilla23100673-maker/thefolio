// backend/seedPosts.js
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');

const poems = [
  {
    title: 'Journey Through the Night',
    body: 'The stars whisper tales of ancient dreams,\nWhile moonlight paints the world in silver beams.\nI walk this path with hope in my heart,\nSearching for where two souls can start.\n\nIn the silence of the evening breeze,\nI find my peace and cherish these:\nThe moments that make life feel so real,\nThe quiet joys that help me heal.'
  },
  {
    title: 'Whispers of the Heart',
    body: 'In every heartbeat, I hear your name,\nA gentle spark that lights my flame.\nThrough the darkest night, I\'ll always find,\nThe warmth of love that\'s so divine.\n\nLet us dance beneath the starlit sky,\nAs time passes by, we\'ll reach up high.\nFor in this world of endless strife,\nYou are the song that gives me life.'
  },
  {
    title: 'Echoes of Tomorrow',
    body: 'The dawn breaks gently on the horizon,\nBringing hope and a new beginning.\nEach moment is a precious gift,\nA chance to grow and uplift.\n\nWith courage burning in my soul,\nI strive to make myself whole.\nThrough every challenge I will see,\nThe person I\'m meant to be.\n\nTomorrow holds infinite dreams,\nNothing\'s as impossible as it seems.\nI chase my passion with all my might,\nGuidance from stars burning bright.'
  },
  {
    title: 'Colors of Love',
    body: 'Red as the roses in summer\'s bloom,\nFilling every corner of my room.\nOrange like the sunset\'s glow,\nA warmth that helps my spirit grow.\n\nYellow bright as morning\'s ray,\nGuiding me through each new day.\nGreen as life that\'s ever strong,\nA feeling where I belong.\n\nYour love paints my world so true,\nEvery color reflects what\'s you.\nIn this canvas of our fate,\nI love you more with every heartbeat.'
  },
  {
    title: 'Dreams Never Die',
    body: 'When shadows fall and hope seems lost,\nRemember the price we\'ve already crossed.\nEvery tear has made us strong,\nThis is where we all belong.\n\nOur dreams are painted in the sky,\nThey never fade, they never die.\nSo take my hand and hold it tight,\nWe\'ll reach the stars and stand so high.\n\nTogether we can conquer all,\nWe\'ll rise no matter how we fall.\nIn this journey called our life,\nThrough joy and sorrow, strife and strife.'
  },
];

connectDB().then(async () => {
  try {
    // Find admin user
    const admin = await User.findOne({ email: 'admin@thefolio.com' });
    if (!admin) {
      console.log('Admin account not found. Please run seedAdmin.js first.');
      process.exit();
    }

    // Check if posts already exist
    const existingPosts = await Post.countDocuments();
    if (existingPosts > 0) {
      console.log(`${existingPosts} posts already exist. Skipping seed.`);
      process.exit();
    }

    const images = ['buwan.jpg', 'iba.jpg', 'nice.jpg', 'thetwo.jpg', 'walking.jpg'];

    // Create posts
    for (let i = 0; i < poems.length; i++) {
      const post = await Post.create({
        title: poems[i].title,
        body: poems[i].body,
        image: images[i % images.length],
        author: admin._id,
      });
      console.log(`Created post: ${post.title}`);
    }

    console.log(`Successfully created ${poems.length} sample posts!`);
    process.exit();
  } catch (err) {
    console.error('Error seeding posts:', err.message);
    process.exit(1);
  }
});
