import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import * as React from "react";

export interface TrackDownloadModalProps {
  id: number;
  title: string;
  audioLink: string;
  videoLink: string;
  open: boolean;
  onClose(): void;
}

export default function TrackDownloadModal(props: TrackDownloadModalProps) {
  const handleClose = React.useCallback(() => props.onClose(), [props]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth>
      <DialogTitle>Tải bản nhạc</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: 10 }}>
          Bạn có muốn tải bản nhạc {props.title}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Huỷ</Button>
        <Button
          href={`/api/tracks/${props.id}/audio`}
          download={`${props.title}${props.audioLink.substring(props.audioLink.lastIndexOf("."))}`}
          onClick={handleClose}
        >
          Audio
        </Button>
        <Button
          href={`/api/tracks/${props.id}/video`}
          download={`${props.title}${props.videoLink.substring(props.videoLink.lastIndexOf("."))}`}
          onClick={handleClose}
        >
          Video
        </Button>
      </DialogActions>
    </Dialog>
  );
}
