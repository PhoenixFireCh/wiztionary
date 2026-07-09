const sorters = {
    "name":    (a, b) => a.name.localeCompare(b.name),
    "-name":   (a, b) => b.name.localeCompare(a.name),

    "range":   (a, b) => a.range - b.range,
    "-range":  (a, b) => b.range - a.range,
};
export const Filters = {
    findHighestDmg(list) {
    const filtered = list.map(o => ({dmg: o.damage_roll, name: o.name}));
    let longest = {dmg: '', name: ''};
    let longestTotal = 0;
    for (const item of filtered) {
      if (item.dmg.length > 0) {
        const [count, sides] = item.dmg.split("d").map(Number);
        if ((count * sides) > longestTotal) {
          longest = {dmg: item.dmg, name: item.name};
          longestTotal = count * sides;
        }
      }
    }
    return longest
  },
  findLongestRange(list) {
    const filtered = list.map(o => ({range: o.range, name: o.name}));
    filtered.sort((a,b) => b.range - a.range); 
    if (filtered.length > 0) {
      return {range: filtered[0].range, name: filtered[0].name};
    }  else {
      return {range: '', name: ''};
    }

  },
  sortItems(list, parameters) {
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
        result = result = result.filter(item => 
        item.classes.some(cls => cls.name === parameters.class)
        );
    }

    // order everything up
    result = result.sort(sorters[parameters.ordering]);
    return result;
  },
  graphSchoolRange(list) {
    let result = new Map();
    for (const item of list) {
      const school = item.school.name;
      const range = item.range;
      if (![...result.keys()].includes(school) || result.get(school) < range) {
        result.set(school, range)
      }
    }
    
    return Array.from(result, ([school, range]) => ({school, range}));
  }
};