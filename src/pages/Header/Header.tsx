import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle } from "@ionic/react";
import { menuOutline } from "ionicons/icons"; // Import the menu icon
import LanguageSwitcher from '../../components/LanguageSwitcher';
import './Header.css'; // Import the CSS file for styling

const Header: React.FC = () => {
  return (
    <IonHeader>
    <IonToolbar>
      <IonTitle>House of Jainz</IonTitle>
      {/* <IonButtons slot="end">
        <IonButton>English</IonButton>
        <IonButton>हिन्दी</IonButton>
      </IonButtons> */}
    </IonToolbar>
  </IonHeader>
  );
};

export default Header;
