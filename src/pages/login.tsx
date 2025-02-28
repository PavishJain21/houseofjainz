import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonIcon,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  useIonToast,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
} from '@ionic/react';
import { 
  phonePortraitOutline, 
  chevronForwardOutline, 
  arrowBackOutline, 
  lockClosedOutline 
} from 'ionicons/icons';
import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './login.css';
import logo from '../assets/hoj.svg'; 
const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [present] = useIonToast();
  const otpRefs = [
    useRef<HTMLIonInputElement>(null), useRef<HTMLIonInputElement>(null), 
    useRef<HTMLIonInputElement>(null), useRef<HTMLIonInputElement>(null),
    useRef<HTMLIonInputElement>(null), useRef<HTMLIonInputElement>(null)
  ];
  const history = useHistory();

  useEffect(() => {
    let timer: any;
    if (step === 2 && resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled, step]);

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length !== 10) {
      present({
        message: 'Please enter a valid 10-digit phone number',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://houseofjainz.com/api/send-otp/', {
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
        setCountdown(30);
        setResendDisabled(true);
      } else {
        present({
          message: data.error || 'Failed to send OTP',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
      }
    } catch (error) {
      setLoading(false);
      present({
        message: 'An error occurred. Please try again.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
    }
  };

  const handleResendOtp = () => {
    setResendDisabled(true);
    setCountdown(30);
    handlePhoneSubmit();
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
      // Auto-verify when all digits are entered
      if (value && index === 5 && newOtp.every(digit => digit)) {
        verifyOtp();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      otpRefs[index - 1].current?.setFocus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Focus on the last input after pasting
      otpRefs[5].current?.setFocus();
    }
  };

  const verifyOtp = async () => {
    if (otp.join('').length !== 6) {
      present({
        message: 'Please enter a valid OTP',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://houseofjainz.com/api/verify-otp/', {
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
          color: 'success',
          position: 'top'
        });
        localStorage.setItem('authToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        if (data.IsNewUser) {
          history.push('/useredit');
        } else {
          history.push('/dashboard');
        }
      } else {
        present({
          message: data.error || 'Invalid OTP',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
      }
    } catch (error) {
      setLoading(false);
      present({
        message: 'An error occurred. Please try again.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border transparent-header">
        <IonToolbar>
          {step === 2 && (
            <IonButtons slot="start">
              <IonBackButton 
                defaultHref="#" 
                icon={arrowBackOutline} 
                text="" 
                onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                }} 
              />
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="auth-content">
        {/* <div className="wave-container">
          <div className="wave"></div>
        </div> */}
        
        <IonGrid className="ion-padding">
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="auth-logo-container">
                <div className="auth-logo">
                  {/* Your app logo goes here */}
                  <div className="logo-placeholder">
                    <img src={logo} alt="App Logo" />
                  </div>
                </div>
              </div>
              
              <div className="auth-card">
                <div className="auth-card-content">
                  <div className="ion-text-center ion-padding-bottom">
                    <h1 className="auth-title">
                      {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <IonText color="medium" className="auth-subtitle">
                      {step === 1 
                        ? "Enter your mobile number to continue" 
                        : `Enter the 6-digit OTP sent to +91 ${phoneNumber}`}
                    </IonText>
                  </div>

                  {step === 1 ? (
                    <div className="phone-input-container">
                      <div className="country-code">+91</div>
                      <IonItem lines="none" className="phone-input-item">
                        <IonIcon icon={phonePortraitOutline} slot="start" className="input-icon" />
                        <IonInput
                          type="tel"
                          placeholder="Mobile Number"
                          value={phoneNumber}
                          onIonInput={(e) => setPhoneNumber(e.detail.value?.replace(/\D/g, '').slice(0, 10) || '')}
                          maxlength={10}
                          className="phone-number-input"
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
                    <div className="otp-section">
                      <div className="otp-container" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                          <IonInput
                            key={index}
                            ref={otpRefs[index]}
                            type="tel"
                            inputmode="numeric"
                            maxlength={1}
                            value={digit}
                            onIonInput={(e) => handleOtpChange(index, e.detail.value || '')}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="otp-input"
                          />
                        ))}
                      </div>

                      <div className="resend-container">
                        <IonButton 
                          fill="clear" 
                          size="small" 
                          className="resend-button"
                          disabled={resendDisabled}
                          onClick={handleResendOtp}
                        >
                          {resendDisabled 
                            ? `Resend OTP in ${countdown}s` 
                            : 'Resend OTP'}
                        </IonButton>
                      </div>

                      <IonButton
                        expand="block"
                        className="submit-button"
                        onClick={verifyOtp}
                        disabled={otp.join('').length !== 6 || loading}
                      >
                        {loading ? <IonSpinner name="crescent" /> : (
                          <>
                            Verify OTP
                            <IonIcon slot="end" icon={lockClosedOutline} />
                          </>
                        )}
                      </IonButton>
                    </div>
                  )}

                  <div className="auth-toggle">
                    <IonButton
                      fill="clear"
                      className="toggle-button"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin 
                        ? "New user? Create account" 
                        : "Already have an account? Login"}
                    </IonButton>
                  </div>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;