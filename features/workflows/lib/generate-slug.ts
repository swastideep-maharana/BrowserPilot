import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  type Config,
} from "unique-names-generator";

const config: Config = {
  dictionaries: [adjectives, animals],
  separator: "-",
  length: 2,
  style: "lowerCase",
};

/**
 * Generates a random hyphenated slug made from an adjective and an animal.
 * @example "brave-otter"
 */
export function generateSlug(): string {
  return uniqueNamesGenerator(config);
}
