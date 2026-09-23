/* NameNest engine - pure mutual-match name logic, shared by app.html and node tests. */
(function(root, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NameNestEngine = factory();
})(typeof self !== 'undefined' ? self : this, function(){

  /* canonical display form: collapse spaces, title-case each word */
  function display(name){
    return name.trim().replace(/\s+/g, ' ').split(' ').map(function(w){
      return w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
    }).join(' ');
  }

  /* match key: case-insensitive */
  function key(name){
    return display(name).toLowerCase();
  }

  function valid(name){
    return display(name).length >= 1 && display(name).length <= 40;
  }

  /* add to a like-list (array of display names); returns {list, added} */
  function add(list, name){
    if (!valid(name)) return {list:list, added:false};
    var d = display(name), k = key(name);
    var exists = list.some(function(n){ return key(n) === k; });
    if (exists) return {list:list, added:false};
    return {list:list.concat([d]), added:true};
  }

  function remove(list, name){
    var k = key(name);
    return list.filter(function(n){ return key(n) !== k; });
  }

  /* mutual matches, display form taken from listA, alpha-sorted */
  function matches(listA, listB){
    var keysB = {};
    listB.forEach(function(n){ keysB[key(n)] = true; });
    return listA.filter(function(n){ return keysB[key(n)]; }).sort(function(a,b){ return a.localeCompare(b); });
  }

  function stats(listA, listB){
    var m = matches(listA, listB);
    return {a:listA.length, b:listB.length, matched:m.length};
  }

  return {display:display, key:key, valid:valid, add:add, remove:remove, matches:matches, stats:stats};
});
