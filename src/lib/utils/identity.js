import Cookies from 'js-cookie';
export const genId = () => {
  if (!Cookies.get('id'))
    Cookies.set('id', Date.now().valueOf(), { expires: 3 });
  return Cookies.get('id');
};
