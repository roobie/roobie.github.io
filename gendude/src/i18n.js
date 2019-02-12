const translations = {
  // meta
  'male': 'man',
  'female': 'kvinna',
  'non-binary': 'icke-binär',

  // races
  'dwarf': 'dvärg',
  'gnome': 'tomte',
  'wood elf': 'skogsalv',
  'drow': 'mörkeralv',
  'high elf': 'högalv',
  'halfling': 'halvlängdsman/kvinna',
  'half elf': 'halvalv',
  'half orc': 'halvorch',
  'goblin': 'goblin',
  'kobold': 'kobold',
  'faerie': 'fé',
  'human': 'människa',

  // classes
  'barbarian': 'barbar',
  'bard': 'bard',
  'cleric': 'präst/inna',
  'druid': 'druid',
  'fighter': 'krigare',
  'mage': 'magiker',
  'monk': 'munk',
  'paladin': 'tempelriddare',
  'ranger': 'utbygdsjägare',
  'rogue': 'skurk',

  'rage': 'bärsärkagång',
  'backstab': 'lönnstick',
  'darkvision': 'mörkersyn',
  'night vision': 'nattsyn',
  'arcane spellcasting': 'magisk förmåga',
  'music': 'musik',

  'passive': 'passiv',
  'day': 'dag',
}

export function translate(word) {
  const something = translations[word]
  if (!something) return word
  return something
}

export function translateObj(obj, type = null) {
  if (type === 'ability') {
    if (typeof obj === 'object') {
      if (obj.per) {
        return `${translate(obj.name)} (${translate(obj.amount)}/${translate(obj.per)})`
      } else {
        return `${translate(obj.name)} (${translate(obj.amount)})`
      }
    }
  }

  return translate(obj.name || obj)
}
