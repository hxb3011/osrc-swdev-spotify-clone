import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppDispatch } from '../../store/reduxhooks';
import { registerAction } from '../../store/slices/authSlice';
import { useCallback, useState } from 'react';

const darkTheme = createTheme({
   palette: {
      mode: 'dark',
   }
});

export interface RegisterProps {
}

export default function Register(props: RegisterProps) {
   const [email, setEmail] = useState<string>('');
   const [username, setUsername] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [first_name, setFirstName] = useState<string>('');
   const [last_name, setLastName] = useState<string>('');
   const [birth_date, setBirthDate] = useState<Date | null>(null);
   const [gender, setGender] = useState<string>('');

   const dispatch = useAppDispatch()

   const submitHandler = useCallback(() => {
      // get the date in the format that the backend expects
      const birth_date_string = birth_date ? birth_date!.toISOString().split('T')[0] : ''
      dispatch(registerAction({email, username, password, first_name, last_name, birth_date: birth_date_string, gender}))
   }, [email, username, password, first_name, last_name, birth_date, gender, dispatch])

   return (
      <ThemeProvider theme={darkTheme}>
         <div className='flex pt-6 justify-center overflow-y-scroll'>
            <div className='flex flex-col basis-9/12' style={{ gap: "16px", marginBottom: "32px" }}>
               <div className='text-white font-bold text-center' style={{
                  fontSize: "xx-large",
                  marginBottom: "16px"
               }}>Đăng ký</div>
               <div className='mt-5'>
                  <div className='text-white' style={{
                     fontSize: "larger",
                     marginBottom: "8px"
                  }}>Tên</div>
                  <TextField value={first_name} onChange={e => setFirstName(e.target.value)} label="Tên" fullWidth variant="filled" />
               </div>
               <div className='mt-5'>
                  <div className='text-white' style={{
                     fontSize: "larger",
                     marginBottom: "8px"
                  }}>Họ</div>
                  <TextField value={last_name} onChange={e => setLastName(e.target.value)} label="Họ" fullWidth variant="filled" />
               </div>
               <div className='mt-5'>
                  <div className='text-white' style={{
                     fontSize: "larger",
                     marginBottom: "8px"
                  }}>Username</div>
                  <TextField value={username} onChange={e => setUsername(e.target.value)} label="Username" fullWidth variant="filled" />
               </div>
               <div className='mt-5'>
                  <div className='text-white' style={{
                     fontSize: "larger",
                     marginBottom: "8px"
                  }}>Email</div>
                  <TextField value={email} onChange={e => setEmail(e.target.value)} label="Email" type="email" fullWidth variant="filled" />
               </div>
               <div className='mt-5'>
                  <div className='text-white' style={{
                     fontSize: "larger",
                     marginBottom: "8px"
                  }}>Mật khẩu</div>
                  <TextField value={password} onChange={e => setPassword(e.target.value)} label="Mật khẩu" type="password" fullWidth variant="filled" />
               </div>
               <div className='mt-5'>
                  <div className='text-white' style={{
                     fontSize: "larger",
                     marginBottom: "8px"
                  }}>Ngày sinh</div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DatePicker
                        label="Ngày sinh"
                        value={birth_date}
                        onChange={(newDate) => setBirthDate(newDate)}
                        slotProps={{ textField: { fullWidth: true, variant: "filled" } }}
                     />
                  </LocalizationProvider>
               </div>
               <div className="mt-5 text-white">
                  <FormControl>
                     <FormLabel id="demo-row-radio-buttons-group-label"><div className='text-white' style={{
                        fontSize: "larger",
                        marginBottom: "8px"
                     }}>Giới tính</div></FormLabel>
                     <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                     >
                        <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                        <FormControlLabel value="male" control={<Radio />} label="Nam" />
                        <FormControlLabel value="other" control={<Radio />} label="Khác" />
                     </RadioGroup>
                  </FormControl>
               </div>
               <div className="mt-5 flex justify-center">
                  <div onClick={submitHandler} className='bg-emerald-600 hover:bg-emerald-400 duration-300 text-2xl font-bold text-black rounded-full cursor-pointer' style={{ padding: "4px 20px" }}>Đăng ký</div>
               </div>
            </div>
         </div>
      </ThemeProvider>
   );
}
