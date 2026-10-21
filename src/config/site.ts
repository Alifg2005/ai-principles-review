/**
 * Editable academic and personal information.
 * This is the only place these values live; components read them from here.
 * Optional values can be removed to hide them from the interface.
 */
export interface SiteConfig {
  /** Product name used in page titles and metadata. */
  productName: string;
  /** Visual identity / wordmark shown in the header. */
  brand: string;
  description: string;
  course: {
    title: string;
    /** Course code as printed on the lecture slides. */
    code?: string;
  };
  /** Student / project author shown on the home page and footer. */
  author?: string;
}

export const siteConfig: SiteConfig = {
  productName: 'AI Principles Review',
  brand: 'MIND//LAB',
  description:
    "An interactive study experience for reviewing AI Principles through chapter-based quizzes grounded in the course lecture materials. Twenty questions per chapter, with every answer explained and traced back to the lecture slides.",
  course: {
    // From the title slide of the Week 1 lecture deck.
    title: 'Artificial Intelligence: Principles and Techniques',
    // Printed on the Topic 2, Week 3, Topic 7 and Knowledge Representation decks.
    code: 'ARTI 401',
  },
  author: 'Ali Feras Alghanim',
};
