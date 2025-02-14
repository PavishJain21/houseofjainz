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
} from 'ionicons/icons';
import { createAnimation } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './footer.css';

const FooterPage: React.FC = () => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

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

  return (
    <IonTabBar slot="bottom" className="instagram-footer">
      <IonTabButton 
        tab="home" 
        href="/home"
        id="home-btn"
        onMouseEnter={() => handleMouseEnter('home')}
        onMouseLeave={() => handleMouseLeave('home')}
      >
        <IonIcon icon={getIcon(homeOutline, home, 'home')} size="small" style={{ fontSize: '20px' }} />
        <IonLabel className={hoveredTab === 'home' ? 'label-active' : ''}>Home</IonLabel>
      </IonTabButton>

      <IonTabButton 
        tab="search" 
        href="/search"
        id="search-btn"
        onMouseEnter={() => handleMouseEnter('search')}
        onMouseLeave={() => handleMouseLeave('search')}
      >
        <IonIcon icon={getIcon(searchOutline, search, 'search')} size="small" style={{ fontSize: '20px' }} />
        <IonLabel className={hoveredTab === 'search' ? 'label-active' : ''}>Search</IonLabel>
      </IonTabButton>

      <IonTabButton 
        tab="calendar" 
        id="calendar-btn"
        onClick={() => history.push('/calender')}
        onMouseEnter={() => handleMouseEnter('calendar')}
        onMouseLeave={() => handleMouseLeave('calendar')}
      >
        <IonIcon icon={getIcon(calendarOutline, calendar, 'calendar')} size="small" style={{ fontSize: '20px' }} />
        <IonLabel className={hoveredTab === 'calendar' ? 'label-active' : ''}>Calendar</IonLabel>
      </IonTabButton>

      {isLoggedIn ? (
        <>
          <IonTabButton 
            tab="profile" 
            href="/profile"
            id="profile-btn"
            onMouseEnter={() => handleMouseEnter('profile')}
            onMouseLeave={() => handleMouseLeave('profile')}
          >
            <IonIcon icon={getIcon(personCircleOutline, personCircle, 'profile')} size="small" style={{ fontSize: '20px' }} />
            <IonLabel className={hoveredTab === 'profile' ? 'label-active' : ''}>Profile</IonLabel>
          </IonTabButton>

          <IonTabButton 
            tab="logout" 
            id="logout-btn"
            onClick={handleLogout}
            onMouseEnter={() => handleMouseEnter('logout')}
            onMouseLeave={() => handleMouseLeave('logout')}
          >
            <IonIcon icon={logOutOutline} size="small" style={{ fontSize: '20px' }} />
            <IonLabel className={hoveredTab === 'logout' ? 'label-active' : ''}>Logout</IonLabel>
          </IonTabButton>
        </>
      ) : (
        <IonTabButton 
          tab="login" 
          href="/login"
          id="login-btn"
          onMouseEnter={() => handleMouseEnter('login')}
          onMouseLeave={() => handleMouseLeave('login')}
        >
          <IonIcon icon={logInOutline} size="small" style={{ fontSize: '20px' }} />
          <IonLabel className={hoveredTab === 'login' ? 'label-active' : ''}>Login</IonLabel>
        </IonTabButton>
      )}
    </IonTabBar>
  );
};

export default FooterPage;