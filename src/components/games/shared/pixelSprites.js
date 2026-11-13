// Sprite pixel-art Swarm Survivor.
// Tiap sprite ditulis sebagai kisi karakter: satu karakter = satu piksel, '.' = transparan.
// Tiga kucing di sini adalah versi pixel dari peliharaan situs (Maxwell, Akmal, Kucing USU).

const CAT_TAIL = ['.oo.......', 'ohbo......', 'obbo......', '.obo.', '.obbo'];

export const SPRITE_DEFS = {
  /* ---------------------------------------------------------- kucing */
  maxwell: {
    pal: { o: '#07070c', b: '#20212e', h: '#454862', w: '#f4f2ea', y: '#cfe65c', p: '#0b0b10', n: '#f08aa0' },
    frames: [
      [
        '...........o....o...',
        '..........obo..obo..',
        '..........obhhhhhbo.',
        `${CAT_TAIL[0]}obbbbbbbo.`,
        `${CAT_TAIL[1]}obybbbybo.`,
        `${CAT_TAIL[2]}obpbbbpbo.`,
        `${CAT_TAIL[3]}oooooobbwnwbbo.`,
        `${CAT_TAIL[4]}hhhhhobbwwwbbo.`,
        '..obbbbbbbbooooooo..',
        '..obbbbbbbbwwwo.....',
        '..obbbbbbbbwwwo.....',
        '..obbbbbbbbbwwo.....',
        '...obbbbbbbbbo......',
        '....oo.....oo.......',
      ],
      [
        '...........o....o...',
        '..........obo..obo..',
        '..........obhhhhhbo.',
        `${CAT_TAIL[0]}obbbbbbbo.`,
        `${CAT_TAIL[1]}obybbbybo.`,
        `${CAT_TAIL[2]}obpbbbpbo.`,
        `${CAT_TAIL[3]}oooooobbwnwbbo.`,
        `${CAT_TAIL[4]}hhhhhobbwwwbbo.`,
        '..obbbbbbbbooooooo..',
        '..obbbbbbbbwwwo.....',
        '..obbbbbbbbwwwo.....',
        '..obbbbbbbbbwwo.....',
        '...obbbbbbbbbo......',
        '.....oo...oo........',
      ],
    ],
  },
  akmal: {
    pal: { o: '#1c120a', b: '#a07a52', h: '#a07a52', t: '#5e4028', l: '#d2b084', w: '#f6f0e6', e: '#16231b', x: '#ffffff', n: '#d98a7a' },
    frames: [
      [
        '...........o....o...',
        '..........obo..obo..',
        '..........obbtbtbbo.',
        '.oo.......obbbtbbbo.',
        'otbo......obexbexbo.',
        'obbo......obeebeebo.',
        '.oto.oooooolbwnwblo.',
        '.obbobtbtbollwwwllo.',
        '..obtbtbtbbooooooo..',
        '..obtbtbtbbwwwo.....',
        '..obbbbbbbllwwo.....',
        '..obllllllllwwo.....',
        '...obbo...obbo......',
        '...owwo...owwo......',
      ],
      [
        '...........o....o...',
        '..........obo..obo..',
        '..........obbtbtbbo.',
        '.oo.......obbbtbbbo.',
        'otbo......obexbexbo.',
        'obbo......obeebeebo.',
        '.oto.oooooolbwnwblo.',
        '.obbobtbtbollwwwllo.',
        '..obtbtbtbbooooooo..',
        '..obtbtbtbbwwwo.....',
        '..obbbbbbbllwwo.....',
        '..obllllllllwwo.....',
        '..obbo.....obbo.....',
        '..owwo.....owwo.....',
      ],
    ],
  },
  usu: {
    pal: { o: '#1c120e', b: '#f2caa2', h: '#f2caa2', s: '#d48a52', w: '#fcf7ee', e: '#1a1420', x: '#ffffff', n: '#c9686a', k: '#17151f', j: '#3d3954', g: '#f5c832' },
    frames: [
      [
        '...........ooooooo..',
        '..........okkkkkkko.',
        '..........okkjgjkko.',
        '.oo.......okkkkkkko.',
        'obbo......obexbexso.',
        'obso......obeebeeso.',
        '.obo.oooooosbwnwbbo.',
        '.obbobsbbbobbwwwbbo.',
        '..obbbssbbbooooooo..',
        '..obbbbsbbbwwwo.....',
        '..obbbbbbbbwwwo.....',
        '..obbbbbbbbbwwo.....',
        '...obbo...obbo......',
        '...owwo...owwo......',
      ],
      [
        '...........ooooooo..',
        '..........okkkkkkko.',
        '..........okkjgjkko.',
        '.oo.......okkkkkkko.',
        'obbo......obexbexso.',
        'obso......obeebeeso.',
        '.obo.oooooosbwnwbbo.',
        '.obbobsbbbobbwwwbbo.',
        '..obbbssbbbooooooo..',
        '..obbbbsbbbwwwo.....',
        '..obbbbbbbbwwwo.....',
        '..obbbbbbbbbwwo.....',
        '..obbo.....obbo.....',
        '..owwo.....owwo.....',
      ],
    ],
  },

  /* ----------------------------------------------------------- musuh */
  // kumbang merah
  drone: {
    pal: { o: '#22090f', r: '#ea4258', d: '#a81f36', k: '#22090f', h: '#ff9aaa', e: '#ffffff', a: '#f7c0c8', l: '#3a1820' },
    frames: [
      [
        '..........a.a.',
        '...ooooo...a..',
        '.oorrhhrroookk',
        'orrkrrhrrrokek',
        'orrrrkrrrrokkk',
        'ordrrrrkrrokk.',
        '.oddrkrrroo...',
        '..oodddooo....',
        '..l..l..l.....',
        '.l..l....l....',
      ],
      [
        '.........a..a.',
        '...ooooo..aa..',
        '.oorrhhrroookk',
        'orrkrrhrrrokek',
        'orrrrkrrrrokkk',
        'ordrrrrkrrokk.',
        '.oddrkrrroo...',
        '..oodddooo....',
        '...l.l..l.....',
        '..l...l..l....',
      ],
    ],
  },
  // tawon cepat
  dart: {
    pal: { o: '#1c1408', y: '#ffd23e', k: '#1c1408', w: '#dff1ff', v: '#93bde6', e: '#ffffff', s: '#e9e9ee' },
    frames: [
      [
        '....ww.ww....',
        '...wwvwwv....',
        '....wv.wv....',
        's.okykykooo..',
        'ssoykykyokek.',
        's.okykykooo..',
        '...oooooo....',
      ],
      [
        '.............',
        '.............',
        '..wwwwvwwwv..',
        's.okykykooo..',
        'ssoykykyokek.',
        's.okykykooo..',
        '...oooooo....',
      ],
    ],
  },
  // lendir yang membelah diri
  splitter: {
    pal: { o: '#0a2a18', g: '#4ee08a', d: '#25a860', h: '#c8ffe0', e: '#0a2a18', x: '#ffffff' },
    frames: [
      [
        '.....oooooo.....',
        '...ooggggggoo...',
        '..oghhgggggggo..',
        '.oghhggggggggdo.',
        '.oggggggggggddo.',
        'oggxeggggxegggdo',
        'oggeegggggeegddo',
        'ogggggggggggdddo',
        'oggggdggggdgdddo',
        '.oddddddddddddo.',
        '..oooooooooooo..',
      ],
      [
        '................',
        '....oooooooo....',
        '..ooghhgggggoo..',
        '.oghhggggggggdo.',
        'oggggggggggggddo',
        'oggxeggggxegggdo',
        'oggeegggggeegddo',
        'ogggggggggggdddo',
        'oggggdggggdgdddo',
        'odddddddddddddo.',
        '.oooooooooooooo.',
      ],
    ],
  },
  mini: {
    pal: { o: '#0a2a18', g: '#4ee08a', d: '#25a860', h: '#c8ffe0', e: '#0a2a18' },
    frames: [
      ['..ooooo..', '.oghhggo.', 'oghgggggo', 'ogegggego', 'ogggggddo', '.odddddo.', '..ooooo..'],
      ['.........', '..ooooo..', '.oghhggo.', 'ogegggego', 'ogggggddo', 'odddddddo', '.ooooooo.'],
    ],
  },
  // laba-laba bermata satu yang meludah
  spitter: {
    pal: { o: '#1c0a2a', p: '#c05df0', d: '#7a2fb0', h: '#f0b8ff', e: '#ffffff', i: '#ff3b6b', l: '#6a3a98' },
    frames: [
      [
        'l....ooooo....l',
        '.l.oopphppoo.l.',
        '..opphhpppppo..',
        'l.oppeeeeeppo.l',
        '.loppeeiieppol.',
        '..oppeeiieppo..',
        'l.opppeeepppo.l',
        '.l.oddpppddo.l.',
        'l...ooooooo...l',
      ],
      [
        '.l...ooooo...l.',
        '.l.oopphppoo.l.',
        'l.opphhpppppo.l',
        '.loppeeeeeppol.',
        '..oppeeiieppo..',
        'l.oppeeiieppo.l',
        '.lopppeeepppol.',
        '...oddpppddo...',
        '.l..ooooooo..l.',
      ],
    ],
  },
  // kumbang badak berlapis baja
  brute: {
    scale: 2,
    pal: { o: '#140a22', v: '#8b5cf6', d: '#5b34c0', h: '#c9b6ff', k: '#2a1a44', e: '#ffd15c' },
    frames: [
      [
        '......oooooooo...k',
        '....oovvhhvvvvoo.k',
        '...ovvhhvvvvvvvvok',
        '..ovvvvvdvvvvvvvok',
        '.ovvvvvvdvvvvvvokk',
        '.ovvvvvvdvvvvvokek',
        '.ovdvvvvdvvvvvokkk',
        '.ovdvvvvdvvvvvvokk',
        '..oddvvvdvvvvddo..',
        '...oodddddddddo...',
        '..kk.oooooooo.kk..',
        '.kk...kk..kk...kk.',
      ],
      [
        '......oooooooo...k',
        '....oovvhhvvvvoo.k',
        '...ovvhhvvvvvvvvok',
        '..ovvvvvdvvvvvvvok',
        '.ovvvvvvdvvvvvvokk',
        '.ovvvvvvdvvvvvokek',
        '.ovdvvvvdvvvvvokkk',
        '.ovdvvvvdvvvvvvokk',
        '..oddvvvdvvvvddo..',
        '...oodddddddddo...',
        '...kk.oooooooo.kk.',
        '..kk..kk...kk..kk.',
      ],
    ],
  },
  // bos: serangga raksasa bertaring
  boss: {
    scale: 3,
    pal: { o: '#1a0508', r: '#ff3b5c', d: '#b01030', h: '#ff9aa8', k: '#1a0508', e: '#ffe45c', t: '#ffffff' },
    frames: [
      [
        '..kk..............kk..',
        '..okk............kko..',
        '...okkoooooooooookko..',
        '....oorrrrhhrrrrroo...',
        '...orrrhhhrrrrrrrrro..',
        '..orrrrrrrrrrrrrrrrro.',
        '.orrreeerrrrrreeerrrro',
        '.orreekeerrrreekeerrdo',
        '.orreeeeerrrreeeeerrdo',
        '.orrreeerrrrrreeerrddo',
        '.orrrrrrrrddrrrrrrdddo',
        '.orrrrtktktktktkrrdddo',
        '..orrrktktktktkrrdddo.',
        '..ordrrrrrrrrrrrdddo..',
        '...oddddrrrrrrddddo...',
        '..kkooddddddddddookk..',
        '.kk...oooooooooo...kk.',
        'kk..................kk',
      ],
      [
        '.kk................kk.',
        '..okk............kko..',
        '...okkoooooooooookko..',
        '....oorrrrhhrrrrroo...',
        '...orrrhhhrrrrrrrrro..',
        '..orrrrrrrrrrrrrrrrro.',
        '.orrreeerrrrrreeerrrro',
        '.orreekeerrrreekeerrdo',
        '.orreeeeerrrreeeeerrdo',
        '.orrreeerrrrrreeerrddo',
        '.orrrrrrrrddrrrrrrdddo',
        '.orrrrktktktktktrrdddo',
        '..orrrtktktktktrrdddo.',
        '..ordrrrrrrrrrrrdddo..',
        '...oddddrrrrrrddddo...',
        '..kkooddddddddddookk..',
        '..kk..oooooooooo..kk..',
        '.kk................kk.',
      ],
    ],
  },

  /* ---------------------------------------------------- benda & efek */
  gem1: { pal: { h: '#d8fff2', g: '#5ff0c0', d: '#1f9c7a' }, frames: [['..h..', '.hgg.', 'hgggd', '.ggd.', '..d..']] },
  gem2: { pal: { h: '#dfe8ff', g: '#7fa8ff', d: '#3a5fd0' }, frames: [['..h..', '.hgg.', 'hgggd', '.ggd.', '..d..']] },
  gem3: { pal: { h: '#fff4c8', g: '#ffd15c', d: '#c88a14' }, frames: [['..h..', '.hgg.', 'hgggd', '.ggd.', '..d..']] },
  heart: { pal: { r: '#ff5d8f', h: '#ffc2d6', d: '#c22a5c' }, frames: [['.rr.rr.', 'rhrrrrr', 'rrrrrrd', '.rrrrd.', '..rrd..', '...d...']] },
  magnet: { pal: { r: '#ff5d6c', w: '#f2f2f6', g: '#8a90a0', d: '#5a6070' }, frames: [['rr...rr', 'rr...rr', 'ww...ww', 'gg...gg', 'ggg.ggd', '.ggggd.', '..ddd..']] },
  bomb: { pal: { y: '#ffd15c', s: '#c9a070', k: '#2b2b3a', h: '#6a6a82' }, frames: [['....y..', '...s...', '..kkk..', '.khhkk.', 'kkhkkkk', 'kkkkkkk', '.kkkkk.', '..kkk..']] },
  fish: { pal: { b: '#7fd8ff', h: '#e2f8ff', e: '#0b1a2a', d: '#3f9fd0' }, frames: [['b...bbb..', 'bb.bbhbb.', 'bbbbbbebb', 'bd.bbbbd.', 'd...ddd..']] },
  rocket: { pal: { f: '#ffb347', w: '#e8e8f0', r: '#ff5d6c', o: '#2a2a3a' }, frames: [['.f.oooo.', 'ffowwwro', 'ffowwwrr', 'ffowwwro', '.f.oooo.'], ['...oooo.', '.fowwwro', 'ffowwwrr', '.fowwwro', '...oooo.']] },
  spit: { pal: { p: '#c05df0', h: '#f0b8ff', w: '#ffffff' }, frames: [['.ppp.', 'phhhp', 'phwhp', 'phhhp', '.ppp.']] },
  spitBoss: { pal: { p: '#ff3b5c', h: '#ffb0bc', w: '#ffffff' }, frames: [['.ppp.', 'phhhp', 'phwhp', 'phhhp', '.ppp.']] },
  tuft: { pal: { g: '#3d8a5c', d: '#2c6a45' }, frames: [['g...g', '.g.d.', 'dg.gd', '.dgd.']] },
  flowerW: { pal: { f: '#e8eef2', y: '#ffd15c', g: '#2f6f4a' }, frames: [['.f.', 'fyf', '.f.', '.g.']] },
  flowerP: { pal: { f: '#ff8fc0', y: '#fff0a0', g: '#2f6f4a' }, frames: [['.f.', 'fyf', '.f.', '.g.']] },
  pebble: { pal: { p: '#4a5a54', h: '#6a7a74' }, frames: [['.hp..', 'hppp.', '.pp.p']] },
  shroom: { pal: { r: '#e04a5a', w: '#f6efe4', s: '#c9bfae' }, frames: [['.rrr.', 'rwrrr', 'rrrwr', '.sws.', '.sws.']] },
};

