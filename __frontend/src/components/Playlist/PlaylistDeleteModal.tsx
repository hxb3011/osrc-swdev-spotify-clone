import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import * as React from 'react';
import { deletePlaylist } from '../../api/trackApi';
import { useNavigate } from 'react-router-dom';

export interface PlaylistDeleteModalProps {
  id: number;
  title: string;
  open: boolean;
  onClose(): void;
}

export default function PlaylistDeleteModal(props: PlaylistDeleteModalProps) {
  const navigate = useNavigate();
  const handleClose = React.useCallback(() => props.onClose(), [props])

  const handleDelete = React.useCallback(() => {
    deletePlaylist(props.id).then(() => {
      handleClose()
      navigate(-1)
    })
  }, [handleClose, props])

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth>
      <DialogTitle>Xoá danh sách phát</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: 10 }}>
          Bạn có muốn xoá danh sách phát {props.title}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Huỷ</Button>
        <Button onClick={handleDelete}>Xoá</Button>
      </DialogActions>
    </Dialog>

  );
}
