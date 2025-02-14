import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  useIonViewDidEnter,
  IonText,
  createAnimation,
} from '@ionic/react';
import { personCircle, lockClosed, logoFacebook, logoGoogle } from 'ionicons/icons';
import './login.css';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  // Animation setup
  useIonViewDidEnter(() => {
    // Lotus animation
    const lotusAnimation = createAnimation()
      .addElement(document.querySelector('.lotus-icon'))
      .duration(2000)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: 'scale(1) rotate(0deg)', opacity: '0.8' },
        { offset: 0.5, transform: 'scale(1.1) rotate(180deg)', opacity: '1' },
        { offset: 1, transform: 'scale(1) rotate(360deg)', opacity: '0.8' }
      ]);

    // Card entrance animation
    const cardAnimation = createAnimation()
      .addElement(document.querySelector('.auth-card'))
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(30px)', 'translateY(0)');

    // Form items staggered animation
    const formItems = document.querySelectorAll('.animate-item');
    formItems.forEach((item, index) => {
      createAnimation()
        .addElement(item)
        .duration(800)
        .delay(200 * (index + 1))
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateX(-20px)', 'translateX(0)')
        .play();
    });

    lotusAnimation.play();
    cardAnimation.play();
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        const data = await response.json();
        setIsSubmitting(false);
        if (response.ok) {
          // Handle successful login
          console.log('Login successful:', data);
          localStorage.setItem('authToken', data.access); // Store token in local storage
          history.push('/dashboard'); // Redirect to dashboard or another page
        } else {
          // Handle errors
          console.error('Login failed:', data);
          setErrors({ form: 'Invalid username or password' });
        }
      } catch (error) {
        setIsSubmitting(false);
        console.error('Error:', error);
        setErrors({ form: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" scrollY={true}>
        <div className="wave-container">
          <div className="wave"></div>
        </div>
        <div className="login-container">
          {/* Lotus symbol */}
          <IonCard className="auth-card">
            <IonCardContent>
              <form onSubmit={handleSubmit}>
                <IonItem lines="full" className="animate-item">
                  <IonIcon icon={personCircle} slot="start" style={{ fontSize: '20px' }} />
                  <IonInput
                    label="Username"
                    labelPlacement="floating"
                    type="text"
                    value={formData.username}
                    onIonChange={e => setFormData({ ...formData, username: e.detail.value })}
                    className={errors.username ? 'ion-invalid' : ''}
                  />
                </IonItem>
                {errors.username && (
                  <IonText color="danger" className="ion-padding-start">
                    <small>{errors.username}</small>
                  </IonText>
                )}

                <IonItem lines="full" className="animate-item">
                  <IonIcon icon={lockClosed} slot="start" style={{ fontSize: '20px' }} />
                  <IonInput
                    label="Password"
                    labelPlacement="floating"
                    type="password"
                    value={formData.password}
                    onIonChange={e => setFormData({ ...formData, password: e.detail.value })}
                    className={errors.password ? 'ion-invalid' : ''}
                  />
                </IonItem>
                {errors.password && (
                  <IonText color="danger" className="ion-padding-start">
                    <small>{errors.password}</small>
                  </IonText>
                )}

                {errors.form && (
                  <IonText color="danger" className="ion-padding-start">
                    <small>{errors.form}</small>
                  </IonText>
                )}

                <div className="forgot-password animate-item">
                  <IonButton fill="clear" expand="block" size="small">
                    Forgot Password?
                  </IonButton>
                </div>

                <div className="ion-padding">
                  <IonButton
                    expand="block"
                    type="submit"
                    fill="clear"
                    size="default"
                    className="animate-item"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </IonButton>

                  <div className="social-login animate-item">
                    <div className="divider">
                      <span>or continue with</span>
                    </div>
                    <div className="social-buttons">
                      <IonButton fill="clear" size="small">
                        <IonIcon icon={logoGoogle} style={{ fontSize: '20px' }} />
                      </IonButton>
                      <IonButton fill="clear" size="small">
                        <IonIcon icon={logoFacebook} style={{ fontSize: '20px' }} />
                      </IonButton>
                    </div>
                  </div>
                  <div className="signup-prompt animate-item">
                    <IonButton fill="clear" size="small" onClick={() => history.push('/signup')}>
                      Create Account
                    </IonButton>
                  </div>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;