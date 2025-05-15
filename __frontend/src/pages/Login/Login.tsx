import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { loginAction } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/reduxhooks';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export interface LoginProps {
}

export default function Login(props: LoginProps) {
  const [user_info, setUserInfo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const dispatch = useAppDispatch()


  const loginHandler = useCallback(() => {
    dispatch(loginAction({ user_info: user_info, password: password, remember_me: rememberMe }))
  }, [user_info, password, dispatch, rememberMe])


  return (
    <ThemeProvider theme={darkTheme}>
      <div className='flex pt-20 justify-center'>
        <div className='flex flex-col basis-5/12' style={{ gap: "16px", paddingBottom: "32px" }}>
          <div className='text-4xl text-white font-bold mb-10 text-center' style={{
            fontSize: "xx-large",
            marginBottom: "16px"
          }}>Đăng nhập</div>
          <div className='mt-5'>
            <div className='text-white' style={{
              fontSize: "larger",
              marginBottom: "8px"
            }}>Username hoặc Email</div>
            <TextField label="Username hoặc Email" fullWidth variant="filled" id="outlined-basic" onChange={e => setUserInfo(e.target.value)} onKeyDown={e => e.key === 'Enter' && loginHandler()} />
          </div>
          <div className='mt-5'>
            <div className='text-white' style={{
              fontSize: "larger",
              marginBottom: "8px"
            }}>Mật khẩu</div>
            <TextField label="Mật khẩu" type="password" fullWidth variant="filled" id="outlined-basic" onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && loginHandler()} />
          </div>
          <div className='mt-5 text-2xl text-white'>
            <FormControlLabel
              control={<Checkbox value={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
              label="Ghi nhớ đăng nhập"
              labelPlacement="end"
            />
          </div>
          <div className="mt-8 flex justify-center">
            <div onClick={loginHandler} className='bg-emerald-600 hover:bg-emerald-400 duration-300 text-2xl font-bold text-black rounded-full cursor-pointer' style={{ padding: "4px 20px" }}>Đăng nhập</div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
