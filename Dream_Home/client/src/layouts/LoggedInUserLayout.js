import Navbar from '../components/Navbar';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserOnline } from '../redux/slices/userInfoSlice';


export default function LoggedInUserLayout() {
    const userOnline = useSelector(selectUserOnline);
    if (!userOnline) {
        return <Navigate to='/login' />
    }
  return (
    <div className='flex flex-col w-full h-svh'>
        <div className='flex w-full'>
          <Navbar />
        </div>
        <div className='flex w-full h-full'>
          <Outlet />
        </div>
    </div>
  )
}
