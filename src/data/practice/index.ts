/**
 * CANONICAL PRACTICE REGISTRY for Written & Practical Review.
 *
 * Each file holds one chapter's questions and is linked to the chapter registry by `chapterId`.
 * To add a set: create `NN-slug.ts` next to this file, import it below and append it.
 * Sets are validated and ordered by chapter number in src/lib/practice.ts.
 */
import introductionToAi from './01-introduction-to-ai';
import intelligentAgents from './02-intelligent-agents';
import searchStrategies from './03-search-strategies';
import solvingProblemsBySearching from './04-solving-problems-by-searching';
import informedSearchAlgorithms from './05-informed-search-algorithms';
import logicalAgents from './07-logical-agents';
import expertSystems from './08-expert-systems';
import knowledgeRepresentation from './09-knowledge-representation';
import naturalLanguageProcessing1 from './10-natural-language-processing-1';
import naturalLanguageProcessing2 from './11-natural-language-processing-2';

export const practiceRegistry = [
  introductionToAi,
  intelligentAgents,
  searchStrategies,
  solvingProblemsBySearching,
  informedSearchAlgorithms,
  logicalAgents,
  expertSystems,
  knowledgeRepresentation,
  naturalLanguageProcessing1,
  naturalLanguageProcessing2,
] as const;
