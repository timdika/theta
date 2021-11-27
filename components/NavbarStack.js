import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome';
import ProjectIcons from './ProjectIcons';
import g, { p } from "../styles/global"

export default function Navbar({ navigation, loc, children }) {
    return (
        <View style={s.navbarContainer}>
            <LinearGradient
                colors={[p.bg1, "#00000000"]}
                style={s.gradient}
                start={{ x: 0.5, y: 0.5}}
            >
            </LinearGradient>
            <View style={s.navbarWrapper}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ProjectIcons figure={"back"} />
                </TouchableOpacity>
                <Text style={s.navbarTitle}>{loc}</Text>
                {children ? children : <View></View>}
            </View>
        </View>
    )
}

const s = StyleSheet.create({
    navbarTitle: {
        color: p.text__main,
        fontSize: 18
    },
    gradient: {
        height: 200,
        width: Dimensions.get("window").width,
    },
    navbarContainer: {
        zIndex: 10,
        position: "absolute",
        top: 0,
        height: 100,
        width: Dimensions.get("window").width,
        alignItems: "center",
        justifyContent: "center"
    },
    navbarWrapper: {
        width: "80%",
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"

    },
    navbarButton: {
        padding: 10
    },
    navbarText: {
        color: p.text__main,
        fontSize: 16
    },
    current: {
        fontSize: 18,
        position: "relative",
        bottom: 3,
        color: p.text__main
    }
})
