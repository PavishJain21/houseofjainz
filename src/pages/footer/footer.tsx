import React, { useState, useEffect } from 'react';
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import {
  home,
  homeOutline,
  search,
  searchOutline,
  calendar,
  calendarOutline,
  heart,
  heartOutline,
  personCircle,
  personCircleOutline,
  logInOutline,
  logOutOutline,
  locateOutline,
  location,
  locationOutline,
} from 'ionicons/icons';
import { createAnimation } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './footer.css';
import Calendar, { PanchangPage } from '../Calender';
const FooterPage: React.FC = () => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const history = useHistory();
  const token = localStorage.getItem('authToken');
  useEffect(() => {
     if(token){
      setIsLoggedIn(true);
     }else{
      setIsLoggedIn(false);
     }
  }, [token]);
   
  const handleMouseEnter = (tabId: string) => {
    setHoveredTab(tabId);
    const element = document.querySelector(`#${tabId}-btn`);
    if (element) {
      createAnimation()
        .addElement(element)
        .duration(300)
        .iterations(1)
        .fromTo('transform', 'scale(1)', 'scale(1.1)')
        .play();
    }
  };

  const handleMouseLeave = (tabId: string) => {
    setHoveredTab(null);
    const element = document.querySelector(`#${tabId}-btn`);
    if (element) {
      createAnimation()
        .addElement(element)
        .duration(300)
        .iterations(1)
        .fromTo('transform', 'scale(1.1)', 'scale(1)')
        .play();
    }
  };

  const getIcon = (outlineIcon: string, filledIcon: string, tabId: string) => {
    return hoveredTab === tabId ? filledIcon : outlineIcon;
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    history.push('/login');
  };
  {}
  console.log('isLoggedIn',isLoggedIn);
  return (
   
    <IonTabBar slot="bottom" className="instagram-footer">
      <IonTabButton 
        tab="home" 
        href="/home"
        id="home-btn"
        className='tool-btn'
        onClick={ ()=>{history.push('/home');} }
        onMouseEnter={() => handleMouseEnter('home')}
        onMouseLeave={() => handleMouseLeave('home')}
      >
        <IonIcon icon={getIcon(homeOutline, home, 'home')} size="large" style={{ fontSize: '24px' }} />
        {/* <IonLabel className={hoveredTab === 'home' ? 'label-active' : ''}>Home</IonLabel> */}
      </IonTabButton>

      <IonTabButton 
        tab="nearby" 
        className='tool-btn'
        onClick={ ()=>{history.push('/nearby');} }
        onMouseEnter={() => handleMouseEnter('nearby')}
        onMouseLeave={() => handleMouseLeave('nearby')}
      >
        <IonIcon icon={getIcon(locationOutline, location, 'location')} size="large" style={{ fontSize: '24px' }} />
        {/* <IonLabel className={hoveredTab === 'search' ? 'label-active' : ''}>Nearby Temple</IonLabel> */}
      </IonTabButton>

      <IonTabButton 
        tab="calendar"
        className='tool-btn' 
        onClick={ ()=>{history.push('/calender');} }
        onMouseEnter={() => handleMouseEnter('calendar')}
        onMouseLeave={() => handleMouseLeave('calendar')}
      >
        <IonIcon icon={getIcon(calendarOutline, calendar, 'calendar')} size="large" style={{ fontSize: '24px' }} />
        {/* <IonLabel className={hoveredTab === 'calendar' ? 'label-active' : ''}>Calendar</IonLabel> */}
      </IonTabButton>

      {isLoggedIn && (
          <IonTabButton 
            tab="profile" 
            onClick={()=>{
              history.push('/useredit');
            }}
            id="profile-btn"
              className='tool-btn'
            onMouseEnter={() => handleMouseEnter('profile')}
            onMouseLeave={() => handleMouseLeave('profile')}
          >
            <IonIcon icon={getIcon(personCircleOutline, personCircle, 'profile')} size="large" style={{ fontSize: '24px' }} />
            {/* <IonLabel className={hoveredTab === 'profile' ? 'label-active' : ''}>Profile</IonLabel> */}
          </IonTabButton>
      )}
          {isLoggedIn ? (
          <IonTabButton 
            tab="logout" 
                className='tool-btn'
            onClick={handleLogout}
            onMouseEnter={() => handleMouseEnter('logout')}
            onMouseLeave={() => handleMouseLeave('logout')}
          >
            <IonIcon icon={logOutOutline} size="large" style={{ fontSize: '24px' }} />
            {/* <IonLabel className={hoveredTab === 'logout' ? 'label-active' : ''}>Logout</IonLabel> */}
          </IonTabButton>
      ) : (
        <IonTabButton 
          tab="login" 
              className='tool-btn'
          onClick={()=>{
            history.push('/login');
          }}
          onMouseEnter={() => handleMouseEnter('login')}
          onMouseLeave={() => handleMouseLeave('login')}
        >
          <IonIcon icon={logInOutline} size="large" style={{ fontSize: '24px' }} />
          {/* <IonLabel className={hoveredTab === 'login' ? 'label-active' : ''}>Login</IonLabel> */}
        </IonTabButton>
      )}
    </IonTabBar>
  );
};

export default FooterPage;