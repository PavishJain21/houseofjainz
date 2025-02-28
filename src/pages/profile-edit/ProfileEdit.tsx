import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonBackButton,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonList,
    IonToast,
    IonIcon,
    IonRippleEffect,
    createAnimation,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
} from '@ionic/react';
import { checkmark, arrowBack, personCircle, mail, call, school, heart } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './profile-edit.css';
import { refreshAccessToken } from '../../utils/tokenUtil';

const ProfileEdit: React.FC = () => {
    const { t } = useTranslation();
    const user = localStorage.getItem('userDetails');
    const userDetails = user ? JSON.parse(user) : {};
    const [profile, setProfile] = useState({
        fullName: userDetails.username || '',
        email: '',
        phone: '',
        education: '',
        relationship: '',
    });
    const [activeInput, setActiveInput] = useState('');
    const [showToast, setShowToast] = useState(false);
    const history = useHistory();

    const relationshipOptions = [
        'relationship.single',
        'relationship.inARelationship',
       'relationship.married',
        'relationship.divorced',
        'relationship.widowed',
        'relationship.preferNotToSay'
    ];

    const educationOptions = [
        'education.highSchool',
        'education.bachelorsDegree',
        'education.mastersDegree',
        'education.phd',
        'education.other',
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(' https://houseofjainz.com/api/user-edit/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setProfile({
                        fullName: data.fullName,
                        email: data.email,
                        phone: data.phonenumber,
                        education: data.education,
                        relationship: data.relationship_status,
                    });
                } else {
                    debugger;
                    //refreshAccessToken();
                    // fetchProfile();
                    console.error('Error fetching profile:', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProfile();
    }, [t]);

    const handleFocus = (field: string) => {
        setActiveInput(field);
        const element = document.querySelector(`#${field}-container`);
        if (element) {
            createAnimation()
                .addElement(element)
                .duration(300)
                .fromTo('transform', 'translateX(-10px)', 'translateX(0px)')
                .fromTo('opacity', '0.8', '1')
                .play();
        }
    };

    const handleChange = (field: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Animate save button
        const saveButton = document.querySelector('.save-button');
        if (saveButton) {
            createAnimation()
                .addElement(saveButton)
                .duration(300)
                .keyframes([
                    { offset: 0, transform: 'scale(1)' },
                    { offset: 0.5, transform: 'scale(0.9)' },
                    { offset: 1, transform: 'scale(1)' }
                ])
                .play();
        }

        try {
            const response = await fetch(' https://houseofjainz.com/api//api/user-edit/update/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    fullName: profile.fullName,
                    email: profile.email,
                    phone: profile.phone,
                    education: profile.education,
                    relationship: profile.relationship,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setShowToast(true);
            } else {
                console.error('Error updating profile:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getIcon = (field: string) => {
        switch (field) {
            case 'fullName': return personCircle;
            case 'email': return mail;
            case 'phone': return call;
            case 'education': return school;
            case 'relationship': return heart;
            default: return personCircle;
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/profile" />
                    </IonButtons>
                    <IonTitle>{t('profile.editProfile')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding light-theme">
                <style>
                    {`
            .light-theme {
              --ion-background-color: #ffffff;
              --ion-text-color: #000000;
            }

            .input-item {
              --border-radius: 10px;
              --background: #f0f0f0;
              margin: 10px 0;
              transition: all 0.3s ease;
            }

            .input-item.active {
              --background: #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              transform: translateY(-2px);
            }

            .active .item-icon {
              transform: scale(1.2);
            }

            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .list-container {
              animation: slideIn 0.5s ease-out;
            }

            .save-button {
              --background: #007bff;
              --color: #ffffff;
              margin-top: 20px;
              width: 100%;
              border-radius: 10px;
              transition: transform 0.3s ease;
            }

            .save-button:hover {
              transform: scale(1.05);
            }

            .success-toast {
              --background: #28a745;
              --color: #ffffff;
            }
          `}
                </style>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('profile.editProfile')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <form onSubmit={handleSubmit} className="list-container">
                            <IonList>
                                {[
                                    { field: 'fullName', label: t('profile.fullName'), type: 'text', editable: true },
                                    { field: 'email', label: t('profile.email'), type: 'email', editable: true },
                                    { field: 'phone', label: t('profile.phoneNumber'), type: 'tel', editable: true },
                                    { field: 'education', label: t('profile.enterEducation'), type: 'select', options: educationOptions, editable: true },
                                    { field: 'relationship', label: "Select Relationship", type: 'select', options: relationshipOptions, editable: true }
                                ].map(({ field, label, type, options, editable }) => (
                                    <IonItem
                                        key={field}
                                        className={`input-item ${activeInput === field ? 'active' : ''}`}
                                        id={`${field}-container`}
                                    >
                                        <IonIcon
                                            icon={getIcon(field)}
                                            slot="start"
                                            className="item-icon"
                                        />
                                        <IonLabel position="stacked">{label}</IonLabel>
                                        {type === 'select' ? (
                                            <IonSelect
                                                value={profile[field as keyof typeof profile]}
                                                onIonChange={e => handleChange(field, e.detail.value)}
                                                onIonFocus={() => handleFocus(field)}
                                                onIonBlur={() => setActiveInput('')}
                                                interface="action-sheet"
                                                placeholder={t(`select ${field.charAt(0).toUpperCase() + field.slice(1)}`)}
                                                disabled={!editable}
                                            > 
                                                {options?.map(option => (
                                                    <IonSelectOption key={option} value={option}>
                                                        {t(option)}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        ) : (
                                            <IonInput
                                                type={type}
                                                value={profile[field as keyof typeof profile]}
                                                onIonChange={e => handleChange(field, e.detail.value!)}
                                                onIonFocus={() => handleFocus(field)}
                                                onIonBlur={() => setActiveInput('')}
                                                placeholder={t(`profile.enter${field.charAt(0).toUpperCase() + field.slice(1)}`)}
                                                clearInput
                                                disabled={!editable}
                                            />
                                        )}
                                        <IonRippleEffect />
                                    </IonItem>
                                ))}
                            </IonList>
                            <IonButton type="submit" className="save-button" expand="block">
                                {t('profile.saveChanges')}
                            </IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={t('profile.updateSuccess')}
                    duration={2000}
                    position="bottom"
                    color="success"
                    cssClass="success-toast"
                />
            </IonContent>
        </IonPage>
    );
};

export default ProfileEdit;