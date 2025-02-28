import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonText,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTextarea,
  IonFooter,
  IonToolbar,
  IonContent,
  IonPage,
  IonActionSheet,
  IonSkeletonText,
  IonChip,
  IonSpinner,
  IonProgressBar,
  IonFab,
  IonFabButton,
  IonToast
} from '@ionic/react';
import {
  heart,
  heartOutline,
  chatbubbleOutline,
  paperPlaneOutline,
  bookmarkOutline,
  ellipsisHorizontal,
  shareSocial,
  logoWhatsapp,
  logoFacebook,
  logoTwitter,
  mailOutline,
  addOutline,
  imageOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform 
} from 'framer-motion';
import FooterPage from '../footer/footer';
import './feed.css';
import authMiddleware from '../../middleware/authMiddleware';

const FeedPage = () => {
  const user = localStorage.getItem('userDetails');
  const userDetails = user ? JSON.parse(user) : {};
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    username: userDetails.username || 'jain_community',
    userAvatar: 'src/assets/user-image.jpg',
    image: null,
    likes: 0,
    caption: '',
    comments: 0,
    timeAgo: 'Just now',
    isLiked: false,
    isSaved: false,
    isDoubleTapped: false,
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [expandedForm, setExpandedForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await authMiddleware('/posts/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();
        
        // Add a small delay for each post to create a staggered animation effect
        setTimeout(() => {
          setPosts(data);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
        showToastMessage('Failed to load posts. Please try again later.');
      }
    };

    fetchPosts();
  }, []);

  const handleDoubleTap = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId && !post.isLiked) {
        return {
          ...post,
          isLiked: true,
          likes: post.likes + 1,
          isDoubleTapped: true,
        };
      }
      return post;
    }));

    setTimeout(() => {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, isDoubleTapped: false };
        }
        return post;
      }));
    }, 1000);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const loadMore = (event) => {
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 0.1;
        if (newProgress >= 1) {
          clearInterval(progressInterval);
          setTimeout(() => {
            const newPosts = [...posts];
            setPosts(newPosts);
            event.target.complete();
            setUploadProgress(0);
          }, 300);
          return 1;
        }
        return newProgress;
      });
    }, 100);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setNewPost({ ...newPost, file: file, image: file.name });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearFileInput = () => {
    setPreviewUrl(null);
    setNewPost({ ...newPost, file: null, image: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('username', newPost.username);
    formData.append('userAvatar', newPost.userAvatar);
    if (newPost.file) {
      formData.append('image', "filePath");
      formData.append('file', newPost.file);
    }
    formData.append('likes', newPost.likes.toString());
    formData.append('caption', newPost.caption);
    formData.append('comments', newPost.comments.toString());
    formData.append('timeAgo', newPost.timeAgo);
    formData.append('isLiked', newPost.isLiked.toString());
    formData.append('isSaved', newPost.isSaved.toString());
    formData.append('isDoubleTapped', newPost.isDoubleTapped.toString());

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 0.1;
        return newProgress >= 0.9 ? 0.9 : newProgress;
      });
    }, 200);

    try {
      const response = await authMiddleware('/posts/create/', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(1);
      
      const data = await response.json();
      
      if (response.ok) {
        setTimeout(() => {
          setPosts([data, ...posts]);
          setNewPost({
            username: userDetails.username || 'jain_community',
            userAvatar: 'src/assets/user-image.jpg',
            image: null,
            likes: 0,
            caption: '',
            comments: 0,
            timeAgo: 'Just now',
            isLiked: false,
            isSaved: false,
            isDoubleTapped: false,
            file: null
          });
          setPreviewUrl(null);
          setExpandedForm(false);
          showToastMessage('Your post was published successfully!');
        }, 500);
      } else {
        console.error('Error creating post:', data);
        showToastMessage('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showToastMessage('Network error. Please check your connection.');
    } finally {
      clearInterval(progressInterval);
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleShare = (url) => {
    setShareUrl(url);
    setShowActionSheet(true);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const formVariants = {
    collapsed: { height: "60px", opacity: 0.9,marginBottom: "64px" },
    expanded: { height: "auto", opacity: 1 }
  };

  const iconButtonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.2, rotate: 5 },
    tap: { scale: 0.9 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const heartAnimation = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.2, 1], 
      opacity: [0, 1, 1],
      transition: { 
        duration: 0.6, 
        times: [0, 0.6, 1],
        ease: "easeInOut" 
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="feed-main-content">
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
          color="dark"
          buttons={[
            {
              icon: closeCircleOutline,
              role: 'cancel',
              handler: () => setShowToast(false)
            }
          ]}
        />
        
        <IonGrid className="instagram-wall">
          <IonRow>
            <IonCol size="12" sizeMd="8" offsetMd="2">
              <motion.div
                variants={formVariants}
                initial="collapsed"
                animate={expandedForm ? "expanded" : "collapsed"}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <IonCard className="create-post-card">
                  <IonCardContent>
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {!expandedForm ? (
                        <div className="create-post-collapsed" onClick={() => setExpandedForm(true)}>
                          <IonAvatar className="small-avatar">
                            <img src={newPost.userAvatar} alt="User" />
                          </IonAvatar>
                          <IonText color="medium">{t('spread_jainism')}</IonText>
                          <motion.div
                            variants={iconButtonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <IonIcon icon={addOutline} className="add-post-icon" />
                          </motion.div>
                        </div>
                      ) : (
                        <form onSubmit={handlePostSubmit} className="create-post-form" ref={formRef}>
                          <div className="form-header">
                            <IonAvatar className="small-avatar">
                              <img src={newPost.userAvatar} alt="User" />
                            </IonAvatar>
                            <IonText>{newPost.username}</IonText>
                            <motion.div
                              variants={iconButtonVariants}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => setExpandedForm(false)}
                            >
                              <IonIcon icon={closeCircleOutline} className="close-icon" />
                            </motion.div>
                          </div>
                          
                          <IonTextarea
                            placeholder={t('spread_jainism')}
                            value={newPost.caption}
                            onIonChange={(e) => setNewPost({ ...newPost, caption: e.detail.value })}
                            required
                            className="create-post-textarea"
                            autoGrow={true}
                            rows={3}
                          />
                          
                          <AnimatePresence>
                            {previewUrl && (
                              <motion.div 
                                className="image-preview-container"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <img src={previewUrl} alt="Preview" className="image-preview" />
                                <motion.div
                                  className="remove-image-button"
                                  variants={iconButtonVariants}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={clearFileInput}
                                >
                                  <IonIcon icon={closeCircleOutline} />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <div className="form-actions">
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileChange} 
                              accept="image/*" 
                              style={{ display: 'none' }}
                            />
                            
                            <motion.div
                              variants={iconButtonVariants}
                              initial="rest"
                              whileHover="hover"
                              whileTap="tap"
                              onClick={triggerFileInput}
                              className="upload-button"
                            >
                              <IonIcon icon={imageOutline} />
                              <IonText>{t('add_photo')}</IonText>
                            </motion.div>
                            
                            <IonButton 
                              fill="solid" 
                              color="primary" 
                              type="submit" 
                              disabled={isSubmitting} 
                              className="post-button"
                            >
                              {isSubmitting ? (
                                <IonSpinner name="dots" color="light" />
                              ) : (
                                t('post')
                              )}
                            </IonButton>
                          </div>
                          
                          {uploadProgress > 0 && (
                            <IonProgressBar 
                              value={uploadProgress} 
                              color="primary"
                              className="upload-progress"
                            />
                          )}
                        </form>
                      )}
                    </motion.div>
                  </IonCardContent>
                </IonCard>
              </motion.div>

              {isLoading ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[1, 2, 3].map((skeletonId) => (
                    <motion.div
                      key={`skeleton-${skeletonId}`}
                      variants={cardVariants}
                      className="skeleton-card"
                    >
                      <IonCard>
                        <IonCardHeader>
                          <div className="header-content">
                            <div className="user-info">
                              <IonSkeletonText animated style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                              <IonSkeletonText animated style={{ width: '100px', height: '20px' }} />
                            </div>
                          </div>
                        </IonCardHeader>
                        <IonSkeletonText animated style={{ width: '100%', height: '300px' }} />
                        <IonCardContent>
                          <IonSkeletonText animated style={{ width: '70%' }} />
                          <IonSkeletonText animated style={{ width: '40%' }} />
                        </IonCardContent>
                      </IonCard>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        layoutId={`post-${post.id}`}
                      >
                        <IonCard className="post-card">
                          <IonCardHeader className="post-header">
                            <div className="header-content">
                              <motion.div 
                                className="user-info" 
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <IonAvatar className="avatar">
                                  <motion.img 
                                    src={post.userAvatar} 
                                    alt={post.username}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                </IonAvatar>
                                <IonLabel className="username">{post.username}</IonLabel>
                              </motion.div>
                              {/* <motion.div 
                                whileHover={{ rotate: 90 }} 
                                transition={{ duration: 0.3 }}
                              >
                                <IonIcon icon={ellipsisHorizontal} className="more-options" />
                              </motion.div> */}
                            </div>
                          </IonCardHeader>

                          <motion.div 
                            className="post-image-container" 
                            onDoubleClick={() => handleDoubleTap(post.id)}
                            whileHover={{ scale: 0.99 }}
                            transition={{ duration: 0.2 }}
                          >
                            <IonImg 
                              src={post.image} 
                              alt="Post content" 
                              className="post-image" 
                              style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1' }} 
                            />
                            <AnimatePresence>
                              {post.isDoubleTapped && (
                                <motion.div
                                  className="double-tap-heart"
                                  variants={heartAnimation}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                >
                                  <IonIcon icon={heart} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>

                          <motion.div 
                            className="caption"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <span className="username">{post.username}</span> {post.caption}
                          </motion.div>

                          <IonCardContent className="post-content">
                            <div className="action-buttons">
                              <div className="left-actions">
                                {/* <motion.div
                                  className="action-button"
                                  variants={iconButtonVariants}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={() => handleLike(post.id)}
                                >
                                  <IonIcon icon={post.isLiked ? heart : heartOutline} 
                                    color={post.isLiked ? "danger" : ""} 
                                    className="action-icon" 
                                  />
                                  <IonText className="action-count">{post.likes}</IonText>
                                </motion.div> */}
                                
                                {/* <motion.div
                                  className="action-button"
                                  variants={iconButtonVariants}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <IonIcon icon={chatbubbleOutline} className="action-icon" />
                                  <IonText className="action-count">{post.comments}</IonText>
                                </motion.div>
                                 */}
                                <motion.div
                                  className="action-button"
                                  variants={iconButtonVariants}
                                  initial="rest"
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={() => handleShare(post.file)}
                                >
                                  <IonIcon icon={shareSocial} className="action-icon" />
                                </motion.div>
                              </div>
                              
                              {/* <motion.div
                                className="action-button"
                                variants={iconButtonVariants}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                              >
                                <IonIcon icon={bookmarkOutline} className="action-icon" />
                              </motion.div> */}
                            </div>
                            
                            <motion.div 
                              className="post-time"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.6 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              <IonText color="medium" className="time-ago">{post.timeAgo}</IonText>
                            </motion.div>
                          </IonCardContent>
                        </IonCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {uploadProgress > 0 && (
                <IonProgressBar value={uploadProgress} color="primary" />
              )}

              <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px">
                <IonInfiniteScrollContent
                  loadingSpinner="bubbles"
                  loadingText={t('loading_more_posts')}
                />
              </IonInfiniteScroll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter>
        <FooterPage />
      </IonFooter>

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: 'Share via WhatsApp',
            icon: logoWhatsapp,
            handler: () => {
              window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Share via Gmail',
            icon: mailOutline,
            handler: () => {
              window.open(`mailto:?subject=Check this out&body=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Share via Facebook',
            icon: logoFacebook,
            handler: () => {
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Share via Twitter',
            icon: logoTwitter,
            handler: () => {
              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close',
          },
        ]}
      />
    </IonPage>
  );
};

export default FeedPage;