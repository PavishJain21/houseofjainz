import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { globeOutline, chevronDownOutline } from 'ionicons/icons';

// Language data with translations
const languages = {
  en: {
    name: 'English',
    labels: {
      appTitle: '',
      languageSelector: 'Language',
      english: 'English',
      hindi: 'Hindi'
    }
  },
  hi: {
    name: 'हिन्दी',
    labels: {
      appTitle: '',
      languageSelector: 'भाषा',
      english: 'अंग्रेज़ी',
      hindi: 'हिन्दी'
    }
  }
};

const LanguageSwitchHeader = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [showLanguagePopover, setShowLanguagePopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(null);
  
  const labels = languages[currentLang].labels;

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setShowLanguagePopover(false);
  };

  const openLanguagePopover = (e) => {
    setPopoverEvent(e.nativeEvent);
    setShowLanguagePopover(true);
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{labels.appTitle}</IonTitle>
        <IonButtons slot="end">
          <IonButton   color='light'onClick={openLanguagePopover}>
            <IonIcon color='light' icon={globeOutline} slot="start" />
             <span color='light'> {languages[currentLang].name} </span>
            <IonIcon icon={chevronDownOutline} slot="end" />
          </IonButton>
        </IonButtons>
        
        <IonPopover
          isOpen={showLanguagePopover}
          event={popoverEvent}
          onDidDismiss={() => setShowLanguagePopover(false)}
        >
          <IonList>
            <IonItem lines="none">
              <IonLabel color="medium">{labels.languageSelector}</IonLabel>
            </IonItem>
            
            <IonItem button onClick={() => handleLanguageChange('en')} detail={false}>
              <IonLabel>{labels.english}</IonLabel>
              {currentLang === 'en' && <IonIcon name="checkmark" slot="end" />}
            </IonItem>
            
            <IonItem button onClick={() => handleLanguageChange('hi')} detail={false}>
              <IonLabel>{labels.hindi}</IonLabel>
              {currentLang === 'hi' && <IonIcon name="checkmark" slot="end" />}
            </IonItem>
          </IonList>
        </IonPopover>
      </IonToolbar>
    </IonHeader>
  );
};

export default LanguageSwitchHeader;