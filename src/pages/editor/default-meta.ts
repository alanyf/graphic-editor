import mindSimpleMeta from './meta-template/mind-simple';
import mindComplex from './meta-template/mind-complex';
import flowMeta from './meta-template/flow';

import complexMathCoordinate from './meta-template/math-coordinate';
import coordinateSystem from './meta-template/math-coordinate-simple';
import richTextMeta from './meta-template/rich-text';
import spriteListExample from './meta-template/sprite-list-example';
import PPT1 from './meta-template/ppt-1';

// const RichTextMeta = {
//   id: 'PODW7VCYRichText',
//   type: 'RichTextSprite',
//   props: {
//     width: 100,
//     height: 40,
//     content:
//       '<p><font size="5" face="Microsoft YaHei"><b>文字</b></font></p><p><font size="4"><font face="STKaiti">这是楷体，</font><font face="SimSun">宋体</font><font face="STKaiti">，</font><font face="PingFang SC">平方，<i><b><u><font color="#0000ff">其他</font></u></b></i></font><br><font face="Times New Roman"><i style="">NaOH + HCL = NaCl + H<sub style="">2</sub>O</i></font></font><br><font size="4">0123456789</font><br><font size="4">abcdefghijklmnopqrstuvwxyz</font></p><p><span style="font-size: large; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span></p>',
//   },
//   attrs: {
//     coordinate: {
//       x: 37,
//       y: 106.50000000000011,
//     },
//     size: {
//       width: 354,
//       height: 223,
//     },
//     angle: 0,
//     style: {},
//     creating: false,
//     editing: false,
//   },
// };
export const SongMeta = {
  id: 'WURDD0UHSong',
  type: 'RichTextSprite',
  props: {
    width: 100,
    height: 40,
    content:
      '<p><font face="STKaiti" size="6"><b style="">曾经的你</b></font></p><p><span style="font-family: STKaiti; font-size: large;">词曲：许巍</span></p><p><font face="STKaiti" size="5">曾梦想仗剑走天涯</font></p><p><font face="STKaiti" size="5">看一看世界的繁华</font></p><p><font face="STKaiti" size="5">年少的心总有些轻狂</font></p><p><font face="STKaiti" size="5">如今你四海为家</font></p><p><font face="STKaiti" size="5">曾让你心疼的姑娘</font></p><p><font face="STKaiti" size="5">如今已悄然无踪影</font></p><p><font face="STKaiti" size="5">爱情总让你渴望又感到烦恼</font></p><p><font face="STKaiti" size="5">曾让你遍体鳞伤</font></p>',
  },
  attrs: {
    coordinate: {
      x: 186.00000000000009,
      y: 51.50000000000004,
    },
    size: {
      width: 319,
      height: 459,
    },
    angle: 0,
    style: {},
    creating: false,
    editing: false,
  },
};
const LinkMeta = {
  id: 'U0HHRJGVLink',
  type: 'LinkSprite',
  props: {
    href: 'https://alanyf.gitee.io/personal-website/pages/shortestPath/dom.png',
    text: '链接',
    target: '_blank',
  },
  attrs: {
    coordinate: {
      x: 103,
      y: 340.5,
    },
    size: {
      width: 100,
      height: 25,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};
const ImageMeta = {
  id: '86ZLUF45Image',
  type: 'ImageSprite',
  props: {
    url: 'https://alanyf.gitee.io/personal-website/assets/icon/github.svg',
  },
  attrs: {
    coordinate: {
      x: 94.33018223627113,
      y: 367.3301822362711,
    },
    size: {
      width: 117.33963552745774,
      height: 117.33963552745774,
    },
    angle: 0,
    style: {},
    creating: false,
    editing: false,
  },
};

const RectMeta = {
  id: 'EHOGNB4MRect',
  type: 'RectSprite',
  props: {},
  attrs: {
    coordinate: {
      x: 146,
      y: 100,
    },
    size: {
      width: 100,
      height: 80,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};

const RectRoundMeta = {
  id: 'EHOGNB4MRectRound',
  type: 'RectRoundSprite',
  props: {
    borderRadius: 30,
  },
  attrs: {
    coordinate: {
      x: 446,
      y: 60.500000000000114,
    },
    size: {
      width: 100,
      height: 80,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};

const GroupMeta = {
  id: 'EHOGNB4MGroup',
  type: 'GroupSprite',
  props: {},
  attrs: {
    coordinate: {
      x: 300,
      y: 100,
    },
    size: {
      width: 300,
      height: 200,
    },
    angle: 0,
  },
  children: [
    {
      id: 'Rect11',
      type: 'RectSprite',
      props: { fill: '#f004' },
      attrs: {
        coordinate: {
          x: 0,
          y: 0,
        },
        size: {
          width: 100,
          height: 80,
        },
        angle: 0,
      },
    },
    {
      id: 'Rect22',
      type: 'RectSprite',
      props: { fill: '#0f04' },
      attrs: {
        coordinate: {
          x: 150,
          y: 100,
        },
        size: {
          width: 100,
          height: 80,
        },
        angle: 0,
      },
    }
  ],
};

const PolygonMeta = {
  id: '1GD0ZQC7Polygon',
  type: 'PolygonSprite',
  props: {
    points: [
      {
        x: 51,
        y: 0,
      },
      {
        x: 179,
        y: 11,
      },
      {
        x: 163,
        y: 174,
      },
      {
        x: 0,
        y: 104,
      },
    ],
  },
  attrs: {
    coordinate: {
      x: 657,
      y: 74.50000000000011,
    },
    size: {
      width: 179,
      height: 174,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};
const PolylineSmoothMeta = {
  id: '8XSOGS5WPolyline',
  type: 'PolylineSprite',
  props: {
    points: [
      {
        x: 0,
        y: 63,
      },
      {
        x: 44,
        y: 0,
      },
      {
        x: 104,
        y: 63,
      },
      {
        x: 149,
        y: 1,
      },
    ],
    smooth: true,
    curvature: 0.5,
  },
  attrs: {
    coordinate: {
      x: 446,
      y: 200.0000000000001,
    },
    size: {
      width: 149,
      height: 63,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};
const FanShapedMeta = {
  id: 'BDABEVULFanShaped',
  type: 'FanShapedSprite',
  props: {
    startAngle: 0,
    endAngle: 170,
  },
  attrs: {
    coordinate: {
      x: 446,
      y: 282.5,
    },
    size: {
      width: 100,
      height: 100,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};
const ConnectLineMeta = {
  id: 'KS6W9BZHConnectLine',
  type: 'ConnectLineSprite',
  props: {
    start: {
      type: 'tiltRect',
      x: 0,
      y: 0,
      port: {
        spriteId: 'EHOGNB4MRect',
        index: 3,
        id: 'EHOGNB4MRect',
      },
    },
    end: {
      type: 'circle',
      x: 144,
      y: 123,
    },
    offset: 50,
    lineType: 'SmoothCurve',
  },
  attrs: {
    coordinate: {
      x: 546,
      y: 100.50000000000011,
    },
    size: {
      width: 144,
      height: 123,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};
const LineMeta = {
  id: 'F1GAFONQLine',
  type: 'LineSprite',
  props: {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      type: 'arrow',
      x: 73,
      y: 90,
    },
  },
  attrs: {
    coordinate: {
      x: 807,
      y: 288,
    },
    size: {
      width: 73,
      height: 90,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};
const DrawPathMeta = {
  id: '20M2V34ODrawPath',
  type: 'DrawPathSprite',
  props: {
    points: [
      {
        x: 38,
        y: 1,
      },
      {
        x: 16,
        y: 0,
      },
      {
        x: 0,
        y: 14,
      },
      {
        x: 16,
        y: 27,
      },
      {
        x: 36,
        y: 26,
      },
      {
        x: 58,
        y: 32,
      },
      {
        x: 72,
        y: 53,
      },
      {
        x: 61,
        y: 78,
      },
      {
        x: 44,
        y: 91,
      },
      {
        x: 24,
        y: 97,
      },
      {
        x: 4,
        y: 88,
      },
      {
        x: 0,
        y: 68,
      },
      {
        x: 16,
        y: 55,
      },
      {
        x: 37,
        y: 54,
      },
      {
        x: 57,
        y: 63,
      },
      {
        x: 74,
        y: 76,
      },
      {
        x: 92,
        y: 89,
      },
    ],
    pointDis: 20,
  },
  attrs: {
    coordinate: {
      x: 459,
      y: 426,
    },
    size: {
      width: 92,
      height: 97,
    },
    angle: 0,
    style: {},
    creating: false,
    editing: false,
  },
};
const PolylineMeta = {
  id: 'YRUYJGBIPolyline',
  type: 'PolylineSprite',
  props: {
    points: [
      {
        x: 0,
        y: 63,
      },
      {
        x: 17,
        y: 18.25,
      },
      {
        x: 46,
        y: 83,
      },
      {
        x: 71,
        y: 0,
      },
      {
        x: 97,
        y: 67,
      },
      {
        x: 120,
        y: 33,
      },
    ],
  },
  attrs: {
    coordinate: {
      x: 635,
      y: 432,
    },
    size: {
      width: 120,
      height: 83,
    },
    angle: 0,
    style: {},
    creating: false,
    editing: false,
  },
};
const TriangleMeta = {
  id: 'NXLLNFHITriangle',
  type: 'TriangleSprite',
  props: {
    width: 100,
    height: 70,
    anchorPointX: 20,
  },
  attrs: {
    coordinate: {
      x: 595,
      y: 293,
    },
    size: {
      width: 100,
      height: 80,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};

const coordinateMeta = {
  id: 'U9J4JR2Q',
  type: 'CoordinateSystemSprite',
  props: {
    unitPx: 35,
    cx: 0.5,
    cy: 0.5,
    strokeDasharray: '4,3',
  },
  attrs: {
    coordinate: {
      x: 108,
      y: 69.5,
    },
    size: {
      width: 600,
      height: 500,
    },
    angle: 0,
    style: {},
    creating: false,
  },
};

const videoMeta = {
  id: '4M8PAOK2',
  type: 'VideoSprite',
  props: {
    url: 'https://klxxcdn.oss-cn-hangzhou.aliyuncs.com/histudy/hrm/media/bg3.mp4',
  },
  attrs: {
    coordinate: {
      x: 360,
      y: 202.5,
    },
    size: {
      width: 480,
      height: 270,
    },
    angle: 0,
    style: {},
    creating: false,
    editing: false,
  },
};

const audioMeta = {
  id: '4M8PAdK2',
  type: 'AudioSprite',
  props: {
    url: 'http://alanyf.gitee.io/music/static/media/music.mp3',
  },
  attrs: {
    coordinate: {
      x: 360,
      y: 202.5,
    },
    size: {
      width: 480,
      height: 90,
    },
    angle: 0,
    style: {},
    creating: false,
    editing: false,
  },
};

const QrCodeMeta = {
  id: '4M8PK233',
  type: 'QrCodeSprite',
  props: {
    url: 'http://alanyf.gitee.io/music/static/media/music.mp3',
  },
  attrs: {
    coordinate: {
      x: 100,
      y: 100,
    },
    size: {
      width: 200,
      height: 200,
    },
    angle: 0,
  },
};

export const spriteListMeta = [
  // LinkMeta,
  // ImageMeta,
  RectMeta,
  RectRoundMeta,
  // PolygonMeta,
  // PolylineSmoothMeta,
  // FanShapedMeta,
  // ConnectLineMeta,
  // LineMeta,
  // DrawPathMeta,
  // PolylineMeta,
  // TriangleMeta,
  // RichTextMeta,
  // coordinateMeta,
  // videoMeta,
  // audioMeta,
  // GroupMeta,
  // QrCodeMeta,
];

export const templateList = [
  { title: '开发用', spriteList: spriteListMeta },
  { title: '精灵功能展示', spriteList: spriteListExample },
  { title: '脑图', spriteList: mindSimpleMeta },
  { title: '复杂脑图', spriteList: mindComplex },
  { title: '流程图', spriteList: flowMeta },
  { title: '正弦波', spriteList: coordinateSystem },
  { title: '坐标系', spriteList: complexMathCoordinate },
  { title: '富文本', spriteList: richTextMeta },
  { title: 'PPT模版1', spriteList: PPT1, background: '#32363f' },
];

export default process.env.NODE_ENV === 'production' ? spriteListExample : spriteListMeta;
