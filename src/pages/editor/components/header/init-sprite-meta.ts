// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-statements */
import type { IStageApis } from '@packages/lego';

export const getSpriteInitMeta = ({
  type,
  stage,
}: {
  type: string;
  stage: IStageApis;
}) => {
  const center = {
    x: stage.store().size.width / 2,
    y: stage.store().size.height / 2,
  };
  let sprite: any = {};
  const getCenter = (width: number, height: number) => ({
    x: center.x - width / 2,
    y: center.y - height / 2,
  });
  if (['Rect', 'Triangle', 'Ellipse', 'Parallelogram'].includes(type)) {
    sprite = {
      props: {},
      attrs: {
        coordinate: getCenter(100, 80),
        size: {
          width: 100,
          height: 80,
        },
      },
    };
  } else if (['Rhombus'].includes(type)) {
    sprite = {
      props: {},
      attrs: {
        coordinate: getCenter(160, 100),
        size: {
          width: 160,
          height: 100,
        },
      },
    };
  } else if (['FanShaped'].includes(type)) {
    sprite = {
      props: {},
      attrs: {
        coordinate: getCenter(100, 100),
        size: {
          width: 100,
          height: 100,
        },
      },
    };
  } else if (type === 'Text' || type === 'RichText') {
    sprite = {
      props: {
        content: '',
      },
      attrs: {
        coordinate: getCenter(150, 40),
        size: {
          width: 430,
          height: 50,
        },
      },
    };
  } else if (type === 'Image') {
    sprite = {
      props: {
        url: 'https://alanyf.gitee.io/personal-website/pages/shortestPath/dom.png',
      },
      attrs: {
        coordinate: getCenter(80, 80),
        size: {
          width: 80,
          height: 80,
        },
      },
    };
  } else if (type === 'Video') {
    sprite = {
      props: {
        url: 'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      },
      attrs: {
        coordinate: getCenter(480, 270),
        size: {
          width: 480,
          height: 270,
        },
      },
    };
  } else if (type === 'Audio') {
    sprite = {
      props: {
        url: 'http://alanyf.gitee.io/music/static/media/music.mp3',
      },
      attrs: {
        coordinate: getCenter(400, 90),
        size: {
          width: 400,
          height: 90,
        },
      },
    };
  } else if (type === 'Link') {
    sprite = {
      props: {
        href: 'https://alanyf.gitee.io/personal-website/pages/shortestPath/dom.png',
        text: '链接',
      },
      attrs: {
        coordinate: getCenter(100, 25),
        size: { width: 100, height: 25 },
      },
    };
  } else if (type === 'Line' || type === 'ConnectLine') {
    sprite = {
      type: 'ConnectLineSprite',
      props: {
        lineType: type === 'Line' ? 'Line' : 'VerticalLine',
        start: {},
        end: {},
      },
    };
  } else if (type === 'ArrowLine') {
    sprite = {
      type: 'ConnectLineSprite',
      props: {
        lineType: 'Line',
        start: {},
        end: { type: 'arrow' },
      },
    };
  } else if (type === 'DoubleArrowLine') {
    sprite = {
      type: 'ConnectLineSprite',
      props: {
        lineType: 'Line',
        start: { type: 'arrow' },
        end: { type: 'arrow' },
      },
    };
  } else if (type === 'CurveConnectLine') {
    sprite = {
      type: 'ConnectLineSprite',
      props: {
        lineType: 'SmoothCurve',
        start: {},
        end: {},
      },
    };
  } else if (type === 'ArcLine' || type === 'Curve') {
    sprite = {};
  } else if (type === 'Polygon' || type === 'Polyline' || type === 'DrawPath') {
    sprite = {};
  } else if (type === 'SmoothCurve') {
    sprite = {
      type: 'PolylineSprite',
      props: {
        smooth: true,
        curvature: 0.5,
      },
    };
  } else if (type === 'Point') {
    sprite = {
      attrs: {
        coordinate: getCenter(10, 10),
        size: { width: 20, height: 20 },
      },
    };
  } else if (type === 'ArrowArcLine') {
    sprite = {
      type: 'ArcLineSprite',
      props: {
        start: {},
        end: { type: 'arrow' },
        control: {},
      },
    };
  } else if (type === 'DrawBoard') {
    sprite = {
      type: 'DrawBoardSprite',
      props: {},
      attrs: {
        coordinate: getCenter(400, 300),
        size: { width: 400, height: 300 },
      },
    };
  } else if (type === 'DoubleArrowArcLine') {
    sprite = {
      type: 'ArcLineSprite',
      props: {
        start: { type: 'arrow' },
        end: { type: 'arrow' },
        control: {},
      },
    };
  } else if (type === 'ArrowCurve') {
    sprite = {
      type: 'CurveSprite',
      props: {
        start: {},
        end: { type: 'arrow' },
      },
    };
  } else if (type === 'CoordinateSystem') {
    sprite = {
      props: {},
      attrs: {
        coordinate: getCenter(600, 500),
        size: { width: 600, height: 500 },
      },
    };
  } else if (type === 'DrawBoard') {
    sprite = {
      props: {},
      attrs: {
        coordinate: getCenter(600, 500),
        size: { width: 600, height: 500 },
      },
    };
  } else if (type === 'QrCode') {
    sprite = {
      props: {},
      attrs: {
        coordinate: getCenter(200, 200),
        size: { width: 150, height: 150 },
      },
    };
  }  else {
    sprite = {
      props: {},
      attrs: {
        coordinate: getCenter(100, 100),
        size: { width: 100, height: 100 },
      },
    };
  }
  if (!sprite.type) {
    sprite.type = `${type}Sprite`;
  }
  return sprite;
};
