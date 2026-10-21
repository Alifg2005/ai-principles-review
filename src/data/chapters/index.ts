/**
 * CANONICAL CHAPTER REGISTRY — the single source of truth for available chapters.
 *
 * To add a chapter: create `NN-slug.ts` next to this file, import it below and
 * append it to `chapterRegistry`. Order here does not matter; chapters are
 * validated and sorted by number in src/lib/chapters.ts. Never edit or remove an
 * existing entry when adding a new one. See docs/CHAPTER_WORKFLOW.md.
 */
import introductionToAi from './01-introduction-to-ai';
import intelligentAgents from './02-intelligent-agents';
import searchStrategies from './03-search-strategies';
import solvingProblemsBySearching from './04-solving-problems-by-searching';
import informedSearchAlgorithms from './05-informed-search-algorithms';
import logicalAgents from './07-logical-agents';
import knowledgeRepresentation from './08-knowledge-representation';

export const chapterRegistry = [
  introductionToAi,
  intelligentAgents,
  searchStrategies,
  solvingProblemsBySearching,
  informedSearchAlgorithms,
  logicalAgents,
  knowledgeRepresentation,
] as const;
