const sorters = {
    "name":    (a, b) => a.name.localeCompare(b.name),
    "-name":   (a, b) => b.name.localeCompare(a.name),

    "range":   (a, b) => a.range - b.range,
    "-range":  (a, b) => b.range - a.range,
};
export const Filters = {
    findHighestDmg(list) {
    const filtered = list.map(o => ({dmg: o.damage_roll, name: o.name})); //Filters out other attributes
    let longest = {dmg: '', name: ''};
    let longestTotal = 0;
    for (const item of filtered) {
      if (item.dmg.length > 0) {
        const total = this.parseDice(item.dmg);
        if (total > longestTotal) {
          longest = {dmg: item.dmg, name: item.name};
          longestTotal = total;
        }
      }
    }
    return longest
  },
  findLongestRange(list) {
    const filtered = list.map(o => ({range: o.range, name: o.name})); //Filters out other attributes
    filtered.sort((a,b) => b.range - a.range); 
    if (filtered.length > 0) {
      return {range: filtered[0].range, name: filtered[0].name};
    }  else {
      return {range: '', name: ''};
    }

  },
  sortItemsHarsh(list, parameters) {
    // filter by Search
    let result = list;
    if (parameters.search != "") {
        result = result.filter(item => 
            item.name.toLowerCase().includes(parameters.search.toLowerCase())
        );
    }
    // filter by level
    result = result.filter(item => 
        item.level == parameters.level
    );

    // filter by class
    if (parameters.class != "") {
        result = result.filter(item => 
        item.classes.some(cls => cls.name === parameters.class)
        );
    }

    // order everything up
    result = result.sort(sorters[parameters.ordering]);
    return result;
  },
  sortItemsGentle(list, parameters) {
    // filter by Search
    let result = list;
    if (parameters.search != "") {
        result = result.filter(item => 
            item.name.toLowerCase().includes(parameters.search.toLowerCase())
        );
    }
    // filter by level
    result = result.filter(item => 
        item.level <= parameters.level
    );

    // filter by class
    if (parameters.class != "") {
        result = result.filter(item => 
        item.classes.some(cls => cls.name === parameters.class) || 
        item.classes.length === 0
      );
    }
    return result;
  },
  graphSchoolRange(list) {
    let result = new Map();
    for (const item of list) {
      const school = item.school.name;
      const range = item.range;
      if (![...result.keys()].includes(school) || result.get(school) < range) {
        result.set(school, range);
      }
    }
    
    return Array.from(result, ([school, range]) => ({school, range}));
  },
  graphSchoolDamage(list) {
    let result = new Map();
    for (const item of list) {
      const school = item.school.name;
      const damage = this.parseDice(item.damage_roll);
      if ((![...result.keys()].includes(school) || result.get(school) < damage) && !Number.isNaN(damage)) {
        result.set(school, damage);
      }
    }
    return Array.from(result, ([school, dmg]) => ({school, dmg}));
  }, 
  parseDice(string) {
    const terms = string.split("+").map(term => term.trim()).filter(term => term.length > 0);
    if (terms.length === 0) return NaN;   // preserves "" -> NaN (empty rolls stay excluded)
    return terms.reduce((sum, term) => {
      if (term.includes("d")) {
        const [count, sides] = term.split("d").map(Number);
        return sum + (count * sides);
      }
      return sum + Number(term);           // flat modifier or fixed-damage number
    }, 0);
  },
  addId(json) {
    let result = json.results.map(item => ({
      ...item,
      id: crypto.randomUUID()
    }));
    return result;
  },
  checkAbilityScore(total, score) {
    return total - score.strength - score.dexterity - score.constitution - score.intelligence - score.wisdom - score.charisma;
  }
};