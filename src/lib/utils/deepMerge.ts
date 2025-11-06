/**
 * Deep Merge Utility - NextDeal Frontend
 *
 * This utility provides safe deep merging of JavaScript objects.
 * It's used throughout the application for updating user data, form state,
 * and other nested object structures without mutating the original objects.
 *
 * Features:
 * - Deep object merging with nested property support
 * - Safe cloning to prevent mutation of original objects
 * - Circular reference handling
 * - Configurable safety options
 * - Constructor preservation for complex objects
 */

/**
 * Safely clone an object using JSON serialization
 * @param {Object} obj - Object to clone
 * @param {boolean} isStrictlySafe - Whether to throw errors on unsafe operations
 * @returns {Object} Cloned object
 */
function clone(obj: unknown, isStrictlySafe = false): unknown {
  /* Clones an object. First attempt is safe. If it errors (e.g. from a circular reference),
          'isStrictlySafe' determines if error is thrown or an unsafe clone is returned. */
  try {
    // Use JSON serialization for safe deep cloning
    return JSON.parse(JSON.stringify(obj));
  } catch (err: unknown) {
    if (isStrictlySafe) {
      throw new Error(err as string);
    }

    // Fallback to shallow spread operator if JSON cloning fails
    return { ...(obj as Record<string, unknown>) };
  }
}

/**
 * Deep merge source object into target object
 * @param {Object} target - Target object to merge into
 * @param {Object} source - Source object to merge from
 * @param {Object} options - Merge options
 * @param {boolean} options.isMutatingOk - Whether mutation of target is allowed
 * @param {boolean} options.isStrictlySafe - Whether to throw errors on unsafe operations
 * @returns {Object} Merged object
 */
export default function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  { isMutatingOk = false, isStrictlySafe = false }: { isMutatingOk?: boolean, isStrictlySafe?: boolean } = {},
): Record<string, unknown> {
  /* Returns a deep merge of source into target.
          Does not mutate target unless isMutatingOk = true. */

  // Clone target if mutation is not allowed
  target = isMutatingOk ? target : clone(target, isStrictlySafe) as Record<string, unknown>;

  // Iterate through source object properties
  for (const [key, val] of Object.entries(source)) {
    if (val !== null && typeof val === 'object') {
      // Handle nested objects
      if (target[key] === undefined) {
        // Create new instance with same constructor if property doesn't exist
        target[key] = new (val as { __proto__: { constructor: new () => unknown } }).__proto__.constructor();
      }
      /* even where isMutatingOk = false, recursive calls only work on clones, so they can always
              safely mutate --- saves unnecessary cloning */
      target[key] = deepMerge(target[key] as Record<string, unknown>, val as Record<string, unknown>, {
        isMutatingOk: true,
        isStrictlySafe,
      });
    } else {
      // Handle primitive values
      target[key] = val;
    }
  }
  return target;
}

