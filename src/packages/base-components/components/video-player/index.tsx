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
    width = 800,
    height = 450,
    onPlayChange = emptyFun,
    onClick = emptyFun,
    ...rest
  } = props;
  const videoRef = useRef(null as any);
  const [$video, setVideo] = useState<HTMLVideoElement>(null as any);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setIsPlaying(Boolean(playing));
  }, [playing]);

  useEffect(() => {
    if ($video) {
       
      isPlaying ? $video.play() : $video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    setVideo(videoRef.current);
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
    <video
      ref={videoRef}
      className="video-player-container"
      style={style}
      width={width}
      height={height}
      controls={true}
      crossOrigin="anonymous"
      onClick={handleClick}
      onPlay={() => handlePlayChange(true)}
      onPause={() => handlePlayChange(false)}
      {...rest}>
      <source src={url} type="video/mp4" />
    </video>
  );
};
