export default [
  {
    id: 'Q9QR9SL7',
    type: 'RhombusSprite',
    props: {
      content:
        '<p><font face="Times New Roman" size="5"><i>i &lt; 10</i></font></p>',
    },
    attrs: {
      coordinate: {
        x: 112,
        y: 321,
      },
      size: {
        width: 160,
        height: 100,
      },
      angle: 0,
      style: {},
      creating: false,
      editing: false,
    },
  },
  {
    id: '1X22BZJQ',
    type: 'RectRoundSprite',
    props: {
      borderRadius: 30,
      content: '<p><font size="5">开始</font></p>',
    },
    attrs: {
      coordinate: {
        x: 120,
        y: 60,
      },
      size: {
        width: 145,
        height: 59,
      },
      angle: 0,
      style: {},
      creating: false,
      editing: false,
    },
  },
  {
    id: 'PID3RD29',
    type: 'RectRoundSprite',
    props: {
      borderRadius: 30,
      content: '<p><font size="5">输出</font></p>',
    },
    attrs: {
      coordinate: {
        x: 120,
        y: 478,
      },
      size: {
        width: 145,
        height: 59,
      },
      angle: 0,
      style: {},
      creating: false,
      editing: false,
    },
  },
  {
    id: 'VY2EVXXT',
    type: 'RectSprite',
    props: {
      content:
        '<p><font size="5" face="Times New Roman"><i>i = i + 1</i></font></p>',
    },
    attrs: {
      coordinate: {
        x: 130.5,
        y: 188,
      },
      size: {
        width: 124,
        height: 79,
      },
      angle: 0,
      style: {},
      creating: false,
      editing: false,
    },
  },
  {
    id: 'WMZXE799',
    type: 'PolylineSprite',
    props: {
      points: [
        {
          x: 0,
          y: 143,
        },
        {
          x: 120,
          y: 142,
        },
        {
          x: 120,
          y: 0,
        },
      ],
      strokeWidth: 2,
    },
    attrs: {
      coordinate: {
        x: 272,
        y: 228,
      },
      size: {
        width: 120,
        height: 143,
      },
      angle: 0,
      style: {},
      creating: false,
    },
  },
  {
    id: 'GBEVN7IM',
    type: 'ConnectLineSprite',
    props: {
      start: {
        x: 0,
        y: 0,
        port: {
          spriteId: '1X22BZJQ',
          id: 'sprite-port__1X22BZJQ__1',
          index: 1,
          x: 50,
          y: 100,
          arcAngle: 90,
        },
      },
      end: {
        type: 'arrow',
        x: 0,
        y: 70,
        port: {
          spriteId: 'VY2EVXXT',
          id: 'sprite-port__VY2EVXXT__0',
          index: 0,
          x: 50,
          y: 0,
          arcAngle: 270,
        },
      },
      offset: 50,
      lineType: 'Line',
      strokeWidth: 2,
    },
    attrs: {
      coordinate: {
        x: 192.5,
        y: 119,
      },
      size: {
        width: 0,
        height: 70,
      },
      angle: 0,
      style: {},
      creating: false,
    },
  },
  {
    id: 'DPA4SV6S',
    type: 'ConnectLineSprite',
    props: {
      start: {
        x: 0.5,
        y: 0,
        port: {
          spriteId: 'VY2EVXXT',
          id: 'sprite-port__VY2EVXXT__1',
          index: 1,
          x: 50,
          y: 100,
          arcAngle: 90,
        },
      },
      end: {
        type: 'arrow',
        x: 0,
        y: 53,
        port: {
          spriteId: 'Q9QR9SL7',
          id: 'sprite-port__Q9QR9SL7__0',
          index: 0,
          x: 50,
          y: 0,
          arcAngle: 270,
        },
      },
      offset: 50,
      lineType: 'Line',
      strokeWidth: 2,
    },
    attrs: {
      coordinate: {
        x: 192,
        y: 268,
      },
      size: {
        width: 0.5,
        height: 53,
      },
      angle: 0,
      style: {},
      creating: false,
    },
  },
  {
    id: 'KV377ZC2',
    type: 'ConnectLineSprite',
    props: {
      start: {
        x: 0,
        y: 0,
        port: {
          spriteId: 'Q9QR9SL7',
          id: 'sprite-port__Q9QR9SL7__1',
          index: 1,
          x: 50,
          y: 100,
          arcAngle: 90,
        },
      },
      end: {
        type: 'arrow',
        x: 0.5,
        y: 57,
        port: {
          spriteId: 'PID3RD29',
          id: 'sprite-port__PID3RD29__0',
          index: 0,
          x: 50,
          y: 0,
          arcAngle: 270,
        },
      },
      offset: 50,
      lineType: 'Line',
      strokeWidth: 2,
    },
    attrs: {
      coordinate: {
        x: 192,
        y: 421,
      },
      size: {
        width: 0.5,
        height: 57,
      },
      angle: 0,
      style: {},
      creating: false,
    },
  },
  {
    id: 'EO9XP2DU',
    type: 'ConnectLineSprite',
    props: {
      start: {
        x: 138.5,
        y: 0,
      },
      end: {
        type: 'arrow',
        x: 0,
        y: 1.5,
        port: {
          spriteId: 'VY2EVXXT',
          id: 'sprite-port__VY2EVXXT__3',
          index: 3,
          x: 100,
          y: 50,
          arcAngle: 0,
        },
      },
      offset: 50,
      lineType: 'Line',
      strokeWidth: 2,
    },
    attrs: {
      coordinate: {
        x: 254.5,
        y: 227,
      },
      size: {
        width: 138.5,
        height: 1.5,
      },
      angle: 0,
      style: {},
      creating: false,
    },
  },
];
