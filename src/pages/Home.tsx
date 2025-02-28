import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IonContent,
  IonPage,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCardContent,
  IonLabel,
  IonRippleEffect,
  IonSkeletonText,
  IonText,
  IonSearchbar,
  IonChip,
  IonButton,
} from '@ionic/react';
import {
  gridOutline,
  callOutline,
  calendarOutline,
  locationOutline,
  peopleOutline,
  notificationsOutline,
  menuOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { motion } from 'framer-motion';
import './Home.css';
import authMiddleware from '../middleware/authMiddleware';

// Create motion-wrapped components
const MotionIonCard = motion(IonCard);
const MotionDiv = motion.div;

const Home = () => {
  const { t, i18n } = useTranslation();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await authMiddleware('/get-logged-in-user/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        const data = await response.json();
        localStorage.setItem('userDetails', JSON.stringify(data));
        setUsername(data.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 800); // Simulate loading for demo
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  const menuItems = [
    {
      title: t('dashboard'),
      icon: gridOutline,
      path: '/dashboard',
      description: t('activity_overview'),
      color: '#6366f1',
    },
    {
      title: t('phone_directory'),
      icon: callOutline,
      path: '/directory',
      description: t('contacts_list'),
      color: '#8b5cf6',
    },
    {
      title: t('panchang'),
      icon: calendarOutline,
      path: '/panchang',
      description: t('daily_almanac'),
      color: '#ec4899',
    },
    {
      title: t('nearby_temples'),
      icon: locationOutline,
      path: '/temples',
      description: t('sacred_places'),
      color: '#14b8a6',
    },
    {
      title: t('contact'),
      icon: peopleOutline,
      path: '/directory',
      description: t('get_in_touch'),
      color: '#f59e0b',
    }
  ];

  const quickActions = ['Temples', 'Events', 'Donations', 'Community'];

  // Featured item component
  const FeaturedItem = () => (
    <MotionIonCard 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="featured-card ion-no-margin"
    >
      <IonCardContent>
        <IonRow className="ion-align-items-center">
          <IonCol size="8">
            <IonText color="dark">
              <h2 className="featured-title">Today's Panchang</h2>
            </IonText>
            <IonText color="medium" className="ion-padding-top">
              <p className="featured-subtitle">View today's auspicious timings</p>
            </IonText>
            <IonButton 
              fill="clear" 
              color="primary" 
              routerLink="/panchang"
              className="ion-no-padding featured-button"
            >
              View Details
              <IonIcon slot="end" icon={arrowForwardOutline} />
            </IonButton>
          </IonCol>
          <IonCol size="4" className="ion-text-center">
            <div className="featured-icon-container">
              <IonIcon icon={calendarOutline} />
            </div>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </MotionIonCard>
  );

  // Mobile app card component
  const MobileAppCard = ({ item, index }) => (
    <MotionIonCard 
      routerLink={item.path}
      className="mobile-card ion-activatable ripple-parent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        borderLeft: `4px solid ${item.color}`,
      }}
    >
      <IonCardContent className="ion-no-padding">
        <IonRow className="ion-align-items-center">
          <IonCol size="2" className="ion-text-center">
            <div className="card-icon" style={{ backgroundColor: `${item.color}20` }}>
              <IonIcon icon={item.icon} style={{ color: item.color }} />
            </div>
          </IonCol>
          <IonCol size="8">
            <IonLabel className="card-title">{item.title}</IonLabel>
            <IonLabel className="card-subtitle">{item.description}</IonLabel>
          </IonCol>
          <IonCol size="2" className="ion-text-right">
            <IonIcon icon={arrowForwardOutline} color="medium" />
          </IonCol>
        </IonRow>
        <IonRippleEffect />
      </IonCardContent>
    </MotionIonCard>
  );

  return (
    <IonPage>
      <IonContent className="mobile-gradient-bg">
        {/* Header Section */}
        <div className="mobile-header">
          <div className="header-top">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="header-greeting"
            >
              <div>
                {isLoading ? (
                  <IonSkeletonText animated style={{ width: '150px', height: '24px' }} />
                ) : (
                  <h1 className="greeting-text">Namaste, {username || 'Guest'}</h1>
                )}
                <p className="greeting-subtext">Welcome back</p>
              </div>
            </MotionDiv>
            
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="header-icons"
            >
              {/* <div className="notification-icon">
                <IonIcon icon={notificationsOutline} />
                <span className="notification-badge"></span>
              </div> */}
              {/* <IonIcon icon={menuOutline} className="menu-icon" /> */}
            </MotionDiv>
          </div>
          
          {/* Search Bar */}
          {/* <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <IonSearchbar
              placeholder="Search temples, events, contacts..."
              className="custom-searchbar"
              animated={true}
            />
          </MotionDiv> */}
          
          {/* Quick Actions */}
          {/* <MotionDiv
            className="quick-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {quickActions.map((action, index) => (
              <IonChip key={index} className="action-chip">
                {action}
              </IonChip>
            ))}
          </MotionDiv> */}
        </div>
        
        {/* Content Section */}
        <div className="mobile-content">
          {/* Featured Section */}
          <div className="section-title">
            {/* <h2>Featured</h2> */}
          </div>
          {/* <FeaturedItem /> */}
          
          {/* Menu Section */}
          <div className="section-title">
            <h2>Quick Access</h2>
          </div>
          
          <div className="menu-cards">
            {menuItems.map((item, index) => (
              <MobileAppCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;