const charLength = document.querySelector('input[type="range"]');
const copyBtn = document.querySelector('.btn-copy');
const copyText = document.querySelector('.copied-text');
const form = document.querySelector('form');
const passwordDisplay = document.querySelector('.pw-display');

const ratingBars = document.querySelector('.rating-bars');
const singleBars = ratingBars.children;
const checkBoxes = document.querySelectorAll('input[type=checkbox]');
const strengthDescription = document.querySelector('.strength-rating__text');

const CHARACTER_SETS = {
   uppercase: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
   lowercase: ['abcdefghijklmnopqrstuvwxyz'],
   numbers: ['1234567890'],
   symbols: ['!@#$%^&*()_+{}[]<>?'],
};

const generatePassword = (e) => {
   e.preventDefault();
   try {
      validateInput();
      resetBarStyles();
      //Array [ "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz" ]
      const includedSets = getIncludedSets();
      const charPool = calculateCharPool(includedSets);
      const generatedPassword = generateRandomPassword(includedSets, charPool);

      const strength = calcStrength(charLength.value, charPool);
      styleMeter(strength);

      passwordDisplay.textContent = generatedPassword;
      canCopy = true;
   } catch (err) {
      console.error(err);
   }
};

const validateInput = () => {
   // At least one box is checked
   if (Array.from(checkBoxes).every((box) => box.checked === false)) {
      throw new Error('At least one box has to be checked');
   }
};

const getIncludedSets = () => {
   const includedSets = [];
   checkBoxes.forEach((box) => {
      if (box.checked) {
         includedSets.push(CHARACTER_SETS[box.value][0]);
      }
   });
   return includedSets;
};

const calculateCharPool = (includedSets) => {
   let charPool = 0;
   includedSets.forEach((set) => {
      charPool += set.length;
   });
   return charPool;
};

const generateRandomPassword = (includedSets, charPool) => {
   let generatedPassword = '';
   for (let i = 0; i < charLength.value; i++) {
      const randSetIndex = Math.floor(Math.random() * includedSets.length);
      const randSet = includedSets[randSetIndex];
      const randCharIndex = Math.floor(Math.random() * randSet.length);
      const randChar = randSet[randCharIndex];
      generatedPassword += randChar;
   }
   return generatedPassword;
};

const calcStrength = (passwordLength, charPool) => {
   const strength = passwordLength * Math.log2(charPool);

   if (strength < 25) {
      return ['Too Weak!', 1];
   } else if (strength >= 25 && strength < 50) {
      return ['Weak', 2];
   } else if (strength >= 50 && strength < 75) {
      return ['Medium', 3];
   } else {
      return ['Strong', 4];
   }
};

const styleBars = ([...barElements], color) => {
   barElements.forEach((bar) => {
      bar.style.backgroundColor = color;
      bar.style.borderColor = color;
   });
};

const styleMeter = (rating) => {
   const text = rating[0];
   const numBars = rating[1];
   const barsToFill = Array.from(singleBars).slice(0, numBars);

   //    resetBarStyles();

   strengthDescription.textContent = text;

   switch (numBars) {
      case 1:
         return styleBars(barsToFill, 'hsl(0, 91%, 63%)');
      case 2:
         return styleBars(barsToFill, 'hsl(13, 95%, 66%)');
      case 3:
         return styleBars(barsToFill, 'hsl(42, 91%, 68%)');
      case 4:
         return styleBars(barsToFill, 'hsl(127, 100%, 82%');
      default:
         throw new Error('Invalid value for numBars');
   }
};

const resetBarStyles = () => {
   const bars = Array.from(singleBars);
   bars.forEach((bar) => {
      bar.style.backgroundColor = 'transparent';
      bar.style.borderColor = 'hsl(252, 11%, 91%)';
   });
};

//CLIPBOARD

const copyPassword = async () => {
   await navigator.clipboard.writeText(passwordDisplay.textContent);
   copyText.textContent = 'COPIED';

   // Fade out text after 1 second
   setTimeout(() => {
      copyText.style.transition = 'all 1s';
      copyText.style.opacity = 0;

      // Remove styles and text after fade out
      setTimeout(() => {
         copyText.style.removeProperty('opacity');
         copyText.style.removeProperty('transition');
         copyText.textContent = '';
      }, 1000);
   }, 1000);
};

// displays
const displayNum = () => {
   const charCount = document.querySelector('#char-count');
   charCount.textContent = charLength.valueAsNumber;
};

charLength.addEventListener('input', displayNum);
copyBtn.addEventListener('click', copyPassword);
form.addEventListener('submit', generatePassword);
