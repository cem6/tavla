import { Outlet } from 'react-router-dom';
// import SideBar from '../components/SideBar';
import { useMediaQuery } from 'react-responsive';

export default function Root() {
  const isExtraSmallScreen = useMediaQuery({ query: '(max-width: 480px)' })
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' })
  const isMediumScreen = useMediaQuery({ query: '(max-width: 1024px)' })
  const isLargeScreen = useMediaQuery({ query: '(max-width: 1440px)' })
  const isExtraLargeScreen = useMediaQuery({ query: '(min-width: 1441px)' })

  let scale
  if (isExtraSmallScreen) scale = 0.5
  else if (isSmallScreen) scale = 0.6 
  else if (isMediumScreen) scale = 0.8 
  else if (isLargeScreen) scale = 0.9
  else if (isExtraLargeScreen) scale = 1
  

  return (
    <div id="detail" style={{ transform: `scale(${scale})` }}>
      <Outlet />
    </div>
  );
}
