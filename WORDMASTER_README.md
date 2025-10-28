# 📚 WordMaster - Advanced Vocabulary Learning Platform

> Transform your vocabulary learning experience with an interactive, feature-rich platform designed for serious language learners.

![WordMaster Banner](cover.png)

## ✨ Features

### 🎯 Core Features

- **Dynamic Word Loading**: Centralized JSON-based word database with 12+ words and growing
- **Bilingual Support**: English and Bengali meanings, pronunciations, and audio
- **Smart Search**: Real-time search across words, definitions, and meanings
- **Advanced Filtering**: Filter by category, difficulty level, and learning status
- **Progress Tracking**: Track your learning journey with detailed statistics
- **Interactive Dashboard**: Visual progress indicators and achievement tracking

### 🎨 User Experience

- **Dark Mode**: Toggle between light and dark themes for comfortable reading
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and interactions
- **Audio Pronunciation**: Listen to correct pronunciation in English and Bengali
- **Favorites System**: Bookmark words for later review
- **Learning Status**: Mark words as learned and track your progress

### 🎓 Learning Tools

- **Interactive Quiz Mode**: Test your knowledge with randomized quizzes
- **Score Tracking**: Monitor your quiz performance
- **Example Sentences**: See words used in context
- **Synonyms & Antonyms**: Expand your vocabulary connections
- **Part of Speech**: Understand grammatical usage

### 💾 Data Management

- **Export Progress**: Download your learning progress as JSON
- **Export Word Lists**: Save word lists as TXT or CSV
- **Share Words**: Share individual words via native sharing or clipboard
- **Local Storage**: All progress saved automatically in your browser
- **Data Persistence**: Never lose your learning progress

## 🚀 Getting Started

### Quick Start

1. **Classic View**: Open `index.html` for the original interface
2. **Advanced Platform**: Open `app.html` for the full-featured experience

### File Structure

```
WOTD/
├── app.html                 # Main application (Advanced Platform)
├── index.html              # Classic word display (Day 1)
├── index2.html             # Classic word display (Day 2)
├── css/
│   ├── app.css            # Comprehensive application styles
│   └── styles.css         # Classic styles
├── js/
│   ├── app.js             # Main application logic
│   ├── moment.min.js      # Date handling
│   └── fetchword.js       # Word fetching utilities
├── data/
│   └── words.json         # Centralized word database
├── enhanced/
│   └── *.wav              # Audio pronunciation files
└── *.png                  # Images and assets
```

## 📖 How to Use

### Viewing Words

1. **Browse All Words**: Default view shows all available words
2. **Search**: Use the search bar to find specific words or definitions
3. **Filter by Category**: Select from 8 categories (descriptive, communication, etc.)
4. **Filter by Difficulty**: Choose beginner, intermediate, or advanced levels

### Managing Your Learning

1. **Mark as Learned**: Click the "Mark as Learned" button on any word card
2. **Add to Favorites**: Click the star icon to bookmark important words
3. **Track Progress**: View your stats in the dashboard at the top

### Taking Quizzes

1. Click the **Quiz** button in the navigation
2. Answer multiple-choice questions about word definitions
3. Get instant feedback on your answers
4. View your final score and try again

### Exporting Data

1. Click the **Export** button in navigation
2. Choose your export format:
   - **Progress**: Your favorites and learning history (JSON)
   - **TXT**: Word list in text format
   - **CSV**: Spreadsheet-compatible format

## 🎨 Customization

### Dark Mode

Click the moon/sun icon in the header to toggle between light and dark themes. Your preference is automatically saved.

### Views

Switch between different views using the navigation buttons:
- **All Words**: See every word in the database
- **Favorites**: Only your bookmarked words
- **Learned**: Words you've marked as learned
- **To Learn**: Words you haven't learned yet

## 🌟 Word Database Structure

Each word in the database includes:

