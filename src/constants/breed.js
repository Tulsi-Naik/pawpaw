export const BREEDS_LIST = [
  // Popular / Featured
  "Indie", "Labrador Retriever", "Golden Retriever", "German Shepherd", 
  "Beagle", "Shih Tzu", "Pug", "Rottweiler", "Cocker Spaniel", "French Bulldog",
  // A-Z others
  "Australian Shepherd", "Boxer", "Chihuahua", "Chow Chow","Corgi", "Dachshund", 
  "Dalmatian", "Doberman Pinscher", "Great Dane", "Greyhound", "Husky", 
  "Jack Russell Terrier", "Lhasa Apso", "Maltese", "Mastiff", "Pomeranian", 
  "Poodle", "Saint Bernard", "Siberian Husky", "Tibetan Mastiff", "Other"
].sort((a, b) => {
    if (a === "Indie") return -1; // Keep Indie at the very top
    return a.localeCompare(b);
});