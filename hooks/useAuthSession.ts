import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearAuth } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";
import axios from 'axios';

const useAuthSession = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.user) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearAuth());
        }
      } catch (error) {
        console.error('Error fetching user', error);
        dispatch(clearAuth());
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      dispatch(clearAuth());
    }
  }, [dispatch]);

  return user;
};

export default useAuthSession;
