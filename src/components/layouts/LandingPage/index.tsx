import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import './style.scss';

const LandingPageLayout = () => {
  return (
    <div className="mx_LandingPage">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
