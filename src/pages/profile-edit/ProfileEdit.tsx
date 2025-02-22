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
} from '@ionic/react';
import { checkmark, arrowBack, personCircle, mail, call, school, heart } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './profile-edit.css';
const ProfileEdit: React.FC = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        education: '',
        relationship: '',
    });
    const [activeInput, setActiveInput] = useState('');
    const [showToast, setShowToast] = useState(false);
    const history = useHistory();

    const relationshipOptions = [
        'Single',
        'In a Relationship',
        'Married',
        'Divorced',
        'Widowed',
        'Prefer not to say',
    ];

    const educationOptions = [
        'High School',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'Ph.D.',
        'Other',
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user-edit/', {
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
                    console.error('Error fetching profile:', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProfile();
    }, []);

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
            const response = await fetch('http://127.0.0.1:8000/api/user-edit/update/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    username: profile.fullName,
                    email: profile.email,
                    phonenumber: profile.phone,
                    education: profile.education,
                    relationship_status: profile.relationship,
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
            <IonContent className="ion-padding">
                <style>
                    {`
            .input-item {
              --border-radius: 10px;
              --background: #f8f8f8;
              margin: 10px 0;
              transition: all 0.3s ease;
            }

            .input-item.active {
              --background: #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              transform: translateY(-2px);
            }

            .item-icon {
              margin-right: 10px;
              color: #6B73FF;
              transition: all 0.3s ease;
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
          `}
                </style>
            
                <form onSubmit={handleSubmit} className="list-container">
                    <IonList>
                        {[
                            { field: 'fullName', label: 'Full Name', type: 'text', editable: false },
                            { field: 'email', label: 'Email', type: 'email', editable: false },
                            { field: 'phone', label: 'Phone Number', type: 'tel', editable: true },
                            { field: 'education', label: 'Education', type: 'select', options: educationOptions, editable: true },
                            { field: 'relationship', label: 'Relationship Status', type: 'select', options: relationshipOptions, editable: true }
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
                                        placeholder={`Select ${label.toLowerCase()}`}
                                        disabled={!editable}
                                    >
                                        {options?.map(option => (
                                            <IonSelectOption key={option} value={option}>
                                                {option}
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
                                        placeholder={`Enter your ${label.toLowerCase()}`}
                                        clearInput
                                        disabled={!editable}
                                    />
                                )}
                                <IonRippleEffect />
                            </IonItem>
                        ))}
                    </IonList>
                </form>
                <IonButtons>
                               <IonButton fill="clear" onClick={handleSubmit} expand="block" size="small">
                                    Save Changes
                            </IonButton>
                    </IonButtons>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Profile updated successfully!"
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