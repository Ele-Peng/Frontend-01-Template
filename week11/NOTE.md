while (collection.length) {

  let [x, y] = collection.take()
  if (x === start[0] && y === start[1]) {
    map[100 * y + x] = 'start'
  }
  if (x === end[0] && y === end[1]) {
    let path = []
    // 这句？？？ 造成死循环
    while (x !== start[0] || y !== start[1]) {
      path.push([x, y])
      // container.children[y * 100 + x].style.backgroundColor = 'pink'
      [x, y] = map[y * 100 + x]
      console.log('[x,y]', [x, y])
    }
    return path
  }
}