import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle } from "@ionic/react";
import { menuOutline } from "ionicons/icons"; // Import the menu icon

const Header: React.FC = () => {
  return (
    <IonHeader>
      <IonToolbar>
        {/* ✅ Custom Menu Button */}
        <IonButtons slot="start">
          <IonButton onClick={() => document.querySelector("ion-menu")?.open()}>
            <IonIcon icon={menuOutline} />
          </IonButton>
        </IonButtons>

        <IonTitle>House of Jainz</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
