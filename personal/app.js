/* All selections belong to this page instance. */
(async () => {
  'use strict';
  const get = id => document.getElementById(id);
  try {
    const graph = location.protocol === 'file:' ? window.OFFLINE_TEACHING_FLOOR : await readFloor();
    async function readFloor() {
      const response = await fetch('./floor.json');
      if (!response.ok) throw Error('楼层数据读取失败');
      return response.json();
    }
    const rooms = graph.nodes.filter(n => n.kind === 'room').sort((a,b) => a.id.localeCompare(b.id));
    const exits = graph.nodes.filter(n => n.kind === 'exit');
    const doors = graph.edges.filter(e => e.kind === 'door');
    const corridors = graph.edges.filter(e => e.kind === 'corridor');
    const items = new Map([...exits, ...doors, ...corridors].map(item => [item.id, item]));
    const baseline = SampleRouting.run(graph);
    const state = {room:'', pending:'', results:baseline, closedEdges:new Set(), closedExits:new Set(), view:'2d', camera:0};
    const roomInput = get('room'), elementInput = get('element'), toggle = get('toggle');
    for (const room of rooms) roomInput.add(new Option(room.id + ' · ' + room.label, room.id));
    for (const [groupName, options] of [['室外出口', exits], ['走廊', corridors], ['教室门', doors]]) {
      const group = document.createElement('optgroup');
      group.label = groupName;
      for (const item of options) group.append(new Option(item.label + ' · ' + item.id, item.id));
      elementInput.append(group);
    }
    const renderMap = TeachingMap.create(get('floor-map'), graph, chooseRoom, chooseItem);
    const exitLabel = id => items.get(id)?.label.replace(/^示例/, '') || '';
    const format = n => n.toLocaleString('zh-CN', {maximumFractionDigits:2});
    function closures(id) { return items.get(id)?.kind === 'exit' ? state.closedExits : state.closedEdges; }
    function chooseRoom(id) {
      state.room = rooms.some(room => room.id === id) ? id : '';
      state.pending = '';
      roomInput.value = state.room;
      get('action-status').textContent = state.room ? '点选地点后可确认模拟封闭。' : '先选起点房间。';
      update();
    }
    function chooseItem(id) {
      if (!state.room || (id && !items.has(id))) return;
      state.pending = id;
      get('action-status').textContent = id ? '已选 ' + items.get(id).label + '。确认后将重新计算路线。' : '可从图上或列表点选地点。';
      update();
    }
    function recalculate(message) {
      state.results = SampleRouting.run(graph,{closed_edges:[...state.closedEdges], closed_exits:[...state.closedExits]});
      get('action-status').textContent = message;
      update();
    }
    function update() {
      const current = state.results.find(route => route.room_id === state.room);
      const base = baseline.find(route => route.room_id === state.room);
      const closed = [...state.closedEdges, ...state.closedExits];
      get('dest').textContent = !current ? '先选起点查看最近出口' : current.reachable ?
        state.room + ' · 最近' + exitLabel(current.endpoint_id) : state.room + ' · 无可达出口';
      get('distance').textContent = current?.reachable ? format(current.distance_m) : '—';
      get('units').textContent = current?.reachable ? 'm' : '';
      get('change').textContent = !current ? '' : !current.reachable ? '当前设置下没有可走的路线。' :
        closed.length ? '增加 ' + format(current.distance_m-base.distance_m) + ' m · 绕行比 ' +
          (current.distance_m/base.distance_m).toFixed(2) : '正常通行';
      get('baseline').textContent = base ? '基准路线：' + exitLabel(base.endpoint_id) + '，' + format(base.distance_m) + ' m' : '';
      get('ties').textContent = current?.tied_endpoints.length > 1 ? '等距出口：' + current.tied_endpoints.map(exitLabel).join('、') : '';
      get('v2').setAttribute('aria-pressed', String(state.view === '2d'));
      get('v3').setAttribute('aria-pressed', String(state.view === '3d'));
      get('rotate').hidden = state.view !== '3d';
      get('maphelp').textContent = state.room ? '点门、走廊或出口，再在下方确认。放大后可滑动地图。' : '轻点图上房间或用起点列表开始。';
      elementInput.disabled = !state.room;
      elementInput.value = state.pending;
      toggle.disabled = !state.pending;
      toggle.textContent = state.pending && closures(state.pending).has(state.pending) ? '恢复此处通行' : '设为不可通行';
      get('restore').disabled = !closed.length;
      get('chips').replaceChildren(...closed.map(id => {
        const button = document.createElement('button');
        button.textContent = items.get(id).label + ' ×';
        button.setAttribute('aria-label', '恢复' + items.get(id).label);
        button.addEventListener('click', () => {
          closures(id).delete(id);
          recalculate('已恢复' + items.get(id).label + '。');
        });
        return button;
      }));
      const canvas = get('floor-map');
      canvas.setAttribute('aria-label', !current ? '虚构教学楼层图，尚未选择起点' : current.reachable ?
        state.room + ' 到' + exitLabel(current.endpoint_id) + '，' + format(current.distance_m) + ' 米' :
        state.room + ' 无可达路线');
      renderMap(state);
    }
    roomInput.addEventListener('change', () => chooseRoom(roomInput.value));
    elementInput.addEventListener('change', () => chooseItem(elementInput.value));
    toggle.addEventListener('click', () => {
      if (!state.pending) return;
      const set = closures(state.pending), wasClosed = set.delete(state.pending);
      if (!wasClosed) set.add(state.pending);
      recalculate(items.get(state.pending).label + (wasClosed ? '已恢复通行。' : '已设为不可通行。'));
    });
    get('restore').addEventListener('click', () => {
      state.closedEdges.clear(); state.closedExits.clear(); state.pending = '';
      recalculate('全部地点已恢复通行。');
    });
    for (const [button,view] of [['v2','2d'],['v3','3d']]) get(button).addEventListener('click', () => {
      state.view = view; update();
    });
    get('rotate').addEventListener('click', () => { state.camera = (state.camera + 1) % 4; update(); });
    get('zoom').addEventListener('click', () => {
      const viewport = get('viewport'), zoomed = viewport.classList.toggle('zoomed');
      get('zoom').textContent = zoomed ? '全图' : '放大';
      get('zoom').setAttribute('aria-pressed', String(zoomed));
      viewport.scrollLeft = (viewport.scrollWidth-viewport.clientWidth)/2;
    });
    chooseRoom(new URL(location.href).searchParams.get('room'));
    get('work').setAttribute('aria-busy', 'false');
  } catch (error) {
    get('work').hidden = true;
    get('error').hidden = false;
    get('error').textContent = '演练数据无法加载。请确认网页与楼层文件保存在同一目录，然后刷新。';
    console.error(error);
  }
})();
