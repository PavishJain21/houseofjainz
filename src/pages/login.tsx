import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  useIonToast,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { phonePortraitOutline, chevronForwardOutline } from 'ionicons/icons';
import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './login.css';

const login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();
  const otpRefs = [useRef<HTMLIonInputElement>(null), useRef<HTMLIonInputElement>(null), 
                   useRef<HTMLIonInputElement>(null), useRef<HTMLIonInputElement>(null),
                   useRef<HTMLIonInputElement>(null), useRef<HTMLIonInputElement>(null)];
  const history = useHistory();

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length !== 10) {
      present({
        message: 'Please enter a valid 10-digit phone number',
        duration: 2000,
        color: 'danger'
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/send-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phoneNumber }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        setStep(2);
      } else {
        present({
          message: data.error || 'Failed to send OTP',
          duration: 2000,
          color: 'danger'
        });
      }
    } catch (error) {
      setLoading(false);
      present({
        message: 'An error occurred. Please try again.',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        otpRefs[index + 1].current?.setFocus();
      }
    }
  };

  const verifyOtp = async () => {
    if (otp.join('').length !== 6) {
      present({
        message: 'Please enter a valid OTP',
        duration:  2000,
        color: 'danger'
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phoneNumber, otp: otp.join('') }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        present({
          message: 'Successfully authenticated!',
          duration: 2000,
          color: 'success'
        });
        localStorage.setItem('authToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        if (data.IsNewUser) {
          history.push('/useredit'); // Redirect to user edit page for new users
        } else {
          history.push('/dashboard'); // Redirect to dashboard for existing users
        }
      } else {
        present({
          message: data.error || 'Invalid OTP',
          duration: 2000,
          color: 'danger'
        });
      }
    } catch (error) {
      setLoading(false);
      present({
        message: 'An error occurred. Please try again.',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {step === 2 && (
            <IonButtons slot="start">
              <IonBackButton defaultHref="#" onClick={() => setStep(1)} />
            </IonButtons>
          )}
          <IonTitle>{isLogin ? 'Login' : 'Sign Up'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="auth-content">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <IonCard className="auth-card">
                <IonCardContent>
                  <div className="ion-text-center ion-padding">
                    <h2 className="auth-title">
                      {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <IonText color="medium">
                      {step === 1 
                        ? "Enter your mobile number to continue" 
                        : "Enter the OTP sent to your phone"}
                    </IonText>
                  </div>

                  {step === 1 ? (
                    <div className="ion-padding">
                      <IonItem className="phone-input">
                        <IonIcon icon={phonePortraitOutline} slot="start" />
                        <IonInput
                          type="tel"
                          placeholder="Mobile Number"
                          value={phoneNumber}
                          onIonInput={(e) => setPhoneNumber(e.detail.value?.replace(/\D/g, '').slice(0, 10) || '')}
                          maxlength={10}
                          className="ion-padding-start"
                        />
                      </IonItem>

                      <IonButton
                        expand="block"
                        className="submit-button"
                        onClick={handlePhoneSubmit}
                        disabled={phoneNumber.length !== 10 || loading}
                      >
                        {loading ? <IonSpinner name="crescent" /> : (
                          <>
                            Continue
                            <IonIcon slot="end" icon={chevronForwardOutline} />
                          </>
                        )}
                      </IonButton>
                    </div>
                  ) : (
                    <div className="ion-padding">
                      <div className="otp-container">
                        {otp.map((digit, index) => (
                          <IonInput
                            key={index}
                            ref={otpRefs[index]}
                            type="text"
                            maxlength={1}
                            value={digit}
                            onIonInput={(e) => handleOtpChange(index, e.detail.value || '')}
                            className="otp-input"
                          />
                        ))}
                      </div>

                      <IonButton
                        expand="block"
                        className="submit-button"
                        onClick={verifyOtp}
                        disabled={otp.join('').length !== 6 || loading}
                      >
                        {loading ? <IonSpinner name="crescent" /> : 'Verify OTP'}
                      </IonButton>
                    </div>
                  )}

                  <div className="ion-text-center ion-padding-top">
                    <IonButton
                      fill="clear"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin 
                        ? "New user? Create account" 
                        : "Already have an account? Login"}
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default login;