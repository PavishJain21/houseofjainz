import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle } from "@ionic/react";
import { menuOutline } from "ionicons/icons"; // Import the menu icon
import LanguageSwitcher from '../../components/LanguageSwitcher';
import './Header.css'; // Import the CSS file for styling

const Header: React.FC = () => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={() => document.querySelector("ion-menu")?.open()}>
            <IonIcon icon={menuOutline} />
          </IonButton>
        </IonButtons>

        <IonTitle>House of Jainz</IonTitle>
        <div className="header-right">
          <LanguageSwitcher />
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
