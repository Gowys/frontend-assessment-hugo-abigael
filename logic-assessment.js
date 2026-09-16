/**
 * Count how many times each letter appears in a string.
 * Whitespace, punctuation, and numbers are ignored.
 * The input is not mutated.
 */
export function countCharacterFrequency(text) {
  if (typeof text !== 'string') return {};

  return [...text.toLowerCase()].reduce((frequency, character) => {
    if (!/[a-z]/.test(character)) return frequency;

    frequency[character] = (frequency[character] || 0) + 1;
    return frequency;
  }, {});
}

/**
 * Filter adult users, group them by gender, and calculate the average age.
 * Invalid/missing age or gender values are skipped so malformed records do not
 * create misleading groups such as "undefined".
 * The input array and user objects are not mutated.
 */
export function processUserData(users) {
  if (!Array.isArray(users) || users.length === 0) return {};

  const groups = users.reduce((result, user) => {
    if (!user || typeof user !== 'object') return result;

    const age = Number(user.age);
    const gender = typeof user.gender === 'string'
      ? user.gender.trim().toLowerCase()
      : '';

    if (!Number.isFinite(age) || age < 18 || !gender) return result;

    if (!result[gender]) {
      result[gender] = {
        count: 0,
        totalAge: 0,
        users: [],
      };
    }

    result[gender].count += 1;
    result[gender].totalAge += age;
    result[gender].users.push({ ...user });

    return result;
  }, {});

  return Object.fromEntries(
    Object.entries(groups).map(([gender, group]) => [
      gender,
      {
        count: group.count,
        averageAge: Number((group.totalAge / group.count).toFixed(1)),
        users: group.users,
      },
    ]),
  );
}
