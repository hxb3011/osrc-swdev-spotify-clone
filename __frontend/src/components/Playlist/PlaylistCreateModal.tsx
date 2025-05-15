import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import * as React from 'react';
import { createPlaylistFromSaved } from '../../api/trackApi';

export interface PlaylistCreateModalProps {
  open: boolean;
  onClose(): void;
}

export default function PlaylistCreateModal(props: PlaylistCreateModalProps) {
  const [imageUrl, setImageUrl] = React.useState<string>()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File>()
  const [playlistTitle, setPlaylistName] = React.useState<string>()

  // open file input when user clicks to select image button
  const handleSelect = () => {
    inputRef.current?.click()
  }

  // show image preview when user selects an image
  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
    setFile(file)
  }, [])

  // close modal and reset selected image
  const handleClose = React.useCallback(() => {
    setImageUrl(undefined)
    props.onClose()
  }, [props])

  // send image to server and update profile image and close modal
  const handleCreate = React.useCallback(() => {
    if (!file || !playlistTitle || !playlistTitle.length) return
    createPlaylistFromSaved(playlistTitle, file).then(res => {
      handleClose()
    })
  }, [file, handleClose, props])

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth>
      <DialogTitle>Tạo danh sách phát</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: 10 }}>
          Chọn ảnh danh sách phát từ máy
        </DialogContentText>
        <div className='flex justify-center items-center mb-10'>
          {imageUrl && <img src={imageUrl} alt="playlist" />}
        </div>
        <Button onClick={handleSelect} fullWidth variant="contained" size="large">Chọn</Button>
        <input onChange={handleFileChange} ref={inputRef} type="file" hidden />

        <div className='mt-5'>
          <div className='text-white' style={{
            fontSize: "larger",
            marginBottom: "8px"
          }}>Tên danh sách phát</div>
          <TextField label="Tên danh sách phát" fullWidth variant="filled" id="outlined-basic" onChange={e => setPlaylistName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Huỷ</Button>
        <Button onClick={handleCreate}>Tạo</Button>
      </DialogActions>
    </Dialog>

  );
}
