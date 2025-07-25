'use client';

import { Components } from "@formio/react";
import RatingComponent from "../custom-components/rating-component/ratingComponent";

export function registerCustomRatingComponent () {
    Components.addComponent('rating', RatingComponent);
}