/* ------------------------------------------------- Meong Maze (labirin) */

// Robot penyedot debu dilihat dari atas; warna tiap robot lewat palet.
const ROBOT_ROWS = [
  [
    '....oooooo....',
    '..oorryyrroo..',
    '.orrhhrrrrrro.',
    '.orhrrrrrrrro.',
    'orrrrrrrrrrrro',
    'orrwwrrrrwwrro',
    'orrwkrrrrwkrro',
    'orkkkkkkkkkkro',
    'orddrrrrrrddro',
    '.orddddddddro.',
    '.oodddddddddo.',
    '..okkooookko..',
    '....oo..oo....',
  ],
  [
    '....oooooo....',
    '..oorryyrroo..',
    '.orrhhrrrrrro.',
    '.orhrrrrrrrro.',
    'orrrrrrrrrrrro',
    'orrwwrrrrwwrro',
    'orrkwrrrrkwrro',
    'orkkkkkkkkkkro',
    'orddrrrrrrddro',
    '.orddddddddro.',
    '.odddddddddoo.',
    '..ookkookkoo..',
    '...oo....oo...',
  ],
];
const robot = (r, d, h, w = '#ffffff', k = '#12121c') => ({ pal: { o: '#12121c', r, d, h, w, k, y: '#ffe45c' }, frames: ROBOT_ROWS });

