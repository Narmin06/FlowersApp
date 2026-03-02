import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const isDarkMode = useAppStore(state => state.isDarkMode);
    const toggleDarkMode = useAppStore(state => state.toggleDarkMode);

    const userName = useAppStore(state => state.userName);
    const userEmail = useAppStore(state => state.userEmail);
    const setUserName = useAppStore(state => state.setUserName);
    const setUserEmail = useAppStore(state => state.setUserEmail);

    const theme = isDarkMode ? darkTheme : lightTheme;

    const [isEditProfileVisible, setEditProfileVisible] = useState(false);
    const [editName, setEditName] = useState(userName);
    const [editEmail, setEditEmail] = useState(userEmail);

    const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isFaqVisible, setFaqVisible] = useState(false);
    const [isContactVisible, setContactVisible] = useState(false);
    const [contactMessage, setContactMessage] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const dataStr = await AsyncStorage.getItem('userData');
                if (dataStr) {
                    const data = JSON.parse(dataStr);
                    if (data.fullName && userName === 'Guest') setUserName(data.fullName);
                    if (data.email && userEmail === 'guest@bloomy.com') setUserEmail(data.email);
                }
            } catch (e) {
                console.error('Failed to load user data', e);
            }
        };
        loadUserData();
    }, []);

    const openEditProfile = () => {
        setEditName(userName);
        setEditEmail(userEmail);
        setEditProfileVisible(true);
    };

    const handleSaveProfile = async () => {
        if (!editName || !editEmail) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }
        setUserName(editName);
        setUserEmail(editEmail);

        try {
            const dataStr = await AsyncStorage.getItem('userData');
            let data = dataStr ? JSON.parse(dataStr) : {};
            data.fullName = editName;
            data.email = editEmail;
            await AsyncStorage.setItem('userData', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save user data', e);
        }

        setEditProfileVisible(false);
    };

    const handleSavePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }

        try {
            const dataStr = await AsyncStorage.getItem('userData');
            let data = dataStr ? JSON.parse(dataStr) : {};

            if (data.password && data.password !== currentPassword) {
                Alert.alert("Error", "Current password is incorrect.");
                return;
            }

            data.password = newPassword;
            await AsyncStorage.setItem('userData', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save new password', e);
            Alert.alert("Error", "Failed to update password.");
            return;
        }

        setChangePasswordVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        Alert.alert("Success", "Password changed successfully!");
    };

    const handleSendContact = () => {
        if (!contactMessage) {
            Alert.alert("Error", "Please enter a message.");
            return;
        }
        Alert.alert("Success", "Message sent successfully! We will get back to you soon.");
        setContactVisible(false);
        setContactMessage('');
    };

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} style={{ marginTop: 2 }} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, theme.text]}>Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Account Settings */}
                <View style={[styles.section, theme.card]}>
                    <Text style={[styles.sectionTitle, theme.text]}>Account</Text>

                    <TouchableOpacity style={styles.settingItem} onPress={openEditProfile}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, theme.text]}>Edit Profile</Text>
                            <Text style={styles.settingSubtitle}>Change your name and avatar</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AA949C" />
                    </TouchableOpacity>

                    <View style={[styles.divider, theme.divider]} />

                    <TouchableOpacity style={styles.settingItem} onPress={() => setChangePasswordVisible(true)}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, theme.text]}>Change Password</Text>
                            <Text style={styles.settingSubtitle}>Update your security credentials</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AA949C" />
                    </TouchableOpacity>
                </View>

                {/* Appearance */}
                <View style={[styles.section, theme.card]}>
                    <Text style={[styles.sectionTitle, theme.text]}>Appearance</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, theme.text]}>Dark Mode</Text>
                            <Text style={styles.settingSubtitle}>Easier on your eyes</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#EFE4E5", true: "#AD6D71" }}
                            thumbColor={"#FFFFFF"}
                            ios_backgroundColor="#EFE4E5"
                            onValueChange={toggleDarkMode}
                            value={isDarkMode}
                        />
                    </View>
                </View>

                {/* Help & Support */}
                <View style={[styles.section, theme.card]}>
                    <Text style={[styles.sectionTitle, theme.text]}>Help & Support</Text>

                    <TouchableOpacity style={styles.settingItem} onPress={() => setFaqVisible(true)}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, theme.text]}>FAQ</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AA949C" />
                    </TouchableOpacity>

                    <View style={[styles.divider, theme.divider]} />

                    <TouchableOpacity style={styles.settingItem} onPress={() => setContactVisible(true)}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingTitle, theme.text]}>Contact Us</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#AA949C" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={isEditProfileVisible} animationType="slide" transparent={true} onRequestClose={() => setEditProfileVisible(false)}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.modalContent, theme.card]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, theme.text]}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setEditProfileVisible(false)} style={styles.closeModalButton}>
                                <Feather name="x" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>Full Name</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FCF3F5', borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                    <TextInput
                                        style={[styles.input, theme.text]}
                                        value={editName}
                                        onChangeText={setEditName}
                                        placeholder="Enter your name"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>Email</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FCF3F5', borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                    <TextInput
                                        style={[styles.input, theme.text]}
                                        value={editEmail}
                                        onChangeText={setEditEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholder="Enter your email"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} activeOpacity={0.8}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            <Modal visible={isChangePasswordVisible} animationType="slide" transparent={true} onRequestClose={() => setChangePasswordVisible(false)}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.modalContent, theme.card]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, theme.text]}>Change Password</Text>
                            <TouchableOpacity onPress={() => setChangePasswordVisible(false)} style={styles.closeModalButton}>
                                <Feather name="x" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>Current Password</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FCF3F5', borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                    <TextInput
                                        style={[styles.input, theme.text]}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry
                                        placeholder="Enter current password"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>New Password</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FCF3F5', borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                    <TextInput
                                        style={[styles.input, theme.text]}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                        placeholder="Enter new password"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>Confirm New Password</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FCF3F5', borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                    <TextInput
                                        style={[styles.input, theme.text]}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        placeholder="Confirm new password"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword} activeOpacity={0.8}>
                                <Text style={styles.saveButtonText}>Update Password</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* FAQ Modal */}
            <Modal visible={isFaqVisible} animationType="slide" transparent={true} onRequestClose={() => setFaqVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, theme.card]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, theme.text]}>FAQ</Text>
                            <TouchableOpacity onPress={() => setFaqVisible(false)} style={styles.closeModalButton}>
                                <Feather name="x" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[styles.faqItem, { borderBottomColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                <Text style={[styles.faqQuestion, theme.text]}>How do I track my order?</Text>
                                <Text style={styles.faqAnswer}>You can track your order in the "My Orders" section under your Profile.</Text>
                            </View>
                            <View style={[styles.faqItem, { borderBottomColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                <Text style={[styles.faqQuestion, theme.text]}>What are the delivery times?</Text>
                                <Text style={styles.faqAnswer}>We deliver every day between 9 AM and 8 PM. Same-day delivery is available for orders placed before 2 PM.</Text>
                            </View>
                            <View style={[styles.faqItem, { borderBottomColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                <Text style={[styles.faqQuestion, theme.text]}>Can I cancel my order?</Text>
                                <Text style={styles.faqAnswer}>Orders can be canceled up to 24 hours before the scheduled delivery date from the "My Orders" section.</Text>
                            </View>
                            <View style={[styles.faqItem, { borderBottomColor: isDarkMode ? '#2A2A2A' : '#F3E9EA', borderBottomWidth: 0 }]}>
                                <Text style={[styles.faqQuestion, theme.text]}>Do you ship internationally?</Text>
                                <Text style={styles.faqAnswer}>Currently, we only deliver within the city limits. We are working on expanding our delivery zones!</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal visible={isContactVisible} animationType="slide" transparent={true} onRequestClose={() => setContactVisible(false)}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.modalContent, theme.card]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, theme.text]}>Contact Us</Text>
                            <TouchableOpacity onPress={() => setContactVisible(false)} style={styles.closeModalButton}>
                                <Feather name="x" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>Your Message</Text>
                                <View style={[styles.textAreaContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FCF3F5', borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                    <TextInput
                                        style={[styles.textArea, theme.text]}
                                        value={contactMessage}
                                        onChangeText={setContactMessage}
                                        placeholder="How can we help you?"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                        multiline
                                        numberOfLines={6}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSendContact} activeOpacity={0.8}>
                                <Text style={styles.saveButtonText}>Send Message</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    card: { backgroundColor: '#1E1E1E', shadowOpacity: 0 },
    text: { color: '#FFFFFF' },
    divider: { backgroundColor: '#2A2A2A' },
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    card: { backgroundColor: '#FFFFFF' },
    text: { color: '#150935' },
    divider: { backgroundColor: '#F3E9EA' },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF8F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#150935',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    settingInfo: {
        flex: 1,
        paddingRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#150935',
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#AA949C',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3E9EA',
        marginVertical: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#150935',
    },
    closeModalButton: {
        padding: 4,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 15,
        height: '100%',
    },
    saveButton: {
        backgroundColor: '#AD6D71',
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    faqItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#AA949C',
        lineHeight: 22,
    },
    textAreaContainer: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        minHeight: 120,
    },
    textArea: {
        flex: 1,
        fontSize: 15,
        minHeight: 100,
    },
});
