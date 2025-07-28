'use client';

import { Components } from "@formio/react";
import { Formio } from "formiojs";
import EmojiSelectorComponent from "../custom-components/emoji-selector/emojiSelector";
import Rating from "../custom-components/rating/Rating";

export function registerCustomRatingComponent () {
    Components.addComponent('rating', Rating);
}

export function registerCustomEmojiComponent() {
    Components.addComponent('emojiselect', EmojiSelectorComponent);
}