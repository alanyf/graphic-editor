import React, { useEffect, useState, useRef } from 'react';

const emptyFun = () => '';

interface IProps {
  url?: string;
  style?: React.CSSProperties;
  playing?: boolean;
  autoplay?: boolean;
  clickPlay?: boolean;
  width?: number | string;
  height?: number | string;
  onPlayChange?: (playing: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}

export default (props: IProps) => {
  const {
    url = '',
    style = {},
    playing = undefined,
    autoplay = false,
    clickPlay = false,
    width,
    height,
    onPlayChange = emptyFun,
    onClick = emptyFun,
    ...rest
  } = props;
  const audioRef = useRef(null as any);
  const [$audio, setAudio] = useState<HTMLAudioElement>(null as any);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(Boolean(playing));
  }, [playing]);

  useEffect(() => {
    if ($audio) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isPlaying ? $audio.play() : $audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    setAudio(audioRef.current);
    if (autoplay) {
      setIsPlaying(true);
    }
  }, []);

  const handlePlayChange = (play: boolean) => {
    if (playing === undefined) {
      setIsPlaying(play);
    }
    onPlayChange(play);
  };
  const handleClick = (e: React.MouseEvent) => {
    if (!clickPlay) {
      e.preventDefault();
    }
    onClick(e);
  };

  return (
    <audio
      ref={audioRef}
      className="audio-player-container"
      style={{
        width,
        height,
        maxHeight: 54,
        minHeight: 15,
        minWidth: 220,
        ...style,
      }}
      controls={true}
      crossOrigin="Anonymous"
      onClick={handleClick}
      onPlay={() => handlePlayChange(true)}
      onPause={() => handlePlayChange(false)}
      {...rest}>
      <source src={url} type="audio/mpeg" />
    </audio>
  );
};