```json
{
  "id": 1,
  "word": "Ephemeral",
  "pronunciation": "/ɪˈfem.ər.əl/",
  "definition": "Lasting for a very short time...",
  "bengaliMeaning": "অল্পক্ষণস্থায়ী",
  "example": "The beauty of cherry blossoms is ephemeral...",
  "partOfSpeech": "Adjective",
  "difficulty": "advanced",
  "category": "descriptive",
  "synonyms": ["transient", "fleeting", "temporary"],
  "antonyms": ["permanent", "eternal"],
  "audioEn": "enhanced/Ephemeral (enhanced).wav",
  "audioBn": "enhanced/ephemeral bengali (enhanced).wav",
  "day": 1
}
```

## 📊 Categories

- **Descriptive**: Words that describe qualities
- **Communication**: Words related to expression
- **Quantity**: Words about amounts and measures
- **Position**: Words about location and placement
- **Emotion**: Words describing feelings
- **Action**: Verbs and action words
- **Personality**: Words describing character traits
- **Time**: Words related to temporal concepts

## 🎯 Difficulty Levels

- **Beginner**: Common, everyday words
- **Intermediate**: More sophisticated vocabulary
- **Advanced**: Complex, specialized words

## 💡 Tips for Effective Learning

1. **Daily Practice**: Review words regularly for better retention
2. **Use Favorites**: Bookmark challenging words for focused study
3. **Take Quizzes**: Test yourself periodically to reinforce learning
4. **Listen to Audio**: Improve pronunciation by listening to audio files
5. **Read Examples**: Understand usage through context
6. **Track Progress**: Monitor your statistics to stay motivated

## 🔧 Technical Features

### Performance
- Lazy loading for images
- Optimized animations
- Efficient data filtering
- Minimal dependencies

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Storage
- LocalStorage for user preferences
- Session persistence
- No server required
- Privacy-focused (all data stored locally)

## 🎨 Design Principles

- **Clean & Modern**: Professional, distraction-free interface
- **Accessible**: WCAG 2.1 compliant, keyboard navigation
- **Responsive**: Mobile-first design approach
- **Intuitive**: Self-explanatory UI elements
- **Fast**: Optimized for quick loading and smooth interactions

## 📱 Mobile Experience

The application is fully responsive and optimized for:
- Touch interactions
- Smaller screen sizes
- Mobile-specific layouts
- Native sharing on supported devices

## 🔐 Privacy

- **No Tracking**: No analytics or tracking scripts
- **Local Storage**: All data stays on your device
- **No Server**: Completely client-side application
- **No Sign-up**: Start learning immediately

## 🚀 Future Enhancements

Potential features for future versions:
- [ ] Spaced repetition algorithm
- [ ] More languages support
- [ ] Voice recording for pronunciation practice
- [ ] Flashcard mode
- [ ] Study groups/challenges
- [ ] Import custom word lists
- [ ] Advanced statistics and insights
- [ ] Offline PWA support

## 📝 Adding New Words

To add words to the database, edit `data/words.json`:

```json
{
  "id": 13,
  "word": "Your Word",
  "pronunciation": "/pronunciation/",
  "definition": "Definition here",
  "bengaliMeaning": "বাংলা অর্থ",
  "example": "Example sentence",
  "partOfSpeech": "Noun/Verb/Adjective",
  "difficulty": "beginner/intermediate/advanced",
  "category": "category_name",
  "synonyms": ["word1", "word2"],
  "antonyms": ["opposite1"],
  "audioEn": "path/to/audio.wav",
  "audioBn": "path/to/bengali/audio.wav",
  "day": 1
}
```

## 🤝 Contributing

Suggestions for improvements:
1. Add more words to the database
2. Improve translations
3. Add more audio files
4. Enhance UI/UX
5. Fix bugs or issues

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- **Font**: Inter by Rasmus Andersson
- **Design Inspiration**: Modern vocabulary learning platforms
- **Audio**: Enhanced pronunciation files for better clarity

## 📞 Support

For issues or questions:
1. Check the documentation above
2. Review the code comments
3. Test in a modern browser
4. Clear browser cache if needed

---

**Made with ❤️ for language learners**

*WordMaster - Where vocabulary meets technology*
