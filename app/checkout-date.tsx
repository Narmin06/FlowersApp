import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AVAILABLE_TIMES = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
});

export default function CheckoutDateScreen() {
    const router = useRouter();
    const isDarkMode = useAppStore(state => state.isDarkMode);
    const setCheckoutDate = useAppStore(state => state.setCheckoutDate);
    const setCheckoutTime = useAppStore(state => state.setCheckoutTime);

    const [currentDate] = useState(new Date());
    const todayAtMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const [viewYear, setViewYear] = useState(currentDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(currentDate.getMonth());

    const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('09:00');
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);

    const theme = isDarkMode ? darkTheme : lightTheme;

    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    }, [viewYear, viewMonth]);

    const isPrevMonthDisabled = viewYear === currentDate.getFullYear() && viewMonth === currentDate.getMonth();

    const goToPrevMonth = () => {
        if (isPrevMonthDisabled) return;
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleSelectDate = (dateNum: number) => {
        const dateToCheck = new Date(viewYear, viewMonth, dateNum);
        if (dateToCheck < todayAtMidnight) return;
        setSelectedDateObj(dateToCheck);
    };

    const handleNext = () => {
        if (!selectedDateObj) return;
        const monthName = MONTHS[selectedDateObj.getMonth()];
        const day = selectedDateObj.getDate();
        const year = selectedDateObj.getFullYear();

        setCheckoutDate(`${monthName} ${day}, ${year}`);
        setCheckoutTime(selectedTime);
        router.push('/checkout-address');
    };

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={theme.text.color} style={{ marginTop: 2 }} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, theme.text]}>Date & Time</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.calendarContainer, theme.card]}>
                    <View style={styles.monthHeader}>
                        <TouchableOpacity onPress={goToPrevMonth} disabled={isPrevMonthDisabled} style={{ padding: 4 }}>
                            <Feather name="chevron-left" size={20} color={isPrevMonthDisabled ? theme.subText.color : theme.text.color} />
                        </TouchableOpacity>

                        <Text style={[styles.monthText, theme.text]}>{MONTHS[viewMonth]} {viewYear}</Text>

                        <TouchableOpacity onPress={goToNextMonth} style={{ padding: 4 }}>
                            <Feather name="chevron-right" size={20} color={theme.text.color} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.daysRow}>
                        {DAYS.map((day, i) => (
                            <Text key={i} style={styles.dayText}>{day}</Text>
                        ))}
                    </View>

                    <View style={styles.datesGrid}>
                        {calendarDays.map((date, index) => {
                            if (date === null) {
                                return <View key={`empty-${index}`} style={styles.dateCell} />;
                            }

                            const checkDate = new Date(viewYear, viewMonth, date);
                            const isPast = checkDate < todayAtMidnight;

                            const isSelected = selectedDateObj?.getTime() === checkDate.getTime();

                            return (
                                <TouchableOpacity
                                    key={`date-${date}`}
                                    style={[
                                        styles.dateCell,
                                        isSelected && styles.dateCellSelected
                                    ]}
                                    onPress={() => handleSelectDate(date)}
                                    activeOpacity={0.7}
                                    disabled={isPast}
                                >
                                    <Text style={[
                                        styles.dateNum,
                                        theme.text,
                                        isPast && styles.dateNumDisabled,
                                        isSelected && styles.dateNumSelected
                                    ]}>{date}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.timeSection}>
                    <Text style={[styles.sectionTitle, theme.text]}>Pick-up time</Text>
                    <TouchableOpacity
                        style={[styles.dropdownButton, theme.cardBackground, { borderColor: isDarkMode ? '#2A2A2A' : '#E0CCD0' }]}
                        onPress={() => setTimePickerVisible(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.dropdownButtonText, theme.text]}>{selectedTime}</Text>
                        <Feather name="chevron-down" size={20} color={theme.text.color} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={[styles.footer, theme.card]}>
                <TouchableOpacity
                    style={[styles.button, !selectedDateObj && styles.buttonDisabled]}
                    disabled={!selectedDateObj}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>Next Step</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isTimePickerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setTimePickerVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setTimePickerVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, theme.card]}>
                            <Text style={[styles.modalTitle, theme.text]}>Select Time</Text>
                            <ScrollView style={styles.timeListContainer} showsVerticalScrollIndicator={false}>
                                {AVAILABLE_TIMES.map((time) => (
                                    <TouchableOpacity
                                        key={time}
                                        style={[
                                            styles.timeListItem,
                                            selectedTime === time && styles.timeListItemSelected
                                        ]}
                                        onPress={() => {
                                            setSelectedTime(time);
                                            setTimePickerVisible(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.timeListText,
                                            theme.text,
                                            selectedTime === time && styles.timeListTextSelected
                                        ]}>{time}</Text>
                                        {selectedTime === time && (
                                            <Feather name="check" size={18} color="#FFFFFF" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    text: { color: '#FFFFFF' },
    subText: { color: '#555555' },
    card: { backgroundColor: '#1E1E1E' },
    cardBackground: { backgroundColor: '#2A2A2A' },
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    text: { color: '#150935' },
    subText: { color: '#D0C4C8' },
    card: { backgroundColor: '#FFFFFF', borderColor: '#F3E9EA', borderWidth: 1 },
    cardBackground: { backgroundColor: '#FCF3F5' },
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: '600' },
    content: { padding: 20 },
    calendarContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    monthText: {
        fontSize: 16,
        fontWeight: '600',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F3E9EA',
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    dayText: {
        flex: 1,
        textAlign: 'center',
        color: '#AA949C',
        fontWeight: '500',
        fontSize: 13,
    },
    datesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dateCell: {
        width: '14.28%', // 100/7
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    dateCellSelected: {
        backgroundColor: '#AD6D71',
    },
    dateNum: {
        fontSize: 14,
        fontWeight: '500',
    },
    dateNumDisabled: {
        color: '#D0C4C8',
    },
    dateNumSelected: {
        color: '#FFFFFF',
    },
    timeSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
        color: '#150935',
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        width: 140,
    },
    dropdownButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxHeight: '70%',
        borderRadius: 24,
        padding: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    timeListContainer: {
        flexGrow: 0,
    },
    timeListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    timeListItemSelected: {
        backgroundColor: '#AD6D71',
    },
    timeListText: {
        fontSize: 16,
        fontWeight: '500',
    },
    timeListTextSelected: {
        color: '#FFFFFF',
    },
    footer: {
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        backgroundColor: '#AD6D71',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#E0CCD0',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
