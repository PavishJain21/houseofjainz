import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonCardContent,
  IonLabel,
} from '@ionic/react';
import {
  gridOutline,
  callOutline,
  calendarOutline,
  locationOutline,
  peopleOutline,
} from 'ionicons/icons';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://13.201.104.120:8000/api/get-logged-in-user/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        const data = await response.json();
        localStorage.setItem('userDetails', JSON.stringify(data));
        setUsername(data.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const menuItems = [
    {
      title: t('dashboard'),
      icon: gridOutline,
      path: '/dashboard',
      description: t('activity_overview')
    },
    {
      title: t('phone_directory'),
      icon: callOutline,
      path: '/directory',
      description: t('contacts_list')
    },
    {
      title: t('panchang'),
      icon: calendarOutline,
      path: '/panchang',
      description: t('daily_almanac')
    },
    {
      title: t('nearby_temples'),
      icon: locationOutline,
      path: '/temples',
      description: t('sacred_places')
    },
    {
      title: t('contact'),
      icon: peopleOutline,
      path: '/directory',
      description: t('get_in_touch')
    }
  ];
  interface DashboardCardProps {
    icon: string;
    title: string;
    path:string;
  }

  const cardStyle: React.CSSProperties = {
    margin: '8px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };
  
  const iconContainerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    borderRadius: '50%',
    padding: '12px',
    width: '48px',
    height: '48px',
    margin: '0 auto 12px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const iconStyle: React.CSSProperties = {
    fontSize: '24px',
    color: 'white',
  };
  
  const welcomeStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '20px 0',
    color: '#1f2937',
  };
  

  const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, path }) => (
    <IonCol size="6">
      <IonCard  routerLink={path} className="ion-text-center" style={cardStyle}>
        <IonCardContent>
          <div style={iconContainerStyle}>
            <IonIcon icon={icon} style={iconStyle} />
          </div>
          <IonLabel>{title}</IonLabel>
        </IonCardContent>
      </IonCard>
    </IonCol>
  );

  return (
    <IonPage>
      <IonContent className="bg-gray-50">
        <div className="wave-container">
          <div className="wave"></div>
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            {username ? `Welcome, ${username}` : 'Welcome'}
          </h1>
          
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              {menuItems.map((item, index) => (
                <DashboardCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  path={item.path}
                />
              ))}
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;