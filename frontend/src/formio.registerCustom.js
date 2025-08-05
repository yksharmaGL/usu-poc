import { Components } from 'formiojs';
// Import all your custom components here
import EmojiSelectorComponent from './components/emoji-selector/emojiSelector';
import RatingComponent from './components/rating-component/ratingComponent';
import TextEditorComponent from './components/text-editor/textEditor';

// ... import more as needed

// Register each custom component once
Components.addComponent('emojiselect', EmojiSelectorComponent);

Components.addComponent('rating', RatingComponent);

Components.addComponent('textEditor', TextEditorComponent);
