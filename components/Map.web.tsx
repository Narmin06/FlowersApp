import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Marker = (props: any) => null;
export const PROVIDER_GOOGLE = 'google';

export default function MapView(props: any) {
    const lat = props.region?.latitude || 40.409264;
    const lng = props.region?.longitude || 49.867092;

    return (
        <View style={[styles.mapContainer, props.style]}>
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`}
                allowFullScreen
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        backgroundColor: '#F3E9EA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
});