Object.assign(SPRITE_DEFS, {
  robotRed: robot('#ef4a5c', '#a82238', '#ffa3ae'),
  robotBlue: robot('#4aa8ef', '#2268a8', '#a8dcff'),
  robotGreen: robot('#56d07a', '#2a8a4c', '#b4f5c8'),
  robotOrange: robot('#f29a3a', '#b0621a', '#ffd29a'),
  // korslet kena catnip: pucat dan bermata X
  robotScared: robot('#9aa6d8', '#5a66a8', '#dfe6ff', '#12121c', '#ffffff'),
  robotBlink: robot('#f6f4ee', '#b8b6c8', '#ffffff', '#ef4a5c', '#ffffff'),
  // sedang kembali ke dok: tinggal mata dan lampu
  robotEyes: {
    pal: { w: '#ffffff', k: '#4aa8ef', y: '#ffd15c' },
    frames: [['..............', '..............', '..............', '......yy......', '..............', '...ww....ww...', '...wk....wk...'], ['..............', '..............', '..............', '..............', '......yy......', '...ww....ww...', '...kw....kw...']],
  },
  catnip: { pal: { g: '#7dffb2', d: '#2f9c63', s: '#1f6a43' }, frames: [['...g....', '..gg..g.', '.ggd.gg.', '.gdd.gd.', '..ds.d..', '...ss...', '...s....'], ['....g...', '.g..gg..', '.gg.dgg.', '.dg.ddg.', '..d.sd..', '...ss...', '...s....']] },
  goldfish: { pal: { b: '#ffd15c', h: '#fff4c8', e: '#3a2a08', d: '#c88a14' }, frames: [['b...bbb..', 'bb.bbhbb.', 'bbbbbbebb', 'bd.bbbbd.', 'd...ddd..']] },
  heartSmall: { pal: { r: '#ff5d8f', h: '#ffc2d6' }, frames: [['.r.r.', 'rhrrr', 'rrrrr', '.rrr.', '..r..']] },
});

