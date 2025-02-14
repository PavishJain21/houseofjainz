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
import { personCircle, mailOutline, lockClosed } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  // Animation setup
  useIonViewDidEnter(() => {
    // Card entrance animation
    const cardAnimation = createAnimation()
      .addElement(document.querySelector('.auth-card'))
      .duration(1000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(50px)', 'translateY(0)');

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

    cardAnimation.play();
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        setIsSubmitting(false);
        if (response.ok) {
          // Handle successful signup
          console.log('Signup successful:', data);
          history.push('/login'); // Redirect to login page after successful signup
        } else {
          // Handle errors
          console.error('Signup failed:', data);
          setErrors({ form: 'Signup failed. Please try again.' });
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
      <IonContent fullscreen className="ion-padding">
        <div className="wave-container">
          <div className="wave"></div>
        </div> 
        <div className="login-container">
          <IonCard className="auth-card">
            <IonCardContent>
              <form onSubmit={handleSubmit}>
                <IonItem lines="full" className="animate-item">
                  <IonIcon icon={personCircle} slot="start" />
                  <IonInput
                    label="Full Name"
                    labelPlacement="floating"
                    type="text"
                    value={formData.name}
                    onIonChange={e => setFormData({ ...formData, name: e.detail.value })}
                    className={errors.name ? 'ion-invalid' : ''}
                  />
                </IonItem>
                {errors.name && (
                  <IonText color="danger" className="ion-padding-start">
                    <small>{errors.name}</small>
                  </IonText>
                )}

                <IonItem lines="full" className="animate-item">
                  <IonIcon icon={mailOutline} slot="start" />
                  <IonInput
                    label="Email"
                    labelPlacement="floating"
                    type="email"
                    value={formData.email}
                    onIonChange={e => setFormData({ ...formData, email: e.detail.value })}
                    className={errors.email ? 'ion-invalid' : ''}
                  />
                </IonItem>
                {errors.email && (
                  <IonText color="danger" className="ion-padding-start">
                    <small>{errors.email}</small>
                  </IonText>
                )}

                <IonItem lines="full" className="animate-item">
                  <IonIcon icon={lockClosed} slot="start" />
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

                <IonItem lines="full" className="animate-item">
                  <IonIcon icon={lockClosed} slot="start" />
                  <IonInput
                    label="Confirm Password"
                    labelPlacement="floating"
                    type="password"
                    value={formData.confirmPassword}
                    onIonChange={e => setFormData({ ...formData, confirmPassword: e.detail.value })}
                    className={errors.confirmPassword ? 'ion-invalid' : ''}
                  />
                </IonItem>
                {errors.confirmPassword && (
                  <IonText color="danger" className="ion-padding-start">
                    <small>{errors.confirmPassword}</small>
                  </IonText>
                )}

                {errors.form && (
                  <IonText color="danger" className="ion-padding-start">
                    <small>{errors.form}</small>
                  </IonText>
                )}

                <div className="ion-padding">
                  <IonButton
                    expand="block"
                    type="submit"
                    fill="clear"
                    className="animate-item"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="clear"
                    className="animate-item"
                    onClick={() => history.push('/login')}
                  >
                    Already have an account? Log in
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;