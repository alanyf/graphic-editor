import { getOS } from '../../../utils/tools';

const BackspaceIcon = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="2166"
    width="16"
    height="16">
    <path
      d="M446.72 361.386667a32 32 0 0 1 45.226667 0L597.333333 466.773333l105.386667-105.386666a32 32 0 1 1 45.226667 45.226666L642.56 512l105.386667 105.386667a32 32 0 1 1-45.226667 45.226666L597.333333 557.226667l-105.386666 105.386666a32 32 0 1 1-45.226667-45.226666L552.106667 512l-105.386667-105.386667a32 32 0 0 1 0-45.226666z"
      fill="#999999"
      p-id="2167"></path>
    <path
      d="M358.656 211.2a160 160 0 0 0-125.866667 61.184l-151.893333 193.493333a74.666667 74.666667 0 0 0 0 92.245334l151.893333 193.493333a160 160 0 0 0 125.866667 61.184h454.272a117.333333 117.333333 0 0 0 117.333333-117.333333V328.533333a117.333333 117.333333 0 0 0-117.333333-117.333333H358.656z m-75.52 100.693333a96 96 0 0 1 75.52-36.693333h454.272c29.44 0 53.333333 23.893333 53.333333 53.333333v366.933334c0 29.44-23.893333 53.333333-53.333333 53.333333H358.656a96 96 0 0 1-75.52-36.693333l-151.936-193.536a10.666667 10.666667 0 0 1 0-13.141334L283.136 311.893333z"
      fill="#999999"
      p-id="2168"></path>
  </svg>
);
const system = getOS();
const cmd = system === 'Mac' ? '⌘' : 'Ctrl';

const data = [
  {
    text: '全选',
    key: 'selectAll',
    shortcutKey: `${cmd}+A`,
  },
  {
    text: '剪切',
    key: 'cut',
    shortcutKey: `${cmd}+X`,
  },
  {
    text: '复制',
    key: 'copy',
    shortcutKey: `${cmd}+C`,
  },
  {
    text: '粘贴',
    key: 'paste',
    shortcutKey: `${cmd}+V`,
  },
  {
    text: '删除',
    key: 'delete',
    shortcutKey: <BackspaceIcon />,
  },

  {
    text: '对齐',
    key: 'align',
    children: [
      {
        text: '水平垂直居中',
        key: 'horizontalVerticalAlign',
      },
      {
        text: '水平居中',
        key: 'horizontalAlign',
      },
      {
        text: '垂直居中',
        key: 'verticalAlign',
      },
      { text: '向上对齐', key: 'topAlign' },
      {
        text: '向下对齐',
        key: 'bottomAlign',
      },
      { text: '向左对齐', key: 'leftAlign' },
      { text: '向右对齐', key: 'rightAlign' },
    ],
  },

  {
    text: '层级移动',
    key: 'level',
    children: [
      { text: '置顶', key: 'levelTop' },
      { text: '置底', key: 'levelBottom' },
      { text: '上移一层', key: 'levelUp' },
      { text: '下移一层', key: 'levelDown' },
    ],
  },
  {
    text: '组合',
    key: 'group',
    shortcutKey: `${cmd}+G`,
  },
  {
    text: '解组',
    key: 'splitGroup',
    shortcutKey: `${cmd}+shift+G`,
  },
];

export default data;