/* ------------------------------------------------------------ pembangun */

function drawGrid(rows, pal, scale) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const c = document.createElement('canvas');
  c.width = w * scale;
  c.height = h * scale;
  const g = c.getContext('2d');
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const col = pal[rows[y][x]];
      if (!col) continue;
      g.fillStyle = col;
      g.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return c;
}

function derive(src, fn) {
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  fn(c.getContext('2d'), c);
  return c;
}

// Garis tepi 1 piksel di sekeliling siluet (gaya stiker, seperti gambar peliharaan di situs).
function outlined(src, color) {
  const c = document.createElement('canvas');
  c.width = src.width + 2;
  c.height = src.height + 2;
  const g = c.getContext('2d');
  for (const [dx, dy] of [[0, 1], [2, 1], [1, 0], [1, 2]]) g.drawImage(src, dx, dy);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = 'source-over';
  g.drawImage(src, 1, 1);
  return c;
}

const HEROES = ['maxwell', 'akmal', 'usu'];

let cache = null;
export function getSprites() {
  if (cache) return cache;
  cache = {};
  for (const [name, def] of Object.entries(SPRITE_DEFS)) {
    const scale = def.scale || 1;
    const hero = HEROES.includes(name);
    const frames = def.frames.map((rows) => {
      const base = drawGrid(rows, def.pal, scale);
      return hero ? outlined(base, '#f6f4ee') : base;
    });
    const flip = frames.map((f) =>
      derive(f, (g, c) => {
        g.translate(c.width, 0);
        g.scale(-1, 1);
        g.drawImage(f, 0, 0);
      }),
    );
    const whiten = (f) =>
      derive(f, (g, c) => {
        g.drawImage(f, 0, 0);
        g.globalCompositeOperation = 'source-in';
        g.fillStyle = '#ffffff';
        g.fillRect(0, 0, c.width, c.height);
      });
    cache[name] = { w: frames[0].width, h: frames[0].height, frames, flip, white: frames.map(whiten), flipWhite: flip.map(whiten) };
  }
  return cache;
}

