import React, { useState } from 'react';
import styles from './Settings.module.css';
import Footer from '../../components/footer/Footer';
import { useAuthContext } from '../../context/AuthContext';
import userPlaceholder from '../../assets/svg/user-placeholder.svg';
import Button1 from '../../components/button/Button1/Button1';
import { authApi } from '../../api';
import { showAlert } from '../../components/auth/Alert';

const Settings: React.FC = () => {
  const { user, setUser } = useAuthContext();

  // Form state
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar || null);
  const [newSkill, setNewSkill] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      let response;

      if (selectedFile) {
        const form = new FormData();
        form.append('avatar', selectedFile, selectedFile.name);
        form.append('fullname', fullname);
        if (email && email.trim()) {
          form.append('email', email.trim());
        }
        form.append('bio', bio);
        form.append('skills', JSON.stringify(skills));
        // walletAddress is read-only, don't send to server

        response = await authApi.updateProfile(form as any);
      } else {
        const updateData: any = {
          fullname,
          bio,
          skills,
        };
        // Only send email if it has a valid value
        if (email && email.trim()) {
          updateData.email = email.trim();
        }
        // walletAddress is read-only, don't send to server

        response = await authApi.updateProfile(updateData);
      }

      if (response?.data?.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);

        // Update all form states with server response
        setFullname(updatedUser.fullname || '');
        setEmail(updatedUser.email || '');
        setBio(updatedUser.bio || '');
        setSkills(updatedUser.skills || []);
        setWalletAddress(updatedUser.walletAddress || '');

        if (updatedUser.avatar) {
          setAvatar(updatedUser.avatar);
          setPreviewUrl(updatedUser.avatar);
        }

        // Clear selected file after successful upload
        setSelectedFile(null);

        showAlert(response.message || 'Profile updated successfully!', 'success');
      }
    } catch (error: any) {
      const errorMessage = error?.response.data.error.message;
      console.log("This is the error message:", errorMessage);
      showAlert(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.settingsWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>Manage your profile information and preferences</p>
        </div>

        <div className={styles.content}>
          {/* Profile Picture Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Profile Picture</h2>
            <div className={styles.avatarSection}>
              <img
                src={previewUrl || userPlaceholder}
                alt="Profile"
                className={styles.avatarPreview}
                onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = userPlaceholder; }}
              />
              <div className={styles.avatarControls}>
                <label className={styles.label}>Upload Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0];
                    if (f) {
                      setSelectedFile(f);
                      const url = URL.createObjectURL(f);
                      setPreviewUrl(url);
                    }
                  }}
                />
                <p className={styles.hint}>Upload a JPG/PNG/WebP image (max 5MB)</p>
              </div>
            </div>
          </section>

          {/* Basic Information Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea
                className={styles.textarea}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </section>

          {/* Skills Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <div key={index} className={styles.skillTag}>
                  <span>{skill}</span>
                  <button
                    type="button"
                    className={styles.removeSkillBtn}
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addSkillGroup}>
              <input
                type="text"
                className={styles.input}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill"
              />
              <button
                type="button"
                className={styles.addSkillBtn}
                onClick={handleAddSkill}
              >
                Add Skill
              </button>
            </div>
          </section>

          {/* Wallet Information Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Wallet Information</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Wallet Address</label>
              <input
                type="text"
                className={styles.input}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                readOnly
              />
              <p className={styles.hint}>Connected wallet address (read-only)</p>
            </div>
          </section>

          {/* Account Role Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Role</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Current Role</label>
              <div className={styles.roleDisplay}>
                {user?.role === 'developer' ? 'Developer' : 'Client'}
              </div>
              <p className={styles.hint}>Contact support to change your account role</p>
            </div>
          </section>

          {/* Save Button */}
          <div className={styles.saveSection}>
            <Button1
              text={isSaving ? 'Saving...' : 'Save Changes'}
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
