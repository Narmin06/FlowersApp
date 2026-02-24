import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddressesScreen() {
    const router = useRouter();
    const addresses = useAppStore(state => state.addresses);
    const addAddress = useAppStore(state => state.addAddress);
    const updateAddress = useAppStore(state => state.updateAddress);
    const deleteAddress = useAppStore(state => state.deleteAddress);

    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newAddress, setNewAddress] = useState('');

    const handleSaveAddress = () => {
        if (!newTitle || !newAddress) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        const type = newTitle.toLowerCase() === 'home' ? 'home' : (newTitle.toLowerCase() === 'office' ? 'briefcase' : 'map-pin');

        if (editingId) {
            updateAddress(editingId, { title: newTitle, address: newAddress, type });
        } else {
            addAddress({
                id: Date.now().toString(),
                title: newTitle,
                address: newAddress,
                isDefault: addresses.length === 0,
                type: type
            });
        }

        closeModal();
    };

    const handleDelete = () => {
        if (editingId) {
            deleteAddress(editingId);
            closeModal();
        }
    };

    const openEditModal = (item: any) => {
        setEditingId(item.id);
        setNewTitle(item.title);
        setNewAddress(item.address);
        setAddModalVisible(true);
    };

    const openAddModal = () => {
        setEditingId(null);
        setNewTitle('');
        setNewAddress('');
        setAddModalVisible(true);
    };

    const closeModal = () => {
        setAddModalVisible(false);
        setEditingId(null);
        setNewTitle('');
        setNewAddress('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#150935" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Addresses</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {addresses.map((item) => (
                    <View key={item.id} style={styles.addressCard}>
                        <View style={styles.iconContainer}>
                            <Feather name={item.type as any} size={20} color="#D1A3A6" />
                        </View>

                        <View style={styles.addressInfo}>
                            <View style={styles.titleRow}>
                                <Text style={styles.addressTitle}>{item.title}</Text>
                                {item.isDefault && (
                                    <View style={styles.defaultBadge}>
                                        <Text style={styles.defaultText}>Default</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.addressText}>{item.address}</Text>
                        </View>

                        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                            <Feather name="edit-2" size={18} color="#AA949C" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.8}
                    onPress={openAddModal}
                >
                    <Feather name="plus" size={20} color="#FFFFFF" style={styles.addIcon} />
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Add Address Modal */}
            <Modal
                visible={isAddModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingId ? 'Edit Address' : 'Add New Address'}</Text>
                            <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
                                <Feather name="x" size={24} color="#150935" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Title (e.g. Home, Office)</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter address title"
                                        value={newTitle}
                                        onChangeText={setNewTitle}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Address</Text>
                                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Enter your full address"
                                        multiline
                                        numberOfLines={3}
                                        value={newAddress}
                                        onChangeText={setNewAddress}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress} activeOpacity={0.8}>
                                <Text style={styles.saveButtonText}>{editingId ? 'Update Address' : 'Save Address'}</Text>
                            </TouchableOpacity>

                            {editingId && (
                                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
                                    <Text style={styles.deleteButtonText}>Delete Address</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

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
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FCF3F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addressInfo: {
        flex: 1,
        marginRight: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#150935',
        marginRight: 8,
    },
    defaultBadge: {
        backgroundColor: '#EFE4E5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 10,
        color: '#D1A3A6',
        fontWeight: '600',
    },
    addressText: {
        fontSize: 13,
        color: '#AA949C',
        lineHeight: 18,
    },
    editButton: {
        padding: 8,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#D1A3A6',
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    addIcon: {
        marginRight: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
    modalForm: {
        paddingBottom: 20,
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
        backgroundColor: '#FCF3F5',
        borderWidth: 1,
        borderColor: '#F3E9EA',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    textAreaContainer: {
        height: 100,
        alignItems: 'flex-start',
        paddingTop: 16,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#150935',
        height: '100%',
    },
    textArea: {
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#D1A3A6',
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
    deleteButton: {
        backgroundColor: '#FFEBEE',
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    deleteButtonText: {
        color: '#C62828',
        fontSize: 16,
        fontWeight: '600',
    },
});
