declare module 'react-modal-video' {
  import { Component } from 'react';

  export interface ModalVideoProps {
    channel?: string;
    isOpen?: boolean;
    videoId?: string;
    onClose?: () => void;
    ratio?: string;
    youtube?: {
      autoplay?: number;
      cc_load_policy?: number;
      color?: string;
      controls?: number;
      disablekb?: number;
      enablejsapi?: number;
      end?: number;
      fs?: number;
      h1?: string;
      iv_load_policy?: number;
      list?: string;
      listType?: string;
      loop?: number;
      modestbranding?: number;
      origin?: string;
      playlist?: string;
      playsinline?: number;
      rel?: number;
      showinfo?: number;
      start?: number;
      wmode?: string;
    };
  }

  export default class ModalVideo extends Component<ModalVideoProps> {}
}
