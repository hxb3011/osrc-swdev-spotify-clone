import { AlertColor } from "@mui/material/Alert"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Toast component is at frontend\src\components\Toast.tsx
export interface Toast {
    open: boolean,
    type: AlertColor | undefined,
    message: string
}

export interface NotficiationState {
    toast: Toast
}

const initialState: NotficiationState = {
    toast: {
        open: false,
        type: undefined,
        message: '',
    }
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setToast: (state, action: PayloadAction<Toast>) => {
            state.toast = action.payload
        },
        closeToast: (state) => {
            state.toast.open = false
        }
    }
})

export const { setToast, closeToast } = notificationSlice.actions

export default notificationSlice



export {}