// Gambar sprite sebagai data URL (untuk kartu pilih karakter di menu).
export function spriteUrl(name, frame = 0, scale = 4) {
  const s = getSprites()[name];
  const src = s.frames[frame % s.frames.length];
  const c = document.createElement('canvas');
  c.width = src.width * scale;
  c.height = src.height * scale;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL();
}

// Angka 3×5 untuk damage melayang.
const GLYPHS = {
  0: '111101101101111',
  1: '010110010010111',
  2: '111001111100111',
  3: '111001111001111',
  4: '101101111001001',
  5: '111100111001111',
  6: '111100111101111',
  7: '111001010010010',
  8: '111101111101111',
  9: '111101111001111',
  '+': '000010111010000',
  '!': '010010010000010',
};
export function drawNumber(g, text, x, y, color) {
  const w = text.length * 4 - 1;
  let px = Math.round(x - w / 2);
  const py = Math.round(y);
  for (const ch of text) {
    const bits = GLYPHS[ch];
    if (bits) {
      for (let i = 0; i < 15; i++) {
        if (bits[i] !== '1') continue;
        const cx = px + (i % 3);
        const cy = py + Math.floor(i / 3);
        g.fillStyle = '#0a0a12';
        g.fillRect(cx + 1, cy + 1, 1, 1);
        g.fillStyle = color;
        g.fillRect(cx, cy, 1, 1);
      }
    }
    px += 4;
  }
}
